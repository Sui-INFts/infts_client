"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { HeroHeader } from "@/components/header";
import { Button } from "@/components/ui/button";
import { useCurrentAccount, useWallets, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction as TransactionBlock } from "@mysten/sui/transactions";
import { useNetworkVariables } from "@/contract";
import { toast } from "sonner";

// Define the NFT form data structure
interface NFTFormData {
  name: string;
  description: string;
  file: File | null;
  atomaModelId: string; // Reference to Atoma AI model
}

// Walrus storage connection details
const WALRUS_ENDPOINT = "https://api.walrus-testnet.walrus.space/v1/upload";
const WALRUS_API_KEY = process.env.NEXT_PUBLIC_WALRUS_API_KEY || "";

export default function CreateNFT() {
  const router = useRouter();
  const account = useCurrentAccount();
  const wallets = useWallets();
  const networkVariables = useNetworkVariables();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<NFTFormData>({
    name: "",
    description: "",
    file: null,
    atomaModelId: "default-model-id", // Default value, can be changed
  });
  const [supply, setSupply] = useState<number>(1);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, file });
      
      // Create a preview URL for the selected file
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Upload file to Walrus decentralized storage
  const uploadToWalrus = async (file: File): Promise<{ public_uri: string, private_uri: string }> => {
    // Create form data for upload
    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      // Upload public metadata (the file itself)
      const publicUploadResponse = await fetch(WALRUS_ENDPOINT, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${WALRUS_API_KEY}`,
        },
        body: uploadData,
      });

      if (!publicUploadResponse.ok) {
        throw new Error("Failed to upload file to Walrus storage");
      }

      const publicData = await publicUploadResponse.json();
      const publicUri = publicData.cid;

      // Create and upload private metadata (can contain additional info)
      const privateMetadata = {
        name: formData.name,
        description: formData.description,
        atomaModelId: formData.atomaModelId,
        creationDate: new Date().toISOString(),
        creator: account?.address,
      };

      const privateBlob = new Blob([JSON.stringify(privateMetadata)], { type: "application/json" });
      const privateFile = new File([privateBlob], "private-metadata.json");
      
      const privateUploadData = new FormData();
      privateUploadData.append("file", privateFile);
      
      const privateUploadResponse = await fetch(WALRUS_ENDPOINT, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${WALRUS_API_KEY}`,
        },
        body: privateUploadData,
      });

      if (!privateUploadResponse.ok) {
        throw new Error("Failed to upload private metadata to Walrus storage");
      }

      const privateData = await privateUploadResponse.json();
      const privateUri = privateData.cid;

      return { public_uri: publicUri, private_uri: privateUri };
    } catch (error) {
      console.error("Error uploading to Walrus:", error);
      throw error;
    }
  };

  // Mint NFT on the SUI blockchain
  const mintNFT = async () => {
    if (!account || !formData.file || wallets.length === 0) {
      toast.error("Please connect your wallet and select a file");
      return;
    }

    setIsLoading(true);
    try {
      // 1. Upload media to Walrus
      const { public_uri, private_uri } = await uploadToWalrus(formData.file);
      
      // 2. Create and execute the transaction
      const tx = new TransactionBlock();
      tx.moveCall({
        target: `${networkVariables.PACKAGE_ID}::inft_core::mint_nft`,
        arguments: [
          tx.pure.string(formData.name),
          tx.pure.string(formData.description),
          tx.pure.string(public_uri),
          tx.pure.string(private_uri),
          tx.pure.string(formData.atomaModelId),
        ],
      });

      // Use the useSignAndExecuteTransaction hook instead of calling the method directly on wallet
      const { mutate: signAndExecute } = useSignAndExecuteTransaction();
      
      // Execute the transaction - corrected structure for dapp-kit v0.16.0
      const result = await new Promise<{
        digest: string;
        transaction: {
          data: {
            gasData: object;
            messageVersion: string;
            transaction: object;
          };
        };
        effects: {
          status: {
            status: string;
          };
          transactionDigest: string;
        };
      }>((resolve, reject) => {
        signAndExecute({
          transaction: tx,
          requestType: 'WaitForEffectsCert',
          chain: networkVariables.CHAIN_ID as `${string}:${string}`,
        }, {
          onSuccess: (data) => resolve(data),
          onError: (error) => reject(error),
        });
      });

      if (result.effects?.status.status === "success") {
        toast.success("NFT minted successfully!");
        router.push("/profile"); // Redirect to profile page
      } else {
        toast.error("Failed to mint NFT");
      }
    } catch (error) {
      console.error("Error minting NFT:", error);
      toast.error("Error minting NFT");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black">
      <HeroHeader />
      <div className="max-w-5xl mx-auto px-4 pt-23 pb-24">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-white">Create an NFT</h1>
        <p className="text-muted-foreground mb-8">Once your item is minted you will not be able to change any of its information.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Side - Upload Area */}
          <div className="flex flex-col">
            <div 
              className="border-2 border-dashed border-white/20 rounded-lg h-96 flex items-center justify-center cursor-pointer overflow-hidden"
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl ? (
                <div className="w-full h-full relative">
                  <Image 
                    src={previewUrl} 
                    alt="NFT Preview" 
                    fill 
                    className="object-contain" 
                  />
                </div>
              ) : (
                <div className="text-center p-6">
                  <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-400">Drag and drop media</p>
                  <p className="text-xs text-gray-500 mt-1">or click to browse files</p>
                  <p className="text-xs text-gray-600 mt-4">Max size: 50MB</p>
                  <p className="text-xs text-gray-600">Supported: JPG, PNG, GIF, SVG, MP4</p>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/gif,image/svg+xml,video/mp4"
              className="hidden"
            />
          </div>
          
          {/* Right Side - Form Fields */}
          <div className="space-y-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Collection *</label>
              <Button variant="outline" className="w-full justify-start">
                <span className="mr-2">+</span>
                Create a new collection
              </Button>
              <p className="text-xs text-muted-foreground mt-1">Not all collections are eligible</p>
            </div>
            
            <div>
              <label htmlFor="name" className="block text-white text-sm font-medium mb-2">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Name your NFT"
                className="w-full px-4 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            <div>
              <label htmlFor="supply" className="block text-white text-sm font-medium mb-2">
                Supply *
              </label>
              <input
                type="number"
                id="supply"
                value={supply}
                onChange={(e) => setSupply(Number(e.target.value))}
                min="1"
                className="w-full px-4 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-white text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter a description for your NFT"
                className="w-full px-4 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary h-24 resize-none"
              />
            </div>
            
            <div>
              <label htmlFor="atomaModelId" className="block text-white text-sm font-medium mb-2">
                Atoma AI Model ID *
              </label>
              <input
                type="text"
                id="atomaModelId"
                name="atomaModelId"
                value={formData.atomaModelId}
                onChange={handleInputChange}
                placeholder="Enter Atoma AI model ID"
                className="w-full px-4 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            <div className="pt-4">
              <Button 
                onClick={mintNFT} 
                disabled={!formData.file || !formData.name || isLoading} 
                className="w-full" 
                size="lg"
              >
                {isLoading ? "Creating..." : "Create NFT"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}