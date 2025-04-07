import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useBlockchain } from '@/contexts/blockchain-context';
import { SearchIcon, NotificationIcon } from '@/lib/icons';
import { getInitials } from '@/lib/icons';
import { 
  Menu, 
  X, 
  Coins, 
  BarChart3, 
  Receipt, 
  DollarSign, 
  PiggyBank, 
  Gift, 
  FileText, 
  Mountain, 
  ChevronRight,
  ExternalLink 
} from 'lucide-react'; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from 'wouter';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Header: React.FC = () => {
  const { user, logoutMutation } = useAuth();
  const { 
    nptBalance, 
    userAddress, 
    mintTokens, 
    withdrawTokens, 
    sendTokens
  } = useBlockchain();
  const [searchQuery, setSearchQuery] = useState('');
  const [buyAmount, setBuyAmount] = useState('1000');
  const [sellAmount, setSellAmount] = useState('1000');

  if (!user) return null;

  const initials = getInitials(user.firstName, user.lastName);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className="bg-black/80 backdrop-blur-md sticky top-0 z-10 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Left side: Logo on mobile, Search on desktop */}
          <div className="flex items-center">
            <div className="md:hidden flex-shrink-0">
              <h1 className="font-bold text-xl gradient-text">
                <span>Nepali</span>Pay
              </h1>
            </div>
            <div className="hidden md:block ml-4">
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="text-primary/60" />
                </div>
                <input 
                  type="text" 
                  placeholder="Search transactions, contacts..."
                  className="block w-full pl-10 pr-3 py-2 border border-primary/20 bg-black/30 rounded-md text-sm text-white placeholder-gray-400 
                            focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>
          </div>
          
          {/* Right side: Actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="p-1.5 rounded-full text-primary hover:bg-primary/20 transition-colors duration-300 glow focus:outline-none">
                    <Menu className="h-5 w-5" />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full max-w-xs bg-black/90 border-primary/30 text-white p-0">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-primary/20">
                    <h2 className="font-bold text-xl gradient-text">
                      <span>Nepali</span>Pay
                    </h2>
                    <SheetTrigger asChild>
                      <button className="text-primary hover:text-white">
                        <X className="h-5 w-5" />
                      </button>
                    </SheetTrigger>
                  </div>
                  <div className="px-4 py-3 border-b border-primary/20">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/30 flex items-center justify-center glow">
                        <span className="text-white font-semibold">{initials}</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">{`${user.firstName} ${user.lastName}`}</p>
                        <p className="text-xs text-primary/80">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <nav className="py-3 space-y-1 px-2">
                    <Link href="/dashboard">
                      <div className="flex items-center px-3 py-2 rounded-md text-white hover:bg-primary/20 transition-colors">
                        Dashboard
                      </div>
                    </Link>
                    <Link href="/wallet">
                      <div className="flex items-center px-3 py-2 rounded-md text-white hover:bg-primary/20 transition-colors">
                        My Wallet
                      </div>
                    </Link>
                    <Link href="/nepalipaytoken">
                      <div className="flex items-center px-3 py-2 rounded-md text-white hover:bg-primary/20 transition-colors">
                        NPT Tokens
                      </div>
                    </Link>
                    <Link href="/transactions">
                      <div className="flex items-center px-3 py-2 rounded-md text-white hover:bg-primary/20 transition-colors">
                        Transactions
                      </div>
                    </Link>
                    <Link href="/profile">
                      <div className="flex items-center px-3 py-2 rounded-md text-white hover:bg-primary/20 transition-colors">
                        Profile
                      </div>
                    </Link>
                    <Link href="/settings">
                      <div className="flex items-center px-3 py-2 rounded-md text-white hover:bg-primary/20 transition-colors">
                        Settings
                      </div>
                    </Link>
                  </nav>
                  <div className="mt-auto p-4 border-t border-primary/20">
                    <button 
                      onClick={() => logoutMutation.mutate()}
                      className="w-full py-2 px-4 bg-primary/20 hover:bg-primary/30 text-white rounded-md transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            
            <button className="p-1 rounded-full text-primary hover:bg-primary/20 transition-colors duration-300 relative glow">
              <NotificationIcon className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center animate-pulse">3</span>
            </button>
            
            {/* NPT Token dropdown for desktop */}
            <div className="hidden md:block relative">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 focus:outline-none group glass-card glow-amber">
                  <Coins className="h-4 w-4 mr-1" />
                  <span className="font-medium text-sm">{parseFloat(nptBalance || '0').toLocaleString(undefined, { maximumFractionDigits: 2 })} NPT</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]:rotate-90" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-black/90 border border-amber-500/30 text-white">
                  {/* NPT Balance with value in NPR */}
                  <div className="p-4 border-b border-amber-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-white">Your NPT Balance</h3>
                      <Link href="/nepalipaytoken">
                        <button className="text-xs text-white flex items-center hover:underline">
                          View Details
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </button>
                      </Link>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xl font-bold text-white">{parseFloat(nptBalance || '0').toLocaleString(undefined, { maximumFractionDigits: 2 })} NPT</p>
                      </div>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30">
                              <DollarSign className="h-3 w-3 mr-1" />
                              Buy
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-black/95 border-amber-500/30 text-white">
                            <DialogHeader>
                              <DialogTitle className="text-white">Buy NPT Tokens</DialogTitle>
                              <DialogDescription>
                                Purchase NPT tokens using NPR at a 1:1 ratio
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                              <div className="space-y-2">
                                <label className="text-sm">Amount (NPR)</label>
                                <input
                                  type="text"
                                  value={buyAmount}
                                  onChange={(e) => setBuyAmount(e.target.value)}
                                  className="w-full p-2 bg-black/60 border border-amber-500/30 rounded-md text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                                />
                                <p className="text-xs text-white/60">You will receive {buyAmount} NPT</p>
                              </div>
                              <Button 
                                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
                                onClick={() => {
                                  if (!buyAmount) return;
                                  // Call mintTokens (this function connects to the mint() function in the smart contract)
                                  // Use amount in NPR which is 1:1 to NPT
                                  mintTokens(buyAmount);
                                }}
                              >
                                Buy Now
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30">
                              <DollarSign className="h-3 w-3 mr-1" />
                              Sell
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-black/95 border-amber-500/30 text-white">
                            <DialogHeader>
                              <DialogTitle className="text-white">Sell NPT Tokens</DialogTitle>
                              <DialogDescription>
                                Sell your NPT tokens back to NPR at a 1:1 ratio
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                              <div className="space-y-2">
                                <label className="text-sm">Amount (NPT)</label>
                                <input
                                  type="text"
                                  value={sellAmount}
                                  onChange={(e) => setSellAmount(e.target.value)}
                                  max={nptBalance || '0'}
                                  className="w-full p-2 bg-black/60 border border-amber-500/30 rounded-md text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                                />
                                <p className="text-xs text-white/60">You will receive {sellAmount} NPR</p>
                              </div>
                              <Button 
                                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
                                onClick={() => {
                                  if (!sellAmount) return;
                                  // Call withdrawTokens (this connects to the withdraw() function in the smart contract)
                                  withdrawTokens(sellAmount);
                                }}
                              >
                                Sell Now
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick actions */}
                  <div className="p-4 grid grid-cols-2 gap-2 border-b border-amber-500/20">
                    <Link href="/nepalipaytoken?tab=statistics">
                      <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-amber-500/10 transition-colors">
                        <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                          <BarChart3 className="h-4 w-4 text-amber-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">Analytics</p>
                          <p className="text-xs text-white/60">Token statistics</p>
                        </div>
                      </div>
                    </Link>
                    <Link href="/nepalipaytoken?tab=transactions">
                      <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-amber-500/10 transition-colors">
                        <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                          <Receipt className="h-4 w-4 text-amber-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">Transactions</p>
                          <p className="text-xs text-white/60">Transaction history</p>
                        </div>
                      </div>
                    </Link>
                    <Link href="/nepalipaytoken?tab=collateral">
                      <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-amber-500/10 transition-colors">
                        <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                          <PiggyBank className="h-4 w-4 text-amber-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">Collateral</p>
                          <p className="text-xs text-white/60">Loan status</p>
                        </div>
                      </div>
                    </Link>
                    <Link href="/nepalipaytoken?tab=rewards">
                      <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-amber-500/10 transition-colors">
                        <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                          <Gift className="h-4 w-4 text-amber-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">Rewards</p>
                          <p className="text-xs text-white/60">Referral rewards</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                  
                  {/* Export options */}
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-white">Export Data</h3>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <button 
                        className="flex items-center justify-center space-x-1 px-3 py-1.5 bg-black/40 border border-amber-500/20 rounded-md text-xs text-white hover:bg-amber-500/10 transition-colors"
                        onClick={() => {
                          // This would typically connect to a function that generates a CSV file
                          // Here we're just logging for now
                          console.log('Exporting CSV data for user transactions');
                          alert('Exporting NPT transaction data as CSV...');
                        }}
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        CSV Export
                      </button>
                      <button 
                        className="flex items-center justify-center space-x-1 px-3 py-1.5 bg-black/40 border border-amber-500/20 rounded-md text-xs text-white hover:bg-amber-500/10 transition-colors"
                        onClick={() => {
                          // This would typically open the blockchain explorer link
                          if (userAddress) {
                            window.open(`https://bscscan.com/token/0x69d34B25809b346702C21EB0E22EAD8C1de58D66?a=${userAddress}`, '_blank');
                          } else {
                            alert('Please connect your wallet first');
                          }
                        }}
                      >
                        <Mountain className="h-3 w-3 mr-1" />
                        Blockchain Data
                      </button>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Profile dropdown for desktop */}
            <div className="hidden md:block relative">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-2 text-sm focus:outline-none group">
                  <div className="h-8 w-8 rounded-full bg-primary/30 flex items-center justify-center glow transition-all duration-300 group-hover:bg-primary/40">
                    <span className="text-white font-semibold">{initials}</span>
                  </div>
                  <span className="font-medium text-white">{user.firstName}</span>
                  <svg className="h-5 w-5 text-primary/60 group-hover:text-primary transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-black/90 border border-primary/30 text-white">
                  <div className="px-4 py-3 border-b border-primary/20">
                    <p className="text-sm font-medium">{`${user.firstName} ${user.lastName}`}</p>
                    <p className="text-xs text-primary/80 truncate">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-primary/20" />
                  <DropdownMenuItem className="hover:bg-primary/20 cursor-pointer">
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-primary/20 cursor-pointer">
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-primary/20" />
                  <DropdownMenuItem onClick={() => logoutMutation.mutate()} className="hover:bg-primary/20 cursor-pointer">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
