import React, { useEffect, useState } from 'react';
import { useWalletIntegration } from '../../lib/wallet/useWalletIntegration';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { Alert, AlertDescription, AlertTitle } from './alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Loader2, RefreshCw, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { monitorCompressedAccountTransactions, TransactionMonitorStatus, PendingTransaction } from '../../lib/zk-compression/utils/transactionMonitor';
import { verifyProof, ProofVerificationResult } from '../../lib/zk-compression/utils/proofVerification';

interface CompressedTransactionMonitorProps {
  className?: string;
}

export function CompressedTransactionMonitor({ className = '' }: CompressedTransactionMonitorProps) {
  const { publicKey } = useWalletIntegration();
  
  const [monitorStatus, setMonitorStatus] = useState<TransactionMonitorStatus | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<ProofVerificationResult | null>(null);
  const [selectedTab, setSelectedTab] = useState('transactions');

  // Start monitoring when wallet is connected
  useEffect(() => {
    if (!publicKey) {
      setMonitorStatus(null);
      return;
    }
    
    // Set up transaction monitoring
    const stopMonitoring = monitorCompressedAccountTransactions(
      publicKey.toString(),
      (status) => {
        setMonitorStatus(status);
      }
    );
    
    // Clean up when component unmounts or wallet changes
    return () => {
      stopMonitoring();
    };
  }, [publicKey]);

  // Function to simulate proof verification
  const performVerification = async () => {
    if (!publicKey) return;
    
    setIsVerifying(true);
    setVerificationResult(null);
    
    try {
      // Use placeholder values for demonstration
      // In a real app, these would be the actual leaf and proof data
      const mockLeaf = new Uint8Array(Buffer.from('test-leaf'));
      const mockProof = new Uint8Array(Buffer.from('test-proof'));
      
      // Verify the proof
      const result = await verifyProof(
        publicKey.toString(),
        mockLeaf,
        mockProof
      );
      
      setVerificationResult(result);
    } catch (error) {
      console.error('Error verifying proof:', error);
      setVerificationResult({
        isValid: false,
        error: 'Error during verification process'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Render a transaction item
  const renderTransaction = (tx: PendingTransaction) => {
    const getStatusBadge = () => {
      if (tx.status === 'confirmed') {
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Confirmed
          </Badge>
        );
      } else if (tx.status === 'failed') {
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      } else {
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      }
    };
    
    return (
      <div key={tx.signature} className="border-b last:border-0 py-3">
        <div className="flex items-center justify-between mb-1">
          <div className="font-medium truncate max-w-[250px]" title={tx.signature}>
            {tx.signature.slice(0, 8)}...{tx.signature.slice(-8)}
          </div>
          {getStatusBadge()}
        </div>
        <div className="text-sm text-muted-foreground">
          {new Date(tx.startTime).toLocaleString()}
        </div>
        {tx.error && (
          <div className="mt-2 text-sm text-red-600">
            Error: {tx.error}
          </div>
        )}
      </div>
    );
  };

  // If no wallet connected
  if (!publicKey) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Compressed Transaction Monitor</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Wallet Not Connected</AlertTitle>
            <AlertDescription>
              Please connect your wallet to monitor compressed transactions and verify proofs.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Compressed Account Monitor</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="verification">Proof Verification</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions" className="pt-4">
            {!monitorStatus ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span>Starting monitoring...</span>
              </div>
            ) : monitorStatus.pendingTransactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No compressed transactions found for this wallet.</p>
                <p className="text-sm mt-1">New transactions will appear here automatically.</p>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">
                    {monitorStatus.pendingTransactions.length} transaction(s)
                  </span>
                  {monitorStatus.lastCheckedSlot && (
                    <span className="text-xs text-muted-foreground">
                      Last update: Slot {monitorStatus.lastCheckedSlot}
                    </span>
                  )}
                </div>
                
                <div className="border rounded-md divide-y">
                  {monitorStatus.pendingTransactions
                    .sort((a, b) => b.startTime - a.startTime) // Show newest first
                    .map(renderTransaction)}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="verification" className="pt-4">
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Proof Verification</AlertTitle>
                <AlertDescription>
                  Verify that your compressed account data exists in the Merkle tree.
                  This helps ensure your assets haven't been tampered with.
                </AlertDescription>
              </Alert>
              
              <Button 
                onClick={performVerification} 
                disabled={isVerifying}
                className="w-full"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying Proof...
                  </>
                ) : (
                  'Verify Compressed Data'
                )}
              </Button>
              
              {verificationResult && (
                <div className={`p-4 mt-4 border rounded-md ${
                  verificationResult.isValid 
                    ? 'bg-green-50 border-green-200 text-green-700' 
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                  <div className="flex items-center gap-2 font-semibold mb-2">
                    {verificationResult.isValid ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Proof Verified Successfully
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5" />
                        Proof Verification Failed
                      </>
                    )}
                  </div>
                  
                  {verificationResult.error ? (
                    <p>{verificationResult.error}</p>
                  ) : verificationResult.details ? (
                    <div className="space-y-1 text-sm">
                      <p><strong>Merkle Root:</strong> {verificationResult.details.merkleRoot.slice(0, 16)}...</p>
                      {verificationResult.details.leafIndex >= 0 && (
                        <p><strong>Leaf Index:</strong> {verificationResult.details.leafIndex}</p>
                      )}
                      <p><strong>Proof:</strong> {verificationResult.details.proof.slice(0, 16)}...</p>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
