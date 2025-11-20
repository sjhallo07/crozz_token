
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
				<h1>CROZZ Token Dashboard</h1>
				<p style={{ textAlign: 'center', maxWidth: 480, color: '#4a5568', marginBottom: 8 }}>
					Official CROZZ Community Token — a powerful Sui-based token with advanced features and real-time monitoring.
				</p>
				<a href="https://crozzcoin.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#3182ce', marginBottom: 16 }}>
					https://crozzcoin.com/
				</a>
				<div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
					<ConnectButton />
					<ConnectModal
						trigger={
							<button
								style={{ padding: '8px 16px', borderRadius: 6, background: '#3182ce', color: '#fff', border: 'none', fontWeight: 500, cursor: 'pointer' }}
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
