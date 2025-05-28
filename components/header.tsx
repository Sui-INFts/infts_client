"use client";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import React from "react";
import Logo from "../assets/logo/Logo.png"
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const menuItems = [
  { name: "Home", href: "/" },
  { name: "All INFTs", href: "/comingsoon" },
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
    <header>
      <nav
        data-state={menuState && "active"}
        className="bg-background/50 fixed z-20 w-full border-b backdrop-blur-3xl"
      >
        <div className="mx-auto max-w-6xl px-6 transition-all duration-300">
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">            <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
              <div className="flex items-center gap-8">
                <Link
                  href="/"
                  aria-label="home"
                  className="flex items-center space-x-2"
                >
                  <Image
                    className="h-6 w-6" 
                    src={Logo}
                    alt="Logo"
                    height={32}
                    width={32}
                  />
                </Link>

                <div className="hidden lg:block">
                  <ul className="flex gap-8 text-sm">
                    {menuItems.map((item, index) => (
                      <li key={index}>
                        <Link
                          href={item.href}
                          className="text-muted-foreground hover:text-accent-foreground block duration-150"
                        >
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState == true ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
            </div>

            <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <ConnectButton className="text-xs md:text-sm bg-white text-black shadow-md hover:text-white" />
                {account ? (
                  <Button 
                    variant="outline" 
                    className="p-0 h-12 w-12 rounded-full overflow-hidden border-0"
                    style={{
                      background: `linear-gradient(135deg, ${gradientColors.start}, ${gradientColors.end})`,
                    }}
                    onClick={handleProfile}
                  >
                  </Button>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};