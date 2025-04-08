import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { HomeIcon } from '@/lib/icons';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-background">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold text-foreground">Page Not Found</h2>
        <p className="text-muted-foreground">
          The page you were looking for doesn't exist or has been moved.
        </p>
        <div className="pt-6">
          <Link href="/">
            <Button className="inline-flex items-center">
              <HomeIcon className="mr-2 h-4 w-4" />
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;