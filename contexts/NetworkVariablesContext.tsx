import React, { createContext, useContext } from 'react';

interface NetworkVariables {
  PACKAGE_ID: string;
  CHAIN_ID: string;
}

interface NetworkVariablesContextType {
  data: NetworkVariables;
}

const defaultNetworkVariables: NetworkVariables = {
  PACKAGE_ID: process.env.NEXT_PUBLIC_PACKAGE_ID || '',
  CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID || '',
};

const NetworkVariablesContext = createContext<NetworkVariablesContextType>({
  data: defaultNetworkVariables,
});

export const useNetworkVariables = () => useContext(NetworkVariablesContext);

export const NetworkVariablesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <NetworkVariablesContext.Provider value={{ data: defaultNetworkVariables }}>
      {children}
    </NetworkVariablesContext.Provider>
  );
}; 