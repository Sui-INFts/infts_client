"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { ConnectButton } from "@mysten/dapp-kit";
import { HeroHeader } from "@/components/header";
import { PlusCircle, Wallet, Copy, Check, Activity } from "lucide-react";
import FooterSection from "@/components/footer";
import { toast } from "sonner";
import { NFTGrid } from "@/components/NFTGrid";
import { TransactionList } from "@/components/TransactionList";
// import Image from "next/image";

// NFTData type (copied from MintedNFTs NFT interface)
interface NFTData {
  id: string;
  name: string;
  description: string;
  image_url: string;
  evolution_stage: number;
  interaction_count: number;
  atoma_model_id: string;
  content?: {
    fields?: {
      owner?: string;
      creator?: string;
    };
  };
  isFavorite?: boolean;
}

interface Transaction {
  digest: string;
  data: {
    timestampMs?: number;
    effects?: {
      gasUsed?: {
        computationCost?: number;
        storageCost?: number;
        storageRebate?: number;
      };
    };
  };
  type?: string;
}

interface SuiObject {
  data?: {
    content?: {
      fields?: {
        name?: string;
        description?: string;
        image_url?: string;
        evolution_stage?: string;
        interaction_count?: string;
        atoma_model_id?: string;
        owner?: string;
        creator?: string;
      };
    };
    display?: {
      data?: {
        name?: string;
        description?: string;
        image_url?: string;
        creator?: string;
      };
    };
    objectId?: string;
    owner?: {
      AddressOwner?: string;
    };
  };
  content?: {
    fields?: {
      name?: string;
      description?: string;
      image_url?: string;
      evolution_stage?: string;
      interaction_count?: string;
      atoma_model_id?: string;
      owner?: string;
      creator?: string;
    };
  };
  objectId?: string;
  owner?: {
    AddressOwner?: string;
  };
}

// Improved helper to map Sui object to NFTData
function mapSuiObjectToNFTData(obj: SuiObject): NFTData | null {
  try {
    // Check if object has data and content
    const content = obj.data?.content?.fields || obj.content?.fields;
    
    // If we don't have content fields, try to use display fields
    if (!content && !obj.data?.display?.data) {
      console.log('Object missing content fields:', obj);
      return null;
    }
    
    // Get display data if available
    const displayData = obj.data?.display?.data || {};
    
    // Create NFT data with fallbacks for all properties
    return {
      id: obj.data?.objectId || obj.objectId || '',
      name: content?.name || displayData.name || 'Unnamed NFT',
      description: content?.description || displayData.description || '',
      image_url: content?.image_url || displayData.image_url || '/logo.png',
      evolution_stage: content?.evolution_stage ? parseInt(content.evolution_stage) : 0,
      interaction_count: content?.interaction_count ? parseInt(content.interaction_count) : 0,
      atoma_model_id: content?.atoma_model_id || '',
      content: {
        fields: {
          owner: content?.owner || obj.data?.owner?.AddressOwner || obj.owner?.AddressOwner,
          creator: content?.creator || displayData.creator || ''
        }
      },
      isFavorite: false
    };
  } catch (e) {
    console.error('Error mapping NFT data:', e);
    return null;
  }
}

// function getStableSeed(address: string | null) {
//   // Use the wallet address as seed if available, otherwise use a fixed fallback
//   return address || "default-seed";
// }

const Profile: React.FC = () => {
  const router = useRouter();
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const [balance, setBalance] = React.useState<string>("0");
  const [suiPrice, setSuiPrice] = React.useState<number>(0);
  const [copied, setCopied] = React.useState(false);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = React.useState(false);
  const [networkStatus, setNetworkStatus] = React.useState<{
    status: 'online' | 'offline' | 'syncing';
    lastBlock: number;
    peers: number;
  }>({
    status: 'online',
    lastBlock: 0,
    peers: 0
  });
  const [activeTab, setActiveTab] = React.useState('Collected');
  const [ownedNFTs, setOwnedNFTs] = React.useState<NFTData[]>([]);
  const [favoriteNFTs, setFavoriteNFTs] = React.useState<NFTData[]>([]);
  const [isLoadingNFTs, setIsLoadingNFTs] = React.useState(false);

  // Load favorite NFTs from localStorage on component mount
  React.useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteNFTs');
    if (savedFavorites) {
      setFavoriteNFTs(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorite NFTs to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('favoriteNFTs', JSON.stringify(favoriteNFTs));
  }, [favoriteNFTs]);

  const handleFavoriteToggle = (nftId: string) => {
    setOwnedNFTs(prevNFTs => 
      prevNFTs.map(nft => 
        nft.id === nftId ? { ...nft, isFavorite: !nft.isFavorite } : nft
      )
    );

    const nft = ownedNFTs.find(n => n.id === nftId);
    if (nft) {
      if (nft.isFavorite) {
        setFavoriteNFTs(prev => prev.filter(f => f.id !== nftId));
      } else {
        setFavoriteNFTs(prev => [...prev, { ...nft, isFavorite: true }]);
      }
    }
  };

  React.useEffect(() => {
    const fetchSuiPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=sui&vs_currencies=usd');
        const data = await response.json();
        setSuiPrice(data.sui.usd);
      } catch (error) {
        console.error("Error fetching SUI price:", error);
      }
    };

    fetchSuiPrice();
    // Refresh price every 60 seconds
    const interval = setInterval(fetchSuiPrice, 60000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    const fetchBalance = async () => {
      if (account?.address) {
        try {
          const balance = await suiClient.getBalance({
            owner: account.address,
            coinType: "0x2::sui::SUI"
          });
          setBalance(balance.totalBalance);
        } catch (error) {
          console.error("Error fetching balance:", error);
          setBalance("0");
        }
      }
    };
    fetchBalance();
  }, [account?.address, suiClient]);

  React.useEffect(() => {
    const fetchNetworkStatus = async () => {
      try {
        const status = await suiClient.getLatestSuiSystemState();
        setNetworkStatus({
          status: 'online',
          lastBlock: Number(status.epoch),
          peers: status.activeValidators.length
        });
      } catch (error) {
        console.error("Error fetching network status:", error);
        setNetworkStatus(prev => ({ ...prev, status: 'offline' }));
      }
    };

    fetchNetworkStatus();
    const interval = setInterval(fetchNetworkStatus, 30000);
    return () => clearInterval(interval);
  }, [suiClient]);

  React.useEffect(() => {
    const fetchOwnedNFTs = async () => {
      if (!account?.address) return;
      
      setIsLoadingNFTs(true);
      try {
        // Get all owned objects with enhanced options
        const objects = await suiClient.getOwnedObjects({
          owner: account.address,
          options: {
            showType: true,
            showContent: true,
            showDisplay: true,
            showOwner: true,
          },
          // Increase limit to get more NFTs
          limit: 50,
        });

        console.log('Fetched objects total:', objects.data.length);
        
        // Process all objects to extract NFTs
        const nfts = objects.data
          .map(object => {
            const mappedNFT = mapSuiObjectToNFTData(object as unknown as SuiObject);
            if (mappedNFT) {
              console.log('Successfully mapped NFT:', mappedNFT.id, mappedNFT.name);
            }
            return mappedNFT;
          })
          .filter((nft): nft is NFTData => nft !== null);

        console.log('Total mapped NFTs:', nfts.length);
        setOwnedNFTs(nfts);
        
      } catch (error) {
        console.error("Error fetching owned NFTs:", error);
        toast.error("Failed to fetch NFTs");
      } finally {
        setIsLoadingNFTs(false);
      }
    };

    fetchOwnedNFTs();
  }, [account?.address, suiClient]);

  React.useEffect(() => {
    const fetchTransactions = async () => {
      if (!account?.address) return;
      
      setIsLoadingTransactions(true);
      try {
        // First get transactions where the address is the sender
        const sentTxns = await suiClient.queryTransactionBlocks({
          filter: {
            FromAddress: account.address
          },
          options: {
            showBalanceChanges: true,
            showEffects: true,
            showInput: true,
          },
          limit: 10,
        });
  
        // Then get transactions where the address is the recipient
        const receivedTxns = await suiClient.queryTransactionBlocks({
          filter: {
            ToAddress: account.address
          },
          options: {
            showBalanceChanges: true,
            showEffects: true,
            showInput: true,
          },
          limit: 10,
        });
  
        // Create a map to store unique transactions with their type
        const uniqueTxnsMap = new Map();
        
        // Process sent transactions
        sentTxns.data.forEach(txn => {
          uniqueTxnsMap.set(txn.digest, {
            digest: txn.digest,
            data: txn, 
            type: 'sent'
          });
        });
        
        // Process received transactions (update type if already exists)
        receivedTxns.data.forEach(txn => {
          if (uniqueTxnsMap.has(txn.digest)) {
            // This transaction is both sent and received
            uniqueTxnsMap.get(txn.digest).type = 'both';
          } else {
            // This is only a received transaction
            uniqueTxnsMap.set(txn.digest, {
              digest: txn.digest,
              data: txn,
              type: 'received'
            });
          }
        });
        
        // Convert map to array and sort by timestamp
        const allTxns = Array.from(uniqueTxnsMap.values())
          .sort((a, b) => {
            const aTime = Number(a.data.timestampMs);
            const bTime = Number(b.data.timestampMs);
            return bTime - aTime; // newest first
          });
        
        setTransactions(allTxns);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast.error("Failed to fetch transactions");
      } finally {
        setIsLoadingTransactions(false);
      }
    };
  
    fetchTransactions();
    // Refresh transactions every 30 seconds
    const interval = setInterval(fetchTransactions, 30000);
    return () => clearInterval(interval);
  }, [account?.address, suiClient]);

  const handleCreateNFT = () => {
    router.push("/create");
  };

  const handleCopyAddress = () => {
    if (account?.address) {
      navigator.clipboard.writeText(account.address);
      setCopied(true);
      toast.success("Address copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getDisplayNFTs = () => {
    switch(activeTab) {
      case 'Collected':
        return ownedNFTs;
      case 'Favorited':
        return favoriteNFTs;
      case 'Offers made':
        return [];
      default:
        return ownedNFTs;
    }
  };

  // const avatarSeed = getStableSeed(account?.address || null);
  const formattedBalance = balance ? (parseInt(balance) / 1e9).toFixed(2) : "0.00";
  const usdValue = balance ? ((parseInt(balance) / 1e9) * suiPrice).toFixed(2) : "0.00";

  return (
    <div className="min-h-screen w-full bg-black flex flex-col">
      <HeroHeader />
      {/* Profile Info Section */}
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-16 flex-1">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-12">
          <div className="w-30 h-30 rounded-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 border-primary/30 flex items-center justify-center overflow-hidden shadow-xl">
          </div>
          <div className="flex-1 text-left space-y-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl font-bold text-white">
                <span>{account ? `${account.address.slice(0, 7)}...${account.address.slice(-4)}` : 'Wallet_Address'}</span>
              </div>
              {account && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopyAddress}
                  className="h-8 w-8 hover:bg-zinc-800/50 transition-colors"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4 text-zinc-400" />
                  )}
                </Button>
              )}
            </div>
            {/* Network Status */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                networkStatus.status === 'online' ? 'bg-green-500' : 
                networkStatus.status === 'syncing' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <span className="text-sm text-zinc-400">
                {networkStatus.status === 'online' ? 'Connected' : 
                  networkStatus.status === 'syncing' ? 'Syncing' : 'Offline'}
              </span>
            </div>
          </div>
          <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-4 items-center">
            {account ? (
              <>
                <div className="flex items-center space-x-3 bg-zinc-900/50 px-4 py-2.5 rounded-lg border border-zinc-800/50 h-11 shadow-sm">
                  <Wallet className="h-4 w-4 text-zinc-400" />
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-white">{formattedBalance} SUI</span>
                    <span className="text-sm text-zinc-500">|</span>
                    <span className="text-sm font-medium text-white">${usdValue}</span>
                  </div>
                </div>
                <Button 
                  size="lg" 
                  variant="default" 
                  onClick={handleCreateNFT} 
                  className="bg-primary text-primary-foreground h-11 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Mint INFT
                </Button>
              </>
            ) : (
              <ConnectButton />
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-zinc-800/50 mb-8 pb-2 w-full">
          {['Collected', 'Offers made', 'Favorited', 'Activity'].map(tab => (
            <Button 
              key={tab} 
              variant="ghost" 
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-[120px] rounded-lg px-4 py-2.5 text-base font-medium justify-center transition-all duration-200 ${
                activeTab === tab 
                  ? 'text-white bg-zinc-800/50 shadow-sm' 
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
              }`}
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* Filters/Search/Sort */}
        <div className="flex flex-wrap gap-3 items-center mb-8">
          <Button variant="outline" size="sm" className="hover:bg-zinc-800/50 border-zinc-800/50">Status</Button>
          <input
            type="text"
            placeholder="Search by name"
            className="border border-zinc-800/50 rounded-lg px-4 py-2 text-sm bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
            style={{ minWidth: 200 }}
          />
          <Button variant="outline" size="sm" className="hover:bg-zinc-800/50 border-zinc-800/50">Recently received</Button>
        </div>
        
        {/* NFT Display */}
        {(activeTab === 'Collected' || activeTab === 'Favorited') && (
          <NFTGrid 
            nfts={getDisplayNFTs()} 
            isLoading={isLoadingNFTs} 
            onFavoriteToggle={handleFavoriteToggle}
          />
        )}
        
        {activeTab === 'Activity' && (
          <TransactionList transactions={transactions} isLoading={isLoadingTransactions} />
        )}
        
        {/* Empty states for other tabs */}
        {activeTab === 'Offers made' && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-24 h-24 bg-zinc-900/50 rounded-full flex items-center justify-center mb-4">
              <Activity className="w-12 h-12 text-zinc-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No {activeTab} Found</h3>
            <p className="text-zinc-400">You don&apos;t have any {activeTab.toLowerCase()} yet.</p>
          </div>
        )}
      </div>
      <FooterSection />
    </div>
  );
};

export default Profile;