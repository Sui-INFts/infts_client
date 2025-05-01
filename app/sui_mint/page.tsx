"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { HeroHeader } from "@/components/header";
import { Button } from "@/components/ui/button";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useNetworkVariables } from "@/contract";
import { toast } from "sonner";
import { sui } from "../utils/sui";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { SuiTransactionBlockResponse } from "@mysten/sui.js/client";

// Define the NFT form data structure
interface NFTFormData {
  name: string;
  description: string;
  file: File | null;
}

// Stored metadata inputs (not rendered)
// const metadataInputs = (
//   <div>
//     <div>
//       <label htmlFor="atomaModelId" className="block text-white text-sm font-medium mb-2">
//         Atoma AI Model ID *
//       </label>
//       <input
//         type="text"
//         id="atomaModelId"
//         name="atomaModelId"
//         placeholder="Enter Atoma AI model ID"
//         className="w-full px-4 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//         required
//       />
//     </div>

//     <div>
//       <label htmlFor="publicMetadata" className="block text-white text-sm font-medium mb-2">
//         Public Metadata (JSON) *
//       </label>
//       <textarea
//         id="publicMetadata"
//         name="publicMetadata"
//         placeholder='e.g., {"trait_type": "Background", "value": "Blue"}'
//         className="w-full px-4 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary h-24 resize-none"
//         required
//       />
//     </div>

//     <div>
//       <label htmlFor="privateMetadata" className="block text-white text-sm font-medium mb-2">
//         Private Metadata (JSON)
//       </label>
//       <textarea
//         id="privateMetadata"
//         name="privateMetadata"
//         placeholder='e.g., {"secret_key": "xyz"}'
//         className="w-full px-4 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary h-24 resize-none"
//       />
//     </div>
//   </div>
// );

export default function MintNFT() {
  const router = useRouter();
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const networkVariables = useNetworkVariables();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<NFTFormData>({
    name: "",
    description: "",
    file: null,
  });
  const supply = 1;
  const [nftDetails, setNftDetails] = useState<{
    objectId: string;
    name: string;
    description: string;
    imageUrl: string;
    publicMetadataUri: string;
    privateMetadataUri: string;
    atomaModelId: string;
  } | null>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file type and size
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file (JPEG, PNG, etc.)");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image file is too large. Please upload an image smaller than 10MB.");
        return;
      }

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

  // Mint NFT on the SUI blockchain
  const mintNFT = async () => {
    if (!account || !formData.file) {
      toast.error("Please connect your wallet and select an image file");
      return;
    }
    if (!formData.name.trim()) {
      toast.error("Name is required and cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      const result = await sui.mintNFT(
        {
          signAndExecuteTransactionBlock: (input: { transactionBlock: TransactionBlock }) =>
            new Promise((resolve, reject) => {
              signAndExecute(
                {
                  transaction: input.transactionBlock.serialize(),
                  chain: networkVariables.CHAIN_ID as `${string}:${string}`,
                },
                {
                  onSuccess: (data) => resolve(data as unknown as SuiTransactionBlockResponse),
                  onError: (error) => reject(error),
                }
              );
            }),
        },
        {
          name: formData.name.trim(),
          description: formData.description.trim(),
          image: formData.file,
          publicMetadata: "{}",
          privateMetadata: "{}",
          atomaModelId: "default-model-id"
        }
      );

      setNftDetails({
        objectId: result.objectId,
        name: formData.name,
        description: formData.description,
        imageUrl: result.imageUrl,
        publicMetadataUri: result.publicMetadataUri,
        privateMetadataUri: result.privateMetadataUri,
        atomaModelId: "default-model-id",
      });

      toast.success(`INFT minted successfully! View at: https://suiexplorer.com/object/${result.objectId}?network=testnet`);
      router.push("/profile");
    } catch (error) {
      console.error("Error minting INFT:", error);
      toast.error(`Failed to mint INFT: ${error instanceof Error ? error.message : "Unknown error occurred"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black">
      <HeroHeader />
      <div className="max-w-5xl mx-auto px-4 pt-23 pb-24">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-white">Mint INFT</h1>
        <p className="text-muted-foreground mb-8">
          Once your NFT is minted you will not be able to change any of its information.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Side - Upload Area */}
          <div className="flex flex-col">
            <div
              className="border-2 border-dashed border-white/20 rounded-lg h-96 flex items-center justify-center cursor-pointer overflow-hidden"
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl ? (
                <div className="w-full h-full relative">
                  <Image src={previewUrl} alt="INFT Preview" fill className="object-contain" />
                </div>
              ) : (
                <div className="text-center p-6">
                  <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-400">Drag and drop media</p>
                  <p className="text-xs text-gray-500 mt-1">or click to browse files</p>
                  <p className="text-xs text-gray-600 mt-4">Max size: 10MB</p>
                  <p className="text-xs text-gray-600">Supported: JPG, PNG</p>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png"
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
              <p className="text-xs text-muted-foreground mt-1">Coming soon</p>
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
                placeholder="Name your INFT"
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
                disabled
                className="w-full px-4 py-2 bg-background border rounded-md opacity-50 cursor-not-allowed"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">Coming soon</p>
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
                placeholder="Enter a description for your INFT"
                className="w-full px-4 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary h-24 resize-none"
              />
            </div>

            <div className="pt-4">
              <Button
                onClick={mintNFT}
                disabled={!formData.file || !formData.name || isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? "Minting..." : "Mint INFT"}
              </Button>
            </div>
          </div>
        </div>

        {nftDetails && (
          <div className="mt-8 p-6 bg-gray-800 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-white">Minted INFT Details</h2>
            <div className="space-y-4">
              <p className="text-white">
                <strong>Name:</strong> {nftDetails.name}
              </p>
              <p className="text-white">
                <strong>Description:</strong> {nftDetails.description}
              </p>
              <p className="text-white">
                <strong>Atoma Model ID:</strong> {nftDetails.atomaModelId}
              </p>
              <p className="text-white">
                <strong>Image URL:</strong>{" "}
                <a href={nftDetails.imageUrl} target="_blank" className="text-primary hover:underline">
                  {nftDetails.imageUrl}
                </a>
              </p>
              <p className="text-white">
                <strong>Public Metadata URI:</strong>{" "}
                <a href={nftDetails.publicMetadataUri} target="_blank" className="text-primary hover:underline">
                  {nftDetails.publicMetadataUri}
                </a>
              </p>
              <p className="text-white">
                <strong>Private Metadata URI:</strong>{" "}
                <a href={nftDetails.privateMetadataUri} target="_blank" className="text-primary hover:underline">
                  {nftDetails.privateMetadataUri || "None"}
                </a>
              </p>
              <p className="text-white">
                <strong>Object ID:</strong>{" "}
                <a
                  href={`https://suiexplorer.com/object/${nftDetails.objectId}?network=testnet`}
                  target="_blank"
                  className="text-primary hover:underline"
                >
                  {nftDetails.objectId}
                </a>
              </p>
              <div>
                <strong className="text-white">Image:</strong>
                <div className="mt-2">
                  <Image
                    src={nftDetails.imageUrl}
                    alt={nftDetails.name}
                    width={200}
                    height={200}
                    className="rounded-md"
                    onError={() => toast.error("Failed to load INFT image")}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}