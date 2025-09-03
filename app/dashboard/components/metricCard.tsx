import { TrendingUp, TrendingDown } from "lucide-react";

type IconComponent = React.ComponentType<{ className?: string; }>;

interface MetricCardProps {
    title: string;
    value: string;
    change?: string;
    icon: IconComponent;
    trend?: 'up' | 'down' | 'neutral';
    subtitle?: string;
  }

  export const MetricCard: React.FC<MetricCardProps> = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    trend, 
    subtitle 
  }) => (
    <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6 hover:border-zinc-700/50 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-800/50 rounded-lg">
            <Icon className="w-5 h-5 text-zinc-300" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-zinc-300">{title}</h3>
            {subtitle && <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>}
          </div>
        </div>
        {change && trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${
            trend === 'up' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-red-400/10 text-red-400'
          }`}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );