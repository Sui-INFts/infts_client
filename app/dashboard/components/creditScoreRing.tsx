

interface CreditScoreRingProps {
    score: number;
    maxScore: number;
    label: string;
    color?: 'emerald' | 'yellow' | 'red' | 'blue';
  }

  export const CreditScoreRing: React.FC<CreditScoreRingProps> = ({ 
    score, 
    maxScore, 
    label, 
    color = "emerald" 
  }) => {
    const percentage = (score / maxScore) * 100;
    const circumference = 2 * Math.PI * 45;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    
    const colorClasses: Record<string, string> = {
      emerald: "stroke-emerald-400",
      orange: "stroke-orange-400",
      red: "stroke-red-400",
      blue: "stroke-blue-400"
    };
  
    return (
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32">
          <svg className="transform -rotate-90 w-32 h-32">
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-zinc-800"
            />
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className={`transition-all duration-1000 ${colorClasses[color]}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-white">{score}</span>
            <span className="text-sm text-zinc-400">/{maxScore}</span>
          </div>
        </div>
        <span className="text-sm text-zinc-300 mt-2">{label}</span>
      </div>
    );
  };