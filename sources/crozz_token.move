module crozz::crozz_token {
    use sui::coin;
    use sui::coin::{TreasuryCap, Coin, CoinMetadata};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use sui::url::{Self, Url};
    use sui::object::{Self, UID};
    use sui::balance::{Self, Balance};
    use sui::package;
    use std::string::{Self, String};
    use std::option::{Self, Option};
    use std::vector;

    // ====== Constants ======
    const TOKEN_DECIMALS: u8 = 9;
    const TOKEN_SYMBOL: vector<u8> = b"CROZZ";
    const TOKEN_NAME: vector<u8> = b"CROZZ Token";
    const TOKEN_DESCRIPTION: vector<u8> = b"Official CROZZ Community Token";
    const TOKEN_ICON_URL: vector<u8> = b"https://crozz.com/icon.png";

    // ====== Error Codes ======
    const E_NOT_ADMIN: u64 = 0;
    const E_INSUFFICIENT_BALANCE: u64 = 1;
    const E_ZERO_AMOUNT: u64 = 2;
    const E_UNAUTHORIZED: u64 = 3;

    // ====== Event Definitions ======
    struct TokenMinted has copy, drop {
        amount: u64,
        minter: address,
        recipient: address,
        timestamp: u64,
        tx_digest: vector<u8>
    }

    struct TokenBurned has copy, drop {
        amount: u64,
        burner: address,
        timestamp: u64,
        tx_digest: vector<u8>
    }

    struct TokenTransferred has copy, drop {
        amount: u64,
        from: address,
        to: address,
        timestamp: u64,
        tx_digest: vector<u8>
    }

    struct AdminAction has copy, drop {
        action_type: vector<u8>,
        admin: address,
        details: String,
        timestamp: u64,
        tx_digest: vector<u8>
    }

    struct MetadataUpdated has copy, drop {
        field: String,
        old_value: String,
        new_value: String,
        updater: address,
        timestamp: u64
    }

    // ====== Admin Capability ======
    struct AdminCap has key {
        id: UID,
        admins: vector<address>,
        last_updated: u64
    }

    // ====== Token State ======
    struct TokenState has key {
        id: UID,
        total_minted: u64,
        total_burned: u64,
        total_transferred: u64,
        last_activity: u64
    }

    // ====== INITIALIZATION ======
    public fun init(
        ctx: &mut TxContext
    ): (TreasuryCap<CROZZ>, CoinMetadata<CROZZ>, AdminCap, TokenState) {
        let (treasury_cap, metadata) = coin::create_currency<CROZZ>(
            ctx,
            TOKEN_DECIMALS,
            TOKEN_SYMBOL,
            TOKEN_NAME,
            TOKEN_DESCRIPTION,
            option::some(url::new_unsafe_from_bytes(TOKEN_ICON_URL)),
            ctx
        );

        // Create admin capability with deployer as first admin
        let mut admins = vector::empty<address>();
        vector::push_back(&mut admins, tx_context::sender(ctx));
        
        let admin_cap = AdminCap {
            id: object::new(ctx),
            admins,
            last_updated: tx_context::epoch(ctx)
        };

        // Create token state tracker
        let token_state = TokenState {
            id: object::new(ctx),
            total_minted: 0,
            total_burned: 0,
            total_transferred: 0,
            last_activity: tx_context::epoch(ctx)
        };

        // Emit initialization event
        event::emit(AdminAction {
            action_type: b"CONTRACT_DEPLOYED",
            admin: tx_context::sender(ctx),
            details: string::utf8(b"CROZZ Token contract deployed successfully"),
            timestamp: tx_context::epoch(ctx),
            tx_digest: tx_context::digest(ctx)
        });

        (treasury_cap, metadata, admin_cap, token_state)
    }

    // ====== ADMIN FUNCTIONS ======

    /// Add a new admin - only existing admins can call this
    public entry fun add_admin(
        admin_cap: &mut AdminCap,
        new_admin: address,
        ctx: &mut TxContext
    ) {
        assert!(is_admin(admin_cap, tx_context::sender(ctx)), E_NOT_ADMIN);
        
        vector::push_back(&mut admin_cap.admins, new_admin);
        admin_cap.last_updated = tx_context::epoch(ctx);

        event::emit(AdminAction {
            action_type: b"ADMIN_ADDED",
            admin: tx_context::sender(ctx),
            details: string::utf8(b"New admin added to contract"),
            timestamp: tx_context::epoch(ctx),
            tx_digest: tx_context::digest(ctx)
        });
    }

    /// Remove an admin - only admins can call this
    public entry fun remove_admin(
        admin_cap: &mut AdminCap,
        admin_to_remove: address,
        ctx: &mut TxContext
    ) {
        assert!(is_admin(admin_cap, tx_context::sender(ctx)), E_NOT_ADMIN);
        assert!(vector::length(&admin_cap.admins) > 1, E_UNAUTHORIZED); // Prevent removing all admins
        
        let index = find_admin_index(admin_cap, admin_to_remove);
        vector::remove(&mut admin_cap.admins, index);
        admin_cap.last_updated = tx_context::epoch(ctx);

        event::emit(AdminAction {
            action_type: b"ADMIN_REMOVED",
            admin: tx_context::sender(ctx),
            details: string::utf8(b"Admin removed from contract"),
            timestamp: tx_context::epoch(ctx),
            tx_digest: tx_context::digest(ctx)
        });
    }

    // ====== TOKEN FUNCTIONS ======

    /// Mint tokens to any address - admin only
    public entry fun admin_mint(
        admin_cap: &AdminCap,
        treasury_cap: &mut TreasuryCap<CROZZ>,
        token_state: &mut TokenState,
        amount: u64,
        recipient: address,
        ctx: &mut TxContext
    ) {
        assert!(is_admin(admin_cap, tx_context::sender(ctx)), E_NOT_ADMIN);
        assert!(amount > 0, E_ZERO_AMOUNT);

        let coin = coin::mint(treasury_cap, amount, ctx);
        transfer::public_transfer(coin, recipient);

        // Update token state
        token_state.total_minted = token_state.total_minted + amount;
        token_state.last_activity = tx_context::epoch(ctx);

        event::emit(TokenMinted {
            amount,
            minter: tx_context::sender(ctx),
            recipient,
            timestamp: tx_context::epoch(ctx),
            tx_digest: tx_context::digest(ctx)
        });

        event::emit(AdminAction {
            action_type: b"TOKENS_MINTED",
            admin: tx_context::sender(ctx),
            details: string::utf8(b"Admin minted tokens"),
            timestamp: tx_context::epoch(ctx),
            tx_digest: tx_context::digest(ctx)
        });
    }

    /// Mint tokens to sender - admin only
    public entry fun admin_mint_to_self(
        admin_cap: &AdminCap,
        treasury_cap: &mut TreasuryCap<CROZZ>,
        token_state: &mut TokenState,
        amount: u64,
        ctx: &mut TxContext
    ) {
        admin_mint(admin_cap, treasury_cap, token_state, amount, tx_context::sender(ctx), ctx);
    }

    /// Burn tokens from any coin - admin only
    public entry fun admin_burn(
        admin_cap: &AdminCap,
        treasury_cap: &mut TreasuryCap<CROZZ>,
        token_state: &mut TokenState,
        coin: Coin<CROZZ>
    ) {
        assert!(is_admin(admin_cap, tx_context::sender(ctx)), E_NOT_ADMIN);
        
        let amount = coin::value(&coin);
        assert!(amount > 0, E_ZERO_AMOUNT);

        coin::burn(treasury_cap, coin);

        // Update token state
        token_state.total_burned = token_state.total_burned + amount;
        token_state.last_activity = tx_context::epoch(tx_context::new());

        event::emit(TokenBurned {
            amount,
            burner: tx_context::sender(tx_context::new()),
            timestamp: tx_context::epoch(tx_context::new()),
            tx_digest: b"burn_tx_digest" // In real scenario, get from context
        });

        event::emit(AdminAction {
            action_type: b"TOKENS_BURNED",
            admin: tx_context::sender(tx_context::new()),
            details: string::utf8(b"Admin burned tokens"),
            timestamp: tx_context::epoch(tx_context::new()),
            tx_digest: b"burn_tx_digest"
        });
    }

    /// Transfer tokens between addresses - admin only
    public entry fun admin_transfer(
        admin_cap: &AdminCap,
        token_state: &mut TokenState,
        coin: Coin<CROZZ>,
        to: address,
        ctx: &mut TxContext
    ) {
        assert!(is_admin(admin_cap, tx_context::sender(ctx)), E_NOT_ADMIN);
        
        let amount = coin::value(&coin);
        assert!(amount > 0, E_ZERO_AMOUNT);

        transfer::public_transfer(coin, to);

        // Update token state
        token_state.total_transferred = token_state.total_transferred + amount;
        token_state.last_activity = tx_context::epoch(ctx);

        event::emit(TokenTransferred {
            amount,
            from: tx_context::sender(ctx),
            to,
            timestamp: tx_context::epoch(ctx),
            tx_digest: tx_context::digest(ctx)
        });

        event::emit(AdminAction {
            action_type: b"TOKENS_TRANSFERRED",
            admin: tx_context::sender(ctx),
            details: string::utf8(b"Admin transferred tokens"),
            timestamp: tx_context::epoch(ctx),
            tx_digest: tx_context::digest(ctx)
        });
    }

    // ====== METADATA FUNCTIONS ======

    /// Update token name - admin only
    public entry fun update_token_name(
        admin_cap: &AdminCap,
        treasury_cap: &TreasuryCap<CROZZ>,
        metadata: &mut CoinMetadata<CROZZ>,
        new_name: String,
        ctx: &mut TxContext
    ) {
        assert!(is_admin(admin_cap, tx_context::sender(ctx)), E_NOT_ADMIN);
        
        let old_name = coin::name(metadata);
        coin::update_name(treasury_cap, metadata, new_name);

        event::emit(MetadataUpdated {
            field: string::utf8(b"name"),
            old_value: old_name,
            new_value: coin::name(metadata),
            updater: tx_context::sender(ctx),
            timestamp: tx_context::epoch(ctx)
        });
    }

    /// Update token description - admin only
    public entry fun update_token_description(
        admin_cap: &AdminCap,
        treasury_cap: &TreasuryCap<CROZZ>,
        metadata: &mut CoinMetadata<CROZZ>,
        new_description: String,
        ctx: &mut TxContext
    ) {
        assert!(is_admin(admin_cap, tx_context::sender(ctx)), E_NOT_ADMIN);
        
        let old_description = coin::description(metadata);
        coin::update_description(treasury_cap, metadata, new_description);

        event::emit(MetadataUpdated {
            field: string::utf8(b"description"),
            old_value: old_description,
            new_value: coin::description(metadata),
            updater: tx_context::sender(ctx),
            timestamp: tx_context::epoch(ctx)
        });
    }

    /// Update token icon URL - admin only
    public entry fun update_token_icon(
        admin_cap: &AdminCap,
        treasury_cap: &TreasuryCap<CROZZ>,
        metadata: &mut CoinMetadata<CROZZ>,
        new_icon_url: String,
        ctx: &mut TxContext
    ) {
        assert!(is_admin(admin_cap, tx_context::sender(ctx)), E_NOT_ADMIN);
        
        let url_bytes = string::bytes(&new_icon_url);
        let new_url = url::new_unsafe_from_bytes(url_bytes);
        coin::update_icon_url(treasury_cap, metadata, new_url);

        event::emit(MetadataUpdated {
            field: string::utf8(b"icon_url"),
            old_value: string::utf8(b"previous_url"),
            new_value: new_icon_url,
            updater: tx_context::sender(ctx),
            timestamp: tx_context::epoch(ctx)
        });
    }

    // ====== VIEW FUNCTIONS ======

    /// Check if an address is admin
    public fun is_admin(admin_cap: &AdminCap, addr: address): bool {
        let i = 0;
        let len = vector::length(&admin_cap.admins);
        while (i < len) {
            if (*vector::borrow(&admin_cap.admins, i) == addr) {
                return true
            };
            i = i + 1;
        };
        false
    }

    /// Get total supply from metadata
    public fun get_total_supply(metadata: &CoinMetadata<CROZZ>): u64 {
        coin::supply(&coin::total_supply(metadata))
    }

    /// Get token decimals
    public fun get_decimals(): u8 {
        TOKEN_DECIMALS
    }

    /// Get token symbol
    public fun get_symbol(): vector<u8> {
        TOKEN_SYMBOL
    }

    /// Get admin list
    public fun get_admins(admin_cap: &AdminCap): &vector<address> {
        &admin_cap.admins
    }

    /// Get token statistics
    public fun get_token_stats(token_state: &TokenState): (u64, u64, u64, u64) {
        (
            token_state.total_minted,
            token_state.total_burned,
            token_state.total_transferred,
            token_state.last_activity
        )
    }

    // ====== PRIVATE HELPER FUNCTIONS ======

    fun find_admin_index(admin_cap: &AdminCap, admin: address): u64 {
        let i = 0;
        let len = vector::length(&admin_cap.admins);
        while (i < len) {
            if (*vector::borrow(&admin_cap.admins, i) == admin) {
                return i
            };
            i = i + 1;
        };
        abort E_UNAUTHORIZED
    }
}

// The CROZZ token type
struct CROZZ has drop {}
