import React from "react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
import Image from "next/image";
import { HeroHeader } from "@/components/hero8-header";
import Herologo from "../assets/image/Hero0.png";
import HeroOne from "../assets/image/hero1.png";
import HeroTwo from "../assets/image/hero2.png";
import HeroThree from "../assets/image/hero3.png";



export default function HeroSection() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-x-hidden">
        <section>
          <div className="min-h-screen pb-24 pt-12 md:pb-32 lg:pb-56 lg:pt-44">
            <div className="relative mx-auto flex max-w-6xl flex-col px-6 lg:block">
              <div className="mx-auto max-w-lg text-center lg:ml-0 lg:w-1/2 lg:text-left">
                <h1 className="mt-8 max-w-2xl text-balance text-5xl font-medium md:text-6xl lg:mt-16 xl:text-6xl">
                Intelligent NFTs that Learn, Evolve and remember you
                </h1>
                <p className="mt-8 max-w-2xl text-pretty text-lg">
                unlocking a new era of personalized digital assets on Sui.
                </p>

                <div className="mt-0 flex flex-row items-center">
                  <Image
                    src={HeroOne}
                    alt="Abstract Object"
                    height="1500"
                    width="1000"
                    className="w-full max-w-sm"
                  />
                  <Image
                    src={HeroTwo}
                    alt="Abstract Object"
                    height="1500" 
                    width="1000"
                    className="w-full max-w-sm"
                  />
                  <Image
                    src={HeroThree}
                    alt="Abstract Object"
                    height="1500" 
                    width="1000"
                    className="w-full max-w-sm"
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
