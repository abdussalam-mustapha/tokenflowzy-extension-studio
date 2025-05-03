import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";
import { Skeleton } from "./skeleton";
import { useZkCompression } from "../../lib/zk-compression/ZkCompressionContext";
import { TokenMetadata } from "../../lib/zk-compression/types";

interface CompressedTokenCardProps {
  metadata: TokenMetadata;
  leafHash: string;
  proof: Uint8Array;
  onVerify?: (isValid: boolean) => void;
}

export function CompressedTokenCard({ metadata, leafHash, proof, onVerify }: CompressedTokenCardProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const { verifyTokenMetadata, tokenMetadataService } = useZkCompression();

  // Function to verify the token metadata
  const handleVerify = async () => {
    if (!tokenMetadataService) return;
    
    setIsVerifying(true);
    try {
      // Get the metadata from the service using the leaf hash
      const storedMetadata = tokenMetadataService.getMetadataByLeafHash(leafHash);
      
      if (!storedMetadata) {
        throw new Error("Token metadata not found in storage");
      }
      
      // Convert the metadata to a leaf for verification
      const leaf = tokenMetadataService.prepareForTransaction(metadata, proof).leaf;
      const leafArray = new Uint8Array(leaf);
      
      // Verify the token metadata
      const isValid = await verifyTokenMetadata(proof, leafArray);
      setIsVerified(isValid);
      
      if (onVerify) {
        onVerify(isValid);
      }
    } catch (error) {
      console.error("Error verifying token metadata:", error);
      setIsVerified(false);
      if (onVerify) {
        onVerify(false);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{metadata.name}</CardTitle>
          <Badge variant={isVerified === null ? "outline" : isVerified ? "success" : "destructive"}>
            {isVerified === null ? "Unverified" : isVerified ? "Verified" : "Invalid"}
          </Badge>
        </div>
        <CardDescription>{metadata.symbol}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="text-sm font-medium">Decimals</div>
          <div className="text-sm">{metadata.decimals}</div>
          
          <div className="text-sm font-medium">Total Supply</div>
          <div className="text-sm">{metadata.totalSupply}</div>
          
          {metadata.description && (
            <>
              <div className="text-sm font-medium">Description</div>
              <div className="text-sm">{metadata.description}</div>
            </>
          )}
        </div>
        
        {metadata.logo && (
          <div className="mt-4 flex justify-center">
            <img 
              src={metadata.logo} 
              alt={`${metadata.name} logo`} 
              className="h-16 w-16 rounded-full" 
            />
          </div>
        )}
        
        <div className="mt-4">
          <div className="text-xs text-muted-foreground">
            Compressed with ZK | Leaf Hash: {leafHash.substring(0, 8)}...{leafHash.substring(leafHash.length - 8)}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleVerify} 
          disabled={isVerifying}
          variant="outline"
        >
          {isVerifying ? (
            <>
              <Skeleton className="h-4 w-4 rounded-full mr-2" />
              Verifying...
            </>
          ) : "Verify On-chain"}
        </Button>
      </CardFooter>
    </Card>
  );
}
