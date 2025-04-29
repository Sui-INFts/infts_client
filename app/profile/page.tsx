"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useDisconnectWallet, useCurrentAccount } from "@mysten/dapp-kit";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ConnectButton } from "@mysten/dapp-kit";
import { Logo } from "@/components/logo";

export default function Profile() {
  const router = useRouter();
  const account = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();

  const handleDisconnect = () => {
    disconnect();
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-background py-16">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="flex flex-row items-center gap-6 border-b pb-6">
          <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-fuchsia-700 shadow-lg">
            <Logo className="w-16 h-16 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle>
              {account ? (
                <span className="text-3xl font-bold mb-1">
                  {account.address.slice(0, 7)}...{account.address.slice(-4)}
                </span>
              ) : (
                <span className="text-muted-foreground">Connect your SUI wallet</span>
              )}
            </CardTitle>
            <div className="mt-2">
              {account ? (
                <Button size="sm" variant="destructive" onClick={handleDisconnect}>
                  Disconnect
                </Button>
              ) : (
                <ConnectButton className="text-xs md:text-sm bg-primary text-primary-foreground shadow-md hover:bg-primary/90" />
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 border-b mb-6 pb-2">
            {['Collected', 'Offers made', 'Deals', 'Created', 'Favorited', 'Activity', 'More'].map(tab => (
              <Button key={tab} variant="ghost" className="rounded px-4 py-2 text-base font-medium">
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
        </CardContent>
      </Card>
    </div>
  );
} 