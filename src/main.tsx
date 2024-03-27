import React from "react";
import ReactDOM from "react-dom/client";
import "@mysten/dapp-kit/dist/index.css";
import "@radix-ui/themes/styles.css";
import "./assets/styles/styles.scss";

import { ThemeVars, SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Theme } from "@radix-ui/themes";
import App from "./App.tsx";
import { networkConfig } from "./networkConfig.ts";

const queryClient = new QueryClient();

// Light theme copied from dapp-kit
export const lightTheme: ThemeVars = {
	blurs: {
		modalOverlay: 'blur(0)',
	},
	backgroundColors: {
		primaryButton: '#F6F7F9',
		primaryButtonHover: '#F0F2F5',
		outlineButtonHover: '#F4F4F5',
		modalOverlay: 'rgba(24 36 53 / 20%)',
		modalPrimary: 'white',
		modalSecondary: '#F7F8F8',
		iconButton: 'transparent',
		iconButtonHover: '#F0F1F2',
		dropdownMenu: '#FFFFFF',
		dropdownMenuSeparator: '#F3F6F8',
		walletItemSelected: 'white',
		walletItemHover: '#3C424226',
	},
	borderColors: {
		outlineButton: '#E4E4E7',
	},
	colors: {
		primaryButton: '#373737',
		outlineButton: '#373737',
		iconButton: '#000000',
		body: '#182435',
		bodyMuted: '#767A81',
		bodyDanger: '#FF794B',
	},
	radii: {
		small: '6px',
		medium: '8px',
		large: '12px',
		xlarge: '16px',
	},
	shadows: {
		primaryButton: '0px 4px 12px rgba(0, 0, 0, 0.1)',
		walletItemSelected: '0px 2px 6px rgba(0, 0, 0, 0.05)',
	},
	fontWeights: {
		normal: '400',
		medium: '500',
		bold: '600',
	},
	fontSizes: {
		small: '14px',
		medium: '16px',
		large: '18px',
		xlarge: '20px',
	},
	typography: {
		fontFamily:
			'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
		fontStyle: 'normal',
		lineHeight: '1.3',
		letterSpacing: '1',
	},
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Theme appearance="light" accentColor="red" radius="small">
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networkConfig} defaultNetwork="mainnet">
          <WalletProvider autoConnect
            theme={[
              {
                // default to light theme
                variables: lightTheme,
              },
            ]}
          >
            <App />
          </WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
    </Theme>
  </React.StrictMode>,
);