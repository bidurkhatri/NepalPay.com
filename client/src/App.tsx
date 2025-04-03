import React from 'react';
import { Route, Switch, Link } from 'wouter';
import LoginPage from './pages/login-page';
import DashboardPage from './pages/dashboard-page';

// Home page component
const HomePage: React.FC = () => {
  console.log("Rendering Home Page");
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <header className="py-6 px-8 backdrop-blur-lg bg-black/20 border-b border-white/10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <h1 className="text-white text-2xl font-bold">NepaliPay</h1>
          </div>
          <nav>
            <ul className="flex space-x-8">
              <li><a href="#features" className="text-gray-300 hover:text-white transition">Features</a></li>
              <li><a href="#about" className="text-gray-300 hover:text-white transition">About</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-white transition">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-grow flex items-center">
        <div className="container mx-auto px-8 py-16 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Next Generation <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">Digital Wallet</span> for Nepal
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-lg">
              Securely manage your finances, send money instantly, and access blockchain-powered features in one seamless app.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/login" 
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium text-lg hover:opacity-90 transition shadow-lg shadow-blue-500/20 text-center"
              >
                Login
              </Link>
              <Link 
                href="/register" 
                className="px-8 py-3 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-white/10 text-white font-medium text-lg hover:bg-gray-700/50 transition text-center"
              >
                Register
              </Link>
            </div>
            <div className="mt-6 text-gray-400 text-sm">
              <p>Demo account: <span className="text-white">Username: demo / Password: password</span></p>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-80 h-[500px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl transform md:rotate-3">
              <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 to-gray-900/70 backdrop-blur-md z-10"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-700/10 bg-cover opacity-30"></div>
              
              {/* Mockup Content */}
              <div className="absolute inset-0 z-20 p-6 flex flex-col">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <p className="text-gray-400 text-xs">Welcome back</p>
                    <h3 className="text-white font-semibold">John Doe</h3>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-gray-800 border border-gray-700"></div>
                </div>
                
                <div className="bg-gray-800/60 rounded-2xl p-4 backdrop-blur-lg border border-white/5 mb-6">
                  <p className="text-gray-400 text-xs mb-1">Total Balance</p>
                  <h2 className="text-white text-2xl font-bold mb-1">NPT 2,456.00</h2>
                  <div className="flex items-center">
                    <span className="text-green-400 text-xs">+5.3%</span>
                    <span className="text-gray-400 text-xs ml-2">this week</span>
                  </div>
                </div>
                
                <p className="text-gray-400 text-xs mb-3">Quick Actions</p>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {['Send', 'Receive', 'Pay'].map(action => (
                    <div key={action} className="bg-gray-800/40 rounded-xl p-3 text-center border border-white/5">
                      <div className="h-8 w-8 rounded-full bg-blue-500/20 mx-auto mb-2 flex items-center justify-center">
                        <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                      </div>
                      <p className="text-white text-xs">{action}</p>
                    </div>
                  ))}
                </div>
                
                <p className="text-gray-400 text-xs mb-3">Recent Transactions</p>
                <div className="space-y-3 flex-grow overflow-hidden">
                  {['Starbucks', 'Amazon', 'Netflix'].map(merchant => (
                    <div key={merchant} className="bg-gray-800/30 rounded-xl p-3 flex justify-between items-center border border-white/5">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-700 mr-3"></div>
                        <div>
                          <p className="text-white text-sm">{merchant}</p>
                          <p className="text-gray-400 text-xs">Yesterday</p>
                        </div>
                      </div>
                      <p className="text-white">-$24.99</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 bg-gray-900/50">
        <div className="container mx-auto px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Powerful Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Blockchain Transactions',
                description: 'Send money instantly with minimal fees using our blockchain technology'
              },
              {
                title: 'NPT Token Staking',
                description: 'Earn rewards by staking your NepaliPayTokens in our platform'
              },
              {
                title: 'Crypto Loans',
                description: 'Get instant loans using your crypto assets as collateral'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-800/30 backdrop-blur-lg rounded-xl p-6 border border-white/5">
                <div className="h-12 w-12 rounded-full bg-blue-500/20 mb-4 flex items-center justify-center">
                  <div className="h-6 w-6 rounded-full bg-blue-500"></div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-black/30 backdrop-blur-lg border-t border-white/5">
        <div className="container mx-auto px-8 text-center">
          <p className="text-gray-400">© 2023 NepaliPay. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// The main App component with routing
const App: React.FC = () => {
  console.log("Rendering App with routing");
  
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
          <div className="text-center p-8 max-w-md w-full">
            <h1 className="text-3xl font-bold text-white mb-4">Page Not Found</h1>
            <p className="text-gray-300 mb-8">The page you're looking for doesn't exist or has been moved.</p>
            <Link 
              href="/"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:opacity-90 transition"
            >
              Go Home
            </Link>
          </div>
        </div>
      </Route>
    </Switch>
  );
};

export default App;
