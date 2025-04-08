import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { AdsIcon } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdsPage() {
  const { data: allAds, isLoading: isLoadingAll } = useQuery({
    queryKey: ['/api/ads'],
  });
  
  const { data: myAds, isLoading: isLoadingMine } = useQuery({
    queryKey: ['/api/my-ads'],
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NPR'
    }).format(amount);
  };

  const getAdStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'expired':
        return 'bg-gray-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">P2P Marketplace</h1>
          <p className="text-muted-foreground">Buy and sell NPT tokens directly with other users</p>
        </div>
        <Button>Create Ad</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Ads</CardTitle>
            <AdsIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoadingAll ? '...' : allAds?.filter(ad => ad.status === 'active').length || 0}</div>
            <p className="text-xs text-muted-foreground">Available P2P offers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Ads</CardTitle>
            <AdsIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoadingMine ? '...' : myAds?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Your active advertisements</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rate</CardTitle>
            <AdsIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingAll ? '...' : formatCurrency(1)}
            </div>
            <p className="text-xs text-muted-foreground">Current average price per NPT</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="browse">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">Browse Ads</TabsTrigger>
          <TabsTrigger value="my-ads">My Ads</TabsTrigger>
        </TabsList>
        <TabsContent value="browse">
          <Card>
            <CardHeader>
              <CardTitle>Available Offers</CardTitle>
              <CardDescription>Find the best deals to buy or sell NPT</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingAll ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : allAds?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Limit</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(allAds || [])
                      .filter(ad => ad.status === 'active')
                      .map((ad) => (
                        <TableRow key={ad.id}>
                          <TableCell>
                            <Badge variant={ad.type === 'buy' ? 'default' : 'secondary'}>
                              {ad.type.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">{formatCurrency(ad.price)}</TableCell>
                          <TableCell>{ad.amount} NPT</TableCell>
                          <TableCell>{formatCurrency(ad.min_limit)} - {formatCurrency(ad.max_limit)}</TableCell>
                          <TableCell>{ad.payment_method}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                                {ad.username.substring(0, 2).toUpperCase()}
                              </div>
                              <span>{ad.username}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getAdStatusColor(ad.status)}>{ad.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <Button size="sm">
                              {ad.type === 'buy' ? 'Sell' : 'Buy'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-10">
                  <AdsIcon className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No active ads</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Be the first to create an ad for buying or selling NPT
                  </p>
                  <Button className="mt-4">Create Ad</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="my-ads">
          <Card>
            <CardHeader>
              <CardTitle>My Advertisements</CardTitle>
              <CardDescription>Manage your buy and sell offers</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingMine ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : myAds?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(myAds || []).map((ad) => (
                      <TableRow key={ad.id}>
                        <TableCell className="font-medium">#{ad.id}</TableCell>
                        <TableCell>
                          <Badge variant={ad.type === 'buy' ? 'default' : 'secondary'}>
                            {ad.type.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatCurrency(ad.price)}</TableCell>
                        <TableCell>{ad.amount} NPT</TableCell>
                        <TableCell>{formatDistanceToNow(new Date(ad.created_at), { addSuffix: true })}</TableCell>
                        <TableCell>
                          <Badge className={getAdStatusColor(ad.status)}>{ad.status}</Badge>
                        </TableCell>
                        <TableCell className="flex space-x-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          {ad.status === 'active' ? (
                            <Button variant="destructive" size="sm">Deactivate</Button>
                          ) : (
                            <Button variant="outline" size="sm">Delete</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-10">
                  <AdsIcon className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No ads created</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Create your first ad to buy or sell NPT tokens
                  </p>
                  <Button className="mt-4">Create Ad</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}