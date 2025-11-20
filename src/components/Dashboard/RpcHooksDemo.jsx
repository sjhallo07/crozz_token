import React from 'react';
import {
  useSuiClientQuery,
  useSuiClientQueries,
  useSuiClientInfiniteQuery,
  useSuiClientMutation,
  useResolveSuiNSName,
  useCurrentAccount,
  useAccounts,
  useWallets,
  useCurrentWallet,
  useSignPersonalMessage,
  useSignTransaction,
  useSignAndExecuteTransaction,
  useSuiClient,
  useDisconnectWallet,
  useConnectWallet
} from '@mysten/dapp-kit';

const owner = '0x123'; // Example address

export default function RpcHooksDemo() {
	// Demo owner address
	const owner = '0x123';

	// Wallet hooks
	const currentAccount = useCurrentAccount();
	const accounts = useAccounts();
	const wallets = useWallets();
	const currentWallet = useCurrentWallet();
	const { disconnect } = useDisconnectWallet();
	const { mutate: connectWallet } = useConnectWallet();

	// Signing hooks
	const { signPersonalMessage, isPending: isSigningMsg } = useSignPersonalMessage();
	const { mutate: signTransaction, isPending: isSigningTx } = useSignTransaction();
	const { mutate: signAndExecuteTransaction, isPending: isSigningAndExec } = useSignAndExecuteTransaction();

	// Sui client hooks
	const suiClient = useSuiClient();
	const { data: ownedObjects, isPending: isPending1, isError: isError1, error: error1 } = useSuiClientQuery('getOwnedObjects', { owner });
	const { data: multiData, isPending: isPending2, isError: isError2 } = useSuiClientQueries({
		queries: [
			{ method: 'getAllBalances', params: { owner } },
			{ method: 'queryTransactionBlocks', params: { filter: { FromAddress: owner } } },
		],
		combine: (result) => ({
			data: result.map((res) => res.data),
			isSuccess: result.every((res) => res.isSuccess),
			isPending: result.some((res) => res.isPending),
			isError: result.some((res) => res.isError),
		}),
	});
	const {
		data: infiniteData,
		isPending: isPending3,
		isError: isError3,
		error: error3,
		fetchNextPage,
		hasNextPage,
	} = useSuiClientInfiniteQuery('getOwnedObjects', { owner });
	const { mutate } = useSuiClientMutation('dryRunTransactionBlock');
	const { data: suiNS, isPending: isPending5 } = useResolveSuiNSName(owner);


	// UI handlers
	const handleSignMessage = async () => {
		try {
			const res = await signPersonalMessage({ message: 'Hello Sui!' });
			alert('Signed message: ' + JSON.stringify(res));
		} catch (e) {
			alert('Sign message error: ' + e.message);
		}
	};
	const handleSignTx = async () => {
		try {
			signTransaction({ transaction: {} }, {
				onSuccess: (res) => alert('Signed tx: ' + JSON.stringify(res)),
				onError: (e) => alert('Sign tx error: ' + e.message),
			});
		} catch (e) {
			alert('Sign tx error: ' + e.message);
		}
	};
	const handleSignAndExecTx = async () => {
		try {
			signAndExecuteTransaction({ transaction: {} }, {
				onSuccess: (res) => alert('Signed & executed tx: ' + JSON.stringify(res)),
				onError: (e) => alert('Sign & exec tx error: ' + e.message),
			});
		} catch (e) {
			alert('Sign & exec tx error: ' + e.message);
		}
	};

	return (
		<div className="dashboard-card">
			<h2>Wallet Hooks Demo</h2>

			<h3>useCurrentAccount</h3>
			<pre>{JSON.stringify(currentAccount, null, 2)}</pre>

			<h3>useAccounts</h3>
			<pre>{JSON.stringify(accounts, null, 2)}</pre>

			<h3>useWallets</h3>
			<pre>{JSON.stringify(wallets, null, 2)}</pre>

			<h3>useCurrentWallet</h3>
			<pre>{JSON.stringify(currentWallet, null, 2)}</pre>




			<h3>useConnectWallet</h3>
			<button onClick={() => connectWallet({ walletName: wallets[0]?.name })} disabled={!wallets.length}>Connect First Wallet</button>

			<h3>useDisconnectWallet</h3>
			<button onClick={() => disconnect()}>Disconnect Wallet</button>

			<h3>useSignPersonalMessage</h3>
			<button onClick={handleSignMessage} disabled={isSigningMsg}>Sign Message</button>

			<h3>useSignTransaction</h3>
			<button onClick={handleSignTx} disabled={isSigningTx}>Sign Transaction</button>

			<h3>useSignAndExecuteTransaction</h3>
			<button onClick={handleSignAndExecTx} disabled={isSigningAndExec}>Sign & Execute Transaction</button>

			<h3>useSuiClient</h3>
			<pre>{suiClient ? '[SuiClient instance]' : 'Not available'}</pre>

			<h3>useSuiClientQuery (getOwnedObjects)</h3>
			{isPending1 ? <div>Loading...</div> : isError1 ? <div>Error: {error1.message}</div> : <pre>{JSON.stringify(ownedObjects, null, 2)}</pre>}

			<h3>useSuiClientQueries (getAllBalances, queryTransactionBlocks)</h3>
			{isPending2 ? <div>Loading...</div> : isError2 ? <div>Fetching Error</div> : <pre>{JSON.stringify(multiData, null, 2)}</pre>}

			<h3>useSuiClientInfiniteQuery (getOwnedObjects)</h3>
			{isPending3 ? <div>Loading...</div> : isError3 ? <div>Error: {error3.message}</div> : <pre>{JSON.stringify(infiniteData, null, 2)}</pre>}
			{hasNextPage && <button onClick={() => fetchNextPage()}>Load more</button>}

			<h3>useSuiClientMutation (dryRunTransactionBlock)</h3>
			<button onClick={() => mutate({ transactionBlock: {} })}>Dry run transaction (example)</button>

			<h3>useResolveSuiNSName</h3>
			{isPending5 ? <div>Loading...</div> : suiNS ? <div>Domain name is: {suiNS}</div> : <div>Domain name not found</div>}

		</div>
	);
}
