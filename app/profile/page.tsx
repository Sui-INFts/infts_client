"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { ConnectButton } from "@mysten/dapp-kit";
import { HeroHeader } from "@/components/header";
import { PlusCircle, Wallet, Copy, Check, Activity, Network, Settings } from "lucide-react";
import FooterSection from "@/components/footer";
import MintedNFTs from "./components/minted";

function getStableSeed(address: string | null) {
  // Use the wallet address as seed if available, otherwise use a fixed fallback
  return address || "default-seed";
}

export default function Profile() {
  const router = useRouter();
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const networkVariables = useNetworkVariables();
  const [balance, setBalance] = React.useState<string>("0");
  const [suiPrice, setSuiPrice] = React.useState<number>(0);
  const [copied, setCopied] = React.useState(false);
  const [transactions, setTransactions] = React.useState<any[]>([]);
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
  const [createdNFTs, setCreatedNFTs] = React.useState<NFTData[]>([]);
  const [isLoadingNFTs, setIsLoadingNFTs] = React.useState(false);

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
        const objects = await suiClient.getOwnedObjects({
          owner: account.address,
          options: {
            showType: true,
            showContent: true,
            showDisplay: true
          }
        });

        // Filter for NFTs (objects with display metadata)
        const nfts = objects.data
          .map(mapSuiObjectToNFTData)
          .filter((nft): nft is NFTData => nft !== null);

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
    const fetchCreatedNFTs = async () => {
      if (!account?.address) return;
      
      setIsLoadingNFTs(true);
      try {
        const objects = await suiClient.getOwnedObjects({
          owner: account.address,
          options: {
            showType: true,
            showContent: true,
            showDisplay: true
          }
        });

        // Filter for NFTs created by the current wallet
        const nfts = objects.data
          .map(mapSuiObjectToNFTData)
          .filter((nft): nft is NFTData => 
            nft !== null && 
            nft.content?.dataType === 'moveObject' &&
            nft.content?.fields?.creator === account.address
          );

        setCreatedNFTs(nfts);
      } catch (error) {
        console.error("Error fetching created NFTs:", error);
        toast.error("Failed to fetch created NFTs");
      } finally {
        setIsLoadingNFTs(false);
      }
    };

    fetchCreatedNFTs();
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

        // Combine and sort by timestamp
        const allTxns = [...sentTxns.data, ...receivedTxns.data]
          .sort((a, b) => Number(b.timestampMs) - Number(a.timestampMs))
          .slice(0, 10); // Take the 10 most recent
        
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

  const avatarSeed = getStableSeed(account?.address || null);
  const formattedBalance = balance ? (parseInt(balance) / 1e9).toFixed(2) : "0.00";
  const usdValue = balance ? ((parseInt(balance) / 1e9) * suiPrice).toFixed(2) : "0.00";

  return (
    <div className="min-h-screen w-full bg-black flex flex-col">
      <HeroHeader />
      {/* Profile Info Section */}
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-16 flex-1">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-12">
          <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 flex items-center justify-center overflow-hidden shadow-xl">
            <img
              src={`https://api.dicebear.com/7.x/bottts/svg?seed=${avatarSeed}`}
              alt="Profile Avatar"
              className="w-36 h-36 object-cover"
            />
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
                  Create INFT
                </Button>
              </>
            ) : (
              <ConnectButton />
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-zinc-800/50 mb-8 pb-2 w-full">
          {['Collected', 'Offers made', 'Deals', 'Created', 'Favorited', 'Activity', 'More'].map(tab => (
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
          <Button variant="outline" size="sm" className="hover:bg-zinc-800/50 border-zinc-800/50">Chains</Button>
          <input
            type="text"
            placeholder="Search by name"
            className="border border-zinc-800/50 rounded-lg px-4 py-2 text-sm bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
            style={{ minWidth: 200 }}
          />
          <Button variant="outline" size="sm" className="hover:bg-zinc-800/50 border-zinc-800/50">Recently received</Button>
        </div>
        {/* NFT Display */}
        <MintedNFTs />
      </div>
      <FooterSection />
    </div>
  );
}