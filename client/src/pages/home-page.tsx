import { useAuth } from '@/hooks/use-auth';
import { Link } from 'wouter';

export default function HomePage() {
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="home-page">
      <header className="header">
        <div className="logo">NepaliPay</div>
        <nav className="navigation">
          <Link href="/">Dashboard</Link>
          <Link href="/wallet">Wallet</Link>
          <Link href="/buy-tokens">Buy Tokens</Link>
          <Link href="/transactions">Transactions</Link>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </nav>
      </header>

      <main className="main-content">
        <section className="welcome-section">
          <h1>Welcome, {user?.username}!</h1>
          <p>Manage your digital finances with NepaliPay</p>
        </section>

        <section className="dashboard-cards">
          <div className="card">
            <h3>Wallet Balance</h3>
            <p className="balance">100 NPT</p>
            <div className="card-actions">
              <Link href="/wallet" className="button">
                View Wallet
              </Link>
            </div>
          </div>

          <div className="card">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <Link href="/buy-tokens" className="button primary">
                Buy Tokens
              </Link>
              <Link href="/send" className="button">
                Send
              </Link>
              <Link href="/receive" className="button">
                Receive
              </Link>
            </div>
          </div>

          <div className="card">
            <h3>Recent Transactions</h3>
            <div className="transactions-list">
              <p>No recent transactions</p>
            </div>
            <div className="card-actions">
              <Link href="/transactions" className="button">
                View All
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}