'use client'

import React from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { FeaturedCollectionSection } from "./sections/FeaturedCollectionSection";
import { FooterSection } from "./sections/FooterSection";
import { HeroSection } from "./sections/HeroSection";
import { HowItWorksSection } from "./sections/HowItWorksSection";
import { IntroductionSection } from "./sections/IntroductionSection";
import { MainContentSection } from "./sections/MainContentSection";
import { MeetTheTeamSection } from "./sections/MeetTheTeamSection";
import { UseCasesSection } from "./sections/UseCasesSection";
import { HeroHeader } from "@/components/header";

export const Home = (): React.ReactElement => {
  // Create a grid pattern for the background
  const gridCells = Array(288).fill(null);

  return (
    <>
      <HeroHeader />
      <div className="flex flex-col items-center relative bg-[#110e11] min-h-screen w-full">
        {/* Background grid pattern */}
        <div className="flex flex-wrap w-full items-start absolute top-0 left-0 z-0">
          {gridCells.map((_, index) => (
            <div
              key={`grid-cell-${index}`}
              className="relative w-20 h-20 border border-solid border-[#ffffff0a]"
            />
          ))}
          <div className="absolute w-full h-full top-0 left-0 bg-[linear-gradient(90deg,rgba(17,14,17,0)_0%,rgba(17,14,17,1)_33%,rgba(17,14,17,1)_66%,rgba(17,14,17,0)_100%)]" />
        </div>

        {/* Glow effect */}
        <div className="absolute w-[1000px] h-[200px] top-[-100px] left-1/2 transform -translate-x-1/2 bg-[#3e4654] rounded-[500px/100px] blur-[300px]" />

        {/* Content sections - Added padding-top to account for fixed header */}
        <div className="relative z-10 flex flex-col items-center w-full gap-20 pt-20">
                  <HeroSection />

        <Separator className="w-20">
          <div className="flex w-full items-center justify-center">
            <Image
              className="w-[79.78px] h-[18.82px]"
              alt="Vector"
              src="/figmaAssets/vector-6.svg"
              width={80}
              height={19}
            />
          </div>
        </Separator>

                <IntroductionSection />

        <Separator className="w-20">
          <div className="flex w-full items-center justify-center">
            <Image
              className="w-[79.78px] h-[18.82px]"
              alt="Vector"
              src="/figmaAssets/vector-6.svg"
              width={80}
              height={19}
            />
          </div>
        </Separator>

        <Image
          className="w-full max-w-[1194.67px]"
          alt="Section"
          src="/figmaAssets/section.svg"
          width={1195}
          height={200}
                />

        <Separator className="w-20">
          <div className="flex w-full items-center justify-center">
            <Image
              className="w-[79.78px] h-[18.82px]"
              alt="Vector"
              src="/figmaAssets/vector-6.svg"
              width={80}
              height={19}
            />
          </div>
        </Separator>

                <MainContentSection />

        <Separator className="w-20">
          <div className="flex w-full items-center justify-center">
            <Image
              className="w-[79.78px] h-[18.82px]"
              alt="Vector"
              src="/figmaAssets/vector-6.svg"
              width={80}
              height={19}
            />
          </div>
        </Separator>

                <FeaturedCollectionSection />

        <Separator className="w-20">
          <div className="flex w-full items-center justify-center">
            <Image
              className="w-[79.78px] h-[18.82px]"
              alt="Vector"
              src="/figmaAssets/vector-6.svg"
              width={80}
              height={19}
            />
          </div>
        </Separator>

                <UseCasesSection />

        <Separator className="w-20">
          <div className="flex w-full items-center justify-center">
            <Image
              className="w-[79.78px] h-[18.82px]"
              alt="Vector"
              src="/figmaAssets/vector-9.svg"
              width={80}
              height={19}
            />
          </div>
        </Separator>

                <HowItWorksSection />

        <Separator className="w-20">
          <div className="flex w-full items-center justify-center">
            <Image
              className="w-[79.78px] h-[18.82px]"
              alt="Vector"
              src="/figmaAssets/vector-9.svg"
              width={80}
              height={19}
            />
          </div>
        </Separator>

        <MeetTheTeamSection />
          <FooterSection />
        </div>
      </div>
    </>
  );
};