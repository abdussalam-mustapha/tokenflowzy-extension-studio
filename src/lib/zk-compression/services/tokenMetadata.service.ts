import { PublicKey } from '@solana/web3.js';
import { defaultZkRpc } from './rpc.service';
import { TokenMetadata } from '../types';
import { serializeData, addTokenMetadata, verifyCompressedData, getCompressedAccountInfo } from '../utils/merkleTree';

/**
 * My service for managing token metadata compression
 */
export class TokenMetadataService {
  private treeId: string;
  private offchainStorage: Map<string, TokenMetadata> = new Map();

  /**
   * I create a new token metadata service
   * @param treeId The ID of the Merkle tree to use
   */
  constructor(treeId: string) {
    this.treeId = treeId;
  }

  /**
   * I compress token metadata and add it to the Merkle tree
   * @param metadata The token metadata to compress
   * @returns The leaf hash and proof
   */
  async compressMetadata(metadata: TokenMetadata) {
    try {
      // Use our custom addTokenMetadata function which handles everything
      const result = await addTokenMetadata(this.treeId, metadata);

      // Store metadata in off-chain storage (would be IPFS/Arweave in production)
      const leafHash = Array.from(result.leaf)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      this.offchainStorage.set(leafHash, metadata);

      return {
        leaf: result.leaf,
        proof: result.proof,
        leafHash
      };
    } catch (error) {
      console.error('Error compressing token metadata:', error);
      throw new Error(`Failed to compress token metadata: ${error.message}`);
    }
  }

  /**
   * I get token metadata by its leaf hash
   * @param leafHash The hash of the leaf to retrieve
   * @returns The token metadata or null if not found
   */
  getMetadataByLeafHash(leafHash: string): TokenMetadata | null {
    return this.offchainStorage.get(leafHash) || null;
  }

  /**
   * I verify that token metadata exists in the compressed account
   * @param proof The proof to verify
   * @param leaf The leaf data
   * @returns True if the metadata is verified
   */
  async verifyMetadata(proof: Uint8Array, leaf: Uint8Array): Promise<boolean> {
    try {
      return await verifyCompressedData(this.treeId, proof, leaf);
    } catch (error) {
      console.error('Error verifying token metadata:', error);
      throw new Error(`Failed to verify token metadata: ${error.message}`);
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
   * I convert token metadata to a format ready for Solana transactions
   * @param metadata The token metadata
   * @param proof The proof for the metadata
   * @returns An object with the necessary transaction data
   */
  prepareForTransaction(metadata: TokenMetadata, proof: Uint8Array) {
    const serializedData = serializeData(metadata);
    
    return {
      proof: Array.from(proof),
      data: Array.from(serializedData)
    };
  }
}
