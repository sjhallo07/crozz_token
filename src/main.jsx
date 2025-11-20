import React from 'react';
import { createRoot } from 'react-dom/client';
import { createNetworkConfig, SuiClientProvider, WalletProvider, lightTheme } from '@mysten/dapp-kit';
import { useState } from 'react';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@mysten/dapp-kit/dist/index.css';

const { networkConfig } = createNetworkConfig({
	localnet: { url: getFullnodeUrl('localnet') },
	mainnet: { url: getFullnodeUrl('mainnet') },
});
const queryClient = new QueryClient();

import Dashboard from './Dashboard';

// Example pink custom theme
const pinkTheme = {
	blurs: { modalOverlay: 'blur(0)' },
	backgroundColors: {
		primaryButton: '#ffe0f0',
		primaryButtonHover: '#ffb6d5',
		outlineButtonHover: '#ffe0f0',
		modalOverlay: 'rgba(255, 182, 213, 0.2)',
		modalPrimary: '#fff0f6',
		modalSecondary: '#ffe0f0',
		iconButton: 'transparent',
		iconButtonHover: '#ffb6d5',
		dropdownMenu: '#fff0f6',
		dropdownMenuSeparator: '#ffe0f0',
		walletItemSelected: '#ffe0f0',
		walletItemHover: '#ffb6d5',
	},
	borderColors: { outlineButton: '#ffb6d5' },
	colors: {
		primaryButton: '#d72660',
		outlineButton: '#d72660',
		iconButton: '#d72660',
		body: '#d72660',
		bodyMuted: '#bdbdbd',
		bodyDanger: '#FF794B',
	},
	radii: { small: '6px', medium: '8px', large: '12px', xlarge: '16px' },
	shadows: {
		primaryButton: '0px 4px 12px rgba(215, 38, 96, 0.1)',
		walletItemSelected: '0px 2px 6px rgba(215, 38, 96, 0.05)',
	},
	fontWeights: { normal: '400', medium: '500', bold: '600' },
	fontSizes: { small: '14px', medium: '16px', large: '18px', xlarge: '20px' },
	typography: {
		fontFamily:
			'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
		fontStyle: 'normal',
		lineHeight: '1.3',
		letterSpacing: '1',
	},
};

// Example dark theme (customize as needed)
const darkTheme = {
	blurs: { modalOverlay: 'blur(0)' },
	backgroundColors: {
		primaryButton: '#23272f',
		primaryButtonHover: '#2d3748',
		outlineButtonHover: '#23272f',
		modalOverlay: 'rgba(24 36 53 / 60%)',
		modalPrimary: '#23272f',
		modalSecondary: '#181a1b',
		iconButton: 'transparent',
		iconButtonHover: '#23272f',
		dropdownMenu: '#23272f',
		dropdownMenuSeparator: '#181a1b',
		walletItemSelected: '#23272f',
		walletItemHover: '#2d3748',
	},
	borderColors: { outlineButton: '#444' },
	colors: {
		primaryButton: '#fff',
		outlineButton: '#fff',
		iconButton: '#fff',
		body: '#fff',
		bodyMuted: '#aaa',
		bodyDanger: '#FF794B',
	},
	radii: { small: '6px', medium: '8px', large: '12px', xlarge: '16px' },
	shadows: {
		primaryButton: '0px 4px 12px rgba(0,0,0,0.2)',
		walletItemSelected: '0px 2px 6px rgba(0,0,0,0.15)',
	},
	fontWeights: { normal: '400', medium: '500', bold: '600' },
	fontSizes: { small: '14px', medium: '16px', large: '18px', xlarge: '20px' },
	typography: {
		fontFamily:
			'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
		fontStyle: 'normal',
		lineHeight: '1.3',
		letterSpacing: '1',
	},
};
function App() {
	// theme: 'light' | 'dark' | 'pink' | 'system'
	const [theme, setTheme] = useState('system');

	// Add/remove .pink-theme class to body for selector-based theme
	React.useEffect(() => {
		if (theme === 'pink') {
			document.body.classList.add('pink-theme');
		} else {
			document.body.classList.remove('pink-theme');
		}
	}, [theme]);

	// Compute WalletProvider theme prop based on selection
	let walletTheme;
	if (theme === 'light') {
		walletTheme = [{ variables: lightTheme }];
	} else if (theme === 'dark') {
		walletTheme = [{ variables: darkTheme }];
	} else if (theme === 'pink') {
		walletTheme = [
			{ variables: lightTheme },
			{ selector: '.pink-theme', variables: pinkTheme },
		];
	} else {
		// system: light + dark media query + pink selector
		walletTheme = [
			{ variables: lightTheme },
			{ mediaQuery: '(prefers-color-scheme: dark)', variables: darkTheme },
			{ selector: '.pink-theme', variables: pinkTheme },
		];
	}

	return (
		<QueryClientProvider client={queryClient}>
			<SuiClientProvider networks={networkConfig} defaultNetwork="localnet">
				<div style={{ position: 'fixed', top: 10, right: 10, zIndex: 1000, display: 'flex', gap: 8 }}>
					<label htmlFor="theme-select" style={{ color: '#333', fontWeight: 500, marginRight: 4 }}>Theme:</label>
					<select
						id="theme-select"
						value={theme}
						onChange={e => setTheme(e.target.value)}
						style={{
							borderRadius: 6,
							padding: '6px 12px',
							fontWeight: 500,
							border: '1px solid #ccc',
							outline: 'none',
							background: '#fff',
							color: '#333',
						}}
					>
						<option value="system">System</option>
						<option value="light">Light</option>
						<option value="dark">Dark</option>
						<option value="pink">Pink</option>
					</select>
				</div>
				<WalletProvider
					autoConnect
					enableUnsafeBurner
					preferredWallets={['Sui Wallet', 'Suiet', 'Ethos Wallet']}
					walletFilter={wallet => wallet.name !== 'ExampleBlockedWallet'}
					slushWallet={{ enabled: true }}
					storage={window.localStorage}
					storageKey="crozz_token_wallet"
					theme={walletTheme}
				>
					<Dashboard theme={theme} />
				</WalletProvider>
			</SuiClientProvider>
		</QueryClientProvider>
	);
}

// dApp Kit ConnectButton import
// import MyComponent from './MyComponent';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
