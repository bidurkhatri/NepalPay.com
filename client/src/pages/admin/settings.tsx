import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, User, Shield, AlertTriangle, Check, X } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import DashboardLayout from './dashboard-layout';
import { useBlockchain } from '@/contexts/blockchain-context';
import { useToast } from '@/hooks/use-toast';

const SettingsPage: React.FC = () => {
  const { userAddress, username, userRole } = useBlockchain();
  const { toast } = useToast();
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    loanOverdue: true,
    adApprovalRequired: true,
    newUsers: false,
    systemStatus: true
  });

  const handleNotificationChange = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    });
    
    toast({
      title: "Settings Updated",
      description: `${setting} notifications ${notificationSettings[setting] ? 'disabled' : 'enabled'}`,
      variant: "default"
    });
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
    <DashboardLayout title="Settings">
      <motion.div
        variants={containerAnimation}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        <motion.div variants={itemAnimation}>
          <h1 className="text-2xl font-bold mb-2">Admin Settings</h1>
          <p className="text-muted-foreground">Manage your admin account settings and preferences</p>
        </motion.div>

        {/* Admin Account */}
        <motion.div variants={itemAnimation} className="space-y-6">
          <div className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            <h2 className="text-lg font-medium">Admin Account</h2>
          </div>
          
          <div className="rounded-xl bg-card/30 backdrop-blur-sm border border-border/40 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Admin Information</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs">Username</Label>
                    <div className="bg-accent/30 p-3 rounded-lg mt-1">{username || 'Not set'}</div>
                  </div>
                  
                  <div>
                    <Label className="text-xs">Role</Label>
                    <div className="bg-accent/30 p-3 rounded-lg mt-1 flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-primary" />
                      {userRole}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Blockchain Identity</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs">Wallet Address</Label>
                    <div className="bg-accent/30 p-3 rounded-lg font-mono text-sm break-all mt-1">
                      {userAddress || 'Not connected'}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-xs">Blockchain Connection</Label>
                    <div className="flex items-center mt-1">
                      <div className="h-2 w-2 rounded-full bg-green-400 mr-2"></div>
                      <span className="text-sm text-green-400">Connected to Binance Smart Chain</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-border/40">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Admin Portal</h3>
                  <p className="text-sm text-muted-foreground">Manage your role in the NepaliPay ecosystem</p>
                </div>
                <a
                  href="https://bscscan.com/address/0xe2d189f6696ee8b247ceae97fe3f1f2879054553#code"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors text-sm"
                >
                  View Contract
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Notifications & Alerts */}
        <motion.div variants={itemAnimation} className="space-y-6">
          <div className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            <h2 className="text-lg font-medium">Notifications & Alerts</h2>
          </div>
          
          <div className="rounded-xl bg-card/30 backdrop-blur-sm border border-border/40 p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-6">
              Configure which blockchain events trigger notifications
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Loan Overdue Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts when user loans become overdue
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.loanOverdue}
                  onCheckedChange={() => handleNotificationChange('loanOverdue')}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Ad Approval Required</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when new ads are waiting for approval
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.adApprovalRequired}
                  onCheckedChange={() => handleNotificationChange('adApprovalRequired')}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">New User Registrations</Label>
                  <p className="text-sm text-muted-foreground">
                    Be alerted when new users register on NepaliPay
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.newUsers}
                  onCheckedChange={() => handleNotificationChange('newUsers')}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">System Status Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Critical system and blockchain network alerts
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.systemStatus}
                  onCheckedChange={() => handleNotificationChange('systemStatus')}
                />
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-border/40 flex justify-end">
              <button
                onClick={() => {
                  toast({
                    title: "Notification Settings Saved",
                    description: "Your notification preferences have been updated."
                  });
                }}
                className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors text-sm"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </motion.div>

        {/* Security Notice */}
        <motion.div variants={itemAnimation} className="p-6 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-yellow-400">Security Notice</h3>
              <p className="text-sm mt-2">
                Your admin access is tied to your blockchain wallet address. Never share your private keys 
                or seed phrase. All admin actions are recorded on the blockchain and are transparent.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="flex items-start">
                  <Check className="w-4 h-4 text-green-400 mt-1 mr-2" />
                  <p className="text-sm">Use a hardware wallet for enhanced security</p>
                </div>
                <div className="flex items-start">
                  <Check className="w-4 h-4 text-green-400 mt-1 mr-2" />
                  <p className="text-sm">Double-check all transactions before approving</p>
                </div>
                <div className="flex items-start">
                  <X className="w-4 h-4 text-red-400 mt-1 mr-2" />
                  <p className="text-sm">Never approve transactions from unknown sources</p>
                </div>
                <div className="flex items-start">
                  <X className="w-4 h-4 text-red-400 mt-1 mr-2" />
                  <p className="text-sm">Don't use shared computers for admin access</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default SettingsPage;