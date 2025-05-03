import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Button } from './button';
import { WalletIcon } from 'lucide-react';

interface WalletConnectButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export const WalletConnectButton = ({ 
  variant = 'default', 
  size = 'default',
  className = '' 
}: WalletConnectButtonProps) => {
  const { wallet, publicKey, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  const handleClick = () => {
    if (connected) {
      disconnect();
    } else {
      setVisible(true);
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      className={className}
    >
      <WalletIcon className="mr-2 h-4 w-4" />
      {connected 
        ? `${publicKey?.toString().slice(0, 4)}...${publicKey?.toString().slice(-4)}`
        : 'Connect Wallet'
      }
    </Button>
  );
};
