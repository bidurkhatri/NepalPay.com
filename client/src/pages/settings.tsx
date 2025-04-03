import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useSettings, ThemeType, DisplayMode, AccentColor, Language, CurrencyFormat, DateFormat } from '@/contexts/settings-context';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import MobileNavigation from '@/components/mobile-navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Paintbrush, Globe, Moon, Sun, Languages, Shield, Bell, Volume2, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { settings, updateTheme, updateDisplayMode, updateAccentColor, updateLanguage, 
          updateCurrencyFormat, updateDateFormat, updateNotificationSetting, 
          toggleTwoFactor, resetSettings, saveSettings } = useSettings();
  const { toast } = useToast();
  
  // Used for simulating actions
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({
    saveAppearance: false,
    saveLang: false,
    saveNotifications: false,
    savePrivacy: false,
    twoFactor: false,
    testNotification: false,
    sessions: false,
    dataPrivacy: false,
  });

  if (!user) return null;
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen relative">
      <Sidebar />
      
      <main className="flex-1 flex flex-col pb-16 md:pb-0">
        <Header />

        <div className="flex-1 py-6 px-4 sm:px-6 lg:px-8 bg-black/80">
          <div className="max-w-4xl mx-auto">
            {/* Page Heading */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold gradient-text">Settings</h1>
              <p className="text-gray-400 mt-1">Customize your application preferences</p>
            </div>

            <Tabs defaultValue="appearance" className="w-full">
              <TabsList className="grid grid-cols-4 w-full bg-black/50 border border-primary/30 text-white">
                <TabsTrigger value="appearance" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-white hover:text-primary/90">
                  <Paintbrush className="h-4 w-4 mr-1 inline" />
                  <span className="hidden sm:inline">Appearance</span>
                </TabsTrigger>
                <TabsTrigger value="language" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-white hover:text-primary/90">
                  <Globe className="h-4 w-4 mr-1 inline" />
                  <span className="hidden sm:inline">Language</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-white hover:text-primary/90">
                  <Bell className="h-4 w-4 mr-1 inline" />
                  <span className="hidden sm:inline">Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="privacy" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-white hover:text-primary/90">
                  <Shield className="h-4 w-4 mr-1 inline" />
                  <span className="hidden sm:inline">Privacy</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="appearance" className="mt-4">
                <Card className="bg-black/40 border-primary/20 text-white">
                  <CardHeader>
                    <CardTitle>Appearance Settings</CardTitle>
                    <CardDescription className="text-white/70">
                      Customize how the application looks
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-md font-medium">Theme</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <div 
                            className={`cyber-card glass rounded-md p-4 border-2 ${settings.theme === 'cyber' ? 'border-primary glow' : 'border-gray-700'} text-center cursor-pointer`}
                            onClick={() => updateTheme('cyber')}
                          >
                            <div className="h-24 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-md flex items-center justify-center">
                              <span className="gradient-text font-bold text-lg">Cyber</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-center">
                            <Label htmlFor="theme-cyber" className="mr-2">Select</Label>
                            <Switch 
                              id="theme-cyber" 
                              checked={settings.theme === 'cyber'} 
                              onCheckedChange={() => updateTheme('cyber')}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div 
                            className={`rounded-md p-4 border-2 ${settings.theme === 'dark' ? 'border-primary glow' : 'border-gray-700'} text-center cursor-pointer`}
                            onClick={() => updateTheme('dark')}
                          >
                            <div className="h-24 bg-gray-800 rounded-md flex items-center justify-center">
                              <span className="text-white font-bold text-lg">Dark</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-center">
                            <Label htmlFor="theme-dark" className="mr-2">Select</Label>
                            <Switch 
                              id="theme-dark" 
                              checked={settings.theme === 'dark'} 
                              onCheckedChange={() => updateTheme('dark')}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div 
                            className={`rounded-md p-4 border-2 ${settings.theme === 'light' ? 'border-primary glow' : 'border-gray-300'} text-center cursor-pointer`}
                            onClick={() => updateTheme('light')}
                          >
                            <div className="h-24 bg-gray-100 rounded-md flex items-center justify-center">
                              <span className="text-gray-900 font-bold text-lg">Light</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-center">
                            <Label htmlFor="theme-light" className="mr-2">Select</Label>
                            <Switch 
                              id="theme-light" 
                              checked={settings.theme === 'light'} 
                              onCheckedChange={() => updateTheme('light')}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-md font-medium">Display Mode</h3>
                      <div className="flex space-x-4">
                        <Button 
                          variant="outline" 
                          className={`border-primary/50 ${settings.displayMode === 'light' ? 'bg-primary/30' : 'bg-primary/10'} text-white flex items-center space-x-2`}
                          onClick={() => updateDisplayMode('light')}
                        >
                          <Sun className="h-4 w-4" />
                          <span>Light</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          className={`border-primary/50 ${settings.displayMode === 'dark' ? 'bg-primary/30' : 'bg-primary/10'} text-white flex items-center space-x-2`}
                          onClick={() => updateDisplayMode('dark')}
                        >
                          <Moon className="h-4 w-4" />
                          <span>Dark</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          className={`border-primary/50 ${settings.displayMode === 'auto' ? 'bg-primary/30' : 'bg-primary/10'} text-white flex items-center space-x-2`}
                          onClick={() => updateDisplayMode('auto')}
                        >
                          <span>Auto</span>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-md font-medium">Accent Color</h3>
                      <div className="flex space-x-4">
                        <div 
                          className={`w-8 h-8 rounded-full bg-primary cursor-pointer ${settings.accentColor === 'default' ? 'ring-2 ring-white' : ''}`}
                          onClick={() => updateAccentColor('default')}
                        />
                        <div 
                          className={`w-8 h-8 rounded-full bg-blue-500 cursor-pointer ${settings.accentColor === 'blue' ? 'ring-2 ring-white' : ''}`}
                          onClick={() => updateAccentColor('blue')}
                        />
                        <div 
                          className={`w-8 h-8 rounded-full bg-green-500 cursor-pointer ${settings.accentColor === 'green' ? 'ring-2 ring-white' : ''}`}
                          onClick={() => updateAccentColor('green')}
                        />
                        <div 
                          className={`w-8 h-8 rounded-full bg-purple-500 cursor-pointer ${settings.accentColor === 'purple' ? 'ring-2 ring-white' : ''}`}
                          onClick={() => updateAccentColor('purple')}
                        />
                        <div 
                          className={`w-8 h-8 rounded-full bg-red-500 cursor-pointer ${settings.accentColor === 'red' ? 'ring-2 ring-white' : ''}`}
                          onClick={() => updateAccentColor('red')}
                        />
                        <div 
                          className={`w-8 h-8 rounded-full bg-orange-500 cursor-pointer ${settings.accentColor === 'orange' ? 'ring-2 ring-white' : ''}`}
                          onClick={() => updateAccentColor('orange')}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="bg-gradient-to-r from-primary to-purple-500 hover:opacity-90 mr-2"
                      onClick={() => {
                        setLoading(prev => ({ ...prev, saveAppearance: true }));
                        saveSettings();
                        setTimeout(() => {
                          setLoading(prev => ({ ...prev, saveAppearance: false }));
                          toast({
                            title: "Appearance settings saved",
                            description: "Your appearance settings have been updated",
                            variant: "default",
                          });
                        }, 500);
                      }}
                      disabled={loading.saveAppearance}
                    >
                      {loading.saveAppearance ? (
                        <>
                          <span className="mr-2">Saving...</span>
                          <span className="animate-spin">⏳</span>
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-primary/50 text-white hover:bg-primary/20"
                      onClick={resetSettings}
                      disabled={loading.saveAppearance}
                    >
                      Reset
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="language" className="mt-4">
                <Card className="bg-black/40 border-primary/20 text-white">
                  <CardHeader>
                    <CardTitle>Language & Region</CardTitle>
                    <CardDescription className="text-white/70">
                      Set your language and regional preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="language">Display Language</Label>
                          <p className="text-sm text-white/60">
                            Choose the language for the user interface
                          </p>
                        </div>
                        <Select 
                          value={settings.language} 
                          onValueChange={value => updateLanguage(value as Language)}
                        >
                          <SelectTrigger className="w-[180px] bg-black/30 border-primary/30 text-white">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent className="bg-black/90 border-primary/30 text-white">
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="np">Nepali</SelectItem>
                            <SelectItem value="hi">Hindi</SelectItem>
                            <SelectItem value="zh">Chinese</SelectItem>
                            <SelectItem value="ja">Japanese</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="language">Currency Format</Label>
                          <p className="text-sm text-white/60">
                            Choose how currencies are displayed
                          </p>
                        </div>
                        <Select 
                          value={settings.currencyFormat} 
                          onValueChange={value => updateCurrencyFormat(value as CurrencyFormat)}
                        >
                          <SelectTrigger className="w-[180px] bg-black/30 border-primary/30 text-white">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent className="bg-black/90 border-primary/30 text-white">
                            <SelectItem value="npr">Nepali Rupee (NPR)</SelectItem>
                            <SelectItem value="usd">US Dollar (USD)</SelectItem>
                            <SelectItem value="eur">Euro (EUR)</SelectItem>
                            <SelectItem value="gbp">British Pound (GBP)</SelectItem>
                            <SelectItem value="jpy">Japanese Yen (JPY)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="language">Date Format</Label>
                          <p className="text-sm text-white/60">
                            Choose how dates are displayed
                          </p>
                        </div>
                        <Select 
                          value={settings.dateFormat} 
                          onValueChange={value => updateDateFormat(value as DateFormat)}
                        >
                          <SelectTrigger className="w-[180px] bg-black/30 border-primary/30 text-white">
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent className="bg-black/90 border-primary/30 text-white">
                            <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                            <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                            <SelectItem value="ymd">YYYY/MM/DD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="bg-gradient-to-r from-primary to-purple-500 hover:opacity-90"
                      onClick={() => {
                        setLoading(prev => ({ ...prev, saveLang: true }));
                        saveSettings();
                        setTimeout(() => {
                          setLoading(prev => ({ ...prev, saveLang: false }));
                          toast({
                            title: "Language & Region settings saved",
                            description: "Your language and regional preferences have been updated",
                            variant: "default",
                          });
                        }, 500);
                      }}
                      disabled={loading.saveLang}
                    >
                      {loading.saveLang ? (
                        <>
                          <span className="mr-2">Saving...</span>
                          <span className="animate-spin">⏳</span>
                        </>
                      ) : (
                        "Save Preferences"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="mt-4">
                <Card className="bg-black/40 border-primary/20 text-white">
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription className="text-white/70">
                      Manage your notification preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="flex items-center">
                            <Bell className="h-4 w-4 mr-2 text-primary" />
                            <Label>Transaction Alerts</Label>
                          </div>
                          <p className="text-sm text-white/60">
                            Get notified for all transactions
                          </p>
                        </div>
                        <Switch 
                          checked={settings.notifications.transactionAlerts} 
                          onCheckedChange={checked => updateNotificationSetting('transactionAlerts', checked)} 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="flex items-center">
                            <Shield className="h-4 w-4 mr-2 text-primary" />
                            <Label>Security Alerts</Label>
                          </div>
                          <p className="text-sm text-white/60">
                            Get notified about security updates
                          </p>
                        </div>
                        <Switch 
                          checked={settings.notifications.securityAlerts} 
                          onCheckedChange={checked => updateNotificationSetting('securityAlerts', checked)} 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="flex items-center">
                            <Bell className="h-4 w-4 mr-2 text-primary" />
                            <Label>Marketing Updates</Label>
                          </div>
                          <p className="text-sm text-white/60">
                            Receive news and promotional offers
                          </p>
                        </div>
                        <Switch 
                          checked={settings.notifications.marketingUpdates} 
                          onCheckedChange={checked => updateNotificationSetting('marketingUpdates', checked)} 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="flex items-center">
                            <Volume2 className="h-4 w-4 mr-2 text-primary" />
                            <Label>Sound Alerts</Label>
                          </div>
                          <p className="text-sm text-white/60">
                            Play sounds for notifications
                          </p>
                        </div>
                        <Switch 
                          checked={settings.notifications.soundAlerts} 
                          onCheckedChange={checked => updateNotificationSetting('soundAlerts', checked)} 
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="bg-gradient-to-r from-primary to-purple-500 hover:opacity-90 mr-2"
                      onClick={() => {
                        setLoading(prev => ({ ...prev, saveNotifications: true }));
                        saveSettings();
                        setTimeout(() => {
                          setLoading(prev => ({ ...prev, saveNotifications: false }));
                          toast({
                            title: "Notification settings saved",
                            description: "Your notification preferences have been updated",
                            variant: "default",
                          });
                        }, 500);
                      }}
                      disabled={loading.saveNotifications}
                    >
                      {loading.saveNotifications ? (
                        <>
                          <span className="mr-2">Saving...</span>
                          <span className="animate-spin">⏳</span>
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-primary/50 text-white hover:bg-primary/20"
                      onClick={() => {
                        setLoading(prev => ({ ...prev, testNotification: true }));
                        setTimeout(() => {
                          setLoading(prev => ({ ...prev, testNotification: false }));
                          toast({
                            title: "Test Notification",
                            description: "This is a test notification. If you can see this, notifications are working!",
                            variant: "default",
                          });
                        }, 500);
                      }}
                      disabled={loading.testNotification}
                    >
                      {loading.testNotification ? (
                        <span className="animate-spin">⏳</span>
                      ) : (
                        "Test Notification"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="privacy" className="mt-4">
                <Card className="bg-black/40 border-primary/20 text-white">
                  <CardHeader>
                    <CardTitle>Privacy & Security</CardTitle>
                    <CardDescription className="text-white/70">
                      Manage your privacy and security settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Two-Factor Authentication</Label>
                          <p className="text-sm text-white/60">
                            Add an extra layer of security
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          className="border-primary/50 bg-primary/10 text-white hover:bg-primary/20"
                          onClick={() => {
                            setLoading(prev => ({ ...prev, twoFactor: true }));
                            toggleTwoFactor();
                            setTimeout(() => {
                              setLoading(prev => ({ ...prev, twoFactor: false }));
                              toast({
                                title: settings.twoFactorEnabled ? "Two-Factor Authentication Disabled" : "Two-Factor Authentication Enabled",
                                description: settings.twoFactorEnabled ? 
                                  "Two-factor authentication has been disabled. Your account is now less secure." : 
                                  "Two-factor authentication has been enabled. Your account is now more secure.",
                                variant: settings.twoFactorEnabled ? "destructive" : "default",
                              });
                            }, 800);
                          }}
                          disabled={loading.twoFactor}
                        >
                          {loading.twoFactor ? (
                            <span className="animate-spin">⏳</span>
                          ) : settings.twoFactorEnabled ? (
                            "Disable"
                          ) : (
                            "Enable"
                          )}
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Session Management</Label>
                          <p className="text-sm text-white/60">
                            Manage your active sessions
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          className="border-primary/50 bg-primary/10 text-white hover:bg-primary/20"
                          onClick={() => {
                            setLoading(prev => ({ ...prev, sessions: true }));
                            setTimeout(() => {
                              setLoading(prev => ({ ...prev, sessions: false }));
                              toast({
                                title: "Session Management",
                                description: "This feature will be available in a future update.",
                                variant: "default",
                              });
                            }, 600);
                          }}
                          disabled={loading.sessions}
                        >
                          {loading.sessions ? (
                            <span className="animate-spin">⏳</span>
                          ) : (
                            "View Sessions"
                          )}
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Data Privacy</Label>
                          <p className="text-sm text-white/60">
                            Control how your data is used
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          className="border-primary/50 bg-primary/10 text-white hover:bg-primary/20"
                          onClick={() => {
                            setLoading(prev => ({ ...prev, privacy: true }));
                            setTimeout(() => {
                              setLoading(prev => ({ ...prev, privacy: false }));
                              toast({
                                title: "Data Privacy Settings",
                                description: "Data privacy management will be available in a future update.",
                                variant: "default",
                              });
                            }, 600);
                          }}
                          disabled={loading.privacy}
                        >
                          {loading.privacy ? (
                            <span className="animate-spin">⏳</span>
                          ) : (
                            "Manage"
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="bg-gradient-to-r from-primary to-purple-500 hover:opacity-90"
                      onClick={() => {
                        setLoading(prev => ({ ...prev, savePrivacy: true }));
                        saveSettings();
                        setTimeout(() => {
                          setLoading(prev => ({ ...prev, savePrivacy: false }));
                          toast({
                            title: "Privacy settings saved",
                            description: "Your privacy and security preferences have been updated",
                            variant: "default",
                          });
                        }, 500);
                      }}
                      disabled={loading.savePrivacy}
                    >
                      {loading.savePrivacy ? (
                        <>
                          <span className="mr-2">Saving...</span>
                          <span className="animate-spin">⏳</span>
                        </>
                      ) : (
                        "Save Preferences"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <MobileNavigation />
      </main>
    </div>
  );
};

export default SettingsPage;