'use client';

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export const IntroductionSection = (): React.ReactElement => {
  return (
    <section className="flex flex-col w-full items-center gap-4 sm:gap-6 relative py-4 sm:py-6">
      {/* Header */}
      <motion.div 
        className="flex flex-col gap-2 w-full max-w-[790px] items-center justify-center px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="w-full font-['Montserrat',Helvetica] font-medium text-white text-sm sm:text-base text-center">
          Intelligent NFT
        </h2>
      </motion.div>

      {/* Single Card Container */}
      <div className="flex items-start justify-center w-full flex-wrap max-w-4xl px-4">
        <motion.div
          className="flex-1 min-w-[280px] max-w-full"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          whileHover={{ 
            scale: 1.02,
            rotateX: 2,
            transition: { duration: 0.3 }
          }}
        >
          <Card className="rounded-3xl p-0 overflow-hidden bg-gradient-to-br from-[#F9C360] via-[#F4A261] to-[#E87A36] shadow-2xl border-0">
            <CardContent className="p-0 relative">
              {/* Animated background overlay */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{ x: [-200, 600] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Additional animated overlay for depth */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-l from-transparent via-purple-500/5 to-transparent"
                animate={{ x: [600, -200] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 2 }}
              />
              
              <div className="p-4 sm:p-6 lg:p-8 bg-[#110e11]/95 backdrop-blur-sm rounded-3xl border border-solid border-[#e7e7e740] relative z-10">
                <motion.p 
                  className="font-['Montserrat',Helvetica] text-sm sm:text-base leading-6 sm:leading-7"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.6 }}
                >
                  <span className="font-semibold text-white bg-gradient-to-r from-[#F9C360] to-[#E87A36] bg-clip-text text-transparent">
                    INFT (Intelligent NFT)
                  </span>
                  <span className="text-[#ffffffa3]">
                    {" "}
                    is a project designed to overcome the limitations of
                    traditional, static, and one-way NFTs by introducing{" "}
                  </span>
                  <span className="font-semibold text-white">
                    interactive and evolving digital assets.
                  </span>
                  <span className="text-[#ffffffa3]">
                    {" "}
                    By integrating{" "}
                  </span>
                  <span className="font-semibold text-white bg-gradient-to-r from-[#6366F1] to-[#A855F7] bg-clip-text text-transparent">
                    AI and blockchain technologies,
                  </span>
                  <span className="text-[#ffffffa3]">
                    {" "}INFT transforms NFTs from mere collectibles into{" "}
                  </span>
                  <span className="font-semibold text-white">
                    intelligent digital entities capable of communication, memory, and emotional expression.
                  </span>
                </motion.p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Animated decorative elements - Hidden on mobile */}
      <motion.img
        className="hidden lg:block absolute w-4 h-4 top-[294px] left-[619px]"
        alt="Circle png"
        src="/figmaAssets/circle-01-png.png"
        animate={{ 
          rotate: 360,
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          rotate: { duration: 8, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
      />
      
      <motion.img
        className="hidden lg:block absolute w-7 h-7 top-[462px] left-16"
        alt="X png"
        src="/figmaAssets/x-png.png"
        animate={{ 
          rotate: [0, 15, -15, 0],
          y: [0, -10, 0]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />
      
      <motion.img
        className="hidden lg:block absolute w-6 h-6 top-[467px] left-[1145px]"
        alt="Circle png"
        src="/figmaAssets/circle-02-png.png"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 1
        }}
      />

      {/* Floating particles - Hidden on mobile, reduced on tablet */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="hidden md:block absolute w-1 h-1 lg:w-2 lg:h-2 bg-gradient-to-r from-[#F9C360] to-[#E87A36] rounded-full opacity-30"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 2) * 40}%`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, -10, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}
    </section>
  );
};