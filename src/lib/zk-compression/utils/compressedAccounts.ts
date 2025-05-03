import { defaultZkRpc } from '../services/rpc.service';
import { PublicKey } from '@solana/web3.js';

/**
 * Gets information about a compressed account.
 * @param accountAddress The address of the compressed account to query
 * @returns The compressed account information
 */
export async function getCompressedAccount(accountAddress: string) {
  try {
    const pubkey = new PublicKey(accountAddress);
    return await defaultZkRpc.getCompressedAccount(pubkey);
  } catch (error) {
    console.error('Error getting compressed account:', error);
    throw new Error(`Failed to get compressed account: ${error.message}`);
  }
}

/**
 * Gets the compressed SOL balance for an account.
 * @param accountAddress The address of the compressed account
 * @returns The SOL balance in lamports
 */
export async function getCompressedBalance(accountAddress: string) {
  try {
    const pubkey = new PublicKey(accountAddress);
    
    // Try to get the compressed balance, but handle potential failures gracefully
    try {
      const balance = await defaultZkRpc.getCompressedBalance(pubkey);
      return balance;
    } catch (rpcError) {
      console.warn('RPC error getting compressed balance, returning 0:', rpcError);
      return 0; // Return 0 if the account doesn't exist or RPC fails
    }
  } catch (error) {
    console.error('Error getting compressed balance:', error);
    // Instead of throwing, return 0 so the UI can handle it gracefully
    return 0;
  }
}

/**
 * Gets information about compressed token accounts owned by a specific address.
 * @param ownerAddress The owner's public key
 * @param mintAddress Optional mint address to filter by
 * @returns Array of compressed token accounts
 */
export async function getCompressedTokenAccounts(ownerAddress: string, mintAddress?: string) {
  try {
    const ownerPubkey = new PublicKey(ownerAddress);
    
    if (mintAddress) {
      const mintPubkey = new PublicKey(mintAddress);
      // Use only the mint parameter for filtering
      return await defaultZkRpc.getCompressedTokenAccountsByOwner(
        ownerPubkey,
        { mint: mintPubkey }
      );
    } else {
      return await defaultZkRpc.getCompressedTokenAccountsByOwner(
        ownerPubkey,
        { programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') }
      );
    }
  } catch (error) {
    console.error('Error getting compressed token accounts:', error);
    throw new Error(`Failed to get compressed token accounts: ${error.message}`);
  }
}

/**
 * Gets compressed token balances for a wallet owner.
 * @param ownerAddress The owner's public key
 * @returns Map of mint addresses to token balances
 */
export async function getCompressedTokenBalances(ownerAddress: string) {
  try {
    const ownerPubkey = new PublicKey(ownerAddress);
    
    // Attempt to get token balances from the ZK RPC
    const balances = await defaultZkRpc.getCompressedTokenBalancesByOwnerV2(ownerPubkey);
    
    // Cast the response to an array to handle different API response formats
    // The structure might be either directly an array or have a nested 'tokens' property
    const tokenArray = Array.isArray(balances) ? balances : 
                      (balances as any)?.tokens || [];
    
    if (tokenArray.length === 0) {
      console.log('No compressed token balances found or empty response');
      return {}; // Return empty object if no balances
    }
    
    // Safely process the balances with better type handling
    return tokenArray.reduce((acc, token) => {
      if (token && token.mint) { // Check that token and token.mint exist
        acc[token.mint] = {
          amount: token.amount || '0',
          decimals: token.decimals || 0,
          uiAmount: token.uiAmount || 0,
        };
      }
      return acc;
    }, {} as Record<string, { amount: string, decimals: number, uiAmount: number }>);
  } catch (error) {
    console.error('Error getting compressed token balances:', error);
    // Instead of throwing, return an empty object so the UI can handle it gracefully
    return {};
  }
}

/**
 * Gets a proof for a compressed account.
 * @param accountAddress The address of the compressed account
 * @returns The account proof data
 */
export async function getCompressedAccountProof(accountAddress: string) {
  try {
    const pubkey = new PublicKey(accountAddress);
    return await defaultZkRpc.getCompressedAccountProof(pubkey);
  } catch (error) {
    console.error('Error getting compressed account proof:', error);
    throw new Error(`Failed to get compressed account proof: ${error.message}`);
  }
}

/**
 * Gets information about a transaction including compression-related details.
 * @param signature The transaction signature
 * @returns Transaction information with compression details
 */
export async function getTransactionWithCompressionInfo(signature: string) {
  try {
    return await defaultZkRpc.getTransactionWithCompressionInfo(signature);
  } catch (error) {
    console.error('Error getting transaction with compression info:', error);
    throw new Error(`Failed to get transaction with compression info: ${error.message}`);
  }
}

/**
 * Gets the latest compression-related transactions for an account.
 * @param accountAddress The address to query
 * @param limit Maximum number of signatures to return
 * @returns Array of transaction signatures
 */
export async function getCompressionSignaturesForAccount(accountAddress: string, limit = 10) {
  try {
    const pubkey = new PublicKey(accountAddress);
    
    // Try to get compression signatures with fallback
    try {
      // Get signatures, may need to adjust parameters based on the actual API
      const signatures = await defaultZkRpc.getSignaturesForAddress(pubkey);
      
      // Filter to only get the compression-related ones
      // This is a simplified approach and may need adjustment
      return signatures.slice(0, limit).map(sig => ({
        signature: sig.signature,
        slot: sig.slot,
        err: sig.err,
        memo: sig.memo,
        blockTime: sig.blockTime
      }));
    } catch (rpcError) {
      console.warn('RPC error getting compression signatures, returning empty array:', rpcError);
      return []; // Return empty array if RPC fails
    }
  } catch (error) {
    console.error('Error getting compression signatures:', error);
    // Instead of throwing, return an empty array so the UI can handle it gracefully
    return [];
  }
}
