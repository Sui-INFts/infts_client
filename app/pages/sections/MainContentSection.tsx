import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";

export const MainContentSection = (): React.ReactElement => {
  const [visibleCards, setVisibleCards] = useState(new Set());
  const [isLoaded, setIsLoaded] = useState(false);
  const sectionRef = useRef(null);

  // Data for the feature cards with enhanced styling
  const featureCards = [
    {
      icon: "🎨", // Using emoji as fallback for SVG
      title: "Mint",
      description: "A user mint an INFT.",
      gradient: "from-blue-400 to-cyan-500",
      glowColor: "blue",
    },
    {
      icon: "🤖", // Using emoji as fallback for SVG
      title: "Interact",
      description: "The user interacts with the AI by leveraging the Atoma network.",
      gradient: "from-purple-400 to-pink-500",
      glowColor: "purple",
    },
    {
      icon: "⚡", // Using emoji as fallback for SVG
      title: "Generation",
      description: "NFT is created and updated via a smart contract.",
      gradient: "from-green-400 to-emerald-500",
      glowColor: "green",
    },
  ];

  useEffect(() => {
    setIsLoaded(true);
    
    // Stagger card animations
    featureCards.forEach((_, index) => {
      setTimeout(() => {
        setVisibleCards(prev => new Set([...prev, index]));
      }, index * 300);
    });

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-slideInUp');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const FloatingElement = ({ 
    className, 
    color, 
    delay = 0, 
    size = "w-4 h-4" 
  }: {
    className: string;
    color: string;
    delay?: number;
    size?: string;
  }) => (
    <div 
      className={`absolute ${className} ${size} opacity-0 ${isLoaded ? 'animate-fadeIn' : ''}`}
      style={{
        animation: `fadeIn 1s ease-out ${delay}s forwards, float 6s ease-in-out infinite`,
        animationDelay: `${delay}s, ${delay + 1}s`
      }}
    >
      <div className={`w-full h-full bg-gradient-to-br ${color} rounded-full shadow-lg`}></div>
    </div>
  );

  const ProcessArrow = ({ index }: { index: number }) => (
    <div 
      className={`
        hidden lg:flex items-center justify-center 
        absolute top-1/2 transform -translate-y-1/2
        transition-all duration-1000 ease-out
        ${visibleCards.has(index) ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
      `}
      style={{
        left: `${33.33 * (index + 1) - 8.33}%`,
        animationDelay: `${(index + 1) * 0.3}s`
      }}
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-0.5 bg-gradient-to-r from-white/40 to-white/20 rounded-full"></div>
        <div className="w-3 h-3 border-r-2 border-b-2 border-white/40 transform rotate-[-45deg]"></div>
      </div>
    </div>
  );

  return (
    <>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px) scale(0.8); }
          to { opacity: 0.6; transform: translateY(0) scale(1); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(60px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8) translateY(40px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-slideInUp {
          animation: slideInUp 0.8s ease-out forwards;
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.8s ease-out forwards;
        }
        .shimmer-border {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }
        .card-glow-blue { box-shadow: 0 0 30px rgba(59, 130, 246, 0.3); }
        .card-glow-purple { box-shadow: 0 0 30px rgba(147, 51, 234, 0.3); }
        .card-glow-green { box-shadow: 0 0 30px rgba(34, 197, 94, 0.3); }
      `}</style>
      
      <section 
        ref={sectionRef}
        className="flex flex-col w-full max-w-7xl mx-auto items-center gap-12 sm:gap-16 lg:gap-20 py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      >
        
        {/* Header Section */}
        <div className={`
          flex flex-col items-center justify-center text-center max-w-4xl
          transition-all duration-1000 ${isLoaded ? 'animate-slideInUp' : 'opacity-0'}
        `}>
          <div className="relative mb-6">
            <h2 className="font-['Montserrat',Helvetica] font-bold text-white text-2xl sm:text-3xl lg:text-4xl xl:text-5xl mb-4">
              How It Works
            </h2>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
          </div>
          <p className="font-['Montserrat',Helvetica] text-[#ffffffa3] text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl">
            Experience the future of interactive NFTs through our seamless three-step process
          </p>
        </div>

        {/* Content Container */}
        <div className="relative w-full">
          
          {/* Floating Decorative Elements */}
          <FloatingElement 
            className="top-0 left-8 sm:left-16 lg:left-24" 
            color="from-blue-400 to-cyan-500" 
            delay={0.5} 
            size="w-3 h-3 sm:w-4 sm:h-4"
          />
          <FloatingElement 
            className="top-32 sm:top-40 -left-4 sm:-left-8" 
            color="from-purple-400 to-pink-500" 
            delay={1} 
            size="w-5 h-5 sm:w-7 sm:h-7"
          />
          <FloatingElement 
            className="top-32 sm:top-40 -right-4 sm:-right-8" 
            color="from-green-400 to-emerald-500" 
            delay={1.5} 
            size="w-4 h-4 sm:w-6 sm:h-6"
          />
          <FloatingElement 
            className="bottom-8 left-1/2 transform -translate-x-1/2" 
            color="from-orange-400 to-red-500" 
            delay={2} 
            size="w-2 h-2 sm:w-3 sm:h-3"
          />

          {/* Process Flow Arrows (Desktop only) */}
          {featureCards.slice(0, -1).map((_, index) => (
            <ProcessArrow key={`arrow-${index}`} index={index} />
          ))}

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 relative">
            {featureCards.map((card, index) => (
              <Card
                key={index}
                className={`
                  group relative overflow-hidden
                  rounded-2xl sm:rounded-3xl 
                  border border-solid border-[#e7e7e740] 
                  bg-gradient-to-br from-[#ffffff08] to-[#ffffff02]
                  backdrop-blur-sm
                  hover:border-[#e7e7e780] hover:card-glow-${card.glowColor}
                  hover:scale-105 hover:-translate-y-2
                  transition-all duration-700 ease-out
                  cursor-pointer
                  ${visibleCards.has(index) ? 'animate-scaleIn' : 'opacity-0'}
                `}
                style={{
                  animationDelay: `${index * 0.3}s`
                }}
              >
                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 shimmer-border opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl sm:rounded-3xl"></div>
                
                {/* Step Number */}
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                  <div className={`
                    w-8 h-8 sm:w-10 sm:h-10 rounded-full 
                    bg-gradient-to-br ${card.gradient}
                    flex items-center justify-center
                    text-white font-bold text-sm sm:text-base
                    shadow-lg group-hover:shadow-xl
                    transition-all duration-500
                    group-hover:rotate-12 group-hover:scale-110
                  `}>
                    {index + 1}
                  </div>
                </div>

                <CardContent className="flex flex-col items-start gap-6 sm:gap-8 lg:gap-10 p-6 sm:p-8 lg:p-10">
                  
                  {/* Icon Container */}
                  <div className={`
                    relative w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20
                    rounded-2xl bg-gradient-to-br ${card.gradient}
                    flex items-center justify-center
                    shadow-lg group-hover:shadow-xl
                    transition-all duration-500
                    group-hover:rotate-12 group-hover:scale-110
                  `}>
                    <span className="text-2xl sm:text-3xl lg:text-4xl filter drop-shadow-lg">
                      {card.icon}
                    </span>
                    <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex flex-col items-start gap-4 sm:gap-6 w-full">
                    <h3 className={`
                      font-['Montserrat',Helvetica] font-bold text-white 
                      text-xl sm:text-2xl lg:text-3xl xl:text-[28px] 
                      leading-tight group-hover:text-blue-100 
                      transition-colors duration-300
                    `}>
                      {card.title}
                    </h3>
                    
                    {/* Animated divider */}
                    <div className={`
                      w-12 h-1 bg-gradient-to-r ${card.gradient} rounded-full
                      group-hover:w-20 transition-all duration-500
                    `}></div>
                    
                    <p className={`
                      font-['Montserrat',Helvetica] font-normal 
                      text-[#ffffffa3] group-hover:text-[#ffffffcc]
                      text-sm sm:text-base lg:text-lg leading-relaxed
                      transition-colors duration-300
                    `}>
                      {card.description}
                    </p>
                  </div>
                </CardContent>
                
                {/* Subtle glow effect */}
                <div className={`
                  absolute inset-0 bg-gradient-to-br ${card.gradient.replace('400', '500/5').replace('500', '600/5')} 
                  rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700
                `}></div>
              </Card>
            ))}
          </div>

          {/* Process Flow Line (Mobile) */}
          <div className="lg:hidden flex flex-col items-center mt-8 sm:mt-12">
            <div className="flex flex-col items-center gap-4">
              {[0, 1].map(index => (
                <div 
                  key={`mobile-arrow-${index}`}
                  className={`
                    flex flex-col items-center gap-2
                    transition-all duration-1000 ease-out
                    ${visibleCards.has(index + 1) ? 'opacity-100' : 'opacity-0'}
                  `}
                  style={{ animationDelay: `${(index + 1) * 0.3}s` }}
                >
                  <div className="w-0.5 h-8 bg-gradient-to-b from-white/40 to-white/20 rounded-full"></div>
                  <div className="w-3 h-3 border-b-2 border-r-2 border-white/40 transform rotate-45"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className={`
          flex items-center justify-center gap-3 mt-8 sm:mt-12
          transition-all duration-1000 ${isLoaded ? 'opacity-60' : 'opacity-0'}
        `}>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
          <div className="w-1 h-1 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '0.9s'}}></div>
        </div>
      </section>
    </>
  );
};