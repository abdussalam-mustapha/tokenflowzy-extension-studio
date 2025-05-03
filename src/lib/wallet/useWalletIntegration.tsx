import { useState, useCallback, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { 
  Transaction, 
  PublicKey, 
  Keypair, 
  SystemProgram, 
  LAMPORTS_PER_SOL,
  TransactionInstruction
} from '@solana/web3.js';
import { toast } from 'sonner';

export const useWalletIntegration = () => {
  const { connection } = useConnection();
  const { 
    publicKey, 
    signTransaction, 
    sendTransaction, 
    connected,
    connecting,
    disconnect,
    wallet
  } = useWallet();

  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch wallet balance
  const fetchBalance = useCallback(async () => {
    if (!publicKey) {
      setBalance(null);
      return;
    }
    
    try {
      const walletBalance = await connection.getBalance(publicKey);
      setBalance(walletBalance / LAMPORTS_PER_SOL);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      toast.error('Failed to fetch wallet balance');
      setBalance(null);
    }
  }, [connection, publicKey]);

  // Request airdrop (for devnet/testnet only)
  const requestAirdrop = useCallback(async (amount = 1) => {
    if (!publicKey) {
      toast.error('Wallet not connected');
      return;
    }
    
    setIsLoading(true);
    try {
      const signature = await connection.requestAirdrop(
        publicKey,
        amount * LAMPORTS_PER_SOL
      );
      
      await connection.confirmTransaction(signature);
      toast.success(`Airdropped ${amount} SOL to your wallet`);
      await fetchBalance();
    } catch (error) {
      console.error('Airdrop failed:', error);
      toast.error('Failed to airdrop SOL');
    } finally {
      setIsLoading(false);
    }
  }, [connection, publicKey, fetchBalance]);

  // Send SOL to another wallet
  const sendSol = useCallback(async (
    recipientAddress: string, 
    amount: number
  ) => {
    if (!publicKey || !signTransaction) {
      toast.error('Wallet not connected properly');
      return;
    }
    
    setIsLoading(true);
    try {
      const recipient = new PublicKey(recipientAddress);
      
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipient,
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );
      
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;
      
      const signed = await signTransaction(transaction);
      const txid = await connection.sendRawTransaction(signed.serialize());
      await connection.confirmTransaction(txid);
      
      toast.success(`Sent ${amount} SOL to ${recipientAddress.slice(0, 4)}...${recipientAddress.slice(-4)}`);
      await fetchBalance();
      return txid;
    } catch (error) {
      console.error('Transaction failed:', error);
      toast.error('Failed to send SOL');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [connection, publicKey, signTransaction, fetchBalance]);

  // Send custom transaction
  const sendCustomTransaction = useCallback(async (
    instructions: TransactionInstruction[],
    signers: Keypair[] = []
  ) => {
    if (!publicKey || !signTransaction) {
      toast.error('Wallet not connected properly');
      return null;
    }
    
    setIsLoading(true);
    try {
      const transaction = new Transaction();
      
      // Add all instructions to the transaction
      instructions.forEach(instruction => {
        transaction.add(instruction);
      });
      
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;
      
      // Sign with additional signers if provided
      if (signers.length > 0) {
        transaction.sign(...signers);
      }
      
      // Sign with connected wallet
      const signed = await signTransaction(transaction);
      
      // Send the transaction
      const txid = await connection.sendRawTransaction(signed.serialize());
      await connection.confirmTransaction(txid);
      
      toast.success('Transaction confirmed');
      return txid;
    } catch (error) {
      console.error('Transaction failed:', error);
      toast.error('Transaction failed');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [connection, publicKey, signTransaction]);

  // Fetch the wallet balance when connected
  useEffect(() => {
    if (connected) {
      fetchBalance();
    } else {
      setBalance(null);
    }
  }, [connected, fetchBalance]);

  // Get shortened wallet address for display
  const shortenedAddress = publicKey ? 
    `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}` : 
    null;

  return {
    publicKey,
    connected,
    connecting,
    disconnect,
    balance,
    isLoading,
    walletName: wallet?.adapter.name,
    shortenedAddress,
    fetchBalance,
    requestAirdrop,
    sendSol,
    sendCustomTransaction
  };
};
