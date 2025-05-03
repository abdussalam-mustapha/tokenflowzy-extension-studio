// ZK Compression Types
export interface MerkleTreeData {
  root: string;
  treeId: string;
}

export interface TokenMetadata {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  logo?: string;
  description?: string;
  additionalMetadata?: Record<string, any>;
}

export interface UserReward {
  userId: string;
  tokenId: string;
  amount: string;
  timestamp: number;
  additionalData?: Record<string, any>;
}

export interface CompressionProof {
  proof: Uint8Array;
  publicInputs: Uint8Array[];
  leaf: Uint8Array;
}

export interface ZkRpcConfig {
  standardRpc: string;
  compressionRpc: string;
  proverUrl: string;
  heliusUrl?: string; // Optional Helius URL that can be used for all endpoints
}

export type LeafData = TokenMetadata | UserReward;
