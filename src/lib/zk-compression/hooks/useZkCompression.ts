import { useState, useCallback } from 'react';
import { 
  createMerkleTree, 
  addTokenMetadata, 
  addUserReward,
  verifyProof,
  getTreeRoot
} from '../utils/merkleTree';
import { 
  TokenMetadata, 
  UserReward, 
  MerkleTreeData 
} from '../types';

/**
 * Custom hook for ZK Compression operations
 */
export const useZkCompression = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTree, setCurrentTree] = useState<MerkleTreeData | null>(null);

  // Create a new Merkle tree
  const createTree = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const newTree = await createMerkleTree();
      setCurrentTree(newTree);
      return newTree;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error creating tree';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Compress token metadata and add to Merkle tree
  const compressTokenMetadata = useCallback(async (
    treeId: string,
    metadata: TokenMetadata
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await addTokenMetadata(treeId, metadata);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error compressing token metadata';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Compress user reward data and add to Merkle tree
  const compressUserReward = useCallback(async (
    treeId: string,
    reward: UserReward
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await addUserReward(treeId, reward);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error compressing user reward';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Verify a piece of data exists in a Merkle tree
  const verify = useCallback(async (
    root: Uint8Array,
    proof: Uint8Array,
    leaf: Uint8Array
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const isValid = await verifyProof(root, proof, leaf);
      return isValid;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error verifying proof';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get the current root of a tree
  const getRoot = useCallback(async (treeId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const root = await getTreeRoot(treeId);
      return root;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error getting tree root';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    currentTree,
    createTree,
    compressTokenMetadata,
    compressUserReward,
    verify,
    getRoot
  };
};
