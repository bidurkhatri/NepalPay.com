import React from "react";
import { ExternalLink } from "lucide-react";

export interface ContractInfo {
  name: string;
  address: string;
  description: string;
}

interface ContractLinksProps {
  contracts: ContractInfo[];
}

const ContractLinks: React.FC<ContractLinksProps> = ({ contracts }) => {
  return (
    <div className="glass-card">
      <h2 className="text-xl font-semibold mb-4 gradient-text">Smart Contract Information</h2>
      <div className="space-y-4">
        {contracts.map((contract) => (
          <div key={contract.address} className="p-3 bg-gray-800/30 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-white">{contract.name}</h3>
              <a
                href={`https://bscscan.com/address/${contract.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-primary hover:text-primary/80 text-sm transition-colors"
              >
                View on BSCScan <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>
            <p className="text-sm text-gray-300 mb-2">{contract.description}</p>
            <div className="flex items-center">
              <span className="text-xs font-mono bg-gray-800/50 p-1.5 rounded text-gray-300 overflow-hidden overflow-ellipsis w-full">
                {contract.address}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContractLinks;