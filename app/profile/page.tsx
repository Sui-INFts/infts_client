"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { ConnectButton } from "@mysten/dapp-kit";
import { useSuiClient } from "@mysten/dapp-kit";
import { HeroHeader } from "@/components/header";
import { PlusCircle, Wallet } from "lucide-react";
import FooterSection from "@/components/footer";

function getStableSeed(address: string | null) {
  // Use the wallet address as seed if available, otherwise use a fixed fallback
  return address || "default-seed";
}

export default function Profile() {
  const router = useRouter();
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const [balance, setBalance] = React.useState<string>("0");
  const [suiPrice, setSuiPrice] = React.useState<number>(0);

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

  const handleCreateNFT = () => {
    router.push("/create");
  };

  const avatarSeed = getStableSeed(account?.address || null);
  const formattedBalance = balance ? (parseInt(balance) / 1e9).toFixed(2) : "0.00";
  const usdValue = balance ? ((parseInt(balance) / 1e9) * suiPrice).toFixed(2) : "0.00";

  return (
    <div className="min-h-screen w-full bg-black flex flex-col">
      <HeroHeader />
      {/* Profile Info Section */}
      <div className="max-w-5xl mx-auto px-4 pt-30 flex-1">
        <div className="flex flex-row items-center gap-8">
          <div className="w-32 h-32 rounded-full bg-black border-2 border-white flex items-center justify-center overflow-hidden">
            <img
              src={`https://api.dicebear.com/7.x/bottts/svg?seed=${avatarSeed}`}
              alt="Profile Avatar"
              className="w-28 h-28 object-cover"
            />
          </div>
          <div className="flex-1 text-left">
            <div className="text-3xl font-bold mb-1 text-white">
              <span>{account ? `${account.address.slice(0, 7)}...${account.address.slice(-4)}` : 'Wallet_Address'}</span>
            </div>
          </div>
          <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4 items-center">
            {account ? (
              <>
                <div className="flex items-center space-x-2 bg-zinc-900/50 px-4 py-2 rounded-lg border border-zinc-800 h-10">
                  <Wallet className="h-4 w-4 text-zinc-400" />
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-white">{formattedBalance} SUI</span>
                    <span className="text-sm text-zinc-400">|</span>
                    <span className="text-sm font-medium text-white">${usdValue}</span>
                  </div>
                </div>
                <Button 
                  size="lg" 
                  variant="default" 
                  onClick={handleCreateNFT} 
                  className="bg-primary text-primary-foreground h-10"
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
        {/* Tabs - Full width */}
        <div className="flex flex-wrap gap-2 border-b border-zinc-700 mb-6 mt-8 pb-2 w-full">
          {['Collected', 'Offers made', 'Deals', 'Created', 'Favorited', 'Activity', 'More'].map(tab => (
            <Button key={tab} variant="ghost" className="flex-1 min-w-[120px] rounded px-4 py-2 text-base font-medium text-white justify-center">
              {tab}
            </Button>
          ))}
        </div>
        {/* Filters/Search/Sort */}
        <div className="flex flex-wrap gap-2 items-center mb-8">
          <Button variant="outline" size="sm">Status</Button>
          <Button variant="outline" size="sm">Chains</Button>
          <input
            type="text"
            placeholder="Search by name"
            className="border rounded px-3 py-1 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            style={{ minWidth: 180 }}
          />
          <Button variant="outline" size="sm">Recently received</Button>
        </div>
        {/* Empty State */}
        <div className="text-center text-muted-foreground py-16">
          <p className="text-lg font-semibold mb-2">No items found for this search</p>
          <p className="text-sm">Try adjusting your filters or search terms.</p>
        </div>
      </div>
      <FooterSection />
    </div>
  );
}