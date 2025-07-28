"use client";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Wallet } from "lucide-react";
import React from "react";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    icon: "/figmaAssets/bold---essentional--ui---home-angle.svg",
    text: "Home",
    href: "/",
    active: true,
  },
  {
    icon: "/figmaAssets/bold---astronomy---star-circle-4.svg",
    text: "All NFTs",
    href: "/comingsoon",
    active: false,
  },
];

export const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false);
  const account = useCurrentAccount();
  const router = useRouter();

  const handleProfile = () => {
    router.push("/profile");
  };

  // Generate random gradient colors when component mounts
  const [gradientColors, setGradientColors] = React.useState({
    start: "#3b82f6",
    end: "#8b5cf6"
  });

  React.useEffect(() => {
    // Generate random colors for gradient on mount
    const colors = [
      "#3b82f6", // blue
      "#8b5cf6", // violet
      "#ec4899", // pink
      "#ef4444", // red
      "#f59e0b", // amber
      "#10b981", // emerald
    ];
    
    const start = colors[Math.floor(Math.random() * colors.length)];
    let end = colors[Math.floor(Math.random() * colors.length)];
    
    // Make sure end color is different from start
    while (end === start) {
      end = colors[Math.floor(Math.random() * colors.length)];
    }
    
    setGradientColors({ start, end });
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-sm">
      <nav className="flex items-center justify-between relative w-full px-4 py-4 lg:px-10 lg:py-6">
        
        {/* Desktop Layout - Show on lg and above */}
        <div className="hidden lg:flex w-full items-center justify-between">
          {/* Left Navigation */}
          <div className="flex w-[560px] items-center gap-9 relative">
            <div className="inline-flex items-start gap-10 relative">
              {navItems.map((item, index) => (
                <Link href={item.href} key={index}>
                  <div className="inline-flex items-start gap-2 relative cursor-pointer hover:opacity-80 transition-opacity">
                    <div className="inline-flex flex-col items-center justify-center gap-1 pt-1 pb-0 px-0 relative">
                      <Image
                        className="relative w-6 h-6"
                        alt={item.text}
                        src={item.icon}
                        width={24}
                        height={24}
                      />
                      {item.active && (
                        <div className="relative w-1.5 h-1.5 bg-white rounded-[3px]" />
                      )}
                    </div>
                    <div
                      className={`w-fit h-8 font-semibold ${item.active ? "text-white" : "text-[#ffffff66]"} text-base tracking-[-0.32px] leading-8 relative mt-[-1.00px] [font-family:'Montserrat',Helvetica] whitespace-nowrap`}
                    >
                      {item.text}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Search Bar */}
            <div className="gap-14 px-4 py-2 bg-[#ffffff0a] rounded-[44px] inline-flex items-center relative">
              <div className="gap-2 inline-flex items-center relative">
                <Image
                  className="relative w-5 h-5"
                  alt="Search"
                  src="/figmaAssets/bold---search---rounded-magnifer.svg"
                  width={20}
                  height={20}
                />
                <div className="relative w-fit mt-[-1.00px] [font-family:'Montserrat',Helvetica] font-semibold text-[#ffffff52] text-sm tracking-[-0.28px] leading-7 whitespace-nowrap">
                  Search NFTs ...
                </div>
              </div>
              <div className="relative w-5 h-5 rounded-[5px] overflow-hidden">
                <Image
                  className="absolute w-[18px] h-[13px] top-[3px] left-px"
                  alt="Vector"
                  src="/figmaAssets/vector-22.svg"
                  width={18}
                  height={13}
                />
              </div>
            </div>
          </div>

          {/* Logo */}
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image
              className="w-14 h-[55px] relative object-cover"
              alt="Logo"
              src="/figmaAssets/logo-1.png"
              width={56}
              height={55}
            />
          </Link>

          {/* Right Navigation */}
          <div className="flex w-[560px] items-center justify-end gap-4 relative">
            <ConnectButton 
              connectText={
                <div className="flex items-center px-4 py-2 bg-white rounded-[44px] text-[#3e4654] hover:bg-white/90 transition-colors">
                  <Image
                    className="w-5 h-5 mr-2"
                    alt="Wallet"
                    src="/figmaAssets/bold---money---wallet.svg"
                    width={20}
                    height={20}
                  />
                  <span className="[font-family:'Montserrat',Helvetica] font-semibold text-sm tracking-[-0.28px]">
                    Connect Wallet
                  </span>
                </div>
              }
            />

            {account && (
              <Button 
                variant="outline" 
                className="p-0 h-12 w-12 rounded-full overflow-hidden border-0"
                style={{
                  background: `linear-gradient(135deg, ${gradientColors.start}, ${gradientColors.end})`,
                }}
                onClick={handleProfile}
              >
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Layout - Show below lg (mobile, tablet) */}
        <div className="flex lg:hidden w-full items-center justify-between">
          {/* Left: Wallet Status */}
          <div className="flex items-center">
            {account ? (
              <Button 
                variant="outline" 
                className="p-0 h-10 w-10 rounded-full overflow-hidden border-2 border-green-400 relative"
                style={{
                  background: `linear-gradient(135deg, ${gradientColors.start}, ${gradientColors.end})`,
                }}
                onClick={handleProfile}
              >
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-[#110e11]"></div>
              </Button>
            ) : (
              <ConnectButton 
                connectText={
                  <div className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
                    <Wallet className="size-6" />
                  </div>
                }
              />
            )}
          </div>

          {/* Center: Logo */}
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image
              className="w-10 h-10 relative object-cover"
              alt="Logo"
              src="/figmaAssets/logo-1.png"
              width={40}
              height={40}
            />
          </Link>

          {/* Right: Hamburger Menu */}
          <button
            onClick={() => setMenuState(!menuState)}
            aria-label={menuState ? "Close Menu" : "Open Menu"}
            className="relative z-20 p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu className={`size-6 duration-200 ${menuState ? 'rotate-180 scale-0 opacity-0' : ''}`} />
            <X className={`absolute inset-2 size-6 duration-200 ${menuState ? 'rotate-0 scale-100 opacity-100' : '-rotate-180 scale-0 opacity-0'}`} />
          </button>
        </div>

        {/* Mobile Menu - Only show on mobile when menu is open */}
        {menuState && (
          <div className="absolute top-full left-0 right-0 bg-[#110e11]/95 backdrop-blur-md border-t border-[#ffffff0a] lg:hidden">
            <div className="flex flex-col p-6 space-y-6">
              {/* Account Info */}
              {account && (
                <div className="flex items-center gap-3 p-3 bg-[#ffffff0a] rounded-lg border border-green-400/20">
                  <div 
                    className="w-10 h-10 rounded-full border-2 border-green-400"
                    style={{
                      background: `linear-gradient(135deg, ${gradientColors.start}, ${gradientColors.end})`,
                    }}
                  ></div>
                  <div>
                    <p className="text-green-400 text-sm font-medium">Wallet Connected</p>
                    <p className="text-white/60 text-xs">
                      {account.address.slice(0, 6)}...{account.address.slice(-4)}
                    </p>
                  </div>
                </div>
              )}

              {/* Mobile Navigation Items */}
              <div className="space-y-4">
                {navItems.map((item, index) => (
                  <Link href={item.href} key={index} onClick={() => setMenuState(false)}>
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#ffffff0a] transition-colors">
                      <Image
                        className="w-5 h-5"
                        alt={item.text}
                        src={item.icon}
                        width={20}
                        height={20}
                      />
                      <span className="text-white font-medium">{item.text}</span>
                      {item.active && (
                        <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              {/* Mobile Search Bar */}
              <div className="gap-4 px-4 py-3 bg-[#ffffff0a] rounded-[44px] flex items-center">
                <Image
                  className="w-5 h-5"
                  alt="Search"
                  src="/figmaAssets/bold---search---rounded-magnifer.svg"
                  width={20}
                  height={20}
                />
                <input 
                  type="text" 
                  placeholder="Search NFTs ..." 
                  className="bg-transparent text-white placeholder-[#ffffff52] outline-none flex-1 text-sm [font-family:'Montserrat',Helvetica]"
                />
              </div>

              {/* Mobile Connect Wallet (if not connected) */}
              {!account && (
                <ConnectButton 
                  connectText={
                    <div className="flex items-center justify-center w-full px-4 py-3 bg-white rounded-[44px] text-[#3e4654]">
                      <Image
                        className="w-5 h-5 mr-2"
                        alt="Wallet"
                        src="/figmaAssets/bold---money---wallet.svg"
                        width={20}
                        height={20}
                      />
                      <span className="[font-family:'Montserrat',Helvetica] font-semibold text-sm">
                        Connect Wallet
                      </span>
                    </div>
                  }
                />
              )}

              {/* Mobile Profile Button (if connected) */}
              {account && (
                <Button 
                  variant="outline" 
                  className="w-full py-3 rounded-[44px] border-[#ffffff0a] text-white hover:bg-[#ffffff0a]"
                  onClick={() => {
                    handleProfile();
                    setMenuState(false);
                  }}
                >
                  View Profile
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};