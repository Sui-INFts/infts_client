import React from "react";
import { History } from "lucide-react";

interface TransactionListProps {
  transactions: any[];
  isLoading: boolean;
}

export function TransactionList({ transactions, isLoading }: TransactionListProps) {
  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="bg-zinc-900/50 p-4 rounded-lg animate-pulse">
              <div className="h-4 bg-zinc-800/50 rounded w-3/4 mb-2" />
              <div className="h-3 bg-zinc-800/50 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : transactions.length > 0 ? (
        transactions.map((txn) => {
          // Make sure we're only accessing properties that exist
          const effects = txn.data?.effects || txn.effects;
          let gasFees = 0;
          
          if (effects?.gasUsed) {
            const computationCost = Number(effects.gasUsed.computationCost || 0);
            const storageCost = Number(effects.gasUsed.storageCost || 0);
            const storageRebate = Number(effects.gasUsed.storageRebate || 0);
            gasFees = (computationCost + storageCost - storageRebate) / 1e9;
          }

          // Get timestamp from the transaction - handle enhanced format or original format
          const timestampMs = txn.timestamp || Number(txn.data?.timestampMs || txn.timestampMs);
          const timestamp = new Date(timestampMs);
          const formattedTime = timestamp.toLocaleTimeString();
          const formattedDate = timestamp.toLocaleDateString();
          
          // Get transaction type (if available from our enhanced format)
          const txType = txn.type || 'unknown';
          
          // Get digest from the correct location in the object
          const digest = txn.digest || txn.data?.digest || '';
            
          return (
            <div 
              key={digest} 
              className="bg-zinc-900/50 p-4 rounded-lg transition-all duration-200 hover:border hover:border-zinc-700/50"
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="mb-2 flex items-center gap-2">
                    <History className="w-4 h-4 text-zinc-400" />
                    <span className="text-xs text-zinc-400">Transaction</span>
                  </div>
                  <span className="text-xs text-zinc-500 break-all">
                    {digest}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-zinc-500">Gas:</span>
                    <span className="text-xs text-zinc-400">{gasFees.toFixed(8)} SUI</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-zinc-400">{formattedTime}</span>
                    <span className="text-xs text-zinc-500">{formattedDate}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center py-12">
          <p className="text-zinc-400">No recent activity</p>
        </div>
      )}
    </div>
  );
}