
type IconComponent = React.ComponentType<{ className?: string; }>;

interface CreditFactor {
    factor: string;
    score: number;
    impact: 'positive' | 'negative' | 'neutral';
    icon: IconComponent;
  }

interface CreditFactorItemProps extends CreditFactor {}

export const CreditFactorItem: React.FC<CreditFactorItemProps> = ({ 
    factor, 
    score, 
    impact, 
    icon: Icon 
  }) => {
    const getImpactColor = (impact: 'positive' | 'negative' | 'neutral'): string => {
      switch(impact) {
        case 'positive': return 'text-emerald-400 bg-emerald-400/10';
        case 'negative': return 'text-red-400 bg-red-400/10';
        default: return 'text-yellow-400 bg-yellow-400/10';
      }
    };
  
    return (
      <div className="flex items-center justify-between py-3 border-b border-zinc-800/30 last:border-b-0">
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-zinc-300" />
          <span className="text-white">{factor}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-white">{score}</span>
          <div className={`px-2 py-1 rounded text-xs capitalize ${getImpactColor(impact)}`}>
            {impact}
          </div>
        </div>
      </div>
    );
  };