'use client';
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import useAtomaChat from '../../hooks/useAtoma';
import { HeroHeader } from '@/components/header';
import FooterSection from '@/components/footer';
import { AnimatePresence, motion } from 'framer-motion';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function Home() {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [displayedResponse, setDisplayedResponse] = useState('');
  const [fullResponse, setFullResponse] = useState('');
  const { response, error, handleChat, isLoading } = useAtomaChat();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // Handle form submission
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!message.trim() || isLoading) return;
    
    // Add user message to chat history
    const newMessage: ChatMessage = { role: 'user', content: message };
    setChatHistory(prev => [...prev, newMessage]);
    
    // Clear input and start processing
    await handleChat(message);
    setMessage('');
  };

  // Handle keypress for sending message with Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Start typing animation when response changes
  useEffect(() => {
    if (response && response !== fullResponse) {
      setFullResponse(response);
      setIsTyping(true);
      setDisplayedResponse('');
    }
  }, [response]);

  // Typing animation effect
  useEffect(() => {
    if (isTyping && fullResponse) {
      let i = 0;
      const typingSpeed = 15; // ms per character - adjust for speed
      
      const typingInterval = setInterval(() => {
        if (i < fullResponse.length) {
          setDisplayedResponse(fullResponse.substring(0, i + 1));
          i++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          
          // Add AI response to chat history once typing is complete
          setChatHistory(prev => [...prev, { role: 'assistant', content: fullResponse }]);
        }
      }, typingSpeed);
      
      return () => clearInterval(typingInterval);
    }
  }, [isTyping, fullResponse]);

  // Scroll to bottom when chat history updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, displayedResponse]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black to-gray-900 flex flex-col">
      <Head>
        <title>INFTS | NFT Intelligence</title>
        <meta name="description" content="AI-powered platform with Atoma Network integration for NFT interaction" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <HeroHeader />
      
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-16 flex-1 w-full">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-40 h-40 rounded-full bg-gradient-to-br from-gray-800/30 to-gray-800/10 border-2 border-gray-700/40 flex items-center justify-center overflow-hidden shadow-xl"
          >
            <motion.img 
              whileHover={{ scale: 1.05, rotate: 5 }}
              src="/logo.png" 
              alt="INFTS Logo" 
              className="w-36 h-36 object-cover" 
            />
          </motion.div>
          <div className="flex-1 text-left space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-gray-300"
            >
              INFTS
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-base md:text-lg text-gray-400 leading-relaxed"
            >
              Integrated with Atoma Network for decentralized AI inference with privacy and security.
              <br />Connect to your NFTs and unlock their intelligence.
            </motion.p>
          </div>
        </div>

        {/* Chat container */}
        <div className="w-full max-w-2xl mx-auto bg-gray-900/50 rounded-2xl shadow-2xl overflow-hidden border border-gray-800/50">
          {/* Chat history area */}
          <div 
            ref={chatContainerRef}
            className="h-96 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
          >
            {chatHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <div className="w-20 h-20 opacity-20 mb-4">
                  <img src="/logo.png" alt="INFTS Logo" className="w-3/4 h-3/4 object-contain" />
                </div>
                <p>Start a conversation with your INFT</p>
              </div>
            ) : (
              chatHistory.map((chat, index) => (
                <div 
                  key={index} 
                  className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      chat.role === 'user' 
                        ? 'bg-blue-900/30 text-white ml-auto border border-blue-800/30' 
                        : 'bg-gray-800/80 text-gray-200 border border-gray-700/50'
                    }`}
                  >
                    <p className="text-sm md:text-base">{chat.content}</p>
                  </motion.div>
                </div>
              ))
            )}
            
            {/* Currently typing message */}
            {isTyping && (
              <div className="flex justify-start">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-[80%] rounded-2xl p-4 bg-gray-800/80 text-gray-200 border border-gray-700/50"
                >
                  <p className="text-sm md:text-base">{displayedResponse}</p>
                  <span className="inline-block ml-1 animate-pulse">▋</span>
                </motion.div>
              </div>
            )}

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-red-900/30 border border-red-800/50 p-4 rounded-xl shadow-lg"
                >
                  <p className="text-red-300 text-sm">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input area */}
          <form onSubmit={handleSubmit} className="border-t border-gray-800/50 p-4">
            <div className="flex items-center bg-gray-800/80 rounded-xl overflow-hidden shadow-inner">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Interact with your NFTs..."
                className="flex-1 bg-transparent border-none text-gray-300 p-4 focus:outline-none placeholder-gray-500"
                disabled={isLoading}
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.5)' }}
                type="submit" 
                disabled={isLoading || !message.trim()} 
                className={`px-5 py-3 rounded-lg mr-2 transition-all ${
                  isLoading || !message.trim() 
                    ? 'text-gray-500 cursor-not-allowed' 
                    : 'text-white hover:bg-blue-900/30'
                }`}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </div>
      
      <FooterSection />
    </div>
  );
}