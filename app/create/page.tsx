
"use client";

import React, { useState, useRef } from "react";
// import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCurrentAccount, useWallets, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariables } from "@/contract";
import { toast } from "sonner";
import { HeroHeader } from "@/components/header";
// import FooterSection from "@/components/footer";

// Define the NFT form data structure
interface NFTFormData {
  name: string;
  description: string;
  file: File | null;
  externalLink: string;
}

// Walrus storage connection details
const WALRUS_PUBLISHER_URL = "https://publisher.walrus-testnet.walrus.space";
const WALRUS_AGGREGATOR_URL = "https://aggregator.walrus-testnet.walrus.space";
const SUI_NETWORK = "testnet";

export default function CreateNFT() {
  const account = useCurrentAccount();
  const wallets = useWallets();
  const networkVariables = useNetworkVariables();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<NFTFormData>({
    name: "",
    description: "",
    file: null,
    externalLink: "",
  });
  const [atomaModelId, setAtomaModelId] = useState<string>("default-model");

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
  const uploadToWalrus = async (file: File): Promise<string> => {
    try {
      console.log("Starting upload to Walrus...");
      console.log("File details:", {
        name: file.name,
        type: file.type,
        size: file.size
      });

      if (!account?.address) {
        throw new Error("Wallet address is required for upload");
      }

      const uploadUrl = `${WALRUS_PUBLISHER_URL}/v1/blobs?epochs=5`;
      console.log("Upload URL:", uploadUrl);

      // Upload the file to Walrus storage
      const response = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
          'X-Sui-Address': account.address,
          'X-Sui-Network': SUI_NETWORK
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Upload failed:", {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Failed to upload file: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log("Upload response:", data);

      // Extract the blob ID from the response
      let blobId: string;
      if (data.newlyCreated) {
        blobId = data.newlyCreated.blobObject.blobId;
      } else if (data.alreadyCertified) {
        blobId = data.alreadyCertified.blobId;
      } else {
        throw new Error("Invalid response format from Walrus");
      }

      const blobUrl = `${WALRUS_AGGREGATOR_URL}/v1/blobs/${blobId}`;
      console.log("Successfully uploaded. Blob URL:", blobUrl);
      return blobUrl;
    } catch (error) {
      console.error("Error in uploadToWalrus:", error);
      throw error;
    }
  };

  // Create public metadata for the NFT
  const createPublicMetadata = () => {
    const metadata = {
      name: formData.name,
      description: formData.description,
      externalLink: formData.externalLink,
      creationDate: new Date().toISOString(),
      creator: account?.address,
    };
    return metadata;
  };

  // Create private metadata for the NFT
  const createPrivateMetadata = () => {
    // This could contain additional private information
    const metadata = {
      creatorNotes: "Private notes for this NFT",
      creationDetails: {
        application: "INFT Protocol",
        version: "1.0.0",
        timestamp: new Date().toISOString()
      }
    };
    return metadata;
  };

// Mint NFT on the SUI blockchain
const mintNFT = async () => {
  if (!account || !formData.file || wallets.length === 0) {
    toast.error("Please connect your wallet and select a file");
    return;
  }

  console.log("Connected account address:", account?.address);
  if (!account?.address) {
    toast.error("Wallet is not connected properly.");
    return;
  }

  setIsLoading(true);
  const toastId = toast.loading("Preparing your NFT...");
  
  try {
    // 1. Upload media to Walrus
    toast.loading("Uploading media...", { id: toastId });
    console.log("Starting media upload...");
    const imageUrl = await uploadToWalrus(formData.file);
    console.log("Media uploaded successfully:", imageUrl);

    // 2. Create and upload public metadata
    toast.loading("Creating public metadata...", { id: toastId });
    const publicMetadata = createPublicMetadata();
    console.log("Public metadata:", publicMetadata);
    const publicMetadataBlob = new Blob([JSON.stringify(publicMetadata)], { type: "application/json" });
    const publicMetadataFile = new File([publicMetadataBlob], "public_metadata.json");
    const publicMetadataUri = await uploadToWalrus(publicMetadataFile);
    console.log("Public metadata uploaded:", publicMetadataUri);

    // 3. Create and upload private metadata
    toast.loading("Creating private metadata...", { id: toastId });
    const privateMetadata = createPrivateMetadata();
    console.log("Private metadata:", privateMetadata);
    const privateMetadataBlob = new Blob([JSON.stringify(privateMetadata)], { type: "application/json" });
    const privateMetadataFile = new File([privateMetadataBlob], "private_metadata.json");
    const privateMetadataUri = await uploadToWalrus(privateMetadataFile);
    console.log("Private metadata uploaded:", privateMetadataUri);

    // 4. Create and execute the transaction
    console.log("Creating transaction with package ID:", networkVariables.PACKAGE_ID);
    const tx = new Transaction();
    tx.setGasBudget(200000000); // Increased to 0.2 SUI for better reliability

    tx.moveCall({
      target: `${networkVariables.PACKAGE_ID}::inft_core::mint_nft`,
      arguments: [
        tx.pure.string(formData.name),
        tx.pure.string(formData.description),
        tx.pure.string(imageUrl),
        tx.pure.string(publicMetadataUri),
        tx.pure.string(privateMetadataUri),
        tx.pure.string(atomaModelId),
      ],
    });

    console.log("Transaction created, waiting for wallet approval...");
    toast.loading("Waiting for wallet approval...", { id: toastId });

    const result = await signAndExecute({
      // @ts-expect-error - Version mismatch between @mysten packages
      transaction: tx,
      chain: networkVariables.CHAIN_ID as `${string}:${string}`
    });

    console.log("Transaction result:", result);
    toast.success("Intelligent NFT minted successfully!", { id: toastId });
    
  } catch (error) {
    console.error("Error minting NFT:", error);
    toast.error(`Error minting NFT: ${error instanceof Error ? error.message : 'Unknown error'}`, { id: toastId });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen w-full flex flex-col">
      <HeroHeader />
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 pt-27 pb-24">
          <h1 className="text-3xl font-bold mb-2 text-white">Create an Intelligent NFT</h1>
          <p className="text-gray-400 mb-8">Your INFT will evolve as users interact with it. Gas fees on Sui testnet apply for minting.</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left Side - Upload Area */}
            <div className="flex flex-col">
              <div
                className="border-2 border-dashed border-gray-700 rounded-lg h-96 flex items-center justify-center cursor-pointer overflow-hidden"
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
                    <p className="text-gray-400">Drag and drop media</p>
                    <p className="text-gray-600 mt-1">or browse files</p>
                    <p className="text-xs text-gray-600 mt-4">Max size: 50MB</p>
                    <p className="text-xs text-gray-600">JPG, PNG, GIF, SVG, MP4</p>
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
                <label htmlFor="name" className="block text-white text-sm font-medium mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Name your Intelligent NFT"
                  className="w-full px-4 py-2 bg-black border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="atomaModelId" className="block text-white text-sm font-medium mb-2">
                  Atoma AI Model *
                </label>
                <select
                  id="atomaModelId"
                  value={atomaModelId}
                  onChange={(e) => setAtomaModelId(e.target.value)}
                  className="w-full px-4 py-2 bg-black border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  required
                >
                  <option value="default-model">Default Model</option>
                  <option value="creative-model">Creative Model</option>
                  <option value="analytical-model">Analytical Model</option>
                  <option value="companion-model">Companion Model</option>
                </select>
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
                  placeholder="Enter a description for your Intelligent NFT"
                  className="w-full px-4 py-2 bg-black border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none text-white"
                />
              </div>

              {/* <div>
                <label htmlFor="externalLink" className="block text-white text-sm font-medium mb-2">
                  External link
                </label>
                <input
                  type="text"
                  id="externalLink"
                  name="externalLink"
                  value={formData.externalLink}
                  onChange={handleInputChange}
                  placeholder="https://yoursite.io/item/123"
                  className="w-full px-4 py-2 bg-black border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                />
              </div> */}

              <div className="pt-4">
                <Button
                  onClick={mintNFT}
                  disabled={!formData.file || !formData.name || isLoading}
                  className="w-auto px-51 py-2 bg-white hover:bg-gray-100 text-black rounded-md float-right"
                >
                  {isLoading ? "Minting..." : "Mint INFT"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* <FooterSection /> */}
    </div>
  );
}