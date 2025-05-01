import { Transaction as TransactionBlock } from "@mysten/sui/transactions";

// Walrus storage connection details
const AGGREGATOR = process.env.NEXT_PUBLIC_WALRUS_AGGREGATOR_URL || "https://aggregator.walrus-testnet.walrus.space";
const PUBLISHER = process.env.NEXT_PUBLIC_WALRUS_PUBLISHER_URL || "https://publisher.walrus-testnet.walrus.space";
const PACKAGE_ID = process.env.NEXT_PUBLIC_PACKAGE_ID || "0x7111b909689ec53115a2360c3fe9106c2c6f8e152dbc37d4a98bae51a37f8f62";

// Atoma Model ID
const ATOMA_MODEL_ID = process.env.NEXT_PUBLIC_ATOMA_MODEL_ID || "atoma-123";

// Clean blobId from potential malformed URLs
function cleanBlobId(blobId: string): string {
  const prefixes = [
    `${AGGREGATOR}/v1/`,
    `${AGGREGATOR}/v1/blobs/`,
    `${PUBLISHER}/v1/blobs/`,
    `${AGGREGATOR}/v1/https://aggregator.walrus-testnet.walrus.space/v1/`,
    `${AGGREGATOR}/v1/blobs/https://aggregator.walrus-testnet.walrus.space/v1/blobs/`,
  ];
  for (const prefix of prefixes) {
    if (blobId.startsWith(prefix)) {
      return blobId.slice(prefix.length);
    }
  }
  if (blobId.includes("/")) {
    const segments = blobId.split("/");
    return segments[segments.length - 1];
  }
  return blobId;
}

// Upload a blob to Walrus
async function uploadBlob(file: File, contentType: string = "application/octet-stream", retries = 3): Promise<string> {
  const epochs = process.env.NEXT_PUBLIC_WALRUS_EPOCHS || "3";
  const endpoint = `${PUBLISHER}/v1/blobs?epochs=${epochs}`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Uploading blob to ${endpoint}, attempt ${attempt}`);
      const response = await fetch(endpoint, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": contentType,
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log(`Response from ${endpoint}:`, JSON.stringify(data, null, 2));

      const blobId = data.newlyCreated?.blobObject?.blobId || data.alreadyCertified?.blobId;
      if (!blobId) {
        throw new Error("Invalid response: No blobId found in newlyCreated or alreadyCertified");
      }

      const cleanedBlobId = cleanBlobId(blobId);
      console.log(`Uploaded blob to ${endpoint}: ${cleanedBlobId}`);
      return cleanedBlobId;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      if (errorMessage.includes("could not find SUI coins with sufficient balance")) {
        throw new Error("Publisher wallet has insufficient SUI balance. Please try again later or contact support.");
      }
      console.error(`Upload blob attempt ${attempt} failed: ${errorMessage}`);
      if (attempt === retries) {
        throw new Error(`Failed to upload blob after ${retries} attempts: ${errorMessage}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
    }
  }
  throw new Error("Unexpected error in uploadBlob");
}

// Upload JSON data as a blob
async function uploadJson(jsonData: object, retries = 3): Promise<string> {
  const epochs = process.env.NEXT_PUBLIC_WALRUS_EPOCHS || "3";
  const endpoint = `${PUBLISHER}/v1/blobs?epochs=${epochs}`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Uploading JSON to ${endpoint}, attempt ${attempt}`);
      const response = await fetch(endpoint, {
        method: "PUT",
        body: JSON.stringify(jsonData),
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log(`Response from ${endpoint}:`, JSON.stringify(data, null, 2));

      const blobId = data.newlyCreated?.blobObject?.blobId || data.alreadyCertified?.blobId;
      if (!blobId) {
        throw new Error("Invalid response: No blobId found in newlyCreated or alreadyCertified");
      }

      const cleanedBlobId = cleanBlobId(blobId);
      console.log(`Uploaded JSON to ${endpoint}: ${cleanedBlobId}`);
      return cleanedBlobId;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      if (errorMessage.includes("could not find SUI coins with sufficient balance")) {
        throw new Error("Publisher wallet has insufficient SUI balance. Please try again later or contact support.");
      }
      console.error(`Upload JSON attempt ${attempt} failed: ${errorMessage}`);
      if (attempt === retries) {
        throw new Error(`Failed to upload JSON after ${retries} attempts: ${errorMessage}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
    }
  }
  throw new Error("Unexpected error in uploadJson");
}

export const walrus = {
  // Mint a new INFT
  async mintNFT(
    signer: {
      signAndExecuteTransaction: (input: { transaction: string }) => Promise<{
        digest: string;
        effects: { status: { status: string }; transactionDigest: string };
      }>;
    },
    {
      name,
      description,
      image,
      accountAddress,
    }: {
      name: string;
      description: string;
      image: File;
      accountAddress: string;
    }
  ) {
    try {
      // Validate inputs
      if (!name.trim()) {
        throw new Error("Name cannot be empty");
      }
      if (!ATOMA_MODEL_ID.trim()) {
        throw new Error("Atoma Model ID is not configured");
      }

      console.log("Minting INFT with arguments:", {
        name,
        description,
        atomaModelId: ATOMA_MODEL_ID,
        accountAddress,
        imageName: image.name,
      });

      // Upload image to Walrus
      const imageBlobId = await uploadBlob(image, image.type || "application/octet-stream");
      const imageUrl = `${AGGREGATOR}/v1/blobs/${imageBlobId}`;

      // Create and upload public metadata
      const publicMetadata = {
        name,
        description,
        image: imageUrl,
      };
      const publicBlobId = await uploadJson(publicMetadata);
      const publicMetadataUri = `${AGGREGATOR}/v1/blobs/${publicBlobId}`;

      // Create and upload private metadata
      const privateMetadata = {
        private_data: "Encrypted data",
        atoma_model_output: ATOMA_MODEL_ID,
      };
      const privateBlobId = await uploadJson(privateMetadata);
      const privateMetadataUri = `${AGGREGATOR}/v1/blobs/${privateBlobId}`;

      // Create a new transaction block
      const tx = new TransactionBlock();
      tx.setGasBudget(10000000);

      // Call the mint_nft function from the smart contract
      tx.moveCall({
        target: `${PACKAGE_ID}::inft_core::mint_nft`,
        arguments: [
          tx.pure.string(name),
          tx.pure.string(description),
          tx.pure.string(imageUrl),
          tx.pure.string(publicMetadataUri),
          tx.pure.string(privateMetadataUri),
          tx.pure.string(ATOMA_MODEL_ID),
        ],
      });

      // Execute the transaction
      const result = await signer.signAndExecuteTransaction({
        transaction: tx.serialize(),
      });

      console.log("Mint transaction result:", JSON.stringify(result, null, 2));

      // Extract INFT object ID
      const objectId = result.effects?.transactionDigest;
      if (!objectId) {
        throw new Error("No INFT object ID found in transaction result");
      }

      return {
        objectId,
        digest: result.digest,
        imageUrl,
        publicMetadataUri,
        privateMetadataUri,
        atomaModelId: ATOMA_MODEL_ID,
      };
    } catch (error) {
      console.error("Error minting INFT:", error);
      throw error;
    }
  },
};