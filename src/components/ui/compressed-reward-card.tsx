import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";
import { Skeleton } from "./skeleton";
import { useZkCompression } from "../../lib/zk-compression/ZkCompressionContext";
import { UserReward } from "../../lib/zk-compression/types";
import { formatDistanceToNow } from 'date-fns';

interface CompressedRewardCardProps {
  reward: UserReward;
  leafHash: string;
  proof: Uint8Array;
  onVerify?: (isValid: boolean) => void;
}

export function CompressedRewardCard({ reward, leafHash, proof, onVerify }: CompressedRewardCardProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const { verifyUserReward, userRewardsService } = useZkCompression();

  // Function to verify the user reward
  const handleVerify = async () => {
    if (!userRewardsService) return;
    
    setIsVerifying(true);
    try {
      // Get the reward from the service using the leaf hash
      const storedReward = userRewardsService.getRewardByLeafHash(leafHash);
      
      if (!storedReward) {
        throw new Error("User reward not found in storage");
      }
      
      // Convert the reward to a leaf for verification
      const leaf = userRewardsService.prepareForTransaction(reward, proof).leaf;
      const leafArray = new Uint8Array(leaf);
      
      // Verify the user reward
      const isValid = await verifyUserReward(proof, leafArray);
      setIsVerified(isValid);
      
      if (onVerify) {
        onVerify(isValid);
      }
    } catch (error) {
      console.error("Error verifying user reward:", error);
      setIsVerified(false);
      if (onVerify) {
        onVerify(false);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // Format the timestamp to a human-readable format
  const formattedTime = formatDistanceToNow(new Date(reward.timestamp), { addSuffix: true });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Reward</CardTitle>
          <Badge variant={isVerified === null ? "outline" : isVerified ? "success" : "destructive"}>
            {isVerified === null ? "Unverified" : isVerified ? "Verified" : "Invalid"}
          </Badge>
        </div>
        <CardDescription>Token: {reward.tokenId}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="text-sm font-medium">User ID</div>
          <div className="text-sm">{reward.userId.substring(0, 8)}...{reward.userId.substring(reward.userId.length - 8)}</div>
          
          <div className="text-sm font-medium">Amount</div>
          <div className="text-sm">{reward.amount}</div>
          
          <div className="text-sm font-medium">Timestamp</div>
          <div className="text-sm">{formattedTime}</div>
          
          {reward.additionalData && Object.keys(reward.additionalData).length > 0 && (
            <>
              <div className="text-sm font-medium">Additional Data</div>
              <div className="text-sm">
                {Object.entries(reward.additionalData).map(([key, value]) => (
                  <div key={key}>
                    <span className="font-medium">{key}:</span> {value.toString()}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        
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
