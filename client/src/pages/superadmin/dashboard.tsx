import React, { useState } from 'react';
import DashboardLayout from './dashboard-layout';
import { useBlockchain } from '@/contexts/blockchain-context';
import { useCustomToast } from '@/lib/toast-wrapper';
import { motion } from 'framer-motion';
import { 
  Pause, 
  Play, 
  RefreshCw, 
  TrendingUp, 
  DollarSign,
  Shield,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const SuperAdminDashboardPage: React.FC = () => {
  const { nepaliPayContract, tokenBalance, nptBalance } = useBlockchain();
  const toast = useCustomToast();
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addressFields, setAddressFields] = useState({
    usdtAddress: '0x55d398326f99059fF775485246999027B3197955', // USDT on BSC
    priceFeedAddress: '0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE', // BNB/USD Chainlink Price Feed
    nepaliPayAddress: '0xe2d189f6696ee8b247ceae97fe3f1f2879054553', 
    tokenAddress: '0x69d34B25809b346702C21EB0E22EAD8C1de58D66'
  });

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressFields({
      ...addressFields,
      [name]: value
    });
  };

  const handleSystemPause = async () => {
    if (!nepaliPayContract) {
      toast({
        title: "Contract Not Connected",
        description: "The NepaliPay contract is not connected.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // This would be a real call to pause() on the contract
      // await nepaliPayContract.pause();
      
      // For demo purposes:
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsPaused(true);
      toast({
        title: "System Paused",
        description: "The NepaliPay system has been paused successfully.",
        variant: "default"
      });
    } catch (error: any) {
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to pause the system",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSystemResume = async () => {
    if (!nepaliPayContract) {
      toast({
        title: "Contract Not Connected",
        description: "The NepaliPay contract is not connected.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // This would be a real call to unpause() on the contract
      // await nepaliPayContract.unpause();
      
      // For demo purposes:
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsPaused(false);
      toast({
        title: "System Resumed",
        description: "The NepaliPay system has been resumed successfully.",
        variant: "default"
      });
    } catch (error: any) {
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to resume the system",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAddresses = async () => {
    setIsLoading(true);
    try {
      // This would be real calls to update addresses on the contracts
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Addresses Updated",
        description: "Contract addresses have been updated successfully.",
        variant: "default"
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update contract addresses",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

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
    <DashboardLayout title="Control Panel">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div variants={item} className="nepal-card">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-gray-400 text-sm mb-1">NPT/USD Peg Status</h3>
                <p className="text-2xl font-semibold">$0.0075</p>
                <div className="flex items-center mt-1 text-green-400 text-sm">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>Stable (±0.5%)</span>
                </div>
              </div>
              <div className="bg-primary/10 p-2 rounded-lg">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={item} className="nepal-card">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-gray-400 text-sm mb-1">Reserve Funds</h3>
                <p className="text-2xl font-semibold">$2,450,890</p>
                <p className="text-sm text-gray-400 mt-1">
                  1,238 BNB • 450,000 USDT
                </p>
              </div>
              <div className="bg-primary/10 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-primary" />
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={item} className="nepal-card">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-gray-400 text-sm mb-1">Collected Fees</h3>
                <p className="text-2xl font-semibold">123,450 NPT</p>
                <p className="text-sm text-gray-400 mt-1">
                  ~$925.87 USD
                </p>
              </div>
              <div className="bg-primary/10 p-2 rounded-lg">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* System Status */}
        <motion.div variants={item} className="cyber-card">
          <h2 className="text-xl font-bold mb-4">System Control</h2>
          
          <div className="flex items-center mb-6">
            <div className="mr-3">
              <span className="text-sm text-gray-400">System Status:</span>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${isPaused ? 'bg-red-900/20 text-red-400' : 'bg-green-900/20 text-green-400'}`}>
              <span className="w-2 h-2 rounded-full mr-2 bg-current"></span>
              <span>{isPaused ? 'Paused' : 'Online'}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleSystemPause}
              disabled={isPaused || isLoading}
              className={`modern-button flex items-center ${isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Pause className="w-4 h-4 mr-2" />
              )}
              Pause System
            </button>
            
            <button
              onClick={handleSystemResume}
              disabled={!isPaused || isLoading}
              className={`modern-button flex items-center ${!isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              Resume System
            </button>
          </div>
        </motion.div>
        
        {/* Contract Address Updates */}
        <motion.div variants={item} className="cyber-card">
          <h2 className="text-xl font-bold mb-4">Contract Address Updates</h2>
          <div className="bg-yellow-900/20 border border-yellow-800/30 rounded-lg p-4 mb-6 flex items-start">
            <AlertTriangle className="text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-yellow-200 text-sm">
              Warning: Updating contract addresses can have system-wide effects. Only use verified and audited contract addresses.
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">USDT Token Address</label>
              <input
                type="text"
                name="usdtAddress"
                value={addressFields.usdtAddress}
                onChange={handleAddressChange}
                className="modern-input w-full"
                placeholder="0x..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Price Feed Address</label>
              <input
                type="text"
                name="priceFeedAddress"
                value={addressFields.priceFeedAddress}
                onChange={handleAddressChange}
                className="modern-input w-full"
                placeholder="0x..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">NepaliPay Main Address</label>
              <input
                type="text"
                name="nepaliPayAddress"
                value={addressFields.nepaliPayAddress}
                onChange={handleAddressChange}
                className="modern-input w-full"
                placeholder="0x..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">NepaliPay Token (NPT) Address</label>
              <input
                type="text"
                name="tokenAddress"
                value={addressFields.tokenAddress}
                onChange={handleAddressChange}
                className="modern-input w-full"
                placeholder="0x..."
              />
            </div>
            
            <div className="pt-2">
              <button
                onClick={handleUpdateAddresses}
                disabled={isLoading}
                className="modern-button flex items-center"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Update Addresses
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboardPage;