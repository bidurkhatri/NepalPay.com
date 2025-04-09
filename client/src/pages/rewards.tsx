import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Copy } from 'lucide-react';

const RewardsPage: React.FC = () => {
  const { toast } = useToast();

  const handleCopyReferral = () => {
    navigator.clipboard.writeText('NPTREF12345');
    toast({
      title: 'Referral Code Copied',
      description: 'Your referral code has been copied to clipboard',
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">Rewards & Referrals</h1>
        <p className="text-muted-foreground">Earn rewards and refer friends to NepaliPay</p>
      </div>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <Card className="bg-black/40 backdrop-blur-md border-primary/20">
          <CardHeader>
            <CardTitle>My Rewards</CardTitle>
            <CardDescription>Your earned rewards and points</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex justify-between items-center p-4 border border-primary/20 rounded-lg bg-black/20">
                <div>
                  <h3 className="font-medium">Total Points</h3>
                  <p className="text-3xl font-bold gradient-text">0</p>
                </div>
                <Button
                  onClick={() => {
                    toast({
                      title: 'Feature Coming Soon',
                      description: 'Redeeming points will be available in the next update.',
                    });
                  }}
                >
                  Redeem Points
                </Button>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Recent Rewards</h3>
                <p className="text-center text-muted-foreground py-6">No rewards earned yet</p>
              </div>
              
              <div className="p-4 border border-primary/20 rounded-lg">
                <h3 className="font-medium mb-2">How to Earn Points</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Complete your profile (+50 points)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>First transaction (+100 points)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Refer a friend (+200 points per referral)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Monthly transactions (+10 points each)</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 backdrop-blur-md border-primary/20">
          <CardHeader>
            <CardTitle>Referral Program</CardTitle>
            <CardDescription>Invite friends and earn rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-4 border border-primary/20 rounded-lg bg-black/20">
                <h3 className="font-medium mb-2">Your Referral Code</h3>
                <div className="flex items-center">
                  <code className="flex-1 p-2 rounded bg-black/40 font-mono">NPTREF12345</code>
                  <Button size="sm" variant="outline" className="ml-2" onClick={handleCopyReferral}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="p-4 border border-primary/20 rounded-lg">
                <h3 className="font-medium mb-2">Referral Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Referrals</p>
                    <p className="text-xl font-bold">0</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Points Earned</p>
                    <p className="text-xl font-bold">0</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border border-primary/20 rounded-lg">
                <h3 className="font-medium mb-2">Referral Rewards</h3>
                <p className="text-sm mb-4">For each friend who signs up using your referral code:</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>You earn 200 points</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Your friend gets 100 points</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Earn 5% of their transaction fees for 3 months</span>
                  </li>
                </ul>
              </div>
              
              <Button 
                className="w-full"
                onClick={() => {
                  toast({
                    title: 'Share Feature Coming Soon',
                    description: 'Sharing your referral code will be available in the next update.',
                  });
                }}
              >
                Share Referral Code
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RewardsPage;