"use client";

import React from "react";
import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
import Image from "next/image";
import { HeroHeader } from "@/components/header";
import Herologo from "../assets/image/Hero0.png";
import HeroOne from "../assets/image/hero1.png";
import HeroTwo from "../assets/image/hero2.png";
import HeroThree from "../assets/image/hero3.png";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { useCurrentAccount } from "@mysten/dapp-kit";

export default function HeroSection() {
  const router = useRouter();
  const account = useCurrentAccount();
  
  return (
    <>
      <HeroHeader />
      <main className="overflow-x-hidden font-montserrat">
        <section className="relative">
          <div className="min-h-screen pb-12 pt-12 md:pb-16 lg:pb-24 lg:pt-44">
            <div className="relative mx-auto flex max-w-7xl flex-col px-6 lg:block">
              <div className="mx-auto max-w-2xl text-center lg:ml-0 lg:w-1/2 lg:text-left">
                <h1 className="mt-8 max-w-2xl text-balance text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-5xl lg:mt-16 xl:text-5xl">
                  <span className="italic">Intelligent NFTs</span> that Learn, Evolve and Remember You
                </h1>
                <p className="mt-8 max-w-2xl text-pretty text-xl leading-relaxed text-gray-600 dark:text-gray-300">
                  Unlocking a new era of personalized digital assets on Sui.
                </p>

                <div className="mt-8">
                {/* <ConnectButton className="text-xs md:text-sm bg-white text-black shadow-md hover:text-white" /> */}
                {account ? (
                     <Button 
                     size="lg" 
                     variant="default" 
                     onClick={() => router.push("/profile")} 
                     className="bg-primary text-primary-foreground h-11 w-48 shadow-md hover:shadow-lg transition-all duration-200"
                   >
                     <ArrowRight className="mr-2 h-4 w-4" />
                     Start Here
                   </Button>
                ) : (
                  <span>&nbsp;</span>
                )}
              
                </div>

                <div className="mt-12 flex flex-row items-center justify-center gap-8 lg:justify-start">
                  <Image
                    src={HeroOne}
                    alt="Abstract Object"
                    height="1500"
                    width="1000"
                    className="w-full max-w-xs transition-transform duration-300 hover:scale-105"
                  />
                  <Image
                    src={HeroTwo}
                    alt="Abstract Object"
                    height="1500" 
                    width="1000"
                    className="w-full max-w-xs transition-transform duration-300 hover:scale-105"
                  />
                  <Image
                    src={HeroThree}
                    alt="Abstract Object"
                    height="1500" 
                    width="1000"
                    className="w-full max-w-xs transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </div>
              <Image
                className="order-first mb-8 mx-auto h-90 w-full object-contain invert sm:h-72 lg:order-last lg:absolute lg:inset-0 lg:-right-200 lg:-top-60 lg:h-max lg:w-3/5 lg:object-contain dark:mix-blend-lighten dark:invert-0"
                src={Herologo}
                alt="Abstract Object"
                height="3000"
                width="2000"
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
