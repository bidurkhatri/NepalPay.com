import React from 'react';
import { Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/toaster';

// Pages
import HomePage from '@/pages/home-page';
import AuthPage from '@/pages/auth-page';
import DashboardPage from '@/pages/dashboard';
import WalletPage from '@/pages/wallet';
import TransactionsPage from '@/pages/transactions';
import LoansPage from '@/pages/loans';
import CollateralsPage from '@/pages/collaterals';
import AdsPage from '@/pages/ads';
import BuyTokensPage from '@/pages/buy-tokens';
import PaymentSuccessPage from '@/pages/payment-success';
import NotFoundPage from '@/pages/not-found';
import SupportPage from '@/pages/support';
import SupportFAQPage from '@/pages/support/faq';
import SupportKnowledgeBasePage from '@/pages/support/knowledgebase';
import SupportContactPage from '@/pages/support/contact';

// Layouts and Components
import { ProtectedRoute } from '@/lib/protected-route';
import DashboardLayout from '@/components/layouts/dashboard-layout';
import SupportLayout from '@/components/layouts/support-layout';

function App() {
  return (
    <>
      <Switch>
        {/* Public Routes */}
        <Route path="/" component={HomePage} />
        <Route path="/auth" component={AuthPage} />

        {/* Protected Dashboard Routes */}
        <ProtectedRoute path="/dashboard">
          <DashboardLayout>
            <DashboardPage />
          </DashboardLayout>
        </ProtectedRoute>

        <ProtectedRoute path="/wallet">
          <DashboardLayout>
            <WalletPage />
          </DashboardLayout>
        </ProtectedRoute>

        <ProtectedRoute path="/transactions">
          <DashboardLayout>
            <TransactionsPage />
          </DashboardLayout>
        </ProtectedRoute>

        <ProtectedRoute path="/loans">
          <DashboardLayout>
            <LoansPage />
          </DashboardLayout>
        </ProtectedRoute>

        <ProtectedRoute path="/collaterals">
          <DashboardLayout>
            <CollateralsPage />
          </DashboardLayout>
        </ProtectedRoute>

        <ProtectedRoute path="/ads">
          <DashboardLayout>
            <AdsPage />
          </DashboardLayout>
        </ProtectedRoute>

        <ProtectedRoute path="/buy-tokens">
          <DashboardLayout>
            <BuyTokensPage />
          </DashboardLayout>
        </ProtectedRoute>

        <Route path="/payment/success">
          <DashboardLayout>
            <PaymentSuccessPage />
          </DashboardLayout>
        </Route>

        {/* Support Routes */}
        <Route path="/support">
          <SupportLayout>
            <SupportPage />
          </SupportLayout>
        </Route>

        <Route path="/support/faq">
          <SupportLayout>
            <SupportFAQPage />
          </SupportLayout>
        </Route>

        <Route path="/support/knowledgebase">
          <SupportLayout>
            <SupportKnowledgeBasePage />
          </SupportLayout>
        </Route>

        <Route path="/support/contact">
          <SupportLayout>
            <SupportContactPage />
          </SupportLayout>
        </Route>

        {/* 404 Route */}
        <Route component={NotFoundPage} />
      </Switch>

      {/* Toast notifications */}
      <Toaster />
    </>
  );
}

export default App;