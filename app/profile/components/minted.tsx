"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { toast } from "sonner";
// import { getObjectType } from "@mysten/sui.js/utils";

// Types for our NFT and its data structure
interface NFT {
  id: string;
  name: string;
  description: string;
  image_url: string;
  evolution_stage: number;
  interaction_count: number;
  atoma_model_id: string;
}

interface SuiObjectContent {
  fields: {
    id: { id: string };
    name: string;
    description: string;
    image_url: string;
    public_metadata_uri: string;
    private_metadata_uri: string;
    atoma_model_id: string;
    interaction_count: string; // Will come as string but we convert to number
    evolution_stage: string;   // Will come as string but we convert to number
    owner: string;
    balance: { value: string };
  };
}

export default function MintedNFTs() {
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get the package ID from environment variables
  const packageId = process.env.NEXT_PUBLIC_PACKAGE_ID || 
    "0x7111b909689ec53115a2360c3fe9106c2c6f8e152dbc37d4a98bae51a37f8f62";

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!account?.address) {
        setNfts([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log("Fetching NFTs for wallet:", account.address);
        console.log("Using package ID:", packageId);
        
        // Using the module path from your contract
        const moduleType = "infts_protocol";
        const objectType = `${packageId}::${moduleType}::inft_core::INFT`;
        
        console.log("Looking for objects of type:", objectType);
        
        const infts: NFT[] = [];
        let cursor: string | null = null;

        do {
          // Query owned objects
          const response = await suiClient.getOwnedObjects({
            owner: account.address,
            options: { 
              showContent: true,
              showType: true,
              showOwner: true,
            },
            cursor,
          });

          console.log(`Fetched ${response.data.length} objects, page ${cursor ? 'with cursor' : 'first page'}`);
          
          // Debug: Log all object types to identify potential issues
          if (response.data.length > 0) {
            const types = response.data.map(obj => obj.data?.type || "unknown").join(", ");
            console.log("Object types found:", types);
          }

          // Filter for INFTs from our specific package
          const filteredNFTs = response.data
            .filter((obj) => {
              const type = obj.data?.type;
              // Use a more flexible approach to match your module
              return type && (
                type.includes(`${moduleType}::inft_core::INFT`) || 
                type.includes(`${packageId}::${moduleType}::inft_core::INFT`)
              );
            })
            .map((obj) => {
              if (!obj.data?.objectId || !obj.data?.content) {
                console.log("Skipping object without ID or content:", obj.data?.objectId);
                return null;
              }

              try {
                // Type assertion with safety check
                const content = obj.data.content as unknown as SuiObjectContent;
                const fields = content.fields;

                console.log("Processing NFT:", obj.data.objectId);
                
                return {
                  id: obj.data.objectId,
                  name: fields.name || "Unnamed NFT",
                  description: fields.description || "",
                  image_url: fields.image_url || "/placeholder-image.png",
                  evolution_stage: parseInt(fields.evolution_stage) || 0,
                  interaction_count: parseInt(fields.interaction_count) || 0,
                  atoma_model_id: fields.atoma_model_id || "",
                };
              } catch (err) {
                console.error("Error parsing NFT data:", err, obj);
                return null;
              }
            })
            .filter((nft): nft is NFT => nft !== null);

          console.log(`Filtered ${filteredNFTs.length} INFTs`);
          infts.push(...filteredNFTs);
          cursor = response.hasNextPage ? (response.nextCursor || null) : null;
        } while (cursor);

        console.log(`Found ${infts.length} INFTs owned by this wallet`);
        setNfts(infts);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
        setError("Failed to fetch your NFTs. Please try again later.");
        toast.error("Failed to fetch minted NFTs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNFTs();
  }, [account?.address, suiClient, packageId]);

  // Loading state
  if (isLoading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="mt-4 text-muted-foreground">Loading your NFTs...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center text-red-500 py-16">
        <p className="text-lg font-semibold mb-2">Error</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  // Wallet not connected state
  if (!account) {
    return (
      <div className="text-center text-muted-foreground py-16">
        <p className="text-lg font-semibold mb-2">Connect wallet to view minted NFTs</p>
        <p className="text-sm">Please connect your wallet to see your INFTs.</p>
      </div>
    );
  }

  // Empty state
  if (nfts.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-16">
        <p className="text-lg font-semibold mb-2">No INFTs found</p>
        <p className="text-sm">You don&apos;t have any INFTs from this collection yet.</p>
      </div>
    );
  }

  // Display grid of NFTs
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {nfts.map((nft) => (
        <div key={nft.id} className="bg-gray-800 rounded-lg p-4 flex flex-col">
          <div className="relative w-full h-48 mb-4">
            {nft.image_url ? (
              <Image
                src={nft.image_url}
                alt={nft.name}
                fill
                className="object-cover rounded-md"
                onError={(e) => {
                  console.warn(`Failed to load image for NFT: ${nft.id}`);
                  // Update src to fallback image when original fails
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder-image.png";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-700 rounded-md">
                <span className="text-gray-400">No image</span>
              </div>
            )}
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">{nft.name}</h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{nft.description}</p>
          <div className="flex justify-between text-xs text-gray-400 mt-auto">
            <span>Evolution: {nft.evolution_stage}</span>
            <span>Interactions: {nft.interaction_count}</span>
          </div>
          <div className="text-xs text-gray-400 mt-2 truncate">
            ID: {nft.id.slice(0, 8)}...{nft.id.slice(-6)}
          </div>
        </div>
      ))}
    </div>
  );
}