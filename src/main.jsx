import React from 'react';
import { createRoot } from 'react-dom/client';
import { createNetworkConfig, SuiClientProvider, WalletProvider, lightTheme, ThemeVars } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@mysten/dapp-kit/dist/index.css';

const { networkConfig } = createNetworkConfig({
	localnet: { url: getFullnodeUrl('localnet') },
	mainnet: { url: getFullnodeUrl('mainnet') },
});
const queryClient = new QueryClient();

import Dashboard from './Dashboard';

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
		return (
			<QueryClientProvider client={queryClient}>
				<SuiClientProvider networks={networkConfig} defaultNetwork="localnet">
					<WalletProvider
						theme={[
							{ variables: lightTheme },
							{ mediaQuery: '(prefers-color-scheme: dark)', variables: darkTheme },
						]}
					>
						<Dashboard />
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
