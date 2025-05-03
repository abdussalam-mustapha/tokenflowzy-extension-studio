import React, { FC, ReactNode, useMemo } from 'react';
import { 
  ConnectionProvider,
  WalletProvider
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  CoinbaseWalletAdapter,
  LedgerWalletAdapter,
  CloverWalletAdapter,
  MathWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Import the styles
import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletContextProviderProps {
  children: ReactNode;
  network?: WalletAdapterNetwork;
  endpoint?: string;
}

export const WalletContextProvider: FC<WalletContextProviderProps> = ({ 
  children,
  network = WalletAdapterNetwork.Devnet,
  endpoint = clusterApiUrl(WalletAdapterNetwork.Devnet)
}) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'
  // For Light Protocol ZK Compression, we use 'https://zk-testnet.helius.dev:8899'

  // You can also provide a custom RPC endpoint
  // In Vite, we use import.meta.env instead of process.env
  const customEndpoint = import.meta.env.VITE_SOLANA_RPC_ENDPOINT as string || endpoint;
  
  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking
  // and lazy loading, so your users don't load unecessary code
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new CoinbaseWalletAdapter(),
      new LedgerWalletAdapter(),
      new CloverWalletAdapter(),
      new MathWalletAdapter(),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={customEndpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletContextProvider;
