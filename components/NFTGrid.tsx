import React from 'react';
import { Card, CardContent, } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
import { Activity, Heart, Image as ImageIcon } from 'lucide-react';

interface NFTData {
  id: string;
  name: string;
  description: string;
  image_url: string;
  evolution_stage: number;
  interaction_count: number;
  atoma_model_id: string;
  isFavorite?: boolean;
  content?: {
    fields?: {
      owner?: string;
      creator?: string;
    };
  };
}

interface NFTGridProps {
  nfts: NFTData[];
  isLoading: boolean;
  onFavoriteToggle?: (nftId: string) => void;
}

export function NFTGrid({ nfts, isLoading, onFavoriteToggle }: NFTGridProps) {
  const [failedImages, setFailedImages] = React.useState<Set<string>>(new Set());
  const [clickedHearts, setClickedHearts] = React.useState<Set<string>>(new Set());

  const handleImageError = (imageUrl: string) => {
    console.log('Image failed to load:', imageUrl);
    setFailedImages(prev => new Set(prev).add(imageUrl));
  };

  const handleHeartClick = (e: React.MouseEvent, nftId: string) => {
    e.stopPropagation();
    onFavoriteToggle?.(nftId);
    
    // Add animation effect
    setClickedHearts(prev => new Set(prev).add(nftId));
    setTimeout(() => {
      setClickedHearts(prev => {
        const newSet = new Set(prev);
        newSet.delete(nftId);
        return newSet;
      });
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <Card key={index} className="bg-zinc-900/50 border-zinc-800/50 animate-pulse">
            <div className="aspect-square bg-zinc-800/50 rounded-t-lg" />
            <CardContent className="p-4">
              <div className="h-4 bg-zinc-800/50 rounded w-3/4 mb-2" />
              <div className="h-3 bg-zinc-800/50 rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!nfts || nfts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-24 h-24 bg-zinc-900/50 rounded-full flex items-center justify-center mb-4">
          <Heart className="w-12 h-12 text-zinc-600" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No NFTs Found</h3>
        <p className="text-zinc-400">You don&apos;t have any NFTs in your collection yet.</p>
      </div>
    );
  }

  // Log information about the NFTs we're trying to render
  console.log(`Rendering ${nfts.length} NFTs in grid`);

  const getImageUrl = (url: string) => {
    if (!url) return '/placeholder-nft.png'; // Default placeholder
    
    // Handle different URL formats
    if (url.startsWith('local://')) {
      return url.replace('local://', '');
    } else if (url.startsWith('ipfs://')) {
      // Handle IPFS URLs - note: IPFS gateway may need to be configured in next.config.js
      return `/placeholder-nft.png`; // Use placeholder instead of IPFS for reliability
    }
    return url;
  };

  // Check each NFT data before rendering
  const validNfts = nfts.filter(nft => {
    if (!nft || !nft.id) {
      console.warn('Invalid NFT data found:', nft);
      return false;
    }
    return true;
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {validNfts.map((nft) => {
        const imageUrl = nft.image_url ? getImageUrl(nft.image_url) : '/placeholder-nft.png';
        const hasFailed = imageUrl ? failedImages.has(imageUrl) : true;

        return (
          <Card key={nft.id} className="bg-zinc-900/50 border-zinc-800/50 overflow-hidden hover:shadow-lg transition-all duration-200 group hover:border-primary/50">
            <div className="aspect-square relative bg-zinc-800/50">
              {!hasFailed ? (
                <img
                  src={imageUrl}
                  alt={nft.name || 'NFT'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={() => handleImageError(imageUrl)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-zinc-600" />
                </div>
              )}
              {/* Favorite Button */}
              <button
                onClick={(e) => handleHeartClick(e, nft.id)}
                className={`absolute bottom-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-200 z-10 ${
                  clickedHearts.has(nft.id) ? 'animate-bounce' : ''
                }`}
              >
                <Heart
                  className={`w-5 h-5 transition-all duration-300 ${
                    nft.isFavorite 
                      ? 'fill-red-500 text-red-500 scale-110' 
                      : 'text-white hover:scale-110'
                  }`}
                />
              </button>
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <div className="space-y-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-primary/80">ID</span>
                    <span className="text-xs font-mono text-zinc-200 break-all">{nft.id}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-200">
                    <span className="font-medium text-primary/80">Model ID:</span>
                    <span className="font-mono">{nft.atoma_model_id || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-200">
                    <span className="font-medium text-primary/80">Owner:</span>
                    <span className="font-mono">{nft.content?.fields?.owner ? `${nft.content.fields.owner.slice(0, 6)}...${nft.content.fields.owner.slice(-4)}` : 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-200">
                    <span className="font-medium text-primary/80">Creator:</span>
                    <span className="font-mono">{nft.content?.fields?.creator ? `${nft.content.fields.creator.slice(0, 6)}...${nft.content.fields.creator.slice(-4)}` : 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
            <CardContent className="p-4 group-hover:bg-zinc-800/30 transition-colors duration-200">
              <h3 className="text-lg font-semibold text-white mb-1 truncate group-hover:text-primary transition-colors duration-200">{nft.name || 'Unnamed NFT'}</h3>
              <p className="text-sm text-zinc-400 mb-2 line-clamp-2 group-hover:text-zinc-300 transition-colors duration-200">{nft.description || 'No description'}</p>
              <div className="flex items-center gap-2 text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors duration-200">
                <Activity className="w-4 h-4" />
                <span>Stage {nft.evolution_stage || 0}</span>
                <span className="mx-1">•</span>
                <span>{nft.interaction_count || 0} interactions</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}