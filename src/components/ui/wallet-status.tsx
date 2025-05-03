import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from './card';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { useWalletIntegration } from '../../lib/wallet/useWalletIntegration';
import { Copy, Check, RefreshCw, Coins } from 'lucide-react';
import { Skeleton } from './skeleton';
import { toast } from 'sonner';

export const WalletStatus = () => {
  const { 
    publicKey, 
    connected, 
    walletName, 
    balance, 
    isLoading, 
    fetchBalance, 
    requestAirdrop, 
    disconnect 
  } = useWalletIntegration();
  
  const [copied, setCopied] = useState(false);
  const [airdropAmount, setAirdropAmount] = useState(1);

  const copyAddress = () => {
    if (!publicKey) return;
    
    navigator.clipboard.writeText(publicKey.toString());
    setCopied(true);
    toast.success('Address copied to clipboard');
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleAirdrop = async () => {
    await requestAirdrop(airdropAmount);
  };

  if (!connected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wallet</CardTitle>
          <CardDescription>Connect your wallet to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center p-4">
            <p className="text-muted-foreground">
              No wallet connected. Use the connect button in the navigation bar to connect.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Connected</CardTitle>
        <CardDescription>{walletName}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm text-muted-foreground">Public Key</Label>
          <div className="flex items-center mt-1 space-x-2">
            <code className="flex-1 p-2 text-xs bg-muted rounded-md overflow-x-scroll">
              {publicKey?.toString()}
            </code>
            <Button
              variant="outline"
              size="icon"
              onClick={copyAddress}
              title="Copy address"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center">
            <Label className="text-sm text-muted-foreground">Balance</Label>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={fetchBalance} 
              disabled={isLoading}
              title="Refresh balance"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
          <div className="mt-1 text-xl font-semibold">
            {isLoading ? (
              <Skeleton className="h-7 w-24" />
            ) : balance !== null ? (
              <span>{balance.toFixed(4)} SOL</span>
            ) : (
              <span className="text-muted-foreground">Error loading balance</span>
            )}
          </div>
        </div>

        <div className="pt-4 border-t">
          <Label htmlFor="airdrop-amount">Request Airdrop (Devnet only)</Label>
          <div className="flex mt-1 space-x-2">
            <Input
              id="airdrop-amount"
              type="number"
              min={0.1}
              max={5}
              step={0.1}
              value={airdropAmount}
              onChange={(e) => setAirdropAmount(Number(e.target.value))}
            />
            <Button 
              onClick={handleAirdrop} 
              disabled={isLoading}
            >
              <Coins className="mr-2 h-4 w-4" />
              Airdrop
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={disconnect}
        >
          Disconnect Wallet
        </Button>
      </CardFooter>
    </Card>
  );
};
