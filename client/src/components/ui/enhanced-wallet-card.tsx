import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import {
  Wallet,
  Copy,
  ExternalLink,
  QrCode,
  Shield,
  RefreshCw,
  CheckCircle,
  X,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface EnhancedWalletCardProps {
  wallet?: {
    address?: string;
    nptBalance?: string;
    bnbBalance?: string;
  };
  isLoading?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function EnhancedWalletCard({ 
  wallet, 
  isLoading, 
  onRefresh, 
  isRefreshing 
}: EnhancedWalletCardProps) {
  const { toast } = useToast();
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    if (!text) return;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
      
      // Reset copied state after animation
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy address to clipboard",
        variant: "destructive",
      });
    }
  };

  const formatAddress = (address?: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  if (isLoading) {
    return (
      <Card className="bg-card/50 backdrop-blur-md border-primary/10">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="bg-card/50 backdrop-blur-md border-primary/10 hover:border-primary/20 transition-all duration-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Wallet className="mr-2 h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">Your Wallet</span>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onRefresh}
                      disabled={isRefreshing}
                      className="min-h-[44px] min-w-[44px] hover:scale-105 active:scale-95 transition-transform"
                    >
                      <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Refresh Balance</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <CardDescription>Manage your digital assets securely</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Balance Display */}
            <motion.div 
              className="bg-primary/5 rounded-lg p-6 border border-primary/10"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-sm text-muted-foreground mb-2">NPT Balance</div>
              <div className="text-3xl font-bold mb-2 text-primary">
                {wallet?.nptBalance || '0'} NPT
              </div>
              <div className="text-sm text-muted-foreground">
                ≈ {wallet?.nptBalance || '0'} NPR
              </div>
            </motion.div>
            
            {/* Wallet Address */}
            {wallet?.address && (
              <div className="space-y-3">
                <div className="text-sm font-medium text-foreground">Wallet Address</div>
                
                {/* Address Display */}
                <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg border border-border/50">
                  <div className="text-sm font-mono text-foreground flex-1 truncate">
                    {formatAddress(wallet.address)}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => copyToClipboard(wallet.address || '')}
                            className="min-h-[44px] min-w-[44px] hover:scale-105 active:scale-95 transition-all duration-200"
                          >
                            <motion.div
                              initial={false}
                              animate={copied ? { scale: [1, 1.2, 1] } : {}}
                              transition={{ duration: 0.3 }}
                            >
                              {copied ? (
                                <CheckCircle className="h-4 w-4 text-success" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </motion.div>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{copied ? 'Copied!' : 'Copy Address'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setShowQR(true)}
                            className="min-h-[44px] min-w-[44px] hover:scale-105 active:scale-95 transition-transform"
                          >
                            <QrCode className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Show QR Code</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="min-h-[44px] min-w-[44px] hover:scale-105 active:scale-95 transition-transform"
                            asChild
                          >
                            <a 
                              href={`https://bscscan.com/address/${wallet.address}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              aria-label="View wallet on BscScan"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View on BscScan</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                
                {/* Security Notice */}
                <div className="flex items-center text-xs text-muted-foreground bg-secondary/5 p-2 rounded border border-secondary/10">
                  <Shield className="h-3 w-3 mr-2 text-secondary" />
                  <span>Custodial Wallet - Secured by NepaliPay</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* QR Code Dialog */}
      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <QrCode className="mr-2 h-5 w-5" />
              Wallet QR Code
            </DialogTitle>
            <DialogDescription>
              Scan this QR code to share your wallet address
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center p-6">
            {wallet?.address && (
              <div className="bg-white p-4 rounded-lg">
                <QRCodeSVG 
                  value={wallet.address} 
                  size={200}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="M"
                  includeMargin={true}
                />
              </div>
            )}
          </div>
          <div className="flex justify-between items-center pt-4">
            <div className="text-sm text-muted-foreground font-mono bg-muted p-2 rounded flex-1 mr-2 truncate">
              {wallet?.address}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => copyToClipboard(wallet?.address || '')}
              className="min-h-[44px] min-w-[44px]"
            >
              {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default EnhancedWalletCard;