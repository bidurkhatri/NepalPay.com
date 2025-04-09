import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Search } from 'lucide-react';

const MarketplacePage: React.FC = () => {
  const { toast } = useToast();

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">NFT Marketplace</h1>
        <p className="text-muted-foreground">Buy, sell, and trade NFTs on the NepaliPay platform</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search NFTs, collections, or artists..." 
            className="pl-10 bg-black/40 backdrop-blur-md border-primary/20" 
          />
        </div>
        <Button
          onClick={() => {
            toast({
              title: 'Feature Coming Soon',
              description: 'Creating NFTs will be available in the next update.',
            });
          }}
        >
          Create NFT
        </Button>
      </div>
      
      <Tabs defaultValue="explore">
        <TabsList className="grid w-full grid-cols-4 bg-black/40 backdrop-blur-md">
          <TabsTrigger value="explore">Explore</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="my-nfts">My NFTs</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="explore">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Featured Artworks</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="bg-black/40 backdrop-blur-md border-primary/20 overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-primary/20 to-black/40 flex items-center justify-center">
                    <p className="text-muted-foreground">NFT Preview</p>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium">Coming Soon #{i+1}</h3>
                    <p className="text-sm text-muted-foreground">NepaliPay Collection</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Price:</span> TBA
                    </p>
                    <Button variant="outline" size="sm"
                      onClick={() => {
                        toast({
                          title: 'Feature Coming Soon',
                          description: 'NFT marketplace will be available in the next update.',
                        });
                      }}
                    >
                      View
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4">Trending Collections</h2>
            <Card className="bg-black/40 backdrop-blur-md border-primary/20">
              <CardHeader>
                <CardTitle>Coming Soon</CardTitle>
                <CardDescription>NFT Marketplace is under development</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-12">NFT marketplace functionality will be available in the next update</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="collections">
          <Card className="bg-black/40 backdrop-blur-md border-primary/20">
            <CardHeader>
              <CardTitle>NFT Collections</CardTitle>
              <CardDescription>Browse collections from various artists</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-12">NFT collections will be available in the next update</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="my-nfts">
          <Card className="bg-black/40 backdrop-blur-md border-primary/20">
            <CardHeader>
              <CardTitle>My NFT Collection</CardTitle>
              <CardDescription>NFTs you own or have created</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-12">No NFTs found in your collection</p>
              <div className="flex justify-center">
                <Button
                  onClick={() => {
                    toast({
                      title: 'Feature Coming Soon',
                      description: 'Creating NFTs will be available in the next update.',
                    });
                  }}
                >
                  Create Your First NFT
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity">
          <Card className="bg-black/40 backdrop-blur-md border-primary/20">
            <CardHeader>
              <CardTitle>Marketplace Activity</CardTitle>
              <CardDescription>Recent sales and listings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-12">No marketplace activity found</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketplacePage;