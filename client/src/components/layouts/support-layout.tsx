import React from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

interface SupportLayoutProps {
  children: React.ReactNode;
}

export const SupportLayout: React.FC<SupportLayoutProps> = ({ children }) => {
  const [location] = useLocation();
  const { user } = useAuth();

  const supportLinks = [
    { href: "/support", label: "Support Home" },
    { href: "/support/faq", label: "Frequently Asked Questions" },
    { href: "/support/knowledgebase", label: "Knowledge Base" },
    { href: "/support/contact", label: "Contact Us" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/90 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <h1 className="bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-3xl font-bold text-transparent">
              NepaliPay Help & Support
            </h1>
            {user && (
              <Link href="/">
                <a className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm transition-colors hover:bg-primary/20">
                  Return to Dashboard
                </a>
              </Link>
            )}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 rounded-lg border bg-card/30 p-2 backdrop-blur-sm sm:justify-start">
            {supportLinks.map((link) => (
              <Link href={link.href} key={link.href}>
                <a
                  className={cn(
                    "rounded-md px-4 py-2 text-sm font-medium transition-colors",
                    location === link.href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                  )}
                >
                  {link.label}
                </a>
              </Link>
            ))}
          </div>
        </header>
        <main className="rounded-lg border bg-card/40 p-6 backdrop-blur-md">
          {children}
        </main>
        <footer className="mt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} NepaliPay. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};