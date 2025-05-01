import { SuiClient, SuiTransactionBlockResponse, OwnedObjectRef } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
// import { SuiSignAndExecuteTransactionBlockInput, SuiSignAndExecuteTransactionBlockOutput } from '@mysten/sui.js/transactions';
import { uploadImageToImgBB, storeImageLocally, getStoredImage } from './upload';

// Initialize the SuiClient for Testnet
const client = new SuiClient({
  url: process.env.NEXT_PUBLIC_SUI_NETWORK_URL || 'https://fullnode.testnet.sui.io',
});

// Contract address
const CONTRACT_ADDRESS = '0x7111b909689ec53115a2360c3fe9106c2c6f8e152dbc37d4a98bae51a37f8f62'; // Package ID

export const sui = {
  // Get NFTs owned by the current wallet
  async getNFTsForWallet(walletAddress: string) {
    try {
      const objects = await client.getOwnedObjects({
        owner: walletAddress,
        options: {
          showContent: true,
          showDisplay: true,
        },
      });

      return objects.data
        .filter(obj => {
          const type = obj.data?.type;
          return type && type.includes(`${CONTRACT_ADDRESS}::inft_core::INFT`);
        })
        .map(obj => {
          const content = obj.data?.content as {
            fields?: {
              name?: string;
              description?: string;
              image_url?: string;
              public_metadata_uri?: string;
              private_metadata_uri?: string;
              atoma_model_id?: string;
              interaction_count?: number | string;
              evolution_stage?: number | string;
              owner?: string;
            };
          };
          const display = obj.data?.display as { name?: string; description?: string };

          let imageUrl = content?.fields?.image_url || '';
          imageUrl = getStoredImage(imageUrl);

          let publicMetadataUri = content?.fields?.public_metadata_uri || '';
          publicMetadataUri = getStoredImage(publicMetadataUri);

          let privateMetadataUri = content?.fields?.private_metadata_uri || '';
          privateMetadataUri = getStoredImage(privateMetadataUri);

          return {
            id: obj.data?.objectId,
            name: display?.name || content?.fields?.name || 'Unnamed INFT',
            description: display?.description || content?.fields?.description || '',
            imageUrl,
            publicMetadataUri,
            privateMetadataUri,
            atomaModelId: content?.fields?.atoma_model_id || '',
            interactionCount: parseInt(content?.fields?.interaction_count?.toString() || '0'),
            evolutionStage: parseInt(content?.fields?.evolution_stage?.toString() || '0'),
            owner: content?.fields?.owner || '',
          };
        });
    } catch (error) {
      console.error('Error fetching INFTs:', error);
      return [];
    }
  },

  // Mint a new INFT
  async mintNFT(
    signer: {
      signAndExecuteTransactionBlock: (input: { transactionBlock: TransactionBlock }) => Promise<SuiTransactionBlockResponse>;
    },
    {
      name,
      description,
      image,
      publicMetadata,
      privateMetadata,
      atomaModelId,
    }: {
      name: string;
      description: string;
      image: File;
      publicMetadata: string;
      privateMetadata: string;
      atomaModelId: string;
    }
  ) {
    try {
      // Validate required fields
      if (!name.trim()) {
        throw new Error('Name cannot be empty');
      }
      if (!atomaModelId.trim()) {
        throw new Error('Atoma Model ID cannot be empty');
      }
      if (!publicMetadata.trim()) {
        throw new Error('Public Metadata cannot be empty');
      }

      console.log('Minting INFT with arguments:', {
        name,
        description,
        atomaModelId,
        publicMetadata,
        privateMetadata,
        imageName: image.name,
      });

      // Upload image to ImgBB or fall back to local storage
      let imageUrl: string;
      try {
        imageUrl = await uploadImageToImgBB(image, `${name || 'inft'}_image`);
      } catch (error) {
        console.warn('ImgBB upload failed for image, storing locally:', error);
        imageUrl = storeImageLocally(
          await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error('Failed to read image file'));
            reader.readAsDataURL(image);
          })
        );
      }

      // Handle public metadata (store as JSON)
      let publicMetadataUri = '';
      if (publicMetadata) {
        try {
          // Validate JSON
          JSON.parse(publicMetadata);
          const publicBlob = new Blob([publicMetadata], { type: 'application/json' });
          publicMetadataUri = await uploadImageToImgBB(
            new File([publicBlob], `${name || 'inft'}_public.json`),
            `${name || 'inft'}_public`
          );
        } catch (error) {
          console.warn('ImgBB upload failed for public metadata, storing locally:', error);
          publicMetadataUri = storeImageLocally(publicMetadata);
        }
      }

      // Handle private metadata (store as JSON)
      let privateMetadataUri = '';
      if (privateMetadata) {
        try {
          // Validate JSON
          JSON.parse(privateMetadata);
          const privateBlob = new Blob([privateMetadata], { type: 'application/json' });
          privateMetadataUri = await uploadImageToImgBB(
            new File([privateBlob], `${name || 'inft'}_private.json`),
            `${name || 'inft'}_private`
          );
        } catch (error) {
          console.warn('ImgBB upload failed for private metadata, storing locally:', error);
          privateMetadataUri = storeImageLocally(privateMetadata);
        }
      }

      // Create a new transaction block
      const tx = new TransactionBlock();
      tx.setGasBudget(10000000);

      // Call the mint_nft function from the smart contract
      tx.moveCall({
        target: `${CONTRACT_ADDRESS}::inft_core::mint_nft`,
        arguments: [
          tx.pure(name),
          tx.pure(description),
          tx.pure(imageUrl),
          tx.pure(publicMetadataUri),
          tx.pure(privateMetadataUri),
          tx.pure(atomaModelId),
        ],
      });

      // Execute the transaction
      const result = await signer.signAndExecuteTransactionBlock({
        transactionBlock: tx
      });

      console.log('Mint transaction result:', JSON.stringify(result, null, 2));

      // Extract INFT object ID
      const objectId = result.effects?.created?.find((c: OwnedObjectRef) => c.owner)?.reference?.objectId;
      if (!objectId) {
        throw new Error('No INFT object ID found in transaction result');
      }

      return {
        objectId,
        digest: result.digest,
        imageUrl,
        publicMetadataUri,
        privateMetadataUri,
      };
    } catch (error) {
      console.error('Error minting INFT:', error);
      throw error;
    }
  },
};