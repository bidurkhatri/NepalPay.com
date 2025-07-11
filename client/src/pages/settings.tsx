import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EnhancedSwitch } from '@/components/ui/enhanced-switch';
import { AnimatedCard } from '@/components/ui/animated-card';
import { ResponsiveContainer } from '@/components/ui/responsive-container';
import { ResponsiveGrid } from '@/components/layout/responsive-grid';
import { EnhancedButton } from '@/components/ui/enhanced-button';

const SettingsPage: React.FC = () => {
  const { toast } = useToast();

  return (
    <ResponsiveContainer maxWidth="5xl" padding="lg">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">Settings</h1>
        <p className="text-muted-foreground text-lg">Customize your NepaliPay experience</p>
      </div>
      
      <Tabs defaultValue="appearance">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-card/80 backdrop-blur-md border border-border/50">
          <TabsTrigger value="appearance" className="text-sm">Appearance</TabsTrigger>
          <TabsTrigger value="notifications" className="text-sm">Notifications</TabsTrigger>
          <TabsTrigger value="preferences" className="text-sm">Preferences</TabsTrigger>
          <TabsTrigger value="support" className="text-sm">Help & Support</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appearance">
          <AnimatedCard variant="glass" animation="fade" className="mt-6">
            <CardHeader>
              <CardTitle className="text-xl">Appearance Settings</CardTitle>
              <CardDescription>Customize how NepaliPay looks and feels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="space-y-6">
                  <h3 className="font-medium text-lg">Theme</h3>
                  
                  <ResponsiveGrid cols={{ default: 1, sm: 2, md: 3 }} gap="md">
                    <AnimatedCard variant="elevated" animation="scale" delay={0.1} className="relative flex flex-col">
                      <div className="bg-background/80 rounded-md p-4 mb-4 flex-1 flex items-center justify-center min-h-[80px]">
                        <span className="text-sm text-muted-foreground">Dark Theme</span>
                      </div>
                      <EnhancedButton 
                        size="sm" 
                        variant="gradient"
                        className="w-full"
                        onClick={() => {
                          toast({
                            title: 'Theme Updated',
                            description: 'Dark theme applied successfully.',
                          });
                        }}
                      >
                        Selected
                      </EnhancedButton>
                    </AnimatedCard>
                    
                    <AnimatedCard variant="elevated" animation="scale" delay={0.2} className="relative flex flex-col">
                      <div className="bg-white/90 rounded-md p-4 mb-4 flex-1 flex items-center justify-center min-h-[80px]">
                        <span className="text-sm text-black/70">Light Theme</span>
                      </div>
                      <EnhancedButton 
                        size="sm" 
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          toast({
                            title: 'Feature Coming Soon',
                            description: 'Light theme will be available in the next update.',
                          });
                        }}
                      >
                        Select
                      </EnhancedButton>
                    </AnimatedCard>
                    
                    <AnimatedCard variant="elevated" animation="scale" delay={0.3} className="relative flex flex-col">
                      <div className="bg-gradient-to-br from-primary/30 to-background/90 rounded-md p-4 mb-4 flex-1 flex items-center justify-center min-h-[80px]">
                        <span className="text-sm text-white/90">System Theme</span>
                      </div>
                      <EnhancedButton 
                        size="sm" 
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          toast({
                            title: 'Feature Coming Soon',
                            description: 'System theme will be available in the next update.',
                          });
                        }}
                      >
                        Select
                      </EnhancedButton>
                    </AnimatedCard>
                  </ResponsiveGrid>
                </div>
                
                <div className="space-y-6">
                  <h3 className="font-medium text-lg">Accent Color</h3>
                  
                  <ResponsiveGrid cols={{ default: 1, sm: 2, md: 4 }} gap="md">
                    <AnimatedCard variant="glass" animation="fade" delay={0.1} className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-6 w-6 rounded-full bg-blue-500 ring-2 ring-blue-500/30"></div>
                        <div className="flex-1">
                          <Label htmlFor="blue" className="text-sm font-medium">Blue</Label>
                        </div>
                        <EnhancedSwitch id="blue" variant="info" size="sm" checked />
                      </div>
                    </AnimatedCard>
                    
                    <AnimatedCard variant="glass" animation="fade" delay={0.2} className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-6 w-6 rounded-full bg-purple-500 ring-2 ring-purple-500/30"></div>
                        <div className="flex-1">
                          <Label htmlFor="purple" className="text-sm font-medium">Purple</Label>
                        </div>
                        <EnhancedSwitch id="purple" variant="default" size="sm" />
                      </div>
                    </AnimatedCard>
                    
                    <AnimatedCard variant="glass" animation="fade" delay={0.3} className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-6 w-6 rounded-full bg-green-500 ring-2 ring-green-500/30"></div>
                        <div className="flex-1">
                          <Label htmlFor="green" className="text-sm font-medium">Green</Label>
                        </div>
                        <EnhancedSwitch id="green" variant="success" size="sm" />
                      </div>
                    </AnimatedCard>
                    
                    <AnimatedCard variant="glass" animation="fade" delay={0.4} className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-6 w-6 rounded-full bg-amber-500 ring-2 ring-amber-500/30"></div>
                        <div className="flex-1">
                          <Label htmlFor="amber" className="text-sm font-medium">Amber</Label>
                        </div>
                        <EnhancedSwitch id="amber" variant="warning" size="sm" />
                      </div>
                    </AnimatedCard>
                  </ResponsiveGrid>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Font Size</h3>
                  
                  <Select defaultValue="medium">
                    <SelectTrigger className="w-full md:w-[200px] bg-background/50">
                      <SelectValue placeholder="Select font size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  className="w-full"
                  onClick={() => {
                    toast({
                      title: 'Settings Updated',
                      description: 'Your appearance settings have been updated.',
                    });
                  }}
                >
                  Save Appearance Settings
                </Button>
              </div>
            </CardContent>
          </AnimatedCard>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card className="bg-black/40 backdrop-blur-md border-primary/20">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how NepaliPay notifies you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Email Notifications</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-transactions">Transaction Updates</Label>
                      <Switch id="email-transactions" checked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-security">Security Alerts</Label>
                      <Switch id="email-security" checked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-marketing">Marketing & Promotions</Label>
                      <Switch id="email-marketing" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-newsletter">Newsletter</Label>
                      <Switch id="email-newsletter" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Push Notifications</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-transactions">Transaction Updates</Label>
                      <Switch id="push-transactions" checked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-security">Security Alerts</Label>
                      <Switch id="push-security" checked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-marketing">Marketing & Promotions</Label>
                      <Switch id="push-marketing" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-price">Price Alerts</Label>
                      <Switch id="push-price" />
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full"
                  onClick={() => {
                    toast({
                      title: 'Notification Settings Updated',
                      description: 'Your notification preferences have been saved.',
                    });
                  }}
                >
                  Save Notification Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card className="bg-black/40 backdrop-blur-md border-primary/20">
            <CardHeader>
              <CardTitle>User Preferences</CardTitle>
              <CardDescription>Customize your NepaliPay experience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Language</h3>
                  
                  <Select defaultValue="en">
                    <SelectTrigger className="w-full md:w-[200px] bg-background/50">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="np">Nepali</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Currency Display</h3>
                  
                  <Select defaultValue="npt">
                    <SelectTrigger className="w-full md:w-[200px] bg-background/50">
                      <SelectValue placeholder="Select primary currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="npt">NPT (Nepal Token)</SelectItem>
                      <SelectItem value="npr">NPR (Nepalese Rupee)</SelectItem>
                      <SelectItem value="usd">USD (US Dollar)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium">Display Preferences</h3>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pref-balance">Show Balance on Dashboard</Label>
                    <Switch id="pref-balance" checked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pref-animations">Enable Animations</Label>
                    <Switch id="pref-animations" checked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pref-charts">Show Analytics Charts</Label>
                    <Switch id="pref-charts" checked />
                  </div>
                </div>
                
                <Button 
                  className="w-full"
                  onClick={() => {
                    toast({
                      title: 'Preferences Updated',
                      description: 'Your preferences have been saved successfully.',
                    });
                  }}
                >
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="support">
          <Card className="bg-black/40 backdrop-blur-md border-primary/20">
            <CardHeader>
              <CardTitle>Help & Support</CardTitle>
              <CardDescription>Get help with NepaliPay</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border border-primary/20 rounded-lg bg-black/20">
                    <h3 className="font-medium mb-2">Frequently Asked Questions</h3>
                    <p className="text-sm text-muted-foreground mb-4">Find answers to common questions</p>
                    <Button variant="outline" className="w-full"
                      onClick={() => {
                        toast({
                          title: 'Feature Coming Soon',
                          description: 'FAQ page will be available in the next update.',
                        });
                      }}
                    >
                      View FAQs
                    </Button>
                  </div>
                  
                  <div className="p-4 border border-primary/20 rounded-lg bg-black/20">
                    <h3 className="font-medium mb-2">Contact Support</h3>
                    <p className="text-sm text-muted-foreground mb-4">Get help from our support team</p>
                    <Button variant="outline" className="w-full"
                      onClick={() => {
                        toast({
                          title: 'Feature Coming Soon',
                          description: 'Support contact will be available in the next update.',
                        });
                      }}
                    >
                      Contact Support
                    </Button>
                  </div>
                  
                  <div className="p-4 border border-primary/20 rounded-lg bg-black/20">
                    <h3 className="font-medium mb-2">Knowledge Base</h3>
                    <p className="text-sm text-muted-foreground mb-4">Learn how to use NepaliPay features</p>
                    <Button variant="outline" className="w-full"
                      onClick={() => {
                        toast({
                          title: 'Feature Coming Soon',
                          description: 'Knowledge base will be available in the next update.',
                        });
                      }}
                    >
                      Browse Articles
                    </Button>
                  </div>
                  
                  <div className="p-4 border border-primary/20 rounded-lg bg-black/20">
                    <h3 className="font-medium mb-2">Report an Issue</h3>
                    <p className="text-sm text-muted-foreground mb-4">Let us know if something isn't working</p>
                    <Button variant="outline" className="w-full"
                      onClick={() => {
                        toast({
                          title: 'Feature Coming Soon',
                          description: 'Issue reporting will be available in the next update.',
                        });
                      }}
                    >
                      Report Issue
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 border border-primary/20 rounded-lg">
                  <h3 className="font-medium mb-2">About NepaliPay</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Version:</strong> 1.0.0</p>
                    <p><strong>Website:</strong> <a href="https://nepalipay.com" className="text-primary hover:underline">nepalipay.com</a></p>
                    <p><strong>Smart Contract:</strong> <span className="font-mono text-xs">0x1234...5678</span></p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </ResponsiveContainer>
  );
};

export default SettingsPage;