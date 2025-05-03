import React from 'react';
import { useZkCompression } from '../lib/zk-compression/ZkCompressionContext';
import { useWalletIntegration } from '../lib/wallet/useWalletIntegration';
import { WalletStatus } from '../components/ui/wallet-status';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { AlertCircle, ArrowRight, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';

const ZkCompression: React.FC = () => {
  const { isInitializing, error } = useZkCompression();
  const { connected } = useWalletIntegration();

  if (isInitializing) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">ZK Compression</h1>
        <Alert>
          <AlertTitle>Initializing...</AlertTitle>
          <AlertDescription>
            Setting up ZK Compression services. Please wait...
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">ZK Compression</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to initialize ZK Compression: {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold">ZK Compression Demo</h1>
        <Link to="/compressed-wallet">
          <Button variant="outline" className="mt-2 sm:mt-0 flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            View Compressed Wallet
            <span className="relative flex h-2 w-2 ml-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          </Button>
        </Link>
      </div>

      <p className="text-muted-foreground mb-8">
        This demo shows how to compress token metadata and user rewards using ZK Compression.
        The data is stored off-chain and only Merkle roots are stored on-chain.
      </p>

      {!connected && (
        <Alert className="mb-6 bg-amber-50 border-amber-200">
          <Wallet className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-600">Wallet Required</AlertTitle>
          <AlertDescription className="text-amber-600">
            Please connect your wallet using the button in the navigation bar to interact with ZK Compression features.
          </AlertDescription>
        </Alert>
      )}

      {connected && (
        <div className="mb-8">
          <WalletStatus />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Token Compression</CardTitle>
            <CardDescription>Create and store compressed token data using ZK proofs</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              ZK Compression allows you to store token data off-chain while maintaining verifiability.
              Only Merkle roots are stored on-chain, reducing gas costs significantly.
            </p>
            <div className="flex justify-end">
              <Link to="/compressed-wallet">
                <Button variant="default" className="flex items-center gap-2">
                  View Compressed Tokens
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rewards Compression</CardTitle>
            <CardDescription>Manage user rewards with compressed data</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Reward users with tokens using compressed data structures.
              Verify rewards without storing all data on-chain.
            </p>
            <div className="flex justify-end">
              <Link to="/compressed-wallet">
                <Button variant="default" className="flex items-center gap-2">
                  View Compressed Rewards
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ZkCompression;
