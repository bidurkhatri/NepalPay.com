import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useBlockchain } from '@/contexts/blockchain-context';
import { 
  ArrowLeft, 
  Loader2, 
  Copy, 
  Star, 
  Gift, 
  CheckCircle,
  Users,
  DollarSign,
  Mountain,
  Share2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RewardsPage: React.FC = () => {
  const { 
    isConnected, 
    nptBalance,
    userAddress,
    txCount,
    avatars,
    referralCount,
    claimReferralReward,
    claimCashback,
    claimAvatarBonus
  } = useBlockchain();
  
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  // Processing states
  const [claimingReferral, setClaimingReferral] = useState(false);
  const [claimingCashback, setClaimingCashback] = useState(false);
  const [claimingAvatar, setClaimingAvatar] = useState(false);
  
  // Derived data (in a real app, this would come from the blockchain contracts)
  // Referral values
  const referralLink = `https://nepalipay.com/?ref=${userAddress?.slice(0, 10)}`;
  const referralReward = referralCount * 5; // 5 NPT per referral
  const hasClaimableReferralReward = referralReward > 0;
  
  // Cashback values
  const txCountGoal = 10;
  const txProgress = Math.min(txCount, txCountGoal);
  const txProgressPercent = (txProgress / txCountGoal) * 100;
  const cashbackReward = Math.floor(txCount / txCountGoal) * 1; // 1 NPT per 10 transactions
  const hasClaimableCashback = txCount >= txCountGoal;
  
  // Avatar values
  const totalAvatars = 5;
  const avatarProgress = avatars.length;
  const avatarProgressPercent = (avatarProgress / totalAvatars) * 100;
  const avatarReward = (avatarProgress >= totalAvatars) ? 5 : 0; // 5 NPT for collecting all avatars
  const hasClaimableAvatarReward = avatarProgress >= totalAvatars;
  
  // Copy referral link
  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Copied to Clipboard",
      description: "Referral link copied! Share with friends to earn rewards.",
      variant: "default",
    });
  };
  
  // Handle claiming referral reward
  const handleClaimReferral = async () => {
    if (!hasClaimableReferralReward) return;
    
    try {
      setClaimingReferral(true);
      
      await claimReferralReward();
      
      toast({
        title: "Reward Claimed",
        description: `You've successfully claimed ${referralReward} NPT in referral rewards!`,
        variant: "default",
      });
      
    } catch (error: any) {
      toast({
        title: "Claim Failed",
        description: error.message || "Failed to claim referral reward",
        variant: "destructive",
      });
    } finally {
      setClaimingReferral(false);
    }
  };
  
  // Handle claiming cashback
  const handleClaimCashback = async () => {
    if (!hasClaimableCashback) return;
    
    try {
      setClaimingCashback(true);
      
      await claimCashback();
      
      toast({
        title: "Cashback Claimed",
        description: `You've successfully claimed ${cashbackReward} NPT in cashback rewards!`,
        variant: "default",
      });
      
    } catch (error: any) {
      toast({
        title: "Claim Failed",
        description: error.message || "Failed to claim cashback",
        variant: "destructive",
      });
    } finally {
      setClaimingCashback(false);
    }
  };
  
  // Handle claiming avatar reward
  const handleClaimAvatarReward = async () => {
    if (!hasClaimableAvatarReward) return;
    
    try {
      setClaimingAvatar(true);
      
      await claimAvatarBonus();
      
      toast({
        title: "Avatar Reward Claimed",
        description: `You've successfully claimed ${avatarReward} NPT for completing your avatar collection!`,
        variant: "default",
      });
      
    } catch (error: any) {
      toast({
        title: "Claim Failed",
        description: error.message || "Failed to claim avatar reward",
        variant: "destructive",
      });
    } finally {
      setClaimingAvatar(false);
    }
  };
  
  // Redirect if not connected
  useEffect(() => {
    if (!isConnected) {
      navigate('/login');
    }
  }, [isConnected, navigate]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex flex-col">
      {/* Header with back button and balance */}
      <header className="border-b border-gray-800/60 bg-gray-900/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <Link href="/sections" className="flex items-center text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Back to Dashboard</span>
            </Link>
            
            <div className="flex items-center">
              <div className="text-2xl font-bold gradient-text">Rewards Hub</div>
            </div>
            
            <div className="flex items-center">
              <div className="text-sm text-gray-400 mr-2">Balance:</div>
              <div className="text-white font-medium">{parseFloat(nptBalance).toLocaleString()} NPT</div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow px-4 py-8">
        <div className="max-w-4xl mx-auto grid gap-6">
          {/* Referral Program Section */}
          <div className="cyber-card">
            <div className="card-highlight"></div>
            <div className="card-content p-6">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-500 p-2 rounded-lg mr-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Referral Program</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="glass-panel flex flex-col items-center justify-center p-4 text-center">
                  <div className="text-4xl font-bold text-white mb-2">{referralCount}</div>
                  <div className="text-gray-400 text-sm">Friends Referred</div>
                </div>
                
                <div className="glass-panel flex flex-col items-center justify-center p-4 text-center">
                  <div className="text-4xl font-bold text-white mb-2">{referralReward}</div>
                  <div className="text-gray-400 text-sm">NPT Earned</div>
                </div>
                
                <div className="glass-panel flex flex-col items-center justify-center p-4 text-center">
                  <div className="text-4xl font-bold text-white mb-2">5</div>
                  <div className="text-gray-400 text-sm">NPT Per Referral</div>
                </div>
              </div>
              
              <div className="bg-gray-800/70 rounded-lg p-4 mb-6">
                <div className="text-sm font-medium text-gray-300 mb-2">Your Referral Link</div>
                <div className="flex items-center">
                  <div className="bg-gray-700 text-gray-300 rounded py-2 px-3 flex-grow overflow-hidden text-ellipsis mr-2">
                    {referralLink}
                  </div>
                  <button 
                    onClick={copyReferralLink}
                    className="modern-button-subtle py-2 px-3"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Share this link with friends. They get 2 NPT on signup, you get 5 NPT when they join!
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-gray-400">
                  {hasClaimableReferralReward 
                    ? `${referralReward} NPT available to claim!` 
                    : 'No rewards available yet'}
                </div>
                <button
                  onClick={handleClaimReferral}
                  disabled={!hasClaimableReferralReward || claimingReferral}
                  className={`modern-button px-4 py-2 ${
                    hasClaimableReferralReward ? 'bg-gradient-to-r from-green-600 to-green-500' : 'bg-gray-700 cursor-not-allowed'
                  }`}
                >
                  {claimingReferral ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Claiming...
                    </>
                  ) : (
                    <>
                      <Gift className="mr-2 h-4 w-4" />
                      Claim Rewards
                    </>
                  )}
                </button>
              </div>
              
              <div className="mt-4 flex justify-center">
                <button className="flex items-center text-primary hover:text-primary-dark text-sm">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share via WhatsApp
                </button>
              </div>
            </div>
          </div>
          
          {/* Cashback Offers Section */}
          <div className="cyber-card">
            <div className="card-highlight"></div>
            <div className="card-content p-6">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-amber-500 to-yellow-500 p-2 rounded-lg mr-3">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Cashback Offers</h2>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <div>Transaction Progress</div>
                  <div>{txProgress} of {txCountGoal} transactions</div>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${txProgressPercent}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {hasClaimableCashback
                    ? `Congratulations! You've completed ${Math.floor(txCount / txCountGoal)} transaction goal(s).`
                    : `Complete ${txCountGoal - txProgress} more transactions to earn 1 NPT cashback.`}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="glass-panel flex flex-col items-center justify-center p-4 text-center">
                  <div className="text-4xl font-bold text-white mb-2">{txCount}</div>
                  <div className="text-gray-400 text-sm">Total Transactions</div>
                </div>
                
                <div className="glass-panel flex flex-col items-center justify-center p-4 text-center">
                  <div className="text-4xl font-bold text-white mb-2">{cashbackReward}</div>
                  <div className="text-gray-400 text-sm">NPT Cashback</div>
                </div>
                
                <div className="glass-panel flex flex-col items-center justify-center p-4 text-center">
                  <div className="text-4xl font-bold text-white mb-2">{Math.floor(txCount / txCountGoal)}</div>
                  <div className="text-gray-400 text-sm">Goals Completed</div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-gray-400">
                  {hasClaimableCashback 
                    ? `${cashbackReward} NPT cashback available!` 
                    : 'Complete more transactions to earn cashback'}
                </div>
                <button
                  onClick={handleClaimCashback}
                  disabled={!hasClaimableCashback || claimingCashback}
                  className={`modern-button px-4 py-2 ${
                    hasClaimableCashback ? 'bg-gradient-to-r from-amber-600 to-amber-500' : 'bg-gray-700 cursor-not-allowed'
                  }`}
                >
                  {claimingCashback ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Claiming...
                    </>
                  ) : (
                    <>
                      <DollarSign className="mr-2 h-4 w-4" />
                      Claim Cashback
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Avatar Collection Section */}
          <div className="cyber-card">
            <div className="card-highlight"></div>
            <div className="card-content p-6">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-2 rounded-lg mr-3">
                  <Mountain className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Avatar Collection</h2>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <div>Collection Progress</div>
                  <div>{avatarProgress} of {totalAvatars} avatars</div>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"
                    style={{ width: `${avatarProgressPercent}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {hasClaimableAvatarReward
                    ? "Congratulations! You've collected all avatars."
                    : `Collect ${totalAvatars - avatarProgress} more avatar(s) to earn a bonus 5 NPT.`}
                </div>
              </div>
              
              {/* Avatar display */}
              <div className="grid grid-cols-5 gap-2 mb-6">
                {/* Available avatars */}
                {avatars.map((avatar, index) => (
                  <div key={index} className="relative">
                    <div className="bg-gradient-to-br from-purple-500/30 to-pink-500/30 p-1 rounded-lg">
                      <div className="aspect-square bg-gray-800 rounded flex items-center justify-center overflow-hidden">
                        <div className="text-2xl">{avatar}</div> {/* Using emoji as placeholder */}
                      </div>
                    </div>
                    <div className="absolute -top-1 -right-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                ))}
                
                {/* Locked avatars */}
                {Array.from({ length: totalAvatars - avatarProgress }).map((_, index) => (
                  <div key={index + avatarProgress} className="relative">
                    <div className="bg-gray-800/50 p-1 rounded-lg">
                      <div className="aspect-square bg-gray-800 rounded flex items-center justify-center overflow-hidden opacity-40">
                        <div className="text-2xl">?</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-gray-400">
                  {hasClaimableAvatarReward 
                    ? `${avatarReward} NPT bonus available!` 
                    : 'Complete your collection to earn a bonus'}
                </div>
                <button
                  onClick={handleClaimAvatarReward}
                  disabled={!hasClaimableAvatarReward || claimingAvatar}
                  className={`modern-button px-4 py-2 ${
                    hasClaimableAvatarReward ? 'bg-gradient-to-r from-purple-600 to-pink-500' : 'bg-gray-700 cursor-not-allowed'
                  }`}
                >
                  {claimingAvatar ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Claiming...
                    </>
                  ) : (
                    <>
                      <Star className="mr-2 h-4 w-4" />
                      Claim Bonus
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer with Help Chat */}
      <footer className="py-8 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex justify-center">
          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} NepaliPay. All rights reserved.
          </div>
        </div>
        
        {/* Need Help Chat Bubble - Fixed position */}
        <div className="fixed bottom-6 right-6 z-40">
          <Link href="/support" className="flex items-center glass-card bg-primary/10 py-3 px-5 rounded-full shadow-lg hover:scale-105 transition-transform">
            <div className="relative mr-2 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">?</span>
            </div>
            <span className="font-medium text-primary">Need Help?</span>
          </Link>
        </div>
      </footer>
      
      {/* Processing animation */}
      {(claimingReferral || claimingCashback || claimingAvatar) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full text-center">
            <Loader2 className="h-12 w-12 mx-auto mb-4 text-primary animate-spin" />
            <h3 className="text-xl font-bold text-white mb-2">Processing claim...</h3>
            <p className="text-gray-400">Please wait while your transaction is being confirmed on the blockchain.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardsPage;