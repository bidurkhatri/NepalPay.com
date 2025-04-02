import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { SearchIcon, NotificationIcon } from '@/lib/icons';
import { getInitials } from '@/lib/icons';
import { Menu, X } from 'lucide-react'; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from 'wouter';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

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
                <span>Nepal</span>Pay
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
                      <span>Nepal</span>Pay
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
                    <Link href="/crypto">
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
                      onClick={() => logout()}
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
                  <DropdownMenuItem onClick={() => logout()} className="hover:bg-primary/20 cursor-pointer">
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
