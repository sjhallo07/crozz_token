
import React from 'react';
import './dashboard.css';
import TokenOverview from './components/Dashboard/TokenOverview';
import TokenActions from './components/Dashboard/TokenActions';
import EventsFeed from './components/Dashboard/EventsFeed';
import RpcHooksDemo from './components/Dashboard/RpcHooksDemo';
import { ConnectButton, ConnectModal, useCurrentAccount } from '@mysten/dapp-kit';
import { useState } from 'react';

export default function Dashboard({ theme }) {
	const currentAccount = useCurrentAccount();
	const [modalOpen, setModalOpen] = useState(false);
	// Compute dashboard theme class
	let themeClass = '';
	if (theme === 'dark') themeClass = 'dark-theme';
	else if (theme === 'pink') themeClass = 'pink-theme';
	// For system, use dark if system prefers dark
	else if (theme === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) themeClass = 'dark-theme';

	return (
		<div className={`dashboard-container${themeClass ? ' ' + themeClass : ''}`}>
			<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
				<img src="/logo-no-background.png" alt="CROZZ Logo" style={{ width: 120, marginBottom: 12 }} />
				<img src="https://cryptologos.cc/logos/sui-sui-logo.png" alt="Sui Logo" style={{ width: 60, marginBottom: 12, marginLeft: 12, verticalAlign: 'middle' }} />
				<h1>CROZZ Token Dashboard</h1>
				<p className="crozz-subtitle">
					Official CROZZ Community Token — a powerful Sui-based token with advanced features and real-time monitoring.
				</p>
				<a className="crozz-link" href="https://crozzcoin.com/" target="_blank" rel="noopener noreferrer">
					https://crozzcoin.com/
				</a>
				<div className="wallet-buttons">
					<ConnectButton className="sui-connect-button" />
					<ConnectModal
						trigger={
							<button
								className="sui-connect-button"
								disabled={!!currentAccount}
							>
								{currentAccount ? 'Connected' : 'Connect (Modal)'}
							</button>
						}
						open={modalOpen}
						onOpenChange={setModalOpen}
					/>
				</div>
			</div>
			<TokenOverview />
			<TokenActions />
			<EventsFeed />
			<RpcHooksDemo />
		</div>
	);
}
