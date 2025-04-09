import React from 'react';

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full p-6 bg-card rounded-lg shadow-lg border border-border/10">
        <h1 className="text-3xl font-bold text-center mb-6 text-primary">NepaliPay</h1>
        <p className="text-muted-foreground text-center mb-6">
          Blockchain-powered digital wallet for the Nepali financial ecosystem.
        </p>
        <div className="flex justify-center">
          <a
            href="/auth"
            className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;