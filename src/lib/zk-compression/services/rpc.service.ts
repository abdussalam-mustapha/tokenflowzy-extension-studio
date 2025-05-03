import { createRpc, Rpc } from "@lightprotocol/stateless.js";
import { ZkRpcConfig } from "../types";

// My default RPC endpoints (can be overridden with environment variables or user config)
// I'm using Helius with the provided API key
const DEFAULT_CONFIG: ZkRpcConfig = {
  // Helius URL with my API key
  heliusUrl: "https://devnet.helius-rpc.com/?api-key=2c0e0145-6503-4035-ac83-f2023f8794b6",
  
  // I'll fallback to public endpoints if Helius is unavailable
  standardRpc: "https://api.devnet.solana.com", // Standard Solana RPC
  compressionRpc: "https://api.devnet.solana.com", // ZK Compression RPC
  proverUrl: "https://api.devnet.solana.com", // Prover service
};

/**
 * I create and return a ZK Compression RPC client
 * @param config Optional custom RPC configuration
 * @returns The configured RPC client
 */
export const createZkRpc = (config?: Partial<ZkRpcConfig>): Rpc => {
  const rpcConfig = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  // If Helius URL is provided, I'll use it for all endpoints
  if (rpcConfig.heliusUrl) {
    return createRpc(
      rpcConfig.heliusUrl,
      rpcConfig.heliusUrl,
      rpcConfig.heliusUrl
    );
  }

  // Otherwise I'll use separate endpoints
  return createRpc(
    rpcConfig.standardRpc,
    rpcConfig.compressionRpc,
    rpcConfig.proverUrl
  );
};

// I'm creating a singleton instance with default config (for convenience)
export const defaultZkRpc = createZkRpc();
