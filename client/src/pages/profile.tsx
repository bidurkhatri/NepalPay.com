import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import MobileNavigation from '@/components/mobile-navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, ShieldCheck, Clock, Bell, Mail, Phone } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/lib/icons';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const initials = getInitials(user.firstName, user.lastName);

  return (
    <div className="flex flex-col md:flex-row min-h-screen relative">
      <Sidebar />
      
      <main className="flex-1 flex flex-col pb-16 md:pb-0">
        <Header />

        <div className="flex-1 py-6 px-4 sm:px-6 lg:px-8 bg-black/80">
          <div className="max-w-4xl mx-auto">
            {/* Page Heading */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold gradient-text">My Profile</h1>
              <p className="text-gray-400 mt-1">Manage your account information and settings</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Profile Card */}
              <Card className="lg:col-span-1 bg-black/40 border-primary/20 text-white">
                <CardHeader className="pb-4 flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 bg-primary/30 glow">
                    <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="mt-4">{`${user.firstName} ${user.lastName}`}</CardTitle>
                  <CardDescription className="text-primary/70">{user.username}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-sm text-white/70 mb-4">
                    <p>{user.email}</p>
                    <p>{user.phoneNumber || 'No phone number'}</p>
                  </div>
                  <div className="flex justify-center space-x-4">
                    <Button variant="outline" size="sm" className="border-primary/50 bg-primary/10 text-white hover:bg-primary/20">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="border-primary/50 bg-primary/10 text-white hover:bg-primary/20">
                      Change Photo
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Settings Tabs */}
              <div className="lg:col-span-3">
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid grid-cols-4 w-full bg-black/50 border border-primary/30">
                    <TabsTrigger value="personal" className="data-[state=active]:bg-primary/20">
                      <User className="h-4 w-4 mr-1 inline" />
                      <span className="hidden sm:inline">Personal</span>
                    </TabsTrigger>
                    <TabsTrigger value="security" className="data-[state=active]:bg-primary/20">
                      <ShieldCheck className="h-4 w-4 mr-1 inline" />
                      <span className="hidden sm:inline">Security</span>
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="data-[state=active]:bg-primary/20">
                      <Clock className="h-4 w-4 mr-1 inline" />
                      <span className="hidden sm:inline">Activity</span>
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="data-[state=active]:bg-primary/20">
                      <Bell className="h-4 w-4 mr-1 inline" />
                      <span className="hidden sm:inline">Notifications</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="personal" className="mt-4">
                    <Card className="bg-black/40 border-primary/20 text-white">
                      <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription className="text-white/70">
                          Update your personal details
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input 
                              id="firstName" 
                              defaultValue={user.firstName} 
                              className="bg-black/30 border-primary/30 focus-visible:ring-primary text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input 
                              id="lastName" 
                              defaultValue={user.lastName} 
                              className="bg-black/30 border-primary/30 focus-visible:ring-primary text-white"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <div className="flex">
                            <Input 
                              id="email" 
                              type="email"
                              defaultValue={user.email}
                              className="bg-black/30 border-primary/30 focus-visible:ring-primary text-white flex-1"
                            />
                            <Mail className="ml-2 h-4 w-4 opacity-50 self-center" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <div className="flex">
                            <Input 
                              id="phone"
                              defaultValue={user.phoneNumber || ''}
                              placeholder="Add a phone number" 
                              className="bg-black/30 border-primary/30 focus-visible:ring-primary text-white flex-1"
                            />
                            <Phone className="ml-2 h-4 w-4 opacity-50 self-center" />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="bg-gradient-to-r from-primary to-purple-500 hover:opacity-90 mr-2">
                          Save Changes
                        </Button>
                        <Button variant="outline" className="border-primary/50 text-white hover:bg-primary/20">
                          Cancel
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>

                  <TabsContent value="security" className="mt-4">
                    <Card className="bg-black/40 border-primary/20 text-white">
                      <CardHeader>
                        <CardTitle>Security Settings</CardTitle>
                        <CardDescription className="text-white/70">
                          Update your security preferences
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input 
                            id="currentPassword" 
                            type="password"
                            className="bg-black/30 border-primary/30 focus-visible:ring-primary text-white"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input 
                              id="newPassword" 
                              type="password"
                              className="bg-black/30 border-primary/30 focus-visible:ring-primary text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input 
                              id="confirmPassword" 
                              type="password"
                              className="bg-black/30 border-primary/30 focus-visible:ring-primary text-white"
                            />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="bg-gradient-to-r from-primary to-purple-500 hover:opacity-90 mr-2">
                          Update Password
                        </Button>
                        <Button variant="outline" className="border-primary/50 text-white hover:bg-primary/20">
                          Cancel
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>

                  <TabsContent value="activity" className="mt-4">
                    <Card className="bg-black/40 border-primary/20 text-white">
                      <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription className="text-white/70">
                          Your recent account activity
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex items-start gap-2 pb-3 border-b border-primary/10">
                              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                <Clock className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium text-sm">Login from new device</h4>
                                  <span className="text-xs text-white/50">
                                    {new Date(Date.now() - 1000 * 60 * 60 * 24 * i).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-xs text-white/70 mt-1">
                                  Login from Chrome on Windows
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="border-primary/50 text-white hover:bg-primary/20 w-full">
                          View All Activity
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>

                  <TabsContent value="notifications" className="mt-4">
                    <Card className="bg-black/40 border-primary/20 text-white">
                      <CardHeader>
                        <CardTitle>Notification Preferences</CardTitle>
                        <CardDescription className="text-white/70">
                          Manage how you receive notifications
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-white/70 text-sm">Coming soon...</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
        <MobileNavigation />
      </main>
    </div>
  );
};

export default ProfilePage;