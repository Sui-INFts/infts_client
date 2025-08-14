import { Check } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const UseCasesSection = (): React.ReactElement => {
  const [visibleCards, setVisibleCards] = useState(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  // Define use case data for mapping
  const useCases = [
    {
      id: 1,
      title: "Credit & Lending",
      gradient:
        "bg-[linear-gradient(135deg,rgba(21,192,234,1)_0%,rgba(80,126,223,1)_100%)]",
      points: [
        {
          text: (
            <>
              <span className="text-[#ffffffa3]">INFTs act as </span>
              <span className="font-medium text-white">
                soulbound credit agents.
              </span>
            </>
          ),
        },
        {
          text: "Credit scores evolve via on-chain transactions and behavioral tasks.",
        },
        {
          text: (
            <>
              <span className="text-[#ffffffa3]">
                Lending dApps can plug into INFT&apos;s API to make{" "}
              </span>
              <span className="font-medium text-white">
                automated loan decisions.
              </span>
            </>
          ),
        },
      ],
    },
    {
      id: 3,
      title: "AI Wallet Agents",
      gradient:
        "bg-[linear-gradient(134deg,rgba(249,96,107,1)_0%,rgba(232,54,63,1)_100%)]",
      points: [
        {
          text: (
            <>
              <span className="text-[#ffffffa3]">Each INFT can act as a </span>
              <span className="font-medium text-white">
                smart wallet companion.
              </span>
            </>
          ),
        },
        {
          text: "AI evaluates risk, optimizes DeFi strategies, and even offers personalized tips.",
        },
      ],
    },
    {
      id: 4,
      title: "SocialFi & Missions",
      gradient:
        "bg-[linear-gradient(134deg,rgba(38,225,88,1)_0%,rgba(1,146,49,1)_100%)]",
      points: [
        {
          text: "Protocols can onboard users through tiered INFT missions.",
        },
        {
          text: (
            <>
              <span className="text-[#ffffffa3]">Users complete </span>
              <span className="font-medium text-white">engagement tasks</span>
              <span className="text-[#ffffffa3]">
                {" "}
                (e.g., staking, quizzes) to level up their INFTs.
              </span>
            </>
          ),
        },
      ],
    },
  ];

  useEffect(() => {
    setIsLoaded(true);
    
    // Stagger card animations
    useCases.forEach((_, index) => {
      setTimeout(() => {
        setVisibleCards(prev => new Set([...prev, index]));
      }, index * 200);
    });
  }, []);

  const FloatingElement = ({ className, delay = 0 }: { className: string; delay?: number }) => (
    <div 
      className={`absolute ${className}`}
      style={{
        animation: `float 6s ease-in-out infinite`,
        animationDelay: `${delay}s`
      }}
    >
      <div className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-60"></div>
    </div>
  );

  return (
    <>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.6s ease-out forwards;
        }
        .shimmer-border {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>
      
      <section className="flex flex-col items-center gap-12 sm:gap-16 lg:gap-20 py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto relative overflow-hidden">
        
        {/* Floating Elements */}
        <FloatingElement className="top-10 left-4 sm:left-8" delay={0} />
        <FloatingElement className="top-32 right-6 sm:right-12" delay={1} />
        <FloatingElement className="bottom-20 left-8 sm:left-16" delay={2} />
        <FloatingElement className="bottom-32 right-4 sm:right-8" delay={3} />
        
        {/* Header */}
        <div 
          className={`flex flex-col gap-4 sm:gap-6 max-w-4xl items-center justify-center text-center transition-all duration-1000 ${
            isLoaded ? 'animate-fadeInUp' : 'opacity-0'
          }`}
        >
          <div className="relative">
            <h2 className="font-['Montserrat',Helvetica] font-bold text-white text-2xl sm:text-3xl lg:text-4xl mb-4 sm:mb-6">
              Endless Possibilities
            </h2>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
          </div>
          <p className="font-['Montserrat',Helvetica] font-medium text-[#ffffffa3] text-sm sm:text-base lg:text-lg leading-relaxed">
            INFTs are versatile and programmable.
            <br className="hidden sm:block" />
            <span className="block sm:inline"> Here&apos;s how developers, protocols, and users can utilize them:</span>
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 w-full">
          {useCases.map((useCase, index) => (
            <Card
              key={useCase.id}
              className={`
                group relative overflow-hidden
                flex flex-col items-start gap-6 sm:gap-8 lg:gap-10 
                p-6 sm:p-8 lg:p-10
                rounded-2xl sm:rounded-3xl lg:rounded-[32px] 
                border border-solid border-[#fcfcfc57] 
                bg-gradient-to-br from-[#ffffff08] to-[#ffffff02]
                backdrop-blur-sm
                hover:border-[#fcfcfc80] hover:shadow-2xl hover:shadow-blue-500/10
                hover:scale-105 hover:-translate-y-2
                transition-all duration-700 ease-out
                cursor-pointer
                ${visibleCards.has(index) ? 'animate-scaleIn' : 'opacity-0'}
              `}
              style={{
                animationDelay: `${index * 0.2}s`
              }}
            >
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 shimmer-border opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl sm:rounded-3xl lg:rounded-[32px]"></div>
              
              {/* Gradient Icon */}
              <div 
                className={`
                  relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 
                  rounded-2xl sm:rounded-[20px] lg:rounded-[24px] 
                  ${useCase.gradient}
                  shadow-lg group-hover:shadow-xl
                  transition-all duration-500
                  group-hover:rotate-12 group-hover:scale-110
                `}
              >
                <div className="absolute inset-0 bg-white/20 rounded-2xl sm:rounded-[20px] lg:rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Title */}
              <h3 className="font-['Montserrat',Helvetica] font-bold text-white text-xl sm:text-2xl lg:text-3xl xl:text-[32px] leading-tight w-full group-hover:text-blue-100 transition-colors duration-300">
                {useCase.title}
              </h3>

              {/* Separator */}
              <Separator className="w-16 sm:w-20 h-px bg-gradient-to-r from-[#fcfcfc57] to-transparent group-hover:from-blue-400 group-hover:to-purple-500 transition-all duration-500" />

              {/* Points */}
              <CardContent className="flex flex-col items-start gap-4 sm:gap-6 p-0 w-full">
                {useCase.points.map((point, pointIndex) => (
                  <div 
                    key={pointIndex} 
                    className={`
                      flex items-start gap-3 sm:gap-4 w-full
                      transition-all duration-500 ease-out
                      ${visibleCards.has(index) ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}
                    `}
                    style={{
                      animationDelay: `${(index * 0.2) + (pointIndex * 0.1)}s`
                    }}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 group-hover:text-green-300 transition-colors duration-300" />
                    </div>
                    <p className="font-['Montserrat',Helvetica] text-sm sm:text-base leading-relaxed text-[#ffffffa3] group-hover:text-[#ffffffcc] transition-colors duration-300">
                      {point.text}
                    </p>
                  </div>
                ))}
              </CardContent>
              
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 rounded-2xl sm:rounded-3xl lg:rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </Card>
          ))}
        </div>

        {/* Bottom decorative elements - now responsive */}
        <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-4 sm:left-8 lg:left-16">
          <div 
            className="w-4 h-4 sm:w-6 sm:h-6 lg:w-7 lg:h-7 bg-gradient-to-br from-red-400 to-pink-500 rotate-45 opacity-60"
            style={{ animation: 'float 4s ease-in-out infinite' }}
          ></div>
        </div>
        
        <div className="absolute bottom-6 sm:bottom-8 lg:bottom-10 right-4 sm:right-8 lg:right-16">
          <div 
            className="w-3 h-3 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full opacity-60"
            style={{ animation: 'float 5s ease-in-out infinite reverse' }}
          ></div>
        </div>
        
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div 
            className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full opacity-40"
            style={{ animation: 'float 7s ease-in-out infinite', animationDelay: '1s' }}
          ></div>
        </div>
      </section>
    </>
  );
};