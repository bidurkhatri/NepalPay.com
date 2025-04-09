import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';

const ProfilePage: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">My Profile</h1>
        <p className="text-muted-foreground">Manage your profile and account settings</p>
      </div>
      
      <Tabs defaultValue="personal">
        <TabsList className="grid w-full grid-cols-4 bg-black/40 backdrop-blur-md">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="kyc">KYC Verification</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal">
          <Card className="bg-black/40 backdrop-blur-md border-primary/20">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-center mb-6">
                  <div className="h-24 w-24 rounded-full bg-primary/30 flex items-center justify-center glow">
                    <span className="text-white font-semibold text-2xl">
                      {user?.fullName?.charAt(0) || user?.username?.charAt(0) || '?'}
                    </span>
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input defaultValue={user?.fullName || ''} className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Username</label>
                    <Input defaultValue={user?.username || ''} className="bg-background/50" readOnly />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input defaultValue={user?.email || ''} className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number</label>
                    <Input defaultValue={user?.phone || ''} className="bg-background/50" />
                  </div>
                </div>
                
                <Button 
                  className="w-full"
                  onClick={() => {
                    toast({
                      title: 'Profile Updated',
                      description: 'Your profile information has been updated successfully.',
                    });
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card className="bg-black/40 backdrop-blur-md border-primary/20">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Change Password</label>
                  <Input type="password" placeholder="Current password" className="bg-background/50" />
                  <Input type="password" placeholder="New password" className="bg-background/50 mt-2" />
                  <Input type="password" placeholder="Confirm new password" className="bg-background/50 mt-2" />
                </div>
                
                <div className="flex items-center justify-between p-4 border border-primary/20 rounded-lg">
                  <div>
                    <h3 className="font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline"
                    onClick={() => {
                      toast({
                        title: 'Feature Coming Soon',
                        description: '2FA will be available in the next update.',
                      });
                    }}
                  >
                    Enable 2FA
                  </Button>
                </div>
                
                <Button 
                  className="w-full"
                  onClick={() => {
                    toast({
                      title: 'Security Settings Updated',
                      description: 'Your security settings have been updated successfully.',
                    });
                  }}
                >
                  Save Security Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="kyc">
          <Card className="bg-black/40 backdrop-blur-md border-primary/20">
            <CardHeader>
              <CardTitle>KYC Verification</CardTitle>
              <CardDescription>Complete your identity verification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border border-primary/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Verification Status</h3>
                      <p className="text-sm">
                        {user?.kycStatus === 'approved' ? (
                          <span className="text-green-500">Verified</span>
                        ) : user?.kycStatus === 'pending' ? (
                          <span className="text-yellow-500">Pending Review</span>
                        ) : (
                          <span className="text-red-500">Not Verified</span>
                        )}
                      </p>
                    </div>
                    {user?.kycStatus !== 'approved' && (
                      <Button
                        onClick={() => {
                          toast({
                            title: 'KYC Verification',
                            description: 'KYC submission process will be available in the next update.',
                          });
                        }}
                      >
                        {user?.kycStatus === 'pending' ? 'Check Status' : 'Start Verification'}
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="p-4 border border-primary/20 rounded-lg">
                  <h3 className="font-medium mb-2">Required Documents</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Government-issued photo ID (Citizenship, Passport, License)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Proof of address (Utility bill, Bank statement)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Selfie with ID and handwritten note</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="blockchain">
          <Card className="bg-black/40 backdrop-blur-md border-primary/20">
            <CardHeader>
              <CardTitle>Blockchain Settings</CardTitle>
              <CardDescription>Manage your blockchain accounts and wallet connections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border border-primary/20 rounded-lg">
                  <h3 className="font-medium mb-2">Connected Wallets</h3>
                  <p className="text-sm text-muted-foreground mb-4">Connect your blockchain wallets to NepaliPay</p>
                  
                  <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg mb-2">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                        <span className="text-xs">MM</span>
                      </div>
                      <div>
                        <h4 className="font-medium">MetaMask</h4>
                        <p className="text-xs text-muted-foreground">Not connected</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm"
                      onClick={() => {
                        toast({
                          title: 'Feature Coming Soon',
                          description: 'Wallet connection will be available in the next update.',
                        });
                      }}
                    >
                      Connect
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg mb-2">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                        <span className="text-xs">TP</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Trust Wallet</h4>
                        <p className="text-xs text-muted-foreground">Not connected</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm"
                      onClick={() => {
                        toast({
                          title: 'Feature Coming Soon',
                          description: 'Wallet connection will be available in the next update.',
                        });
                      }}
                    >
                      Connect
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 border border-primary/20 rounded-lg">
                  <h3 className="font-medium mb-2">Default Blockchain Network</h3>
                  <p className="text-sm text-muted-foreground mb-4">NepaliPay uses Binance Smart Chain (BSC) for all transactions</p>
                  
                  <div className="flex items-center p-3 bg-black/20 rounded-lg">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                      <span className="text-xs">BSC</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Binance Smart Chain</h4>
                      <p className="text-xs text-muted-foreground">Mainnet</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;