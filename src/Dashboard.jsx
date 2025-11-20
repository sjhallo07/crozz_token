
import React from 'react';
import './dashboard.css';
import TokenOverview from './components/Dashboard/TokenOverview';
import TokenActions from './components/Dashboard/TokenActions';
import EventsFeed from './components/Dashboard/EventsFeed';
import { ConnectButton } from '@mysten/dapp-kit';

export default function Dashboard() {
	return (
		<div className="dashboard-container">
			<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
				<img src="/logo-no-background.png" alt="CROZZ Logo" style={{ width: 120, marginBottom: 12 }} />
				<h1>CROZZ Token Dashboard</h1>
				<p style={{ textAlign: 'center', maxWidth: 480, color: '#4a5568', marginBottom: 8 }}>
					Official CROZZ Community Token — a powerful Sui-based token with advanced features and real-time monitoring.
				</p>
				<a href="https://crozzcoin.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#3182ce', marginBottom: 16 }}>
					https://crozzcoin.com/
				</a>
				<ConnectButton />
			</div>
			<TokenOverview />
			<TokenActions />
			<EventsFeed />
		</div>
	);
}
