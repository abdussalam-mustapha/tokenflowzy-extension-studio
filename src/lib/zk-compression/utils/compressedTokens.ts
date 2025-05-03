import { PublicKey, Transaction, Connection, Keypair, sendAndConfirmTransaction } from '@solana/web3.js';
import { defaultZkRpc } from '../services/rpc.service';

/**
 * Gets information about all holders of a compressed token.
 * @param mintAddress The mint address of the token
 * @returns Information about token holders
 */
export async function getCompressedTokenHolders(mintAddress: string) {
  try {
    const mintPubkey = new PublicKey(mintAddress);
    return await defaultZkRpc.getCompressedMintTokenHolders(mintPubkey);
  } catch (error) {
    console.error('Error getting compressed token holders:', error);
    throw new Error(`Failed to get compressed token holders: ${error.message}`);
  }
}

/**
 * Gets the balance of a specific compressed token account.
 * @param tokenAccountAddress The address of the token account
 * @returns The token balance information
 */
export async function getCompressedTokenAccountBalance(tokenAccountAddress: string) {
  try {
    const accountPubkey = new PublicKey(tokenAccountAddress);
    return await defaultZkRpc.getCompressedTokenAccountBalance(accountPubkey);
  } catch (error) {
    console.error('Error getting compressed token account balance:', error);
    throw new Error(`Failed to get compressed token account balance: ${error.message}`);
  }
}

/**
 * Helper function to check the health of the ZK Compression indexer.
 * @param slot Optional slot to check against
 * @returns Health status string
 */
export async function checkIndexerHealth(slot?: number) {
  try {
    if (slot) {
      return await defaultZkRpc.getIndexerHealth(slot);
    } else {
      const currentSlot = await defaultZkRpc.getSlot();
      return await defaultZkRpc.getIndexerHealth(currentSlot);
    }
  } catch (error) {
    console.error('Error checking indexer health:', error);
    throw new Error(`Failed to check indexer health: ${error.message}`);
  }
}

/**
 * Gets the current slot of the ZK Compression indexer.
 * @returns The current indexer slot
 */
export async function getIndexerSlot() {
  try {
    return await defaultZkRpc.getIndexerSlot();
  } catch (error) {
    console.error('Error getting indexer slot:', error);
    throw new Error(`Failed to get indexer slot: ${error.message}`);
  }
}

/**
 * Helper to check if the indexer is up-to-date with the blockchain.
 * @returns Object with status information
 */
export async function checkIndexerStatus() {
  try {
    const solanaSlot = await defaultZkRpc.getSlot();
    const indexerSlot = await defaultZkRpc.getIndexerSlot();
    const health = await defaultZkRpc.getIndexerHealth(solanaSlot);
    const laggedSlots = solanaSlot - indexerSlot;
    
    return {
      health,
      solanaSlot,
      indexerSlot,
      laggedSlots,
      isUpToDate: laggedSlots < 10, // Consider up-to-date if less than 10 slots behind
    };
  } catch (error) {
    console.error('Error checking indexer status:', error);
    throw new Error(`Failed to check indexer status: ${error.message}`);
  }
}

/**
 * Gets validity proof for a compressed transaction.
 * @param transactionId The ID of the transaction
 * @returns The validity proof information
 */
export async function getValidityProof(transactionId: string) {
  try {
    return await defaultZkRpc.getValidityProof(transactionId);
  } catch (error) {
    console.error('Error getting validity proof:', error);
    throw new Error(`Failed to get validity proof: ${error.message}`);
  }
}
