"use client";

import React from 'react';
import styled, { keyframes } from 'styled-components';
import FooterSection from "@/components/footer";
import { HeroHeader } from '@/components/header';

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// const glowAnimation = keyframes`
//   0% {
//     text-shadow: 0 0 10px rgba(255, 255, 255, 0.5),
//                  0 0 20px rgba(255, 255, 255, 0.3),
//                  0 0 30px rgba(255, 255, 255, 0.2);
//   }
//   50% {
//     text-shadow: 0 0 20px rgba(255, 255, 255, 0.8),
//                  0 0 30px rgba(255, 255, 255, 0.5),
//                  0 0 40px rgba(255, 255, 255, 0.3);
//   }
//   100% {
//     text-shadow: 0 0 10px rgba(255, 255, 255, 0.5),
//                  0 0 20px rgba(255, 255, 255, 0.3),
//                  0 0 30px rgba(255, 255, 255, 0.2);
//   }
// `;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(-45deg, #000000, #1a1a1a, #2d2d2d, #1a1a1a);
  background-size: 400% 400%;
  animation: ${gradientAnimation} 15s ease infinite;
  color: white;
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 4.5rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  background: linear-gradient(to right, #ffffff, #e0e0e0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.02em;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  position: relative;
  transform-origin: center;

  &:hover {
    transform: scale(1.1) rotate(-2deg);
    background: linear-gradient(45deg, #ffffff,rgb(106, 103, 103), #ffffff);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: 2s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(to right, #ffffff,rgb(106, 103, 103));
    transition: width 0.4s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  max-width: 600px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
`;

const ComingSoon: React.FC = () => {
  return (
    
    <Container>
      <HeroHeader />
      <ContentWrapper>
        <Title>Coming Soon</Title>
        <Subtitle>
          We&apos;re working hard to bring you something amazing. Stay tuned for updates!
        </Subtitle>
      </ContentWrapper>
      <FooterSection />
    </Container>
  );
};

export default ComingSoon;