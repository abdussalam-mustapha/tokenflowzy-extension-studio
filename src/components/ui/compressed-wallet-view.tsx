import React, { useState } from 'react';
import { useCompressedWallet } from '../../lib/zk-compression/hooks/useCompressedWallet';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Loader2, RefreshCw, Wallet, CreditCard, Clock, AlertCircle } from 'lucide-react';

export function CompressedWalletView() {
  const {
    loading,
    error,
    solBalance,
    tokenBalances,
    tokenAccounts,
    recentTransactions,
    indexerStatus,
    refreshWalletData
  } = useCompressedWallet();
  
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="w-full max-w-2xl mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Compressed Wallet
            </CardTitle>
            <CardDescription>
              View your compressed accounts and tokens using ZK Compression
            </CardDescription>
          </div>
          
          {indexerStatus && (
            <Badge 
              variant={indexerStatus.health === 'Ok' ? 'outline' : 'destructive'}
              className="flex items-center gap-1"
            >
              {indexerStatus.health === 'Ok' ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  {indexerStatus.isUpToDate ? 'Synced' : `${indexerStatus.laggedSlots} slots behind`}
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3" />
                  Indexer Error
                </>
              )}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <div className="p-4 text-sm border rounded-md bg-red-50 text-red-600 border-red-200 relative">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-red-700 mb-1">Error Loading Compressed Wallet Data</h4>
                <p className="mb-2">{error}</p>
                <div className="text-red-700 space-y-1">
                  <p><strong>Troubleshooting steps:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Make sure your wallet is connected</li>
                    <li>Check that you're on the Solana network where your compressed accounts exist</li>
                    <li>The ZK Compression indexer may be temporarily unavailable</li>
                    <li>Try refreshing your wallet data using the button below</li>
                  </ul>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:text-red-700"
              onClick={refreshWalletData}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        )}
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 border rounded-lg">
            <div className="text-sm font-medium text-muted-foreground">Compressed SOL</div>
            <div className="text-2xl font-bold mt-1">
              {solBalance !== null ? `${solBalance.toLocaleString()} SOL` : '-'}
            </div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <div className="text-sm font-medium text-muted-foreground">Compressed Tokens</div>
            <div className="text-2xl font-bold mt-1">
              {Object.keys(tokenBalances).length}
            </div>
          </div>
        </div>
        
        {expanded && (
          <>
            {/* Token Balances */}
            {Object.keys(tokenBalances).length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <div className="p-3 bg-muted font-medium">Compressed Token Balances</div>
                <div className="divide-y">
                  {Object.entries(tokenBalances).map(([mint, data]: [string, any]) => (
                    <div key={mint} className="p-3 flex justify-between items-center">
                      <div className="truncate max-w-[200px]">{mint}</div>
                      <div className="font-medium">{data.uiAmount.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            
            {/* Recent Transactions */}
            {recentTransactions.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <div className="p-3 bg-muted font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Recent ZK Compression Transactions
                </div>
                <div className="divide-y">
                  {recentTransactions.map((signature, index) => (
                    <div key={index} className="p-3 text-xs font-mono">
                      <a 
                        href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {signature.slice(0, 20)}...{signature.slice(-4)}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Show Less' : 'Show More'}
        </Button>
        
        <Button
          variant="default"
          size="sm"
          onClick={refreshWalletData}
          disabled={loading}
          className="flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Refresh
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
