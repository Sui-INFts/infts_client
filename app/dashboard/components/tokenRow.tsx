
interface TokenRowProps {
    symbol: string;
    name: string;
    balance: string;
    value: string;
    icon: string;
    isNative?: boolean;
  }

  export const TokenRow: React.FC<TokenRowProps> = ({ 
    symbol, 
    name, 
    balance, 
    value, 
    icon, 
    isNative = false 
  }) => (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-zinc-800/20 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
          isNative ? 'bg-gradient-to-br from-blue-400 to-purple-500' : 'bg-zinc-700'
        } text-white`}>
          {icon}
        </div>
        <div>
          <div className="text-white text-sm font-medium">{symbol}</div>
          <div className="text-zinc-500 text-xs">{name}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-white text-sm font-medium">{balance}</div>
        <div className="text-zinc-400 text-xs">{value}</div>
      </div>
    </div>
  );