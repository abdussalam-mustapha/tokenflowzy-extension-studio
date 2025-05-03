import { Connection, PublicKey } from '@solana/web3.js';
import { defaultZkRpc } from '../services/rpc.service';

/**
 * Interface for transaction monitoring status
 */
export interface TransactionMonitorStatus {
  isActive: boolean;
  lastCheckedSlot?: number;
  recentSignatures: string[];
  pendingTransactions: PendingTransaction[];
}

/**
 * Interface for pending transaction data
 */
export interface PendingTransaction {
  signature: string;
  startTime: number;
  status: 'pending' | 'confirmed' | 'failed';
  confirmationTime?: number;
  error?: string;
}

// In-memory store of transaction status by account
const monitoringStatus: Record<string, TransactionMonitorStatus> = {};

// Keep track of callback functions by account
const statusCallbacks: Record<string, Array<(status: TransactionMonitorStatus) => void>> = {};

// Keep track of which intervals are active
let isMonitoringActive = false;
let monitoringInterval: ReturnType<typeof setInterval> | null = null;

/**
 * Start monitoring transactions for a compressed account
 * @param accountAddress The address to monitor
 * @param callback Function to call when status changes
 * @returns Function to stop monitoring for this callback
 */
export function monitorCompressedAccountTransactions(
  accountAddress: string,
  callback: (status: TransactionMonitorStatus) => void
): () => void {
  try {
    // Initialize monitoring for this account if not already active
    if (!monitoringStatus[accountAddress]) {
      monitoringStatus[accountAddress] = {
        isActive: true,
        recentSignatures: [],
        pendingTransactions: [],
      };
    } else {
      // If it exists but was inactive, mark as active again
      monitoringStatus[accountAddress].isActive = true;
    }
    
    // Register callback
    if (!statusCallbacks[accountAddress]) {
      statusCallbacks[accountAddress] = [];
    }
    statusCallbacks[accountAddress].push(callback);
    
    // Start global monitoring if not already running
    startGlobalMonitoring();
    
    // Return function to unregister this specific callback
    return () => {
      if (statusCallbacks[accountAddress]) {
        const index = statusCallbacks[accountAddress].indexOf(callback);
        if (index !== -1) {
          statusCallbacks[accountAddress].splice(index, 1);
        }
        
        // If no more callbacks for this account, mark it as inactive
        if (statusCallbacks[accountAddress].length === 0) {
          if (monitoringStatus[accountAddress]) {
            monitoringStatus[accountAddress].isActive = false;
          }
        }
        
        // If no active accounts at all, stop global monitoring
        if (Object.values(monitoringStatus).every(status => !status.isActive)) {
          stopGlobalMonitoring();
        }
      }
    };
  } catch (error) {
    console.error('Error setting up transaction monitoring:', error);
    // Return a no-op cleanup function
    return () => {};
  }
}

/**
 * Monitor a specific transaction
 * @param signature The transaction signature to monitor
 * @param accountAddress The account associated with this transaction
 */
export function monitorTransaction(
  signature: string,
  accountAddress: string
): void {
  try {
    // Initialize if needed
    if (!monitoringStatus[accountAddress]) {
      monitoringStatus[accountAddress] = {
        isActive: true,
        recentSignatures: [],
        pendingTransactions: [],
      };
    }
    
    // Add to pending transactions if not already there
    const existing = monitoringStatus[accountAddress].pendingTransactions
      .find(tx => tx.signature === signature);
      
    if (!existing) {
      monitoringStatus[accountAddress].pendingTransactions.push({
        signature,
        startTime: Date.now(),
        status: 'pending'
      });
      
      // Add to recent signatures
      if (!monitoringStatus[accountAddress].recentSignatures.includes(signature)) {
        monitoringStatus[accountAddress].recentSignatures.unshift(signature);
        // Keep only last 10 signatures
        monitoringStatus[accountAddress].recentSignatures = 
          monitoringStatus[accountAddress].recentSignatures.slice(0, 10);
      }
    }
    
    // Make sure monitoring is active
    startGlobalMonitoring();
    
    // Immediately notify all callbacks
    notifyStatusChanged(accountAddress);
  } catch (error) {
    console.error('Error monitoring transaction:', error);
  }
}

/**
 * Start the global monitoring process for all active accounts
 */
function startGlobalMonitoring() {
  if (isMonitoringActive) return;
  
  isMonitoringActive = true;
  
  // Clear any existing interval just to be safe
  if (monitoringInterval) {
    clearInterval(monitoringInterval);
  }
  
  // Set up the monitoring interval
  monitoringInterval = setInterval(checkAllPendingTransactions, 10000); // Check every 10 seconds
  
  // Initial check
  checkAllPendingTransactions();
}

/**
 * Stop the global monitoring process
 */
function stopGlobalMonitoring() {
  isMonitoringActive = false;
  
  if (monitoringInterval) {
    clearInterval(monitoringInterval);
    monitoringInterval = null;
  }
}

/**
 * Check status of all pending transactions
 */
async function checkAllPendingTransactions() {
  try {
    // For each account with active monitoring
    const activeAccounts = Object.entries(monitoringStatus)
      .filter(([_, status]) => status.isActive);
      
    if (activeAccounts.length === 0) {
      // If no active accounts, stop monitoring
      stopGlobalMonitoring();
      return;
    }
      
    // Process each active account
    for (const [accountAddress, status] of activeAccounts) {
      await checkAccountTransactions(accountAddress);
    }
  } catch (error) {
    console.error('Error checking pending transactions:', error);
  }
}

/**
 * Check transactions for a specific account
 * @param accountAddress The account to check
 */
async function checkAccountTransactions(accountAddress: string) {
  try {
    const status = monitoringStatus[accountAddress];
    if (!status) return;
    
    // Create a connection for checking transaction status
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    
    // Update current slot
    try {
      const currentSlot = await connection.getSlot();
      status.lastCheckedSlot = currentSlot;
    } catch (slotError) {
      console.warn('Error getting current slot:', slotError);
    }
    
    // Check for new transactions for this account
    try {
      const pubkey = new PublicKey(accountAddress);
      const newSignatures = await connection.getSignaturesForAddress(pubkey, { limit: 5 });
      
      // Process any new signatures
      for (const sigInfo of newSignatures) {
        const sig = sigInfo.signature;
        
        // Add to our recent signatures list if not already there
        if (!status.recentSignatures.includes(sig)) {
          status.recentSignatures.unshift(sig);
          // Keep only last 10 signatures
          status.recentSignatures = status.recentSignatures.slice(0, 10);
          
          // Add to pending if not already tracked
          const existing = status.pendingTransactions.find(tx => tx.signature === sig);
          if (!existing) {
            status.pendingTransactions.push({
              signature: sig,
              startTime: Date.now(),
              status: sigInfo.err ? 'failed' : 'pending',
              error: sigInfo.err ? JSON.stringify(sigInfo.err) : undefined
            });
          }
        }
      }
    } catch (signatureError) {
      console.warn('Error getting new signatures:', signatureError);
    }
    
    // Check statuses of all pending transactions
    const pendingTxs = status.pendingTransactions.filter(tx => tx.status === 'pending');
    
    if (pendingTxs.length > 0) {
      const signaturesToCheck = pendingTxs.map(tx => tx.signature);
      
      // Batch check all pending transactions
      const confirmedSignatures = new Set<string>();
      const failedSignatures = new Set<string>();
      
      for (const signature of signaturesToCheck) {
        try {
          const txStatus = await connection.getSignatureStatus(signature);
          
          if (txStatus && txStatus.value) {
            const confirmations = txStatus.value.confirmations || 0;
            
            if (txStatus.value.err) {
              // Transaction failed
              failedSignatures.add(signature);
            } else if (confirmations >= 1 || txStatus.value.confirmationStatus === 'confirmed') {
              // Transaction confirmed
              confirmedSignatures.add(signature);
            }
          }
        } catch (txError) {
          console.warn(`Error checking transaction ${signature}:`, txError);
        }
      }
      
      // Update status for confirmed transactions
      for (const sig of confirmedSignatures) {
        const tx = status.pendingTransactions.find(tx => tx.signature === sig);
        if (tx) {
          tx.status = 'confirmed';
          tx.confirmationTime = Date.now();
        }
      }
      
      // Update status for failed transactions
      for (const sig of failedSignatures) {
        const tx = status.pendingTransactions.find(tx => tx.signature === sig);
        if (tx) {
          tx.status = 'failed';
          tx.error = 'Transaction failed';
        }
      }
      
      // Clean up old pending transactions (over 1 hour old)
      const oneHourAgo = Date.now() - 3600000;
      status.pendingTransactions = status.pendingTransactions.filter(tx => {
        return tx.status === 'pending' || tx.startTime > oneHourAgo;
      });
    }
    
    // Notify status changed
    notifyStatusChanged(accountAddress);
  } catch (error) {
    console.error(`Error checking transactions for ${accountAddress}:`, error);
  }
}

/**
 * Notify all callbacks for an account that status has changed
 * @param accountAddress The account with updated status
 */
function notifyStatusChanged(accountAddress: string) {
  // Get the current status
  const status = monitoringStatus[accountAddress];
  if (!status) return;
  
  // Notify all registered callbacks
  const callbacks = statusCallbacks[accountAddress] || [];
  for (const callback of callbacks) {
    try {
      callback({ ...status }); // Send a copy of the status
    } catch (callbackError) {
      console.error('Error in transaction status callback:', callbackError);
    }
  }
}

/**
 * Get the current monitoring status for an account
 * @param accountAddress The account to get status for
 * @returns The current monitoring status
 */
export function getTransactionMonitorStatus(accountAddress: string): TransactionMonitorStatus {
  return monitoringStatus[accountAddress] || {
    isActive: false,
    recentSignatures: [],
    pendingTransactions: []
  };
}
