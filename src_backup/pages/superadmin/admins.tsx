import React, { useState } from 'react';
import DashboardLayout from './dashboard-layout';
import { useBlockchain } from '@/contexts/blockchain-context';
import { useCustomToast } from '@/lib/toast-wrapper';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Ban, 
  CheckCircle, 
  RefreshCw,
  UserX,
  Search,
  Clock,
  CheckCheck,
  AlertTriangle
} from 'lucide-react';

interface Admin {
  id: number;
  username: string;
  walletAddress: string;
  role: string;
  isBlacklisted: boolean;
  lastActive: string;
}

const SuperAdminAdminsPage: React.FC = () => {
  const { nepaliPayContract } = useBlockchain();
  const toast = useCustomToast();
  const [isLoading, setIsLoading] = useState({
    add: false,
    remove: false,
    blacklist: false,
    unblacklist: false
  });
  const [newAdminAddress, setNewAdminAddress] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  // Sample admin data (this would come from the blockchain in a real implementation)
  const [admins, setAdmins] = useState<Admin[]>([
    { 
      id: 1, 
      username: "rashmi_admin", 
      walletAddress: "0x8C741132243A3824f0eF23836A7f7844a1E18B5e", 
      role: "ADMIN", 
      isBlacklisted: false,
      lastActive: "2023-04-05 13:45:22"
    },
    { 
      id: 2, 
      username: "manish_ops", 
      walletAddress: "0x6F9e2A26C0067D71DCe96C2B4E6E3Bd2fC9570e9", 
      role: "ADMIN", 
      isBlacklisted: false,
      lastActive: "2023-04-05 10:12:45"
    },
    { 
      id: 3, 
      username: "rajesh_mod", 
      walletAddress: "0xA6C340E4bb243dE60C26fEEFB8b2A1203950E14d", 
      role: "ADMIN", 
      isBlacklisted: true,
      lastActive: "2023-04-01 08:30:15"
    }
  ]);

  const handleAddAdmin = async () => {
    if (!nepaliPayContract) {
      toast({
        title: "Contract Not Connected",
        description: "The NepaliPay contract is not connected.",
        variant: "destructive"
      });
      return;
    }

    if (!newAdminAddress || !newAdminAddress.startsWith('0x') || newAdminAddress.length !== 42) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Ethereum address.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading({...isLoading, add: true});
    try {
      // This would be a real call to setAdmin() on the contract
      // await nepaliPayContract.setAdmin(newAdminAddress);
      
      // For demo purposes:
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the admin list
      const newId = admins.length + 1;
      const newAdmin: Admin = {
        id: newId,
        username: `admin_${newId}`,
        walletAddress: newAdminAddress,
        role: "ADMIN",
        isBlacklisted: false,
        lastActive: new Date().toLocaleString()
      };
      
      setAdmins([...admins, newAdmin]);
      setNewAdminAddress('');
      
      toast({
        title: "Admin Added",
        description: "New admin has been successfully added.",
        variant: "default"
      });
    } catch (error: any) {
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to add admin",
        variant: "destructive"
      });
    } finally {
      setIsLoading({...isLoading, add: false});
    }
  };

  const handleRemoveAdmin = async (admin: Admin) => {
    if (!nepaliPayContract) {
      toast({
        title: "Contract Not Connected",
        description: "The NepaliPay contract is not connected.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading({...isLoading, remove: true});
    setSelectedAdmin(admin);
    
    try {
      // This would be a real call to removeAdmin() on the contract
      // await nepaliPayContract.removeAdmin(admin.walletAddress);
      
      // For demo purposes:
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the admin list
      setAdmins(admins.filter(a => a.id !== admin.id));
      
      toast({
        title: "Admin Removed",
        description: `Admin ${admin.username} has been successfully removed.`,
        variant: "default"
      });
    } catch (error: any) {
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to remove admin",
        variant: "destructive"
      });
    } finally {
      setIsLoading({...isLoading, remove: false});
      setSelectedAdmin(null);
    }
  };

  const handleBlacklistAdmin = async (admin: Admin) => {
    if (!nepaliPayContract) {
      toast({
        title: "Contract Not Connected",
        description: "The NepaliPay contract is not connected.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading({...isLoading, blacklist: true});
    setSelectedAdmin(admin);
    
    try {
      // This would be a real call to blacklistAdmin() on the contract
      // await nepaliPayContract.blacklistAdmin(admin.walletAddress);
      
      // For demo purposes:
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the admin list
      setAdmins(admins.map(a => 
        a.id === admin.id 
          ? {...a, isBlacklisted: true} 
          : a
      ));
      
      toast({
        title: "Admin Blacklisted",
        description: `Admin ${admin.username} has been successfully blacklisted.`,
        variant: "default"
      });
    } catch (error: any) {
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to blacklist admin",
        variant: "destructive"
      });
    } finally {
      setIsLoading({...isLoading, blacklist: false});
      setSelectedAdmin(null);
    }
  };

  const handleUnblacklistAdmin = async (admin: Admin) => {
    if (!nepaliPayContract) {
      toast({
        title: "Contract Not Connected",
        description: "The NepaliPay contract is not connected.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading({...isLoading, unblacklist: true});
    setSelectedAdmin(admin);
    
    try {
      // This would be a real call to unblacklistAdmin() on the contract
      // await nepaliPayContract.unblacklistAdmin(admin.walletAddress);
      
      // For demo purposes:
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the admin list
      setAdmins(admins.map(a => 
        a.id === admin.id 
          ? {...a, isBlacklisted: false} 
          : a
      ));
      
      toast({
        title: "Admin Unblacklisted",
        description: `Admin ${admin.username} has been successfully unblacklisted.`,
        variant: "default"
      });
    } catch (error: any) {
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to unblacklist admin",
        variant: "destructive"
      });
    } finally {
      setIsLoading({...isLoading, unblacklist: false});
      setSelectedAdmin(null);
    }
  };

  // Filter admins based on search term
  const filteredAdmins = admins.filter(admin => 
    admin.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.walletAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <DashboardLayout title="Admin Management">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* Add New Admin */}
        <motion.div variants={item} className="cyber-card">
          <h2 className="text-xl font-bold mb-4">Add New Admin</h2>
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={newAdminAddress}
                onChange={(e) => setNewAdminAddress(e.target.value)}
                className="modern-input w-full"
                placeholder="Enter wallet address (0x...)"
              />
            </div>
            <button
              onClick={handleAddAdmin}
              disabled={isLoading.add}
              className="modern-button flex items-center whitespace-nowrap"
            >
              {isLoading.add ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Add Admin
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            New admin will have ADMIN role permissions to manage users and transactions.
          </p>
        </motion.div>
        
        {/* Admin List */}
        <motion.div variants={item} className="cyber-card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Admin Overview</h2>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="modern-input py-1 pl-9 pr-3 text-sm"
                placeholder="Search admins..."
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="pb-3 px-3 text-sm font-medium text-gray-400">Username</th>
                  <th className="pb-3 px-3 text-sm font-medium text-gray-400">Wallet Address</th>
                  <th className="pb-3 px-3 text-sm font-medium text-gray-400">Role</th>
                  <th className="pb-3 px-3 text-sm font-medium text-gray-400">Status</th>
                  <th className="pb-3 px-3 text-sm font-medium text-gray-400">Last Active</th>
                  <th className="pb-3 px-3 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmins.length > 0 ? (
                  filteredAdmins.map((admin) => (
                    <tr key={admin.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                      <td className="py-4 px-3">{admin.username}</td>
                      <td className="py-4 px-3">
                        <span className="font-mono text-sm">{admin.walletAddress.substring(0, 6)}...{admin.walletAddress.substring(admin.walletAddress.length - 4)}</span>
                      </td>
                      <td className="py-4 px-3">
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                          {admin.role}
                        </span>
                      </td>
                      <td className="py-4 px-3">
                        {admin.isBlacklisted ? (
                          <span className="flex items-center text-red-400">
                            <Ban className="w-4 h-4 mr-1" />
                            Blacklisted
                          </span>
                        ) : (
                          <span className="flex items-center text-green-400">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Active
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-3">
                        <span className="flex items-center text-gray-400">
                          <Clock className="w-4 h-4 mr-1" />
                          {admin.lastActive}
                        </span>
                      </td>
                      <td className="py-4 px-3">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleRemoveAdmin(admin)}
                            disabled={isLoading.remove && selectedAdmin?.id === admin.id}
                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                            title="Remove Admin"
                          >
                            {isLoading.remove && selectedAdmin?.id === admin.id ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <UserX className="w-4 h-4" />
                            )}
                          </button>
                          
                          {admin.isBlacklisted ? (
                            <button
                              onClick={() => handleUnblacklistAdmin(admin)}
                              disabled={isLoading.unblacklist && selectedAdmin?.id === admin.id}
                              className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                              title="Unblacklist Admin"
                            >
                              {isLoading.unblacklist && selectedAdmin?.id === admin.id ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <CheckCheck className="w-4 h-4" />
                              )}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleBlacklistAdmin(admin)}
                              disabled={isLoading.blacklist && selectedAdmin?.id === admin.id}
                              className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition-colors"
                              title="Blacklist Admin"
                            >
                              {isLoading.blacklist && selectedAdmin?.id === admin.id ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <Ban className="w-4 h-4" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-4 px-3 text-center text-gray-400">
                      {searchTerm ? (
                        <div className="flex flex-col items-center py-6">
                          <Search className="w-8 h-8 mb-2 text-gray-500" />
                          <p>No admins found matching "{searchTerm}"</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center py-6">
                          <AlertTriangle className="w-8 h-8 mb-2 text-gray-500" />
                          <p>No admins found</p>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <p>Admin changes take effect immediately on the blockchain.</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default SuperAdminAdminsPage;