import React from 'react';
import { CompressedWalletView } from '../components/ui/compressed-wallet-view';
import { CompressedTransactionMonitor } from '../components/ui/compressed-transaction-monitor';
import { useZkCompression } from '../lib/zk-compression/ZkCompressionContext';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { AlertCircle, ShieldCheck, Wallet, Zap } from 'lucide-react';

export default function CompressedWalletPage() {
  const zkCompression = useZkCompression();
  
  return (
    <div className="container max-w-7xl py-8">
      <h1 className="text-3xl font-bold mb-4">ZK Compression Wallet</h1>
      <p className="text-muted-foreground mb-8">
        View and manage your compressed accounts and tokens using the ZK Compression protocol.
      </p>
      
      {zkCompression.error ? (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>ZK Compression Error</AlertTitle>
          <AlertDescription>
            {zkCompression.error}
            <div className="mt-2 text-sm">
              This may be due to network issues or the ZK Compression indexer being unavailable.
              Try refreshing the page or come back later.
            </div>
          </AlertDescription>
        </Alert>
      ) : null}
      
      <div className="flex flex-col gap-6">
        <CompressedWalletView />
        
        <CompressedTransactionMonitor className="mt-6" />
        
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Compressed Tokens
              </CardTitle>
              <CardDescription>
                Store token data off-chain with ZK proofs for dramatic cost reduction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Compressed tokens use ZK proofs to store token data off-chain, reducing storage costs by up to 1000x.
              </p>
              
              <div className="mb-4 p-3 border rounded-md bg-amber-50 border-amber-200 text-amber-700 text-sm">
                <strong>Note:</strong> You need to connect a wallet and have compressed tokens to see them listed here.
              </div>
              
              {zkCompression.isInitialized ? (
                <div className="p-3 border rounded-md bg-green-50 border-green-200 text-green-700 text-sm">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>ZK Compression initialized successfully. Your account is ready.</span>
                  </div>
                </div>
              ) : zkCompression.isInitializing ? (
                <div className="p-3 border rounded-md bg-green-50 border-green-200 text-green-700 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-green-700 border-t-transparent rounded-full animate-spin" />
                    <span>Initializing ZK Compression...</span>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Benefits of ZK Compression
              </CardTitle>
              <CardDescription>
                Why compressed accounts are the future of Solana tokens
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                  <div>
                    <strong className="text-foreground">Dramatic Cost Reduction</strong>
                    <p className="text-sm">Up to 1000x reduction in storage costs compared to standard tokens</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                  <div>
                    <strong className="text-foreground">Higher Throughput</strong>
                    <p className="text-sm">Process more token transfers per second with less blockchain bloat</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                  <div>
                    <strong className="text-foreground">Enhanced Security</strong>
                    <p className="text-sm">Proof-based verification ensures data integrity and security</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">4</div>
                  <div>
                    <strong className="text-foreground">Massive Scalability</strong>
                    <p className="text-sm">Support for extremely large collections without blockchain congestion</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
