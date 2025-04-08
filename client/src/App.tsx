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
import FAQPage from '@/pages/support/faq';
import KnowledgeBasePage from '@/pages/support/knowledgebase';
import ContactPage from '@/pages/support/contact';

// Components
import { ProtectedRoute } from '@/lib/protected-route';
import DashboardLayout from '@/components/layouts/dashboard-layout';
import SupportLayout from '@/components/layouts/support-layout';

// Define the dashboard routes that use the dashboard layout
const dashboardRoutes = [
  { path: '/dashboard', component: DashboardPage },
  { path: '/wallet', component: WalletPage },
  { path: '/transactions', component: TransactionsPage },
  { path: '/loans', component: LoansPage },
  { path: '/collaterals', component: CollateralsPage },
  { path: '/ads', component: AdsPage },
  { path: '/buy-tokens', component: BuyTokensPage },
  { path: '/payment-success', component: PaymentSuccessPage },
];

// Define the support routes that use the support layout
const supportRoutes = [
  { path: '/support', component: SupportPage, exact: true },
  { path: '/support/faq', component: FAQPage },
  { path: '/support/knowledgebase', component: KnowledgeBasePage },
  { path: '/support/contact', component: ContactPage },
];

function App() {
  return (
    <>
      <Switch>
        {/* Public Routes */}
        <Route path="/" component={HomePage} />
        <Route path="/auth" component={AuthPage} />

        {/* Dashboard Routes - Protected with layout */}
        {dashboardRoutes.map(({ path, component }) => (
          <ProtectedRoute
            key={path}
            path={path}
            component={() => (
              <DashboardLayout>
                {React.createElement(component)}
              </DashboardLayout>
            )}
          />
        ))}

        {/* Support Routes - Protected with layout */}
        {supportRoutes.map(({ path, component, exact }) => (
          <ProtectedRoute
            key={path}
            path={path}
            component={() => (
              <SupportLayout>
                {React.createElement(component)}
              </SupportLayout>
            )}
          />
        ))}

        {/* 404 Page */}
        <Route component={NotFoundPage} />
      </Switch>

      <Toaster />
    </>
  );
}

export default App;