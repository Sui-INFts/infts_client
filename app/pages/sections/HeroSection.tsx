import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export const HeroSection = (): React.ReactElement => {

  return (
    <section className="flex flex-col items-center justify-center min-h-screen gap-[80px] md:gap-[120px] pt-20 pb-10 px-4 md:px-10 relative self-stretch w-full">
      {/* Hero Content */}
      <div className="inline-flex flex-col items-center gap-6 relative animate-fade-in-up">
        <div className="relative w-fit mt-[-1.00px] [-webkit-text-stroke:1px_#ffffff] bg-[linear-gradient(134deg,rgba(249,195,96,1)_0%,rgba(232,122,54,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Montserrat',Helvetica] font-medium text-transparent text-sm md:text-sm text-center tracking-[-0.28px] leading-7 animate-pulse">
          Exciting
        </div>

        <h1 className="relative w-fit bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(153,153,153,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Montserrat',Helvetica] font-bold text-transparent text-[28px] sm:text-[36px] md:text-[48px] lg:text-[56px] text-center tracking-[-0.56px] md:tracking-[-1.12px] leading-[1.2] max-w-4xl px-4">
          Intelligent NFTs that Learn, Evolve and Remember You
        </h1>

        <p className="relative w-fit [font-family:'Montserrat',Helvetica] font-medium text-[#ffffffa3] text-sm md:text-base text-center tracking-[-0.28px] md:tracking-[-0.32px] leading-6 md:leading-8 max-w-2xl px-4">
          Unlocking a new era of personalized digital assets on Sui.
        </p>

        <Button className="px-6 py-3 bg-white rounded-[44px] text-[#3e4654] hover:bg-white/90 hover:scale-105 transition-all duration-300 animate-bounce-subtle">
          <span className="[font-family:'Montserrat',Helvetica] font-semibold text-sm tracking-[-0.28px] leading-7">
            Get Started
          </span>
          <Image
            className="w-6 h-6 ml-2 transition-transform group-hover:translate-x-1"
            alt="Arrow"
            src="/figmaAssets/outline---arrows---arrow-right-up.svg"
            width={24}
            height={24}
          />
        </Button>
      </div>

      {/* NFT Cards Showcase */}
      <div className="relative w-full">
        {/* Desktop: All cards */}
        <div className="hidden md:block relative w-full h-[600px] flex items-center justify-center overflow-visible">
          <div className="relative w-full max-w-[1200px] lg:max-w-[1400px] h-[520px] mx-auto">
            {/* Center card (Nova) - No rotation */}
            <Card
              className="w-96 h-[480px] pt-10 pb-0 px-10 absolute top-0 left-1/2 transform -translate-x-1/2 backdrop-blur-[10px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(10px)_brightness(100%)] bg-[linear-gradient(135deg,rgba(21,192,234,1)_0%,rgba(80,126,223,1)_100%)] flex flex-col items-center gap-10 rounded-[52px_52px_0px_0px] overflow-hidden border-0 hover:scale-105 transition-all duration-500 animate-float-0 z-20"
              style={{
                animationDelay: `0ms`,
              }}
            >
              <CardContent className="flex items-start justify-between relative self-stretch w-full p-0">
                <div className="flex flex-col w-[162px] items-start relative">
                  <div className="relative w-fit mt-[-1.00px] [font-family:'Montserrat',Helvetica] font-bold text-white text-[40px] text-center tracking-[-0.64px] leading-[normal]">
                    Nova
                  </div>
                  <div className="relative w-fit [font-family:'Montserrat',Helvetica] font-medium text-[#ffffffcc] text-base text-center tracking-[-0.32px] leading-[normal]">
                    🧿 Dream Runner
                  </div>
                </div>
                <div className="inline-flex items-center gap-1 pl-0 pr-2 py-0 relative bg-[#110e1166] rounded-[56px]">
                  <Image
                    className="relative w-9 h-9"
                    alt="Star rating"
                    src="/figmaAssets/bold---astronomy---star-circle-4.svg"
                    width={36}
                    height={36}
                  />
                  <div className="[font-family:'Montserrat',Helvetica] font-semibold text-white text-xl text-center tracking-[-0.24px] leading-[normal] relative w-fit">
                    4,7
                  </div>
                </div>
              </CardContent>
              <Image
                className="relative w-[420px] h-[380px] ml-[-50px] mr-[-50px] object-cover transition-transform hover:scale-110 duration-300"
                alt="Nova"
                src="/figmaAssets/rectangle-5.png"
                width={420}
                height={380}
              />
            </Card>

            {/* Left front card (Glint) - Rotated -5deg */}
            <Card
              className="w-80 h-[420px] pt-8 pb-0 px-8 absolute top-[69px] left-[250px] lg:left-[300px] rotate-[-5deg] backdrop-blur-[10px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(10px)_brightness(100%)] bg-[linear-gradient(134deg,rgba(249,96,107,1)_0%,rgba(232,54,63,1)_100%)] flex flex-col items-center gap-10 rounded-[52px_52px_0px_0px] overflow-hidden border-0 hover:scale-105 transition-all duration-500 animate-float-1 z-10"
              style={{
                animationDelay: `200ms`,
              }}
            >
              <CardContent className="flex items-start justify-between relative self-stretch w-full p-0">
                <div className="flex flex-col w-[162px] items-start relative">
                  <div className="relative w-fit mt-[-1.00px] [font-family:'Montserrat',Helvetica] font-bold text-white text-[32px] text-center tracking-[-0.64px] leading-[normal]">
                    Glint
                  </div>
                  <div className="relative w-fit [font-family:'Montserrat',Helvetica] font-medium text-[#ffffffcc] text-base text-center tracking-[-0.32px] leading-[normal]">
                    🧊 Frost Hacker
                  </div>
                </div>
                <div className="inline-flex items-center gap-1 pl-0 pr-2 py-0 relative bg-[#110e1166] rounded-[56px]">
                  <Image
                    className="relative w-[30.33px] h-[30.33px] mt-[-1.17px] mb-[-1.17px] ml-[-1.17px] rotate-[-5deg]"
                    alt="Star rating"
                    src="/figmaAssets/bold---astronomy---star-circle-3.svg"
                    width={30}
                    height={30}
                  />
                  <div className="[font-family:'Montserrat',Helvetica] font-semibold text-white text-sm text-center tracking-[-0.24px] leading-[normal] relative w-fit">
                    4,7
                  </div>
                </div>
              </CardContent>
              <Image
                className="relative w-[380px] h-[320px] ml-[-60px] mr-[-60px] rotate-[-5deg] object-cover transition-transform hover:scale-110 duration-300"
                alt="Glint"
                src="/figmaAssets/rectangle-6.png"
                width={380}
                height={320}
              />
            </Card>

            {/* Left back card (Vanta) - Rotated -10deg */}
            <Card
              className="w-[300px] h-[360px] pt-6 pb-0 px-8 absolute top-[138px] left-[100px] lg:left-[150px] rotate-[-10deg] backdrop-blur-[10px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(10px)_brightness(100%)] bg-[linear-gradient(134deg,rgba(38,225,88,1)_0%,rgba(1,146,49,1)_100%)] flex flex-col items-center gap-10 rounded-[52px_52px_0px_0px] overflow-hidden border-0 hover:scale-105 transition-all duration-500 animate-float-3 z-5"
              style={{
                animationDelay: `600ms`,
              }}
            >
              <CardContent className="flex items-start justify-between relative self-stretch w-full p-0">
                <div className="flex flex-col w-[162px] items-start relative">
                  <div className="relative w-fit mt-[-1.00px] [font-family:'Montserrat',Helvetica] font-bold text-white text-[32px] text-center tracking-[-0.64px] leading-[normal]">
                    Vanta
                  </div>
                  <div className="relative w-fit [font-family:'Montserrat',Helvetica] font-medium text-[#ffffffcc] text-base text-center tracking-[-0.32px] leading-[normal]">
                    🌀 Void Shepherd
                  </div>
                </div>
                <div className="inline-flex items-center gap-1 pl-0 pr-2 py-0 relative bg-[#110e1166] rounded-[56px]">
                  <Image
                    className="relative w-[27.8px] h-[27.8px] mt-[-1.90px] mb-[-1.90px] ml-[-1.90px] rotate-[-10deg]"
                    alt="Star rating"
                    src="/figmaAssets/bold---astronomy---star-circle-1.svg"
                    width={28}
                    height={28}
                  />
                  <div className="[font-family:'Montserrat',Helvetica] font-semibold text-white text-xs text-center tracking-[-0.24px] leading-[normal] relative w-fit">
                    4,7
                  </div>
                </div>
              </CardContent>
              <Image
                className="relative w-[360px] h-[280px] ml-[-50px] mr-[-50px] rotate-[-10deg] object-cover transition-transform hover:scale-110 duration-300"
                alt="Vanta"
                src="/figmaAssets/---.png"
                width={360}
                height={280}
              />
            </Card>

            {/* Right front card (Zynk) - Rotated +5deg */}
            <Card
              className="w-80 h-[420px] pt-8 pb-0 px-8 absolute top-16 right-[250px] lg:right-[300px] rotate-[5deg] backdrop-blur-[10px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(10px)_brightness(100%)] bg-[linear-gradient(134deg,rgba(249,195,96,1)_0%,rgba(232,122,54,1)_100%)] flex flex-col items-center gap-10 rounded-[52px_52px_0px_0px] overflow-hidden border-0 hover:scale-105 transition-all duration-500 animate-float-2 z-10"
              style={{
                animationDelay: `400ms`,
              }}
            >
              <CardContent className="flex items-start justify-between relative self-stretch w-full p-0">
                <div className="flex flex-col w-[162px] items-start relative">
                  <div className="relative w-fit mt-[-1.00px] [font-family:'Montserrat',Helvetica] font-bold text-white text-[32px] text-center tracking-[-0.64px] leading-[normal]">
                    Zynk
                  </div>
                  <div className="relative w-fit [font-family:'Montserrat',Helvetica] font-medium text-[#ffffffcc] text-base text-center tracking-[-0.32px] leading-[normal]">
                    🦾 Circuit Phantom
                  </div>
                </div>
                <div className="inline-flex items-center gap-1 pl-0 pr-2 py-0 relative bg-[#110e1166] rounded-[56px]">
                  <Image
                    className="relative w-[30.33px] h-[30.33px] mt-[-1.17px] mb-[-1.17px] ml-[-1.17px] rotate-[5deg]"
                    alt="Star rating"
                    src="/figmaAssets/bold---astronomy---star-circle.svg"
                    width={30}
                    height={30}
                  />
                  <div className="[font-family:'Montserrat',Helvetica] font-semibold text-white text-sm text-center tracking-[-0.24px] leading-[normal] relative w-fit">
                    3,5
                  </div>
                </div>
              </CardContent>
              <Image
                className="relative w-[380px] h-[320px] ml-[-60px] mr-[-60px] rotate-[5deg] object-cover transition-transform hover:scale-110 duration-300"
                alt="Zynk"
                src="/figmaAssets/rectangle-6-1.png"
                width={380}
                height={320}
              />
            </Card>

            {/* Right back card (Ember) - Rotated +10deg */}
            <Card
              className="w-[300px] h-[360px] pt-6 pb-0 px-8 absolute top-[127px] right-[100px] lg:right-[150px] rotate-[10deg] backdrop-blur-[10px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(10px)_brightness(100%)] bg-[linear-gradient(134deg,rgba(114,73,238,1)_0%,rgba(107,67,198,1)_100%)] flex flex-col items-center gap-10 rounded-[52px_52px_0px_0px] overflow-hidden border-0 hover:scale-105 transition-all duration-500 animate-float-4 z-5"
              style={{
                animationDelay: `800ms`,
              }}
            >
              <CardContent className="flex items-start justify-between relative self-stretch w-full p-0">
                <div className="flex flex-col w-[162px] items-start relative">
                  <div className="relative w-fit mt-[-1.00px] [font-family:'Montserrat',Helvetica] font-bold text-white text-[32px] text-center tracking-[-0.64px] leading-[normal]">
                    Ember
                  </div>
                  <div className="relative w-fit [font-family:'Montserrat',Helvetica] font-medium text-[#ffffffcc] text-base text-center tracking-[-0.32px] leading-[normal]">
                    🔥 Soul Igniter
                  </div>
                </div>
                <div className="inline-flex items-center gap-1 pl-0 pr-2 py-0 relative bg-[#110e1166] rounded-[56px]">
                  <Image
                    className="relative w-[27.8px] h-[27.8px] mt-[-1.90px] mb-[-1.90px] ml-[-1.90px] rotate-[10deg]"
                    alt="Star rating"
                    src="/figmaAssets/bold---astronomy---star-circle-2.svg"
                    width={28}
                    height={28}
                  />
                  <div className="[font-family:'Montserrat',Helvetica] font-semibold text-white text-xs text-center tracking-[-0.24px] leading-[normal] relative w-fit">
                    2,1
                  </div>
                </div>
              </CardContent>
              <Image
                className="relative w-[360px] h-[280px] ml-[-50px] mr-[-50px] rotate-[10deg] object-cover transition-transform hover:scale-110 duration-300"
                alt="Ember"
                src="/figmaAssets/alien-1.png"
                width={360}
                height={280}
              />
            </Card>
          </div>
        </div>

        {/* Mobile: Single centered card */}
        <div className="block md:hidden relative w-full h-[450px] flex items-center justify-center px-4">
          <Card
            className="w-full max-w-sm h-[400px] pt-8 pb-0 px-8 backdrop-blur-[10px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(10px)_brightness(100%)] bg-[linear-gradient(135deg,rgba(21,192,234,1)_0%,rgba(80,126,223,1)_100%)] flex flex-col items-center gap-8 rounded-[52px_52px_0px_0px] overflow-hidden border-0 animate-float-mobile hover:scale-105 transition-all duration-500"
          >
            <CardContent className="flex items-start justify-between relative self-stretch w-full p-0">
              <div className="flex flex-col items-start relative flex-1">
                <div className="relative w-fit mt-[-1.00px] [font-family:'Montserrat',Helvetica] font-bold text-white text-[28px] text-center tracking-[-0.56px] leading-[normal]">
                  Nova
                </div>
                <div className="relative w-fit [font-family:'Montserrat',Helvetica] font-medium text-[#ffffffcc] text-sm text-center tracking-[-0.28px] leading-[normal]">
                  🧿 Dream Runner
                </div>
              </div>
              <div className="inline-flex items-center gap-1 pl-0 pr-2 py-0 relative bg-[#110e1166] rounded-[56px]">
                <Image
                  className="relative w-8 h-8"
                  alt="Star rating"
                  src="/figmaAssets/bold---astronomy---star-circle-4.svg"
                  width={32}
                  height={32}
                />
                <div className="[font-family:'Montserrat',Helvetica] font-semibold text-white text-base text-center tracking-[-0.24px] leading-[normal] relative w-fit">
                  4,7
                </div>
              </div>
            </CardContent>
            <Image
              className="relative w-full h-[280px] object-cover transition-transform hover:scale-110 duration-300 rounded-b-none"
              alt="Nova"
              src="/figmaAssets/rectangle-5.png"
              width={320}
              height={280}
            />
          </Card>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-subtle {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-3px);
          }
          60% {
            transform: translateY(-2px);
          }
        }

        @keyframes float-0 {
          0%, 100% {
            transform: translateY(0px) rotate(-5deg);
          }
          50% {
            transform: translateY(-10px) rotate(-5deg);
          }
        }

        @keyframes float-1 {
          0%, 100% {
            transform: translateY(0px) rotate(-5deg);
          }
          50% {
            transform: translateY(-15px) rotate(-5deg);
          }
        }

        @keyframes float-2 {
          0%, 100% {
            transform: translateY(0px) rotate(5deg);
          }
          50% {
            transform: translateY(-12px) rotate(5deg);
          }
        }

        @keyframes float-3 {
          0%, 100% {
            transform: translateY(0px) rotate(-10deg);
          }
          50% {
            transform: translateY(-8px) rotate(-10deg);
          }
        }

        @keyframes float-4 {
          0%, 100% {
            transform: translateY(0px) rotate(10deg);
          }
          50% {
            transform: translateY(-14px) rotate(10deg);
          }
        }

        @keyframes float-mobile {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 2s infinite;
        }

        .animate-float-0 {
          animation: float-0 6s ease-in-out infinite;
        }

        .animate-float-1 {
          animation: float-1 5s ease-in-out infinite;
        }

        .animate-float-2 {
          animation: float-2 7s ease-in-out infinite;
        }

        .animate-float-3 {
          animation: float-3 5.5s ease-in-out infinite;
        }

        .animate-float-4 {
          animation: float-4 6.5s ease-in-out infinite;
        }

        .animate-float-mobile {
          animation: float-mobile 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};