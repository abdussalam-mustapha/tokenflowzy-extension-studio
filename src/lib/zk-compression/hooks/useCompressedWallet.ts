import { useState, useCallback, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import {
  getCompressedBalance,
  getCompressedTokenAccounts,
  getCompressedTokenBalances,
  getCompressionSignaturesForAccount
} from '../utils/compressedAccounts';
import { checkIndexerStatus } from '../utils/compressedTokens';

/**
 * My custom hook for accessing compressed token data for the connected wallet
 */
export function useCompressedWallet() {
  const { publicKey, connected } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [tokenBalances, setTokenBalances] = useState<Record<string, any>>({});
  const [tokenAccounts, setTokenAccounts] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<string[]>([]);
  const [indexerStatus, setIndexerStatus] = useState<{
    health: string;
    isUpToDate: boolean;
    laggedSlots: number;
  } | null>(null);

  // Check if the ZK Compression indexer is healthy and up-to-date
  const checkIndexer = useCallback(async () => {
    try {
      const status = await checkIndexerStatus();
      setIndexerStatus({
        health: status.health,
        isUpToDate: status.isUpToDate,
        laggedSlots: status.laggedSlots
      });
      return status;
    } catch (err) {
      console.error('Error checking indexer:', err);
      setIndexerStatus({
        health: 'Error',
        isUpToDate: false,
        laggedSlots: 9999
      });
      return null;
    }
  }, []);

  // Fetch compressed SOL balance for the connected wallet
  const fetchCompressedBalance = useCallback(async () => {
    if (!publicKey) return null;
    try {
      const balance = await getCompressedBalance(publicKey.toString());
      setSolBalance(balance ? balance / 1e9 : 0); // Convert lamports to SOL
      return balance;
    } catch (err) {
      console.error('Error fetching compressed balance:', err);
      setSolBalance(null);
      return null;
    }
  }, [publicKey]);

  // Fetch compressed token accounts for the connected wallet
  const fetchCompressedTokenAccounts = useCallback(async (mintAddress?: string) => {
    if (!publicKey) return [];
    try {
      const accounts = await getCompressedTokenAccounts(publicKey.toString(), mintAddress);
      if (accounts && accounts.value) {
        setTokenAccounts(accounts.value);
        return accounts.value;
      }
      return [];
    } catch (err) {
      console.error('Error fetching compressed token accounts:', err);
      setTokenAccounts([]);
      return [];
    }
  }, [publicKey]);

  // Fetch compressed token balances for the connected wallet
  const fetchCompressedTokenBalances = useCallback(async () => {
    if (!publicKey) return {};
    try {
      const balances = await getCompressedTokenBalances(publicKey.toString());
      setTokenBalances(balances || {});
      return balances;
    } catch (err) {
      console.error('Error fetching compressed token balances:', err);
      setTokenBalances({});
      return {};
    }
  }, [publicKey]);

  // Fetch recent compressed transactions for the connected wallet
  const fetchRecentTransactions = useCallback(async (limit = 10) => {
    if (!publicKey) return [];
    try {
      const signatures = await getCompressionSignaturesForAccount(publicKey.toString(), limit);
      if (signatures && signatures.length > 0) {
        setRecentTransactions(signatures.map(sig => sig.signature));
        return signatures;
      }
      return [];
    } catch (err) {
      console.error('Error fetching recent transactions:', err);
      setRecentTransactions([]);
      return [];
    }
  }, [publicKey]);

  // Refresh all wallet data at once
  const refreshWalletData = useCallback(async () => {
    if (!publicKey || !connected) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await Promise.all([
        checkIndexer(),
        fetchCompressedBalance(),
        fetchCompressedTokenBalances(),
        fetchCompressedTokenAccounts(),
        fetchRecentTransactions()
      ]);
    } catch (err: any) {
      console.error('Error refreshing wallet data:', err);
      setError(err.message || 'Failed to refresh wallet data');
    } finally {
      setLoading(false);
    }
  }, [publicKey, connected, checkIndexer, fetchCompressedBalance, fetchCompressedTokenBalances, fetchCompressedTokenAccounts, fetchRecentTransactions]);

  // Initially load data when wallet connects
  useEffect(() => {
    if (connected && publicKey) {
      refreshWalletData();
    } else {
      // Reset states when wallet disconnects
      setSolBalance(null);
      setTokenBalances({});
      setTokenAccounts([]);
      setRecentTransactions([]);
    }
  }, [connected, publicKey, refreshWalletData]);

  return {
    loading,
    error,
    solBalance,
    tokenBalances,
    tokenAccounts,
    recentTransactions,
    indexerStatus,
    refreshWalletData,
    fetchCompressedBalance,
    fetchCompressedTokenAccounts,
    fetchCompressedTokenBalances,
    fetchRecentTransactions,
    checkIndexer
  };
}
