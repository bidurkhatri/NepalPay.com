import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useBlockchain } from "@/contexts/blockchain-context";
import { truncateAddress } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Wallet,
  ArrowLeftRight,
  FileText,
  Landmark,
  ShieldCheck,
  BarChart3,
  UserIcon,
  LogOut,
  Settings,
  HelpCircle,
  PlusCircle,
  Bell,
  CreditCard,
  Home,
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const [expanded, setExpanded] = useState(true);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { account } = useBlockchain();
  const { toast } = useToast();

  if (!user) return null;

  const isAdmin = user.role === "admin" || user.role === "superadmin";
  const isSuperadmin = user.role === "superadmin";

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const userNavigation = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/wallet", label: "Wallet", icon: Wallet },
    { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
    { href: "/loans", label: "Loans", icon: Landmark },
    { href: "/collaterals", label: "Collaterals", icon: ShieldCheck },
    { href: "/ads", label: "Ads", icon: CreditCard },
  ];

  const adminNavigation = [
    { href: "/admin", label: "Admin Dashboard", icon: BarChart3 },
    { href: "/admin/users", label: "Users", icon: UserIcon },
    { href: "/admin/transactions", label: "Transactions", icon: FileText },
  ];

  const superadminNavigation = [
    { href: "/superadmin", label: "Owner Dashboard", icon: BarChart3 },
    { href: "/superadmin/treasury", label: "Treasury", icon: Landmark },
    { href: "/superadmin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside
      className={cn(
        "relative flex h-screen flex-col border-r bg-card/20 backdrop-blur-lg transition-all duration-300",
        expanded ? "w-64" : "w-20"
      )}
    >
      <div className="flex items-center justify-between p-4">
        <div
          className={cn(
            "overflow-hidden transition-all duration-300",
            expanded ? "w-auto opacity-100" : "w-0 opacity-0"
          )}
        >
          <h1 className="text-xl font-bold text-primary">NepaliPay</h1>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="rounded-full bg-primary/10 p-2 text-primary transition-colors hover:bg-primary/20"
        >
          {expanded ? (
            <ChevronLeft className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </button>
      </div>

      <div className="flex flex-col items-center border-t border-b p-4">
        <div className="mb-2 h-12 w-12 rounded-full bg-primary/10 p-2">
          <UserIcon className="h-8 w-8 text-primary" />
        </div>
        <div
          className={cn(
            "text-center transition-all duration-300",
            expanded ? "block" : "hidden"
          )}
        >
          <p className="font-medium">{user.username}</p>
          {account && (
            <p className="text-xs text-muted-foreground">
              {truncateAddress(account)}
            </p>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <nav className="space-y-1">
          <p
            className={cn(
              "px-4 py-2 text-xs font-semibold uppercase text-muted-foreground",
              !expanded && "sr-only"
            )}
          >
            General
          </p>
          {userNavigation.map((item) => (
            <Link key={item.href} href={item.href}>
              <a
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  location === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                )}
              >
                <item.icon className="mr-2 h-5 w-5" />
                <span
                  className={cn(
                    "transition-all duration-300",
                    expanded ? "opacity-100" : "hidden w-0 opacity-0"
                  )}
                >
                  {item.label}
                </span>
              </a>
            </Link>
          ))}

          {isAdmin && (
            <>
              <p
                className={cn(
                  "mt-6 px-4 py-2 text-xs font-semibold uppercase text-muted-foreground",
                  !expanded && "sr-only"
                )}
              >
                Admin
              </p>
              {adminNavigation.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      location === item.href
                        ? "bg-blue-600 text-white"
                        : "text-muted-foreground hover:bg-blue-600/10 hover:text-foreground"
                    )}
                  >
                    <item.icon className="mr-2 h-5 w-5" />
                    <span
                      className={cn(
                        "transition-all duration-300",
                        expanded ? "opacity-100" : "hidden w-0 opacity-0"
                      )}
                    >
                      {item.label}
                    </span>
                  </a>
                </Link>
              ))}
            </>
          )}

          {isSuperadmin && (
            <>
              <p
                className={cn(
                  "mt-6 px-4 py-2 text-xs font-semibold uppercase text-muted-foreground",
                  !expanded && "sr-only"
                )}
              >
                Owner
              </p>
              {superadminNavigation.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      location === item.href
                        ? "bg-teal-600 text-white"
                        : "text-muted-foreground hover:bg-teal-600/10 hover:text-foreground"
                    )}
                  >
                    <item.icon className="mr-2 h-5 w-5" />
                    <span
                      className={cn(
                        "transition-all duration-300",
                        expanded ? "opacity-100" : "hidden w-0 opacity-0"
                      )}
                    >
                      {item.label}
                    </span>
                  </a>
                </Link>
              ))}
            </>
          )}
        </nav>
      </div>

      <div className="border-t p-2">
        <Link href="/support">
          <a
            className={cn(
              "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:bg-primary/10 hover:text-foreground"
            )}
          >
            <HelpCircle className="mr-2 h-5 w-5" />
            <span
              className={cn(
                "transition-all duration-300",
                expanded ? "opacity-100" : "hidden w-0 opacity-0"
              )}
            >
              Help & Support
            </span>
          </a>
        </Link>
        <button
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:bg-red-600/10 hover:text-red-600"
          )}
        >
          <LogOut className="mr-2 h-5 w-5" />
          <span
            className={cn(
              "transition-all duration-300",
              expanded ? "opacity-100" : "hidden w-0 opacity-0"
            )}
          >
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};