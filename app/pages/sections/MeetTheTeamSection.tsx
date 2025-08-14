import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const MeetTheTeamSection = (): React.ReactElement => {
  const [email, setEmail] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Decorative elements data with responsive positioning
  const decorativeElements = [
    {
      className: "absolute w-3 h-3 sm:w-4 sm:h-4 top-8 sm:top-12 left-8 sm:left-16 lg:left-24",
      gradient: "from-blue-400 to-cyan-500",
      delay: 0,
    },
    {
      className: "absolute w-6 h-6 sm:w-8 sm:h-8 top-16 sm:top-24 left-16 sm:left-32 lg:left-48",
      gradient: "from-purple-400 to-pink-500",
      delay: 1,
    },
    {
      className: "absolute w-4 h-4 sm:w-6 sm:h-6 top-8 sm:top-12 right-8 sm:right-16 lg:right-24",
      gradient: "from-green-400 to-emerald-500",
      delay: 2,
    },
    {
      className: "absolute w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 top-20 sm:top-32 right-12 sm:right-20 lg:right-32",
      gradient: "from-orange-400 to-red-500",
      delay: 3,
    },
  ];

  const handleSubscribe = () => {
    if (email) {
      // Handle subscription logic here
      console.log("Subscribing with email:", email);
      setEmail("");
    }
  };

  const FloatingElement = ({ 
    className, 
    gradient, 
    delay 
  }: {
    className: string;
    gradient: string;
    delay: number;
  }) => (
    <div 
      className={`${className} opacity-0 ${isLoaded ? 'animate-fadeIn' : ''}`}
      style={{
        animation: `fadeIn 1s ease-out ${delay * 0.3}s forwards, float 6s ease-in-out infinite`,
        animationDelay: `${delay * 0.3}s, ${delay * 0.3 + 1}s`
      }}
    >
      <div className={`w-full h-full bg-gradient-to-br ${gradient} rounded-full shadow-lg`}></div>
    </div>
  );

  return (
    <>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(180deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px) scale(0.8); }
          to { opacity: 0.6; transform: translateY(0) scale(1); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
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
        .shimmer-bg {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }
      `}</style>
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card 
          className={`
            relative w-full 
            p-6 sm:p-8 lg:p-12 xl:p-16
            rounded-2xl sm:rounded-3xl lg:rounded-[32px] 
            border border-solid border-[#f3f3f340] 
            bg-gradient-to-br from-[#ffffff08] to-[#ffffff02]
            backdrop-blur-sm
            hover:border-[#f3f3f360] hover:shadow-2xl hover:shadow-purple-500/10
            transition-all duration-700 ease-out
            overflow-hidden
            ${isLoaded ? 'animate-slideInUp' : 'opacity-0'}
          `}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Shimmer effect overlay */}
          <div className={`absolute inset-0 shimmer-bg opacity-0 ${isHovered ? 'opacity-100' : ''} transition-opacity duration-500 rounded-2xl sm:rounded-3xl lg:rounded-[32px]`}></div>
          
          {/* Decorative floating elements */}
          {decorativeElements.map((element, index) => (
            <FloatingElement
              key={`decorative-element-${index}`}
              className={element.className}
              gradient={element.gradient}
              delay={element.delay}
            />
          ))}
          
          <CardContent className="relative p-0 z-10">
            <div className="flex flex-col items-center justify-center max-w-4xl mx-auto">
              
              {/* Header Section */}
              <div className="text-center mb-8 sm:mb-10 lg:mb-12">
                <div className="relative inline-block mb-4">
                  <h2 className="font-['Montserrat',Helvetica] font-bold text-white text-xl sm:text-2xl lg:text-3xl xl:text-4xl mb-2">
                    Stay in the Loop
                  </h2>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"></div>
                </div>
                <p 
                  className={`
                    text-center font-medium text-sm sm:text-base lg:text-lg 
                    text-[#ffffffa3] tracking-[-0.32px] leading-relaxed 
                    font-['Montserrat',Helvetica] max-w-md mx-auto
                    transition-all duration-500 ${isHovered ? 'text-[#ffffffcc]' : ''}
                  `}
                >
                  Subscribe to our super-rare and exclusive newsletter for the latest updates and insights.
                </p>
              </div>
              
              {/* Input Section */}
              <div className="w-full max-w-xl">
                <div className={`
                  flex flex-col sm:flex-row items-stretch sm:items-center 
                  gap-3 sm:gap-4 w-full
                  transition-all duration-500 ${isHovered ? 'scale-105' : 'scale-100'}
                `}>
                  
                  {/* Email Input */}
                  <div className="flex-1 relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
                    <div className="relative bg-[#ffffff0a] hover:bg-[#ffffff15] rounded-full px-6 py-3 sm:py-4 border border-[#ffffff20] hover:border-[#ffffff40] transition-all duration-300">
                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSubscribe()}
                        className="
                          border-0 bg-transparent 
                          font-['Montserrat',Helvetica] font-semibold 
                          text-white text-sm sm:text-base
                          tracking-[-0.28px] leading-6 
                          focus-visible:ring-0 focus-visible:ring-offset-0 
                          placeholder:text-[#ffffff52] hover:placeholder:text-[#ffffff70]
                          transition-all duration-300
                          px-0 py-0
                        "
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>
                  
                  {/* Subscribe Button */}
                  <Button 
                    onClick={handleSubscribe}
                    disabled={!email}
                    className={`
                      relative overflow-hidden
                      bg-gradient-to-r from-white to-gray-100
                      hover:from-gray-100 hover:to-white
                      text-[#3e4654] hover:text-[#2d3440]
                      rounded-full px-6 sm:px-8 py-3 sm:py-4
                      font-['Montserrat',Helvetica] font-bold 
                      text-sm sm:text-base tracking-[-0.28px] leading-6
                      shadow-lg hover:shadow-xl
                      transition-all duration-300 ease-out
                      transform hover:scale-105 active:scale-95
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                      group
                      min-w-[120px] sm:min-w-[140px]
                    `}
                  >
                    <span className="relative z-10 transition-all duration-300">
                      Subscribe
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    
                    {/* Ripple effect */}
                    <div className="absolute inset-0 bg-white opacity-0 group-active:opacity-30 transition-opacity duration-150 rounded-full"></div>
                  </Button>
                </div>
                
                {/* Success message placeholder */}
                <div className="text-center mt-4 opacity-0 transition-opacity duration-300">
                  <p className="text-green-400 text-sm font-medium">
                    Thanks for subscribing! 🚀
                  </p>
                </div>
              </div>
              
              {/* Bottom decoration */}
              <div className="mt-8 sm:mt-12 opacity-60">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <div className="w-1 h-1 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            </div>
          </CardContent>
          
          {/* Subtle background glow */}
          <div className={`
            absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 
            rounded-2xl sm:rounded-3xl lg:rounded-[32px] 
            opacity-0 transition-opacity duration-700
            ${isHovered ? 'opacity-100' : ''}
          `}></div>
        </Card>
      </div>
    </>
  );
};