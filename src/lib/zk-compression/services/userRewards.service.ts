import { defaultZkRpc } from './rpc.service';
import { UserReward } from '../types';
import { serializeData, addUserReward, verifyCompressedData, getCompressedAccountInfo } from '../utils/merkleTree';

/**
 * My service for managing user rewards compression
 */
export class UserRewardsService {
  private treeId: string;
  private offchainStorage: Map<string, UserReward> = new Map();

  /**
   * I create a new user rewards service
   * @param treeId The ID of the Merkle tree to use
   */
  constructor(treeId: string) {
    this.treeId = treeId;
  }

  /**
   * I compress user reward data and add it to the Merkle tree
   * @param reward The user reward data to compress
   * @returns The leaf hash and proof
   */
  async compressReward(reward: UserReward) {
    try {
      // Use our custom addUserReward function which handles everything
      const result = await addUserReward(this.treeId, reward);

      // Store reward in off-chain storage (would be IPFS/Arweave in production)
      const leafHash = Array.from(result.leaf)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      this.offchainStorage.set(leafHash, reward);

      return {
        leaf: result.leaf,
        proof: result.proof,
        leafHash
      };
    } catch (error) {
      console.error('Error compressing user reward:', error);
      throw new Error(`Failed to compress user reward: ${error.message}`);
    }
  }

  /**
   * I get user reward by its leaf hash
   * @param leafHash The hash of the leaf to retrieve
   * @returns The user reward or null if not found
   */
  getRewardByLeafHash(leafHash: string): UserReward | null {
    return this.offchainStorage.get(leafHash) || null;
  }

  /**
   * I get all rewards for a specific user
   * @param userId The ID of the user to get rewards for
   * @returns Array of user rewards
   */
  getRewardsByUserId(userId: string): UserReward[] {
    const rewards: UserReward[] = [];
    
    this.offchainStorage.forEach((reward) => {
      if (reward.userId === userId) {
        rewards.push(reward);
      }
    });
    
    return rewards;
  }

  /**
   * I verify that a user reward exists in the compressed account
   * @param proof The proof to verify
   * @param leaf The leaf data
   * @returns True if the reward is verified
   */
  async verifyReward(proof: Uint8Array, leaf: Uint8Array): Promise<boolean> {
    try {
      return await verifyCompressedData(this.treeId, proof, leaf);
    } catch (error) {
      console.error('Error verifying user reward:', error);
      throw new Error(`Failed to verify user reward: ${error.message}`);
    }
  }

  /**
   * I get the current compressed account info
   * @returns The root identifier of the compressed account
   */
  async getCurrentRoot(): Promise<string> {
    try {
      const accountInfo = await getCompressedAccountInfo(this.treeId);
      
      // In a real implementation, we would extract the root from the account info
      // For now, just return a portion of the public key as the root
      return accountInfo.pubkey.toBase58().slice(0, 16);
    } catch (error) {
      console.error('Error getting compressed account info:', error);
      throw new Error(`Failed to get compressed account info: ${error.message}`);
    }
  }

  /**
   * I convert user reward to a format ready for Solana transactions
   * @param reward The user reward
   * @param proof The proof for the reward
   * @returns An object with the necessary transaction data
   */
  async prepareForTransaction(reward: UserReward, proof: Uint8Array) {
    const serializedData = serializeData(reward);
    
    return {
      proof: Array.from(proof),
      data: Array.from(serializedData)
    };
  }
}
