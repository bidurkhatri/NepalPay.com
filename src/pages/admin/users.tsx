import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Ban, CheckCircle, AlertTriangle, RefreshCw, UserCheck, UserX, Link } from 'lucide-react';
import DashboardLayout from './dashboard-layout';
import { useBlockchain } from '@/contexts/blockchain-context';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  username: string;
  walletAddress: string;
  role: 'USER' | 'ADMIN' | 'NONE';
  nptBalance: string;
  outstandingLoan: string;
  isBlacklisted: boolean;
}

const UserManagementPage: React.FC = () => {
  const { nepaliPayContract, tokenContract } = useBlockchain();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState({
    changeRole: false,
    blacklist: false,
    unblacklist: false
  });

  // Mock data - in production this would come from blockchain calls
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      username: 'prakash.eth',
      walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
      role: 'USER',
      nptBalance: '2,500 NPT',
      outstandingLoan: '500 NPT',
      isBlacklisted: false
    },
    {
      id: 2,
      username: 'binod',
      walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
      role: 'USER',
      nptBalance: '1,200 NPT',
      outstandingLoan: '0 NPT',
      isBlacklisted: false
    },
    {
      id: 3,
      username: 'smriti',
      walletAddress: '0x7890abcdef1234567890abcdef1234567890abcd',
      role: 'USER',
      nptBalance: '3,750 NPT',
      outstandingLoan: '750 NPT',
      isBlacklisted: true
    },
    {
      id: 4,
      username: 'admin_bijay',
      walletAddress: '0xef1234567890abcdef1234567890abcdef123456',
      role: 'ADMIN',
      nptBalance: '5,000 NPT',
      outstandingLoan: '0 NPT',
      isBlacklisted: false
    }
  ]);

  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.username.toLowerCase().includes(searchLower) ||
      user.walletAddress.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower)
    );
  });

  const handleRoleChange = async (user: User, newRole: 'USER' | 'ADMIN' | 'NONE') => {
    if (!nepaliPayContract) {
      toast({
        title: "Contract Not Connected",
        description: "The NepaliPay contract is not connected.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading({...isLoading, changeRole: true});
    setSelectedUser(user);
    
    try {
      // In production, this would call the contract method to set user role
      // await nepaliPayContract.setUserRole(user.walletAddress, newRole);
      
      // For demo purposes:
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update local state
      setUsers(users.map(u => 
        u.id === user.id 
          ? {...u, role: newRole} 
          : u
      ));
      
      toast({
        title: "Role Updated",
        description: `User ${user.username} is now set as ${newRole}`,
        variant: "default"
      });
    } catch (error: any) {
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to update user role",
        variant: "destructive"
      });
    } finally {
      setIsLoading({...isLoading, changeRole: false});
      setSelectedUser(null);
    }
  };

  const handleBlacklistUser = async (user: User) => {
    if (!nepaliPayContract) {
      toast({
        title: "Contract Not Connected",
        description: "The NepaliPay contract is not connected.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading({...isLoading, blacklist: true});
    setSelectedUser(user);
    
    try {
      // In production, this would call the blacklistUser method on the contract
      // await nepaliPayContract.blacklistUser(user.walletAddress);
      
      // For demo purposes:
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the users list
      setUsers(users.map(u => 
        u.id === user.id 
          ? {...u, isBlacklisted: true} 
          : u
      ));
      
      toast({
        title: "User Blacklisted",
        description: `User ${user.username} has been blacklisted successfully.`,
        variant: "default"
      });
    } catch (error: any) {
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to blacklist user",
        variant: "destructive"
      });
    } finally {
      setIsLoading({...isLoading, blacklist: false});
      setSelectedUser(null);
    }
  };

  const handleUnblacklistUser = async (user: User) => {
    if (!nepaliPayContract) {
      toast({
        title: "Contract Not Connected",
        description: "The NepaliPay contract is not connected.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading({...isLoading, unblacklist: true});
    setSelectedUser(user);
    
    try {
      // In production, this would call the unblacklistUser method on the contract
      // await nepaliPayContract.unblacklistUser(user.walletAddress);
      
      // For demo purposes:
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the users list
      setUsers(users.map(u => 
        u.id === user.id 
          ? {...u, isBlacklisted: false} 
          : u
      ));
      
      toast({
        title: "User Unblacklisted",
        description: `User ${user.username} has been removed from the blacklist.`,
        variant: "default"
      });
    } catch (error: any) {
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to unblacklist user",
        variant: "destructive"
      });
    } finally {
      setIsLoading({...isLoading, unblacklist: false});
      setSelectedUser(null);
    }
  };

  const viewTransactionHistory = (walletAddress: string) => {
    window.open(`https://bscscan.com/address/${walletAddress}`, '_blank');
  };

  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <DashboardLayout title="User Management">
      <motion.div
        variants={containerAnimation}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <motion.div variants={itemAnimation} className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-muted-foreground">Manage user roles and permissions in the NepaliPay ecosystem</p>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-card/30 backdrop-blur-sm border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Search users..."
            />
          </div>
        </motion.div>

        <motion.div variants={itemAnimation} className="overflow-x-auto rounded-xl bg-card/30 backdrop-blur-sm border border-border/40">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-muted-foreground border-b border-border/40">
                <th className="px-6 py-4 text-left font-medium">Username</th>
                <th className="px-6 py-4 text-left font-medium">Wallet Address</th>
                <th className="px-6 py-4 text-left font-medium">Role</th>
                <th className="px-6 py-4 text-left font-medium">NPT Balance</th>
                <th className="px-6 py-4 text-left font-medium">Outstanding Loans</th>
                <th className="px-6 py-4 text-left font-medium">Status</th>
                <th className="px-6 py-4 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border/10 hover:bg-accent/5">
                    <td className="px-6 py-4">{user.username}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{user.walletAddress.substring(0, 6)}...{user.walletAddress.substring(user.walletAddress.length - 4)}</span>
                        <button 
                          onClick={() => viewTransactionHistory(user.walletAddress)}
                          className="p-1 rounded-md hover:bg-accent/30 text-primary"
                          title="View on BSCscan"
                        >
                          <Link size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user, e.target.value as 'USER' | 'ADMIN' | 'NONE')}
                        disabled={isLoading.changeRole && selectedUser?.id === user.id}
                        className="bg-accent/30 border border-border/40 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="NONE">NONE</option>
                      </select>
                      {isLoading.changeRole && selectedUser?.id === user.id && (
                        <span className="ml-2">
                          <RefreshCw size={14} className="animate-spin inline" />
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">{user.nptBalance}</td>
                    <td className="px-6 py-4">{user.outstandingLoan}</td>
                    <td className="px-6 py-4">
                      {user.isBlacklisted ? (
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
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        {user.isBlacklisted ? (
                          <button
                            onClick={() => handleUnblacklistUser(user)}
                            disabled={isLoading.unblacklist && selectedUser?.id === user.id}
                            className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                            title="Unblacklist User"
                          >
                            {isLoading.unblacklist && selectedUser?.id === user.id ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <UserCheck className="w-4 h-4" />
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBlacklistUser(user)}
                            disabled={isLoading.blacklist && selectedUser?.id === user.id}
                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                            title="Blacklist User"
                          >
                            {isLoading.blacklist && selectedUser?.id === user.id ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <UserX className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-muted-foreground">
                    {searchTerm ? (
                      <div className="flex flex-col items-center py-6">
                        <Search className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p>No users found matching "{searchTerm}"</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center py-6">
                        <AlertTriangle className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p>No users found</p>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>

        <motion.div variants={itemAnimation} className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-yellow-400 font-medium">Important Note</p>
              <p className="mt-1">
                Role changes and blacklisting immediately affect user permissions on the blockchain. 
                These actions are transparent and permanently recorded.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default UserManagementPage;