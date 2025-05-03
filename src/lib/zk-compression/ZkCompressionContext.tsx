import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TokenMetadataService } from './services/tokenMetadata.service';
import { UserRewardsService } from './services/userRewards.service';
import { createMerkleTree } from './utils/merkleTree';
import { MerkleTreeData, TokenMetadata, UserReward } from './types';

interface ZkCompressionContextType {
  isInitializing: boolean;
  isInitialized: boolean;
  error: string | null;
  tokenMetadataTree: MerkleTreeData | null;
  userRewardsTree: MerkleTreeData | null;
  tokenMetadataService: TokenMetadataService | null;
  userRewardsService: UserRewardsService | null;
  compressTokenMetadata: (metadata: TokenMetadata) => Promise<{
    leaf: Uint8Array;
    proof: Uint8Array;
    leafHash: string;
  }>;
  compressUserReward: (reward: UserReward) => Promise<{
    leaf: Uint8Array;
    proof: Uint8Array;
    leafHash: string;
  }>;
  verifyTokenMetadata: (proof: Uint8Array, leaf: Uint8Array) => Promise<boolean>;
  verifyUserReward: (proof: Uint8Array, leaf: Uint8Array) => Promise<boolean>;
  getTokenMetadataRoot: () => Promise<string>;
  getUserRewardsRoot: () => Promise<string>;
}

const ZkCompressionContext = createContext<ZkCompressionContextType | null>(null);

export const useZkCompression = () => {
  const context = useContext(ZkCompressionContext);
  if (!context) {
    throw new Error('useZkCompression must be used within a ZkCompressionProvider');
  }
  return context;
};

interface ZkCompressionProviderProps {
  children: ReactNode;
}

export const ZkCompressionProvider: React.FC<ZkCompressionProviderProps> = ({ children }) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenMetadataTree, setTokenMetadataTree] = useState<MerkleTreeData | null>(null);
  const [userRewardsTree, setUserRewardsTree] = useState<MerkleTreeData | null>(null);
  const [tokenMetadataService, setTokenMetadataService] = useState<TokenMetadataService | null>(null);
  const [userRewardsService, setUserRewardsService] = useState<UserRewardsService | null>(null);

  // Initialize ZK compression trees and services
  useEffect(() => {
    const initializeZkCompression = async () => {
      setIsInitializing(true);
      setError(null);

      try {
        // Create Merkle trees for token metadata and user rewards
        const metadataTree = await createMerkleTree();
        const rewardsTree = await createMerkleTree();

        // Create services using the tree IDs
        const metadataService = new TokenMetadataService(metadataTree.treeId);
        const rewardsService = new UserRewardsService(rewardsTree.treeId);

        // Save to state
        setTokenMetadataTree(metadataTree);
        setUserRewardsTree(rewardsTree);
        setTokenMetadataService(metadataService);
        setUserRewardsService(rewardsService);
        setIsInitialized(true);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error initializing ZK compression';
        setError(errorMessage);
        console.error('Failed to initialize ZK compression:', err);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeZkCompression();
  }, []);

  // Compress token metadata
  const compressTokenMetadata = async (metadata: TokenMetadata) => {
    if (!tokenMetadataService) {
      throw new Error('Token metadata service not initialized');
    }
    return await tokenMetadataService.compressMetadata(metadata);
  };

  // Compress user reward
  const compressUserReward = async (reward: UserReward) => {
    if (!userRewardsService) {
      throw new Error('User rewards service not initialized');
    }
    return await userRewardsService.compressReward(reward);
  };

  // Verify token metadata
  const verifyTokenMetadata = async (proof: Uint8Array, leaf: Uint8Array) => {
    if (!tokenMetadataService) {
      throw new Error('Token metadata service not initialized');
    }
    return await tokenMetadataService.verifyMetadata(proof, leaf);
  };

  // Verify user reward
  const verifyUserReward = async (proof: Uint8Array, leaf: Uint8Array) => {
    if (!userRewardsService) {
      throw new Error('User rewards service not initialized');
    }
    return await userRewardsService.verifyReward(proof, leaf);
  };

  // Get token metadata root
  const getTokenMetadataRoot = async () => {
    if (!tokenMetadataService) {
      throw new Error('Token metadata service not initialized');
    }
    return await tokenMetadataService.getCurrentRoot();
  };

  // Get user rewards root
  const getUserRewardsRoot = async () => {
    if (!userRewardsService) {
      throw new Error('User rewards service not initialized');
    }
    return await userRewardsService.getCurrentRoot();
  };

  const value: ZkCompressionContextType = {
    isInitializing,
    isInitialized,
    error,
    tokenMetadataTree,
    userRewardsTree,
    tokenMetadataService,
    userRewardsService,
    compressTokenMetadata,
    compressUserReward,
    verifyTokenMetadata,
    verifyUserReward,
    getTokenMetadataRoot,
    getUserRewardsRoot,
  };

  return (
    <ZkCompressionContext.Provider value={value}>
      {children}
    </ZkCompressionContext.Provider>
  );
};
