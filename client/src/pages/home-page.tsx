import React from 'react';
import { Link } from 'wouter';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col animated-gradient-bg">
      {/* Header */}
      <header className="w-full py-4 px-4 md:px-8 flex justify-between items-center glass-morphic-dark z-10">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold gradient-text-blue">NepaliPay</h1>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#features" className="text-white/80 hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="text-white/80 hover:text-white transition-colors">How It Works</a>
          <a href="#about" className="text-white/80 hover:text-white transition-colors">About</a>
          <Link href="/auth" className="glass-button-dark px-4 py-2 text-white hover:bg-blue-600/50 transition-all">
            Get Started
          </Link>
        </nav>
        <div className="md:hidden">
          <button className="text-white p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col md:flex-row items-center justify-center p-4 md:p-12 relative">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1526663089950-ac3d2a086e0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80')" }}></div>
        <div className="glass-morphic-dark max-w-2xl p-8 md:p-12 rounded-2xl z-10 backdrop-blur-lg">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text-blue">
            Revolutionizing Finances in Nepal
          </h1>
          <p className="text-white/90 text-lg md:text-xl mb-8">
            NepaliPay is a blockchain-powered digital wallet designed specifically for the Nepali financial ecosystem.
            Secure, fast, and culturally integrated.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/auth" className="glass-button-dark text-center py-3 px-8 text-lg font-medium text-white hover:shadow-blue-500/20 hover:bg-blue-600/50 transition-all">
              Get Started
            </Link>
            <a href="#learn-more" className="glass-button text-center bg-white/5 py-3 px-8 text-lg font-medium text-white/80 hover:text-white transition-all">
              Learn More
            </a>
          </div>
        </div>
        <div className="hidden md:block ml-10 z-10">
          <div className="glass-card-dark p-8 rounded-2xl shadow-xl">
            <div className="relative w-64 h-96 overflow-hidden rounded-xl">
              <img src="https://images.unsplash.com/photo-1605457867610-e990b296ce5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=987&q=80" alt="NepaliPay App" className="absolute inset-0 object-cover w-full h-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white text-lg font-semibold">NepaliPay App</h3>
                <p className="text-white/70 text-sm">Seamless & Secure Transactions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 md:px-12 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text-blue">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-card-dark p-6 rounded-xl hover:translate-y-[-5px] transition-transform duration-300">
              <div className="w-14 h-14 rounded-full bg-blue-600/20 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4f8ef7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 8-9.04.8a.5.5 0 0 0-.46.5V15a.5.5 0 0 0 .5.5h17a.5.5 0 0 0 .5-.5v-5.7a.5.5 0 0 0-.46-.5L12 8Z"/>
                  <path d="M19 8V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2"/>
                  <path d="M12 13v3"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Secure Wallet</h3>
              <p className="text-white/70">
                Advanced encryption and blockchain technology ensure your assets remain secure at all times.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card-dark p-6 rounded-xl hover:translate-y-[-5px] transition-transform duration-300">
              <div className="w-14 h-14 rounded-full bg-blue-600/20 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4f8ef7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.91 8.84 8.56 2.23a1.93 1.93 0 0 0-1.81 0L3.1 4.13a2.12 2.12 0 0 0-.05 3.69l12.22 6.93a2 2 0 0 0 1.94 0L21 12.51a2.12 2.12 0 0 0-.09-3.67Z"/>
                  <path d="m3.09 8.84 12.35-6.61a1.93 1.93 0 0 1 1.81 0l3.65 1.9a2.12 2.12 0 0 1 .1 3.69L8.73 14.75a2 2 0 0 1-1.94 0L3 12.51a2.12 2.12 0 0 1 .09-3.67Z"/>
                  <line x1="12" y1="22" x2="12" y2="15"/>
                  <path d="M20 13.5v3.37a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13.5"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Fast Transfers</h3>
              <p className="text-white/70">
                Instant transactions with minimal fees, enabling quick and efficient money transfers across Nepal.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card-dark p-6 rounded-xl hover:translate-y-[-5px] transition-transform duration-300">
              <div className="w-14 h-14 rounded-full bg-blue-600/20 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4f8ef7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 5H2v7"/>
                  <path d="M2 5 15 18 19 14l2 2"/>
                  <path d="M22 14v5h-5"/>
                  <path d="M22 14 14 6l-4 4-6-6"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">NPT Tokens</h3>
              <p className="text-white/70">
                Our native NPT token is pegged to the Nepalese Rupee, offering stability and ease of use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-4 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text-blue">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="glass-card-dark p-6 rounded-xl relative">
              <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">1</div>
              <h3 className="text-xl font-semibold mb-4 mt-4 text-white">Create Account</h3>
              <p className="text-white/70">
                Sign up for a free NepaliPay account using your email or phone number.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-card-dark p-6 rounded-xl relative">
              <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">2</div>
              <h3 className="text-xl font-semibold mb-4 mt-4 text-white">Verify Identity</h3>
              <p className="text-white/70">
                Complete a simple KYC process to verify your identity and ensure security.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-card-dark p-6 rounded-xl relative">
              <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">3</div>
              <h3 className="text-xl font-semibold mb-4 mt-4 text-white">Add Funds</h3>
              <p className="text-white/70">
                Purchase NPT tokens using credit/debit cards or other supported payment methods.
              </p>
            </div>

            {/* Step 4 */}
            <div className="glass-card-dark p-6 rounded-xl relative">
              <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">4</div>
              <h3 className="text-xl font-semibold mb-4 mt-4 text-white">Start Using</h3>
              <p className="text-white/70">
                Send money, pay bills, or take loans using your NPT tokens with ease.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4 md:px-12 bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 gradient-text-blue">About NepaliPay</h2>
          <p className="text-white/80 text-lg text-center mb-12">
            NepaliPay is a revolutionary financial platform designed to empower Nepali citizens with access to modern financial tools. 
            Built on blockchain technology, we provide a secure, transparent, and accessible way to manage your finances.
          </p>
          <div className="glass-card-dark p-8 rounded-xl mb-12">
            <h3 className="text-2xl font-bold mb-4 text-white">Our Mission</h3>
            <p className="text-white/80">
              We aim to revolutionize the financial landscape in Nepal by providing a secure, accessible, and inclusive digital payment solution that bridges traditional banking gaps and empowers every Nepali citizen with financial freedom.
            </p>
          </div>
          <div className="flex justify-center">
            <Link href="/auth" className="glass-button-dark py-3 px-8 text-lg font-medium text-white hover:shadow-blue-500/20 hover:bg-blue-600/50 transition-all">
              Join Us Today
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 md:px-12 glass-morphic-dark">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4 gradient-text-blue">NepaliPay</h3>
            <p className="text-white/70 mb-4">
              The future of financial transactions in Nepal. Secure, fast, and culturally integrated.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Press</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-white/10">
          <p className="text-white/50 text-center">© 2023 NepaliPay. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}