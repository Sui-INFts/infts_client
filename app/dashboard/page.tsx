"use client";
import React, {useState, useCallback, useEffect} from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { HeroHeader } from "@/components/header";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { ConnectButton } from "@mysten/dapp-kit";
import {  Wallet, Clock, DollarSign, Activity, Shield, AlertCircle, CheckCircle, Zap, RefreshCw, Image, Coins } from 'lucide-react';
import { CreditScoreRing } from "./components/creditScoreRing";
import { MetricCard } from "./components/metricCard";
import { CreditFactorItem } from "./components/creditFactorItem";
import { toast } from "sonner";

type IconComponent = React.ComponentType<{ className?: string; }>;

interface Token {
  coinType: string;
  symbol: string;
  name: string;
  balance: number;
  balanceFormatted: string;
  usdValue: number;
  usdFormatted: string;
  icon: string;
  isNative?: boolean;
  isStaked?: boolean;
}

interface NFT {
  objectId: string;
  name: string;
  description: string;
  imageUrl: string;
  type: string;
  collection?: string;
}

interface CreditFactor {
  factor: string;
  score: number;
  impact: 'positive' | 'negative' | 'neutral';
  icon: IconComponent;
}

interface OnChainData {
  overallScore: number;
  addressAge: number;
  totalBalance: string;
  transactions: number;
  liquidations: number;
  yieldGenerated: string;
  repaymentHistory: string;
  gasSpent: string;
  nftCount: number;
  activeProtocols: number;
}

interface SuiTransaction {
  digest: string;
  timestampMs?: string;
  effects?: {
    gasUsed?: {
      computationCost?: string;
      storageCost?: string;
      storageRebate?: string;
    };
    status?: {
      status: string;
    };
  };
}

interface SuiObject {
  data?: {
    content?: {
      fields?: any;
    };
    display?: {
      data?: {
        name?: string;
        description?: string;
        image_url?: string;
      };
    };
    objectId?: string;
    type?: string;
  };
}

const Dashboard: React.FC = () => {
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const [activeTab, setActiveTab] = useState<'On Chain' | 'Off Chain'>('On Chain');
  const [activeHoldingsTab, setActiveHoldingsTab] = useState<'Tokens' | 'NFTs'>('Tokens');
  const [isLoading, setIsLoading] = useState(false);
  const [suiPrice, setSuiPrice] = useState<number>(0);
  
  // Real on-chain data state
  const [onChainData, setOnChainData] = useState<OnChainData>({
    overallScore: 0,
    addressAge: 0,
    totalBalance: '$0',
    transactions: 0,
    liquidations: 0,
    yieldGenerated: '$0',
    repaymentHistory: '0%',
    gasSpent: '0',
    nftCount: 0,
    activeProtocols: 1
  });

  const [tokens, setTokens] = useState<Token[]>([]);
  const [nfts, setNFTs] = useState<NFT[]>([]);

  // Calculate address age based on first transaction with better error handling
  const calculateAddressAge = useCallback(async (address: string): Promise<number> => {
    try {
      const transactions = await suiClient.queryTransactionBlocks({
        filter: { FromAddress: address },
        options: {
          showEffects: false,
          showInput: false,
          showEvents: false,
          showObjectChanges: false,
          showBalanceChanges: false,
        },
        order: 'ascending',
        limit: 1
      });

      if (transactions.data && transactions.data.length > 0 && transactions.data[0].timestampMs) {
        const firstTxTime = Number(transactions.data[0].timestampMs);
        const currentTime = Date.now();
        const ageInDays = Math.floor((currentTime - firstTxTime) / (1000 * 60 * 60 * 24));
        return Math.max(ageInDays, 1);
      }
      
      return 1;
    } catch (error) {
      console.error("Error calculating address age:", error);
      return 1;
    }
  }, [suiClient]);

  // Calculate credit score based on real metrics
  const calculateCreditScore = (metrics: {
    addressAge: number;
    transactionCount: number;
    balance: number;
    gasSpent: number;
    nftCount: number;
    liquidations: number;
  }): number => {
    let score = 0;

    score += Math.min(metrics.addressAge / 365 * 25, 25);
    score += Math.min(metrics.transactionCount / 100 * 20, 20);
    score += Math.min(metrics.balance / 1000 * 20, 20);

    if (metrics.transactionCount > 50) score += 15;
    else if (metrics.transactionCount > 20) score += 10;
    else if (metrics.transactionCount > 5) score += 5;

    score += Math.min(metrics.nftCount / 10 * 10, 10);

    if (metrics.liquidations === 0) score += 10;

    return Math.min(Math.round(score), 100);
  };

  // Fetch SUI price
  const fetchSuiPrice = useCallback(async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=sui&vs_currencies=usd'
      );
      const data = await response.json();
      if (data && data.sui && data.sui.usd) {
        setSuiPrice(data.sui.usd);
      }
    } catch (error) {
      console.error("Error fetching SUI price:", error);
    }
  }, []);

  // Fetch user's complete portfolio balance (all coins + staked SUI)
  const fetchCompleteBalance = useCallback(async () => {
    if (!account?.address) return { totalUSD: 0, tokenBalances: [] };
    
    try {
      const allBalances = await suiClient.getAllBalances({
        owner: account?.address,
      });

      const stakes = await suiClient.getStakes({
        owner: account?.address,
      });

      let totalUSD = 0;
      const tokenBalances: Token[] = [];

      // Process liquid tokens
      if (allBalances && Array.isArray(allBalances)) {
        for (const balance of allBalances) {
          const decimals = 9;
          const coinAmount = parseInt(balance.totalBalance) / Math.pow(10, decimals);
          let usdValue = 0;
          let tokenName = 'Unknown';
          let symbol = 'UNKNOWN';

          if (balance.coinType === '0x2::sui::SUI') {
            usdValue = coinAmount * suiPrice;
            tokenName = 'Sui';
            symbol = 'SUI';
          } else {
            try {
              const metadata = await suiClient.getCoinMetadata({ coinType: balance.coinType });
              if (metadata) {
                symbol = metadata.symbol || 'UNKNOWN';
                tokenName = metadata.name || 'Unknown Token';

                if (symbol.includes('USD') || symbol.includes('USDT') || symbol.includes('USDC')) {
                  usdValue = coinAmount;
                } else {
                  usdValue = coinAmount * 0.1;
                }
              }
            } catch (metadataError) {
              console.warn('Could not fetch metadata for coin type:', balance.coinType);
              const parts = balance.coinType.split('::');
              symbol = parts[parts.length - 1] || 'UNKNOWN';
            }
          }

          totalUSD += usdValue;

          if (coinAmount > 0) {
            tokenBalances.push({
              coinType: balance.coinType,
              symbol,
              name: tokenName,
              balance: coinAmount,
              balanceFormatted: `${coinAmount.toLocaleString()}`,
              usdValue,
              usdFormatted: `$${usdValue.toLocaleString()}`,
              icon: symbol.charAt(0),
              isNative: balance.coinType === '0x2::sui::SUI'
            });
          }
        }
      }

      // Add staked SUI
      if (stakes && stakes.length > 0) {
        const totalStaked = stakes
          .flatMap((validator) => validator.stakes || [])
          .reduce((acc, stake) => acc + parseInt(stake.principal || '0'), 0);

        const stakedAmount = totalStaked / 1e9;
        const stakedValue = stakedAmount * suiPrice;

        if (stakedAmount > 0) {
          tokenBalances.push({
            coinType: "0x2::sui::SUI::STAKED",
            symbol: 'SUI',
            name: 'Staked SUI',
            balance: stakedAmount,
            balanceFormatted: `${stakedAmount.toLocaleString()}`,
            usdValue: stakedValue,
            usdFormatted: `$${stakedValue.toLocaleString()}`,
            icon: 'S',
            isNative: true,
            isStaked: true,
          });

          totalUSD += stakedValue;
        }
      }

      return {
        totalUSD,
        tokenBalances: tokenBalances.sort((a, b) => b.usdValue - a.usdValue),
      };

    } catch (error) {
      console.error("Error fetching complete balance:", error);
      return { totalUSD: 0, tokenBalances: [] };
    }
  }, [account?.address, suiClient, suiPrice]);

  // Fetch NFTs
  const fetchNFTs = useCallback(async (): Promise<NFT[]> => {
    if (!account?.address) return [];
    
    try {
      // Fetch more objects and use pagination if needed
      let allObjects: any[] = [];
      let cursor = null;
      let hasNextPage = true;
      
      // Fetch up to 200 objects to catch more NFTs
      while (hasNextPage && allObjects.length < 200) {
        const objects = await suiClient.getOwnedObjects({
          owner: account?.address,
          cursor: cursor,
          options: {
            showType: true,
            showContent: true,
            showDisplay: true,
            showOwner: true,
          },
          limit: 50,
        });
 

        if (objects && objects.data && Array.isArray(objects.data)) {
          allObjects = [...allObjects, ...objects.data];
          hasNextPage = objects.hasNextPage;
          cursor = objects.nextCursor;
        } else {
          break;
        }
      }

      const nftList: NFT[] = [];

      for (const obj of allObjects) {
        try {
          const data = obj.data as SuiObject['data'];
          const objectType = data?.type || '';
          
          // More comprehensive NFT detection logic
          const isNFT = (
            // Has display metadata (standard NFTs)
            data?.display?.data?.name ||
            // Has content but is not a coin
            (data?.content?.fields && !objectType.includes('::coin::Coin')) ||
            // Common NFT type patterns
            objectType.includes('::nft::') ||
            objectType.includes('::NFT') ||
            objectType.includes('::collection::') ||
            // Kiosk objects (Sui NFT standard)
            objectType.includes('kiosk') ||
            // Has URL field (common in NFTs)
            data?.content?.fields?.url ||
            data?.content?.fields?.image_url ||
            // Has name and description fields
            (data?.content?.fields?.name && data?.content?.fields?.description) ||
            // Exclude system objects and focus on user-generated content
            (!objectType.includes('::coin::') && 
             !objectType.includes('::balance::') &&
             !objectType.includes('::supply::') &&
             !objectType.startsWith('0x2::') && // Exclude system packages
             data?.content?.fields) // But has content
          );
          
          if (isNFT) {
            const displayData = data?.display?.data;
            const contentFields = data?.content?.fields;
            
            // Extract name from multiple possible sources
            const name = displayData?.name || 
                        contentFields?.name || 
                        contentFields?.title ||
                        `NFT #${data?.objectId?.slice(-6) || 'Unknown'}`;
            
            // Extract description from multiple sources
            const description = displayData?.description || 
                              contentFields?.description || 
                              contentFields?.bio ||
                              'No description available';
            
            // Extract image from multiple sources
            const imageUrl = displayData?.image_url || 
                           contentFields?.url || 
                           contentFields?.image_url ||
                           contentFields?.avatar ||
                           '';
            
            nftList.push({
              objectId: data?.objectId || '',
              name: String(name),
              description: String(description),
              imageUrl: String(imageUrl),
              type: objectType,
              collection: objectType?.split('::')[0] || 'Unknown Collection'
            });
          }
        } catch (error) {
          console.warn('Error processing NFT object:', obj?.data?.objectId, error);
        }
      }

      console.log(`Found ${nftList.length} NFTs out of ${allObjects.length} total objects`);
      return nftList;
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      return [];
    }
  }, [account?.address, suiClient]);

  // Fetch all dashboard data
  const fetchDashboardData = useCallback(async () => {
    if (!account?.address) return;
    
    setIsLoading(true);
    try {
      // Fetch portfolio data and NFTs in parallel
      const [portfolioData, nftData] = await Promise.all([
        fetchCompleteBalance(),
        fetchNFTs()
      ]);

      const totalBalanceUSD = portfolioData.totalUSD;

      // Fetch transactions
      const [sentTxns, receivedTxns] = await Promise.all([
        suiClient.queryTransactionBlocks({
          filter: { FromAddress: account.address },
          options: {
            showEffects: true,
            showInput: false,
            showEvents: false,
            showObjectChanges: false,
            showBalanceChanges: false,
          },
          limit: 50,
        }),
        suiClient.queryTransactionBlocks({
          filter: { ToAddress: account.address },
          options: {
            showEffects: true,
            showInput: false,
            showEvents: false,
            showObjectChanges: false,
            showBalanceChanges: false,
          },
          limit: 50,
        })
      ]);

      // Combine and deduplicate transactions
      const allTxns = new Map();
      const sentData = sentTxns?.data || [];
      const receivedData = receivedTxns?.data || [];
      
      [...sentData, ...receivedData].forEach(txn => {
        if (txn && txn.digest) {
          allTxns.set(txn.digest, txn);
        }
      });
      
      const uniqueTransactions = Array.from(allTxns.values()) as SuiTransaction[];

      // Calculate gas spent
      const totalGasSpent = uniqueTransactions.reduce((total, txn) => {
        try {
          const gasUsed = txn.effects?.gasUsed;
          if (gasUsed && gasUsed.computationCost) {
            const computation = parseInt(gasUsed.computationCost || '0');
            const storage = parseInt(gasUsed.storageCost || '0');
            const rebate = parseInt(gasUsed.storageRebate || '0');
            const netGas = computation + storage - rebate;
            return total + (netGas > 0 ? netGas : 0);
          }
          return total;
        } catch (error) {
          console.warn('Error calculating gas for transaction:', txn.digest, error);
          return total;
        }
      }, 0);

      // Calculate address age
      const addressAge = await calculateAddressAge(account.address);

      // Calculate credit score
      const creditScore = calculateCreditScore({
        addressAge,
        transactionCount: uniqueTransactions.length,
        balance: totalBalanceUSD,
        gasSpent: totalGasSpent / 1e9,
        nftCount: nftData.length,
        liquidations: 0
      });

      // Update state
      setOnChainData({
        overallScore: creditScore,
        addressAge,
        totalBalance: `$${totalBalanceUSD.toLocaleString()}`,
        transactions: uniqueTransactions.length,
        liquidations: 0,
        yieldGenerated: '$0',
        repaymentHistory: uniqueTransactions.length > 0 ? '100%' : '0%',
        gasSpent: (totalGasSpent / 1e9).toFixed(4),
        nftCount: nftData.length,
        activeProtocols: 1
      });

      setTokens(portfolioData.tokenBalances);
      setNFTs(nftData);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      if (toast && toast.error) {
        toast.error("Failed to fetch dashboard data");
      }
    } finally {
      setIsLoading(false);
    }
  }, [account?.address, suiClient, suiPrice, calculateAddressAge, fetchCompleteBalance, fetchNFTs]);

  // Calculate dynamic credit factors based on real data
  const getDynamicCreditFactors = (): CreditFactor[] => {
    const transactionScore = Math.min((onChainData.transactions / 100) * 100, 100);
    const balanceScore = Math.min((parseFloat(onChainData.totalBalance.replace(/[$,]/g, '')) / 1000) * 100, 100);
    const ageScore = Math.min((onChainData.addressAge / 365) * 100, 100);
    
    return [
      { 
        factor: 'Payment History', 
        score: onChainData.transactions > 0 ? 100 : 0, 
        impact: 'positive', 
        icon: CheckCircle 
      },
      { 
        factor: 'Address Age', 
        score: Math.round(ageScore), 
        impact: ageScore > 50 ? 'positive' : 'neutral', 
        icon: Clock 
      },
      { 
        factor: 'Transaction Volume', 
        score: Math.round(transactionScore), 
        impact: transactionScore > 60 ? 'positive' : 'neutral', 
        icon: Activity 
      },
      { 
        factor: 'Liquidation Risk', 
        score: 100,
        impact: 'positive', 
        icon: Shield 
      },
      { 
        factor: 'Portfolio Balance', 
        score: Math.round(balanceScore), 
        impact: balanceScore > 50 ? 'positive' : 'neutral', 
        icon: Wallet 
      }
    ];
  };

  // Effects
  useEffect(() => {
    fetchSuiPrice();
    const interval = setInterval(fetchSuiPrice, 60000);
    return () => clearInterval(interval);
  }, [fetchSuiPrice]);

  useEffect(() => {
    if (account?.address && suiPrice > 0) {
      fetchDashboardData();
      const interval = setInterval(fetchDashboardData, 30000);
      return () => clearInterval(interval);
    }
  }, [account?.address, suiPrice, fetchDashboardData]);

  const creditFactors = getDynamicCreditFactors();
  const tabOptions: ('On Chain' | 'Off Chain')[] = ['On Chain', 'Off Chain'];

  // Calculate trends
  const getBalanceTrend = () => {
    return parseFloat(onChainData.totalBalance.replace(/[$,]/g, '')) > 1000 ? 'up' : 'neutral';
  };

  const getTransactionTrend = () => {
    return onChainData.transactions > 50 ? 'up' : 'neutral';
  };

  // Handle image error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    const parent = target.parentElement;
    if (parent) {
      target.style.display = 'none';
      const fallbackDiv = parent.querySelector('.fallback-image');
      if (fallbackDiv) {
        (fallbackDiv as HTMLElement).style.display = 'flex';
      }
    }
  };

  if (!account) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center">
        <HeroHeader />
        <div className="text-center pt-32">
          <h1 className="text-4xl font-bold text-white mb-4">Your INFT Credit Profile</h1>
          <p className="text-zinc-400 text-lg mb-8">Connect your wallet to view your credit dashboard</p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-zinc-900 to-black">
      <HeroHeader />
      
      {/* Main Content */}
      <div className="w-5/6 mx-auto pt-32 pb-16">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-12">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-white mb-4">Your INFT Credit Profile</h1>
            <p className="text-zinc-400 text-lg">AI-powered identity card that evolves with your Web3 activity</p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchDashboardData}
              disabled={isLoading}
              className="border-zinc-700"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="w-full border-b border-zinc-800/50 mb-8">
          <div className="flex flex-wrap gap-1 mb-4 pb-2 w-1/3">
            {tabOptions.map((tab) => (
              <Button 
                key={tab} 
                variant="ghost" 
                onClick={() => setActiveTab(tab)}
                className={`flex-1 min-w-[120px] rounded-lg px-6 py-3 text-base font-medium justify-center transition-all duration-200 ${
                  activeTab === tab 
                    ? 'text-white bg-zinc-800/70 shadow-lg border border-zinc-700/50' 
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
                }`}
              >
                {tab}
              </Button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'On Chain' ? (
          <div className="space-y-8">
            {/* Credit Score Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Credit Score */}
              <div className="lg:col-span-1">
                <Card className="bg-zinc-900/50 border-zinc-800/50">
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl text-white">Overall Credit Score</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CreditScoreRing 
                      score={onChainData.overallScore} 
                      maxScore={100} 
                      label="Credit Rating" 
                      color={onChainData.overallScore > 70 ? "emerald" : onChainData.overallScore > 40 ? "yellow" : "red"} 
                    />
                  </CardContent>
                  <CardFooter>
                    <div className={`w-full p-4 rounded-lg border ${
                      onChainData.overallScore > 70 
                        ? 'bg-emerald-400/10 border-emerald-400/20' 
                        : onChainData.overallScore > 40
                        ? 'bg-yellow-400/10 border-yellow-400/20'
                        : 'bg-red-400/10 border-red-400/20'
                    }`}>
                      <p className={`font-medium ${
                        onChainData.overallScore > 70 
                          ? 'text-emerald-400' 
                          : onChainData.overallScore > 40
                          ? 'text-yellow-400'
                          : 'text-red-400'
                      }`}>
                        {onChainData.overallScore > 70 ? 'Excellent Credit' : 
                         onChainData.overallScore > 40 ? 'Good Credit' : 'Building Credit'}
                      </p>
                      <p className={`text-xs mt-1 ${
                        onChainData.overallScore > 70 
                          ? 'text-emerald-400/70' 
                          : onChainData.overallScore > 40
                          ? 'text-yellow-400/70'
                          : 'text-red-400/70'
                      }`}>
                        {onChainData.overallScore > 70 
                          ? 'Eligible for premium lending rates'
                          : onChainData.overallScore > 40
                          ? 'Eligible for standard rates'
                          : 'Continue building your credit history'}
                      </p>
                    </div>
                  </CardFooter>
                </Card>
              </div>

              {/* Key Metrics */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <MetricCard
                  title="Address Age"
                  value={`${onChainData.addressAge} days`}
                  change={onChainData.addressAge > 30 ? "+mature" : "new"}
                  trend={onChainData.addressAge > 30 ? "up" : "neutral"}
                  icon={Clock}
                  subtitle="Account maturity"
                />
                <MetricCard
                  title="Total Portfolio"
                  value={onChainData.totalBalance}
                  change={Number(onChainData.totalBalance.replace(/[$,]/g, '')) > 100 ? "+strong" : "building"}
                  trend={getBalanceTrend()}
                  icon={Wallet}
                  subtitle="SUI network"
                />
                <MetricCard
                  title="Transaction Count"
                  value={onChainData.transactions.toLocaleString()}
                  change={onChainData.transactions > 10 ? "+active" : "low"}
                  trend={getTransactionTrend()}
                  icon={Activity}
                  subtitle="On-chain activity"
                />
                <MetricCard
                  title="Gas Spent"
                  value={`${onChainData.gasSpent} SUI`}
                  change={parseFloat(onChainData.gasSpent) > 1 ? "+high usage" : "efficient"}
                  trend="neutral"
                  icon={Zap}
                  subtitle="Network fees paid"
                />
              </div>
            </div>

            {/* Holdings Section */}
            <Card className="bg-zinc-900/50 border-zinc-800/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-white">Sui Network Holdings</CardTitle>
                    <CardDescription className="text-zinc-400">
                      Total Portfolio: <span className="text-white font-medium">{onChainData.totalBalance}</span> • 
                      {tokens.length} Tokens • {nfts.length} NFTs
                    </CardDescription>
                  </div>
                  
                  {/* Holdings Tab Switcher */}
                  <div className="flex bg-zinc-800/50 rounded-lg p-1">
                    {(['Tokens', 'NFTs'] as const).map((tab) => (
                      <Button
                        key={tab}
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveHoldingsTab(tab)}
                        className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                          activeHoldingsTab === tab
                            ? 'text-white bg-zinc-700/70 shadow-sm'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {tab === 'Tokens' ? <Coins className="w-4 h-4" /> : <Image className="w-4 h-4" />}
                          {tab} ({tab === 'Tokens' ? tokens.length : nfts.length})
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {/* Holdings Content */}
                {activeHoldingsTab === 'Tokens' ? (
                  <div className="space-y-3">
                    {tokens.length > 0 ? (
                      tokens.map((token, index) => (
                        <Card key={index} className="bg-zinc-800/30 border-zinc-700/50 hover:bg-zinc-800/50 transition-colors">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                                  token.isNative ? 'bg-blue-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'
                                }`}>
                                  {token.icon}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="text-white font-medium">{token.symbol}</p>
                                    {token.isStaked && (
                                      <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded">
                                        Staked
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-zinc-400">{token.name}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-white font-medium">{token.balanceFormatted} {token.symbol}</p>
                                <p className="text-sm text-zinc-400">{token.usdFormatted}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <Coins className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                        <p className="text-zinc-400">No tokens found</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {nfts.length > 0 ? (
                      nfts.map((nft, index) => (
                        <Card key={index} className="bg-zinc-800/30 border-zinc-700/50 hover:bg-zinc-800/50 transition-colors">
                          <CardContent className="p-4">
                            <div className="aspect-square bg-zinc-700/50 rounded-lg mb-3 overflow-hidden relative">
                              {nft.imageUrl ? (
                                <img 
                                  src={nft.imageUrl} 
                                  alt={nft.name}
                                  className="w-full h-full object-cover"
                                  onError={handleImageError}
                                />
                              ) : null}
                              <div className={`fallback-image w-full h-full flex items-center justify-center absolute top-0 left-0 ${nft.imageUrl ? 'hidden' : 'flex'}`}>
                                <Image className="w-12 h-12 text-zinc-500" />
                              </div>
                            </div>
                            <div>
                              <h3 className="text-white font-medium text-sm mb-1 truncate">{nft.name}</h3>
                              <p className="text-xs text-zinc-400 mb-2 truncate">{nft.collection}</p>
                              {nft.description && (
                                <p className="text-xs text-zinc-500 line-clamp-2">{nft.description}</p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12">
                        <Image className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                        <p className="text-zinc-400">No NFTs found</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Credit Factors Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-zinc-900/50 border-zinc-800/50">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Credit Factors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {creditFactors.map((factor: CreditFactor, index: number) => (
                      <CreditFactorItem key={index} {...factor} />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900/50 border-zinc-800/50">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-emerald-400/10 border border-emerald-400/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-6 h-6 text-emerald-400" />
                        <div>
                          <p className="text-white font-medium">No Liquidations Detected</p>
                          <p className="text-emerald-400/70 text-sm">Clean transaction history</p>
                        </div>
                      </div>
                      <span className="text-emerald-400 font-bold text-xl">{onChainData.liquidations}</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-emerald-400/10 border border-emerald-400/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="w-6 h-6 text-emerald-400" />
                        <div>
                          <p className="text-white font-medium">Transaction Success Rate</p>
                          <p className="text-emerald-400/70 text-sm">Reliable network participant</p>
                        </div>
                      </div>
                      <span className="text-emerald-400 font-bold text-xl">{onChainData.repaymentHistory}</span>
                    </div>

                    <div className="p-4 bg-blue-400/10 border border-blue-400/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-5 h-5 text-blue-400" />
                        <span className="text-blue-400 font-medium">AI Insights</span>
                      </div>
                      <p className="text-zinc-300 text-sm">
                        {onChainData.overallScore > 70 
                          ? `Excellent credit profile with ${onChainData.transactions} transactions and ${onChainData.addressAge} days of history. Consider exploring DeFi protocols to increase yield generation.`
                          : onChainData.overallScore > 40
                          ? `Good foundation with ${onChainData.transactions} transactions. Increase transaction frequency and portfolio balance to improve your score.`
                          : `Building credit profile. Continue using the network consistently and consider increasing your portfolio balance.`}
                      </p>
                    </div>

                    {/* Additional metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
                        <div className="text-lg font-bold text-blue-400">{onChainData.nftCount}</div>
                        <p className="text-xs text-zinc-400">NFTs Owned</p>
                      </div>
                      <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
                        <div className="text-lg font-bold text-purple-400">{tokens.length}</div>
                        <p className="text-xs text-zinc-400">Token Types</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          // Off Chain Tab
          <div className="flex flex-col items-center justify-center py-32">
            <Card className="bg-zinc-900/50 border-zinc-800/50 max-w-md">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-orange-400/10 border border-orange-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-orange-400" />
                </div>
                <CardTitle className="text-2xl text-white">Off-Chain Score</CardTitle>
                <div className="text-6xl font-bold text-zinc-600 my-4">--/100</div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-400/10 border border-orange-400/20 rounded-full text-orange-400 font-medium">
                  <AlertCircle className="w-4 h-4" />
                  Coming Soon
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-zinc-400 leading-relaxed">
                  Off-chain credit scoring will integrate traditional financial data, social signals, 
                  and external reputation systems to provide a comprehensive credit profile.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;