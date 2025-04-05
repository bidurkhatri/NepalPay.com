import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, RefreshCw, CheckCircle, XCircle, Calendar, AlertTriangle, Eye } from 'lucide-react';
import DashboardLayout from './dashboard-layout';
import { useBlockchain } from '@/contexts/blockchain-context';
import { useToast } from '@/hooks/use-toast';

interface Ad {
  id: number;
  username: string;
  walletAddress: string;
  headline: string;
  content: string;
  tier: 'Base' | 'Wings' | 'Crest';
  price: string;
  submissionDate: string;
  startDate?: string;
  expiryDate?: string;
  status: 'Pending' | 'Active' | 'Expired' | 'Rejected';
}

const AdManagementPage: React.FC = () => {
  const { nepaliPayContract } = useBlockchain();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [isLoading, setIsLoading] = useState({
    approve: false,
    reject: false,
    remove: false,
    refreshStatus: false
  });
  const [viewingAdDetails, setViewingAdDetails] = useState<Ad | null>(null);
  const [isAdDetailsOpen, setIsAdDetailsOpen] = useState(false);

  // Mock data - in production this would come from blockchain calls
  const [ads, setAds] = useState<Ad[]>([
    {
      id: 1,
      username: 'prakash.eth',
      walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
      headline: 'Mountain View Cafe',
      content: 'Best coffee with amazing Himalayan views. 10% discount for NPT holders!',
      tier: 'Base',
      price: '150 NPT',
      submissionDate: '2025-04-02',
      status: 'Pending'
    },
    {
      id: 2,
      username: 'binod',
      walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
      headline: 'Kathmandu Tech Solutions',
      content: 'IT services for small businesses. Special rates for NepaliPay users.',
      tier: 'Wings',
      price: '300 NPT',
      submissionDate: '2025-04-01',
      status: 'Pending'
    },
    {
      id: 3,
      username: 'smriti',
      walletAddress: '0x7890abcdef1234567890abcdef1234567890abcd',
      headline: 'Himalayan Trekking Tours',
      content: 'Guided tours through the most beautiful trails. Pay with NPT, get 15% off.',
      tier: 'Crest',
      price: '500 NPT',
      submissionDate: '2025-03-30',
      status: 'Active',
      startDate: '2025-04-01',
      expiryDate: '2025-04-08'
    },
    {
      id: 4,
      username: 'hari',
      walletAddress: '0xef1234567890abcdef1234567890abcdef123456',
      headline: 'Organic Nepali Tea',
      content: 'Pure tea from high-altitude farms. Direct shipping worldwide.',
      tier: 'Base',
      price: '150 NPT',
      submissionDate: '2025-03-29',
      status: 'Active',
      startDate: '2025-03-30',
      expiryDate: '2025-04-06'
    },
    {
      id: 5,
      username: 'sabin',
      walletAddress: '0x567890abcdef1234567890abcdef1234567890ab',
      headline: 'Digital Arts Gallery',
      content: 'Nepali digital artists showcase. NFT sales with NPT payments.',
      tier: 'Wings',
      price: '300 NPT',
      submissionDate: '2025-03-28',
      status: 'Active',
      startDate: '2025-03-29',
      expiryDate: '2025-04-05'
    }
  ]);

  // Filter ads based on search term and tab
  const filterAds = (status: 'Pending' | 'Active' | 'Expired' | 'Rejected') => {
    return ads.filter(ad => {
      const statusMatch = ad.status === status;
      if (!searchTerm) return statusMatch;
      
      const searchLower = searchTerm.toLowerCase();
      return statusMatch && (
        ad.username.toLowerCase().includes(searchLower) ||
        ad.headline.toLowerCase().includes(searchLower) ||
        ad.content.toLowerCase().includes(searchLower) ||
        ad.tier.toLowerCase().includes(searchLower)
      );
    });
  };

  const pendingAds = filterAds('Pending');
  const activeAds = filterAds('Active');

  const handleApproveAd = async (ad: Ad) => {
    if (!nepaliPayContract) {
      toast({
        title: "Contract Not Connected",
        description: "The NepaliPay contract is not connected.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading({...isLoading, approve: true});
    setSelectedAd(ad);
    
    try {
      // In production, this would call the approveAd method on the contract
      // await nepaliPayContract.approveAd(ad.id);
      
      // For demo purposes:
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the ads list
      const today = new Date();
      const startDate = today.toISOString().split('T')[0];
      
      // Set expiry date based on tier
      let daysToAdd = 7; // Default for Base tier
      if (ad.tier === 'Wings') daysToAdd = 14;
      if (ad.tier === 'Crest') daysToAdd = 30;
      
      const expiryDate = new Date();
      expiryDate.setDate(today.getDate() + daysToAdd);
      
      setAds(ads.map(a => 
        a.id === ad.id 
          ? {
              ...a, 
              status: 'Active', 
              startDate: startDate,
              expiryDate: expiryDate.toISOString().split('T')[0]
            } 
          : a
      ));
      
      toast({
        title: "Ad Approved",
        description: `Ad "${ad.headline}" has been approved successfully.`,
        variant: "default"
      });
    } catch (error: any) {
      toast({
        title: "Approval Failed",
        description: error.message || "Failed to approve ad",
        variant: "destructive"
      });
    } finally {
      setIsLoading({...isLoading, approve: false});
      setSelectedAd(null);
    }
  };

  const handleRejectAd = async (ad: Ad) => {
    if (!nepaliPayContract) {
      toast({
        title: "Contract Not Connected",
        description: "The NepaliPay contract is not connected.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading({...isLoading, reject: true});
    setSelectedAd(ad);
    
    try {
      // In production, this would call the rejectAd method on the contract
      // await nepaliPayContract.rejectAd(ad.id);
      
      // For demo purposes:
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the ads list
      setAds(ads.map(a => 
        a.id === ad.id 
          ? {...a, status: 'Rejected'} 
          : a
      ));
      
      toast({
        title: "Ad Rejected",
        description: `Ad "${ad.headline}" has been rejected.`,
        variant: "default"
      });
    } catch (error: any) {
      toast({
        title: "Rejection Failed",
        description: error.message || "Failed to reject ad",
        variant: "destructive"
      });
    } finally {
      setIsLoading({...isLoading, reject: false});
      setSelectedAd(null);
    }
  };

  const handleRemoveAd = async (ad: Ad) => {
    if (!nepaliPayContract) {
      toast({
        title: "Contract Not Connected",
        description: "The NepaliPay contract is not connected.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading({...isLoading, remove: true});
    setSelectedAd(ad);
    
    try {
      // In production, this would call the removeAd method on the contract
      // await nepaliPayContract.removeAd(ad.id);
      
      // For demo purposes:
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the ads list
      setAds(ads.map(a => 
        a.id === ad.id 
          ? {...a, status: 'Expired'} 
          : a
      ));
      
      toast({
        title: "Ad Removed",
        description: `Ad "${ad.headline}" has been removed from active ads.`,
        variant: "default"
      });
    } catch (error: any) {
      toast({
        title: "Removal Failed",
        description: error.message || "Failed to remove ad",
        variant: "destructive"
      });
    } finally {
      setIsLoading({...isLoading, remove: false});
      setSelectedAd(null);
    }
  };

  const handleRefreshStatus = async (ad: Ad) => {
    if (!nepaliPayContract) {
      toast({
        title: "Contract Not Connected",
        description: "The NepaliPay contract is not connected.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading({...isLoading, refreshStatus: true});
    setSelectedAd(ad);
    
    try {
      // In production, this would check the ad status on the blockchain
      // const status = await nepaliPayContract.getAdStatus(ad.id);
      
      // For demo purposes:
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Status Refreshed",
        description: `Ad status verified: ${ad.status}`,
        variant: "default"
      });
    } catch (error: any) {
      toast({
        title: "Refresh Failed",
        description: error.message || "Failed to refresh ad status",
        variant: "destructive"
      });
    } finally {
      setIsLoading({...isLoading, refreshStatus: false});
      setSelectedAd(null);
    }
  };

  const handleViewAdDetails = (ad: Ad) => {
    setViewingAdDetails(ad);
    setIsAdDetailsOpen(true);
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
    <DashboardLayout title="Ad Management">
      <motion.div
        variants={containerAnimation}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <motion.div variants={itemAnimation} className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Ad Bazaar Management</h1>
            <p className="text-muted-foreground">Review and manage ads in the NepaliPay ecosystem</p>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-card/30 backdrop-blur-sm border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Search ads..."
            />
          </div>
        </motion.div>

        <motion.div variants={itemAnimation}>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="pending" className="flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                <span>Pending Ads</span>
                {pendingAds.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-amber-500/20 text-amber-400">
                    {pendingAds.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="active" className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span>Active Ads</span>
                {activeAds.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">
                    {activeAds.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending">
              <div className="overflow-x-auto rounded-xl bg-card/30 backdrop-blur-sm border border-border/40">
                <table className="w-full">
                  <thead>
                    <tr className="text-xs text-muted-foreground border-b border-border/40">
                      <th className="px-6 py-4 text-left font-medium">User</th>
                      <th className="px-6 py-4 text-left font-medium">Ad Content</th>
                      <th className="px-6 py-4 text-left font-medium">Tier</th>
                      <th className="px-6 py-4 text-left font-medium">Price</th>
                      <th className="px-6 py-4 text-left font-medium">Submission Date</th>
                      <th className="px-6 py-4 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingAds.length > 0 ? (
                      pendingAds.map((ad) => (
                        <tr key={ad.id} className="border-b border-border/10 hover:bg-accent/5">
                          <td className="px-6 py-4">
                            <div className="font-medium">{ad.username}</div>
                          </td>
                          <td className="px-6 py-4 max-w-xs">
                            <div>
                              <h4 className="font-medium">{ad.headline}</h4>
                              <p className="text-xs text-muted-foreground line-clamp-1">{ad.content}</p>
                              <button
                                onClick={() => handleViewAdDetails(ad)}
                                className="text-primary text-xs flex items-center mt-1"
                              >
                                <Eye size={12} className="mr-1" />
                                View Details
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              ad.tier === 'Base' 
                                ? 'bg-blue-500/10 text-blue-400'
                                : ad.tier === 'Wings'
                                  ? 'bg-purple-500/10 text-purple-400'
                                  : 'bg-amber-500/10 text-amber-400'
                            }`}>
                              {ad.tier}
                            </span>
                          </td>
                          <td className="px-6 py-4">{ad.price}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                              {ad.submissionDate}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleApproveAd(ad)}
                                disabled={isLoading.approve && selectedAd?.id === ad.id}
                                className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                                title="Approve Ad"
                              >
                                {isLoading.approve && selectedAd?.id === ad.id ? (
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="w-4 h-4" />
                                )}
                              </button>
                              
                              <button
                                onClick={() => handleRejectAd(ad)}
                                disabled={isLoading.reject && selectedAd?.id === ad.id}
                                className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                title="Reject Ad"
                              >
                                {isLoading.reject && selectedAd?.id === ad.id ? (
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                  <XCircle className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-muted-foreground">
                          <div className="flex flex-col items-center py-6">
                            <CheckCircle className="w-8 h-8 mb-2 text-green-400" />
                            <p>No pending ads found</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="active">
              <div className="overflow-x-auto rounded-xl bg-card/30 backdrop-blur-sm border border-border/40">
                <table className="w-full">
                  <thead>
                    <tr className="text-xs text-muted-foreground border-b border-border/40">
                      <th className="px-6 py-4 text-left font-medium">Ad ID / User</th>
                      <th className="px-6 py-4 text-left font-medium">Ad Content</th>
                      <th className="px-6 py-4 text-left font-medium">Tier</th>
                      <th className="px-6 py-4 text-left font-medium">Start Date</th>
                      <th className="px-6 py-4 text-left font-medium">Expiry Date</th>
                      <th className="px-6 py-4 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeAds.length > 0 ? (
                      activeAds.map((ad) => (
                        <tr key={ad.id} className="border-b border-border/10 hover:bg-accent/5">
                          <td className="px-6 py-4">
                            <div className="text-xs text-muted-foreground mb-1">ID: {ad.id}</div>
                            <div className="font-medium">{ad.username}</div>
                          </td>
                          <td className="px-6 py-4 max-w-xs">
                            <div>
                              <h4 className="font-medium">{ad.headline}</h4>
                              <p className="text-xs text-muted-foreground line-clamp-1">{ad.content}</p>
                              <button
                                onClick={() => handleViewAdDetails(ad)}
                                className="text-primary text-xs flex items-center mt-1"
                              >
                                <Eye size={12} className="mr-1" />
                                View Details
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              ad.tier === 'Base' 
                                ? 'bg-blue-500/10 text-blue-400'
                                : ad.tier === 'Wings'
                                  ? 'bg-purple-500/10 text-purple-400'
                                  : 'bg-amber-500/10 text-amber-400'
                            }`}>
                              {ad.tier}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                              {ad.startDate}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                              {ad.expiryDate}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleRefreshStatus(ad)}
                                disabled={isLoading.refreshStatus && selectedAd?.id === ad.id}
                                className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                title="Refresh Status"
                              >
                                {isLoading.refreshStatus && selectedAd?.id === ad.id ? (
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                  <RefreshCw className="w-4 h-4" />
                                )}
                              </button>
                              
                              <button
                                onClick={() => handleRemoveAd(ad)}
                                disabled={isLoading.remove && selectedAd?.id === ad.id}
                                className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                title="Remove Ad"
                              >
                                {isLoading.remove && selectedAd?.id === ad.id ? (
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                  <XCircle className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-muted-foreground">
                          <div className="flex flex-col items-center py-6">
                            <AlertTriangle className="w-8 h-8 mb-2 text-muted-foreground" />
                            <p>No active ads found</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Ad Details Dialog */}
        {isAdDetailsOpen && viewingAdDetails && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            <div className="bg-card rounded-xl border border-border/40 p-6 w-full max-w-lg">
              <h3 className="text-lg font-bold mb-2">{viewingAdDetails.headline}</h3>
              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <span>By {viewingAdDetails.username}</span>
                <span className="mx-2">•</span>
                <span>{viewingAdDetails.tier} Tier</span>
                <span className="mx-2">•</span>
                <span>{viewingAdDetails.price}</span>
              </div>
              
              <div className="p-4 bg-accent/30 rounded-lg mb-4">
                <p>{viewingAdDetails.content}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-card/50 rounded-lg">
                  <div className="text-xs text-muted-foreground">Submission Date</div>
                  <div className="font-medium">{viewingAdDetails.submissionDate}</div>
                </div>
                
                {viewingAdDetails.status === 'Active' && (
                  <>
                    <div className="p-3 bg-card/50 rounded-lg">
                      <div className="text-xs text-muted-foreground">Status</div>
                      <div className="font-medium text-green-400">Active</div>
                    </div>
                    <div className="p-3 bg-card/50 rounded-lg">
                      <div className="text-xs text-muted-foreground">Start Date</div>
                      <div className="font-medium">{viewingAdDetails.startDate}</div>
                    </div>
                    <div className="p-3 bg-card/50 rounded-lg">
                      <div className="text-xs text-muted-foreground">Expiry Date</div>
                      <div className="font-medium">{viewingAdDetails.expiryDate}</div>
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex justify-end gap-3">
                {viewingAdDetails.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => {
                        handleApproveAd(viewingAdDetails);
                        setIsAdDetailsOpen(false);
                      }}
                      className="px-4 py-2 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        handleRejectAd(viewingAdDetails);
                        setIsAdDetailsOpen(false);
                      }}
                      className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => setIsAdDetailsOpen(false)}
                  className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <motion.div variants={itemAnimation} className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-yellow-400 font-medium">Ad Approval Guidelines</p>
              <p className="mt-1">
                All ads must comply with NepaliPay's content policy. Approval/rejection decisions 
                are recorded on the blockchain and are transparent to all users.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdManagementPage;