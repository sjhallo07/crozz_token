## 🚀 Live Demo (English)

**View the live app:**

https://sjhallo07.github.io/crozz_token

---

## 🔄 Automatic Deployment to GitHub Pages

This project is set up for automatic deployment to GitHub Pages using npm scripts. To deploy your latest changes:

1. Make sure your code is committed and pushed to the `main` branch.
2. Run:

    ```bash
    npm run deploy
    ```

    This will build the app and publish the `dist` folder to GitHub Pages.

3. Your site will be live at:

    https://sjhallo07.github.io/crozz_token

**More info:** [GitHub Pages Documentation (English)](https://docs.github.com/en/pages)

# CROZZ Token Dashboard

Official CROZZ Community Token — a powerful Sui-based token with advanced features and real-time monitoring.

## Powered by Sui

![Sui Logo](https://cryptologos.cc/logos/sui-sui-logo.png)

## Live Demo

https://sjhallo07.github.io/crozz_token

---

## How to use the Sui logo in your app (HTML):

```html
<img src="https://cryptologos.cc/logos/sui-sui-logo.png" alt="Sui Logo" width="120" />
```

# CROZZ Token

![CROZZ Logo](logo-no-background.png)

## Official CROZZ Community Token

A powerful Sui-based token with advanced features and real-time monitoring.
https://crozzcoin.com/

🏗️ System Architecture Diagram
graph TB
    %% ===== USERS =====
    USER[User Browser]
    ADMIN[Admin Dashboard]
    MOBILE[Mobile App]
    
    %% ===== FRONTEND LAYER =====
    subgraph Frontend
        REACT[React App<br/>TypeScript + Tailwind]
        WEB3[Web3 Provider<br/>Wallet Connection]
    end
    
    %% ===== BACKEND LAYER =====
    subgraph Backend
        EXPRESS[Express.js Server<br/>REST API + WebSocket]
        MONITOR[Event Monitor<br/>Real-time Polling]
        WS[WebSocket Server<br/>Live Updates]
        DB[(Event Database<br/>Redis/PostgreSQL)]
    end
    
    %% ===== BLOCKCHAIN LAYER =====
    subgraph "Sui Blockchain"
        SUI_NODE[Sui Full Node<br/>RPC/WebSocket]
        subgraph "Smart Contract"
            MOVE[Move Contract<br/>crozz_token.move]
            EVENTS[Contract Events<br/>Mint/Burn/Transfer]
            STATE[On-Chain State<br/>Objects & Metadata]
        end
    end
    
    %% ===== CONNECTIONS =====
    USER --> REACT
    ADMIN --> REACT
    MOBILE --> REACT
    
    REACT --> EXPRESS
    REACT --> WEB3
    WEB3 --> SUI_NODE
    
    EXPRESS --> MONITOR
    EXPRESS --> WS
    EXPRESS --> DB
    
    MONITOR --> SUI_NODE
    WS --> REACT
    
    SUI_NODE --> MOVE
    MOVE --> EVENTS
    MOVE --> STATE
    
    MONITOR -.-> EVENTS






🔄 Data Flow Sequence Diagram
sequenceDiagram
    participant U as User
    participant R as React App
    participant E as Express API
    participant S as Sui Blockchain
    participant WS as WebSocket

    %% ===== MINT TOKEN FLOW =====
    Note over U,S: 🪙 MINT TOKEN OPERATION
    
    U->>R: Fill mint form<br/>(amount, recipient)
    R->>E: POST /api/tokens/mint<br/>{amount, recipient}
    E->>S: Build & Sign Transaction<br/>admin_mint()
    S->>S: Execute Move Contract<br/>Validate & Process
    S->>S: Emit TokenMinted Event
    S->>E: Transaction Result<br/>{digest, events}
    E->>E: Store Event in Database
    E->>WS: Broadcast TokenMinted Event
    WS->>R: Real-time Update
    E->>R: API Response<br/>{success, transaction}
    R->>U: Show Success Message

    %% ===== EVENT MONITORING FLOW =====
    Note over U,S: 📊 EVENT MONITORING FLOW
    
    loop Every 2 Seconds
        E->>S: Poll for New Events<br/>queryEvents()
        S->>E: Return New Events
        E->>E: Process & Store Events
        E->>WS: Broadcast to Subscribers
        WS->>R: Update Dashboard in Real-time
    end






🏃‍♂️ CRUD Operations Flow
flowchart TD
    START[Start Operation] --> TYPE{Operation Type}
    
    TYPE -->|CREATE| CREATE[Mint Tokens]
    TYPE -->|READ| READ[Query Data]
    TYPE -->|UPDATE| UPDATE[Update Metadata]
    TYPE -->|DELETE| DELETE[Burn Tokens]
    
    %% CREATE FLOW
    CREATE --> C1[Validate Parameters<br/>amount > 0]
    C1 --> C2[Build Transaction<br/>admin_mint()]
    C2 --> C3[Sign with Admin Key]
    C3 --> C4[Execute on Sui]
    C4 --> C5[Emit TokenMinted Event]
    C5 --> SUCCESS[Success Response]
    
    %% READ FLOW
    READ --> R1{Query Type}
    R1 -->|Events| R2[queryEvents<br/>MoveEventType]
    R1 -->|Balance| R3[getCoins<br/>owner + coinType]
    R1 -->|Object| R4[getObject<br/>showContent: true]
    R2 --> R5[Process & Format]
    R3 --> R5
    R4 --> R5
    R5 --> SUCCESS
    
    %% UPDATE FLOW
    UPDATE --> U1[Validate Admin<br/>is_admin()]
    U1 --> U2[Build Transaction<br/>update_metadata()]
    U2 --> U3[Sign & Execute]
    U3 --> U4[Emit MetadataUpdated Event]
    U4 --> SUCCESS
    
    %% DELETE FLOW
    DELETE --> D1[Validate Coin Exists<br/>getObject()]
    D1 --> D2[Build Transaction<br/>admin_burn()]
    D2 --> D3[Sign & Execute]
    D3 --> D4[Emit TokenBurned Event]
    D4 --> SUCCESS
    
    SUCCESS --> END[Return to User]






🏗️ Complete File Structure Diagram

```
croz-ecosystem/
├── 📱 Frontend (React)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard/
│   │   │   │   ├── TokenOverview.tsx
│   │   │   │   ├── TokenActions.tsx
│   │   │   │   └── EventsFeed.tsx
│   │   │   ├── UI/
│   │   │   │   ├── Button.tsx
│   │   │   │   └── Card.tsx
│   │   │   └── Layout/
│   │   │       └── Header.tsx
│   │   ├── hooks/
│   │   │   ├── useTokenData.ts
│   │   │   └── useWebSocket.ts
│   │   ├── utils/
│   │   │   └── sui.ts
│   │   └── App.tsx
│   └── package.json
├── 🚀 Backend (Express)
│   ├── src/
│   │   ├── services/
│   │   │   ├── EventMonitor.js
│   │   │   ├── TransactionService.js
│   │   │   └── WebSocketService.js
│   │   ├── routes/
│   │   │   ├── tokens.js
│   │   │   ├── events.js
│   │   │   └── admin.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   └── server.js
│   └── package.json
├── ⛓️ Smart Contract (Move)
│   ├── sources/
│   │   └── crozz_token.move
│   └── Move.toml
└── 🔧 Configuration
    ├── .env
    └── docker-compose.yml
```

🔄 WebSocket Real-time Flow
sequenceDiagram
    participant C as React Client
    participant W as WebSocket Server
    participant E as Event Monitor
    participant S as Sui Blockchain

    Note over C,S: 🔌 WebSocket Connection & Real-time Updates

    C->>W: Connect to WebSocket<br/>/ws
    W->>C: Connection Established
    
    Note over C,S: 📨 Subscription to Events
    
    C->>W: Subscribe to Events<br/>{type: "TOKEN_MINTED"}
    W->>W: Add to Subscribers List
    
    loop Event Monitoring
        E->>S: Poll for New Events
        S->>E: Return TokenMinted Event
        E->>W: Broadcast Event Data
        W->>C: Send Real-time Update<br/>{event: "TOKEN_MINTED", data: {...}}
    end
    
    Note over C,S: 🎯 Real-time UI Update
    
    C->>C: Update Dashboard<br/>Show New Mint Event
    C->>C: Update Statistics<br/>Recalculate Totals





🛡️ Security & Authentication Flow
  flowchart TD
    USER[User Request] --> WALLET{Wallet Connected?}
    
    WALLET -->|No| CONNECT[Connect Wallet<br/>Sui Wallet]
    WALLET -->|Yes| VERIFY[Verify Signature]
    
    CONNECT --> VERIFY
    
    VERIFY --> AUTH{Admin Function?}
    
    AUTH -->|Yes| CHECK_ADMIN[Check Admin Capability<br/>is_admin()]
    AUTH -->|No| PROCEED[Proceed with Request]
    
    CHECK_ADMIN -->|Authorized| PROCEED
    CHECK_ADMIN -->|Unauthorized| ERROR[Error: Not Admin]
    
    PROCEED --> BUILD[Build Transaction]
    BUILD --> SIGN[Sign with Appropriate Key]
    SIGN --> EXECUTE[Execute on Blockchain]
    EXECUTE --> RESULT[Return Result]
    
    ERROR --> END[Show Error Message]
    RESULT --> END


 

 

📊 Event Processing Pipeline

flowchart LR
    subgraph INPUT[Event Sources]
        A[Sui RPC Events]
        B[Transaction Logs]
        C[Object Changes]
    end
    
    subgraph PROCESSING[Processing Pipeline]
        D[Event Ingestion<br/>Polling/WebSocket]
        E[Event Filtering<br/>By Type & Package]
        F[Data Transformation<br/>Normalize Format]
        G[Storage & Indexing<br/>Database Write]
        H[Real-time Broadcasting<br/>WebSocket Push]
    end
    
    subgraph OUTPUT[Consumers]
        I[React Dashboard<br/>Live Updates]
        J[Mobile Apps<br/>Push Notifications]
        K[Analytics DB<br/>Historical Data]
        L[External APIs<br/>Webhook Calls]
    end
    
    A --> D
    B --> D
    C --> D
    
    D --> E
    E --> F
    F --> G
    F --> H
    
    G --> K
    H --> I
    H --> J
    H --> L






🎯 Complete Deployment Architecture
graph TB
    subgraph "Cloud Provider (AWS/Vercel)"
        subgraph "Frontend Deployment"
            REACT[React App<br/>Vercel/Netlify]
            CDN[CDN<br/>Static Assets]
        end
        
        subgraph "Backend Deployment"
            API[Express API<br/>AWS EC2/Lambda]
            WS[WebSocket Server<br/>Socket.io]
            REDIS[(Redis<br/>Event Cache)]
            DB[(PostgreSQL<br/>Event Storage)]
        end
    end
    
    subgraph "Sui Blockchain Network"
        SUI_DEVNET[Sui Devnet<br/>Full Nodes]
        SUI_TESTNET[Sui Testnet<br/>Full Nodes]
        SUI_MAINNET[Sui Mainnet<br/>Full Nodes]
    end
    
    subgraph "External Services"
        WALLET[Sui Wallets<br/>Suiet/SuiWallet]
        EXPLORER[Sui Explorer<br/>Transaction View]
        MONITOR[Uptime Monitor<br/>Health Checks]
    end
    
    %% Connections
    REACT --> API
    REACT --> WS
    REACT --> WALLET
    
    API --> REDIS
    API --> DB
    WS --> REDIS
    
    API --> SUI_DEVNET
    API --> SUI_TESTNET
    API --> SUI_MAINNET
    
    WALLET --> SUI_MAINNET
    EXPLORER --> SUI_MAINNET
    MONITOR --> API





Key Components Summary:

1. 🏗️ Move Smart Contract: On-chain logic with event emission
2. 🚀 Express Backend: REST API + WebSocket for real-time updates
3. 📱 React Frontend: User interface with live dashboard
4. 🔍 Event Monitor: Continuous blockchain polling
5. 📡 WebSocket Server: Real-time client updates
6. 💾 Database: Event storage and caching
7. 🔗 Sui RPC: Blockchain communication layer

This architecture provides:

· ✅ Real-time updates via WebSocket
· ✅ Complete CRUD operations via REST API
· ✅ Event-driven architecture for scalability
· ✅ Secure admin controls with wallet auth
· ✅ Multi-environment support (devnet/testnet/mainnet)
· ✅ Comprehensive monitoring and analytics
