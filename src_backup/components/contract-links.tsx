import React from 'react';
import { ExternalLink } from 'lucide-react';

export interface ContractInfo {
  name: string;
  address: string;
  description: string;
}

interface ContractLinksProps {
  contracts: ContractInfo[];
}

export const ContractLinks: React.FC<ContractLinksProps> = ({ contracts }) => {
  // Function to shorten address for display
  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Get BSC explorer URL
  const getBscExplorerUrl = (address: string) => {
    return `https://bscscan.com/address/${address}`;
  };

  return (
    <div className="py-6">
      <h3 className="text-lg font-semibold mb-4 gradient-text">Smart Contract Addresses</h3>
      <div className="grid gap-4 md:grid-cols-3">
        {contracts.map((contract) => (
          <a
            key={contract.address}
            href={getBscExplorerUrl(contract.address)}
            target="_blank"
            rel="noopener noreferrer"
            className="cyber-card transition-all hover:translate-y-[-2px]"
          >
            <div className="card-highlight"></div>
            <div className="card-content">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-base font-medium text-white">{contract.name}</h4>
                <ExternalLink className="h-4 w-4 opacity-60" />
              </div>
              <p className="text-xs text-gray-400 mb-3">{contract.description}</p>
              <div className="text-sm font-mono bg-black/30 px-3 py-1.5 rounded-md">
                {shortenAddress(contract.address)}
              </div>
            </div>
          </a>
        ))}
      </div>
      <div className="mt-4 text-center text-xs text-gray-400">
        These contracts are deployed on the Binance Smart Chain (BSC) Mainnet
      </div>
    </div>
  );
};

export default ContractLinks;