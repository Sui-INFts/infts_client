import React, { useState } from 'react';
import { TokenRow } from './tokenRow';

interface Token {
    symbol: string;
    name: string;
    balance: string;
    value: string;
    icon: string;
    isNative?: boolean;
  }
interface Network {
    network: string;
    balance: string;
    transactions: string;
    yield: string;
    logo: string;
    networkColor: string;
    tokens: Token[];
  }

interface NetworkCardProps extends Network {}

export const NetworkCard: React.FC<NetworkCardProps> = ({ 
    network, 
    balance, 
    transactions, 
    yield: yieldValue, 
    logo, 
    tokens, 
    networkColor 
  }) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    
    return (
      <div className="bg-zinc-900/40 border border-zinc-800/40 rounded-xl p-5 hover:border-zinc-700/50 transition-all">
        <div 
          className="cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 bg-gradient-to-br ${networkColor} rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg`}>
              {logo}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white text-lg">{network}</span>
                <span className="text-xs text-zinc-500">({tokens.length} tokens)</span>
              </div>
              <span className="text-zinc-400 text-sm">Click to {isExpanded ? 'collapse' : 'expand'}</span>
            </div>
            <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
              <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-zinc-400 text-xs mb-1">Total Balance</div>
              <div className="text-white font-semibold">{balance}</div>
            </div>
            <div className="text-center">
              <div className="text-zinc-400 text-xs mb-1">Transactions</div>
              <div className="text-white font-semibold">{transactions}</div>
            </div>
            <div className="text-center">
              <div className="text-zinc-400 text-xs mb-1">Yield</div>
              <div className="text-emerald-400 font-semibold">{yieldValue}</div>
            </div>
          </div>
        </div>
  
        {/* Expandable Token List */}
        {isExpanded && (
          <div className="mt-6 pt-4 border-t border-zinc-800/50">
            <h4 className="text-sm font-medium text-zinc-300 mb-3">Token Holdings</h4>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {tokens.map((token: Token, index: number) => (
                <TokenRow key={index} {...token} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };