import React, { createContext, useContext } from 'react';

interface NFT {
  id: string;
  name: string;
  description: string;
  image_url: string;
  evolution_stage: number;
  interaction_count: number;
  atoma_model_id: string;
}

interface NftsContextType {
  data: NFT[];
  isLoading: boolean;
}

const NftsContext = createContext<NftsContextType>({
  data: [],
  isLoading: false,
});

export const useNfts = () => useContext(NftsContext);

export const NftsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, ] = React.useState<NFT[]>([]);
  const [isLoading,] = React.useState(false);

  return (
    <NftsContext.Provider value={{ data, isLoading }}>
      {children}
    </NftsContext.Provider>
  );
}; 