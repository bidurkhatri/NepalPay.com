import React, { useState } from 'react';
import DashboardLayout from './dashboard-layout';
import { useBlockchain } from '@/contexts/blockchain-context';
import { useCustomToast } from '@/lib/toast-wrapper';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Flame, 
  PinIcon, 
  RefreshCw,
  ArrowRight,
  Info
} from 'lucide-react';

const SuperAdminStabilityPage: React.FC = () => {
  const { tokenContract } = useBlockchain();
  const toast = useCustomToast();
  const [isLoading, setIsLoading] = useState({
    mint: false,
    burn: false,
    peg: false
  });
  const [inputValues, setInputValues] = useState({
    mintAmount: '',
    burnAmount: '',
    pegValue: '0.0075'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues({
      ...inputValues,
      [name]: value
    });
  };

  const handleMintTokens = async () => {
    if (!tokenContract) {
      toast({
        title: "Contract Not Connected",
        description: "The NPT token contract is not connected.",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(inputValues.mintAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount of tokens to mint.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading({...isLoading, mint: true});
    try {
      // This would be a real call to mint() on the token contract
      // await tokenContract.mint(ethers.utils.parseUnits(inputValues.mintAmount, 18));
      
      // For demo purposes:
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Tokens Minted",
        description: `Successfully minted ${amount.toLocaleString()} NPT.`,
        variant: "default"
      });
      setInputValues({...inputValues, mintAmount: ''});
    } catch (error: any) {
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to mint tokens",
        variant: "destructive"
      });
    } finally {
      setIsLoading({...isLoading, mint: false});
    }
  };

  const handleBurnTokens = async () => {
    if (!tokenContract) {
      toast({
        title: "Contract Not Connected",
        description: "The NPT token contract is not connected.",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(inputValues.burnAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount of tokens to burn.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading({...isLoading, burn: true});
    try {
      // This would be a real call to burn() on the token contract
      // await tokenContract.burn(ethers.utils.parseUnits(inputValues.burnAmount, 18));
      
      // For demo purposes:
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Tokens Burned",
        description: `Successfully burned ${amount.toLocaleString()} NPT.`,
        variant: "default"
      });
      setInputValues({...inputValues, burnAmount: ''});
    } catch (error: any) {
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to burn tokens",
        variant: "destructive"
      });
    } finally {
      setIsLoading({...isLoading, burn: false});
    }
  };

  const handleSetPeg = async () => {
    if (!tokenContract) {
      toast({
        title: "Contract Not Connected",
        description: "The NPT token contract is not connected.",
        variant: "destructive"
      });
      return;
    }

    const pegValue = parseFloat(inputValues.pegValue);
    if (isNaN(pegValue) || pegValue <= 0) {
      toast({
        title: "Invalid Peg Value",
        description: "Please enter a valid USD value for the peg.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading({...isLoading, peg: true});
    try {
      // This would be a real call to setPeg() on the contract
      // await contract.setPeg(ethers.utils.parseUnits(inputValues.pegValue, 18));
      
      // For demo purposes:
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Peg Updated",
        description: `Successfully set NPT peg to $${pegValue} USD.`,
        variant: "default"
      });
    } catch (error: any) {
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to update peg value",
        variant: "destructive"
      });
    } finally {
      setIsLoading({...isLoading, peg: false});
    }
  };

  // Demo data for the peg graph
  const pegData = [
    { date: 'Apr 1', value: 0.0074 },
    { date: 'Apr 2', value: 0.0075 },
    { date: 'Apr 3', value: 0.0076 },
    { date: 'Apr 4', value: 0.0075 },
    { date: 'Apr 5', value: 0.0075 },
    { date: 'Apr 6', value: 0.0074 },
    { date: 'Apr 7', value: 0.0074 },
    { date: 'Apr 8', value: 0.0075 },
    { date: 'Apr 9', value: 0.0075 },
    { date: 'Apr 10', value: 0.0076 },
    { date: 'Apr 11', value: 0.0075 },
    { date: 'Apr 12', value: 0.0075 },
    { date: 'Apr 13', value: 0.0074 },
    { date: 'Apr 14', value: 0.0075 },
  ];

  const maxValue = Math.max(...pegData.map(d => d.value)) * 1.05;
  const minValue = Math.min(...pegData.map(d => d.value)) * 0.95;
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <DashboardLayout title="Token Stability Management">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* Peg Monitoring Graph */}
        <motion.div variants={item} className="cyber-card">
          <h2 className="text-xl font-bold mb-4">NPT/USD Peg Monitoring</h2>
          
          <div className="bg-[rgba(10,18,35,0.7)] rounded-lg p-4 h-64 relative">
            <div className="absolute top-2 right-2 bg-gray-800 rounded-full px-2 py-1 text-xs text-gray-300">
              7 Day View
            </div>
            
            {/* Target peg line */}
            <div className="absolute left-0 right-0" style={{ top: '50%', height: '1px', backgroundColor: 'rgba(43, 108, 196, 0.3)' }}>
              <div className="absolute right-0 -top-2.5 bg-gray-800 rounded-full px-2 py-0.5 text-xs text-primary">
                Target: $0.0075
              </div>
            </div>
            
            {/* Graph visualization - this would be replaced with a real chart library */}
            <div className="h-full flex items-end">
              {pegData.map((data, index) => {
                const heightPercentage = ((data.value - minValue) / (maxValue - minValue)) * 100;
                const isTarget = Math.abs(data.value - 0.0075) < 0.0001;
                return (
                  <div 
                    key={index} 
                    className="flex-1 flex flex-col items-center justify-end"
                  >
                    <div 
                      className={`w-4/5 rounded-t transition-all ${isTarget ? 'bg-primary' : (data.value > 0.0075 ? 'bg-green-500' : 'bg-red-500')}`}
                      style={{ height: `${heightPercentage}%` }}
                    ></div>
                    {index % 2 === 0 && (
                      <div className="text-xs text-gray-500 mt-1">{data.date}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between px-1">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-sm bg-primary mr-2"></div>
              <span className="text-sm text-gray-300">Target Peg ($0.0075)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-sm bg-green-500 mr-2"></div>
              <span className="text-sm text-gray-300">Above Peg</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-sm bg-red-500 mr-2"></div>
              <span className="text-sm text-gray-300">Below Peg</span>
            </div>
          </div>
        </motion.div>

        {/* Token Supply Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={item} className="nepal-card">
            <h3 className="text-lg font-bold mb-4">Mint Tokens</h3>
            <div className="flex items-center gap-3 mb-2">
              <Info className="h-4 w-4 text-primary" />
              <span className="text-sm text-gray-300">Add new NPT to the total supply</span>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Amount to Mint
              </label>
              <div className="flex gap-3">
                <input
                  type="number"
                  name="mintAmount"
                  value={inputValues.mintAmount}
                  onChange={handleInputChange}
                  className="modern-input flex-1"
                  placeholder="50,000"
                />
                <button
                  onClick={handleMintTokens}
                  disabled={isLoading.mint}
                  className="modern-button flex items-center whitespace-nowrap"
                >
                  {isLoading.mint ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Mint NPT
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                New tokens are minted to the contract owner address
              </p>
            </div>
          </motion.div>
          
          <motion.div variants={item} className="nepal-card">
            <h3 className="text-lg font-bold mb-4">Burn Tokens</h3>
            <div className="flex items-center gap-3 mb-2">
              <Info className="h-4 w-4 text-red-400" />
              <span className="text-sm text-gray-300">Remove NPT from the total supply</span>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Amount to Burn
              </label>
              <div className="flex gap-3">
                <input
                  type="number"
                  name="burnAmount"
                  value={inputValues.burnAmount}
                  onChange={handleInputChange}
                  className="modern-input flex-1"
                  placeholder="10,000"
                />
                <button
                  onClick={handleBurnTokens}
                  disabled={isLoading.burn}
                  className="modern-button flex items-center whitespace-nowrap"
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(220, 53, 69, 0.8), rgba(220, 53, 69, 0.6))'
                  }}
                >
                  {isLoading.burn ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Flame className="w-4 h-4 mr-2" />
                  )}
                  Burn NPT
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Tokens are burned from the contract owner's balance
              </p>
            </div>
          </motion.div>
        </div>
        
        {/* Manual Peg Adjustment */}
        <motion.div variants={item} className="cyber-card">
          <h3 className="text-lg font-bold mb-4">Manual Peg Adjustment (Fallback)</h3>
          <div className="bg-yellow-900/20 border border-yellow-800/30 rounded-lg p-4 mb-6">
            <p className="text-yellow-200 text-sm">
              <strong>Warning:</strong> Manual peg adjustment should only be used as a fallback option when the oracle price feeds are malfunctioning. This directly affects the token's value across the ecosystem.
            </p>
          </div>
          
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                NPR/USD Value
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  name="pegValue"
                  value={inputValues.pegValue}
                  onChange={handleInputChange}
                  className="modern-input w-full pl-8"
                  step="0.0001"
                  placeholder="0.0075"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Current market rate: ~$0.0075 USD per NPR
              </p>
            </div>
            
            <button
              onClick={handleSetPeg}
              disabled={isLoading.peg}
              className="modern-button h-[42px] flex items-center"
            >
              {isLoading.peg ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <PinIcon className="w-4 h-4 mr-2" />
              )}
              Set Peg
            </button>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default SuperAdminStabilityPage;