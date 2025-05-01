import { useState, useEffect } from 'react';
import { TrendingUp, PieChart, Shield, ArrowRight, Wallet, BarChart2, Menu, X } from 'lucide-react';

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Features data
  const features = [
    {
      icon: <TrendingUp className="mb-4 text-yellow-400" size={32} />,
      title: "Real-time Tracking",
      description: "Monitor your portfolio value with live price updates from major exchanges."
    },
    {
      icon: <PieChart className="mb-4 text-yellow-400" size={32} />,
      title: "Portfolio Analytics",
      description: "Visualize asset allocation and performance with intuitive charts."
    },
    {
      icon: <Shield className="mb-4 text-yellow-400" size={32} />,
      title: "Secure Storage",
      description: "Your data is encrypted and never shared with third parties."
    },
    {
      icon: <BarChart2 className="mb-4 text-yellow-400" size={32} />,
      title: "Performance Metrics",
      description: "Track ROI, profit/loss, and historical performance over time."
    }
  ];

  return (
    <div className="bg-[#222831] text-[#EEEEEE] min-h-screen">
      {/* Navbar */}
      <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#222831]/95 shadow-lg' : 'bg-[#222831]'}`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-lg bg-[#FFD369] flex items-center justify-center">
                <Wallet className="text-[#222831]" size={24} />
              </div>
              <span className="font-bold text-2xl">HODL<span className="text-[#FFD369]">Sync</span></span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="hover:text-[#FFD369] transition-colors">Features</a>
              <a href="#dashboard" className="hover:text-[#FFD369] transition-colors">Dashboard</a>
              <a href="#pricing" className="hover:text-[#FFD369] transition-colors">Pricing</a>
              <a href="#faq" className="hover:text-[#FFD369] transition-colors">FAQ</a>
              <button className="bg-[#FFD369] text-[#222831] px-6 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-opacity">
                Sign Up
              </button>
            </nav>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden bg-[#393E46] pt-4 pb-6 px-6 space-y-4">
            <a href="#features" className="block py-2 hover:text-[#FFD369]">Features</a>
            <a href="#dashboard" className="block py-2 hover:text-[#FFD369]">Dashboard</a>
            <a href="#pricing" className="block py-2 hover:text-[#FFD369]">Pricing</a>
            <a href="#faq" className="block py-2 hover:text-[#FFD369]">FAQ</a>
            <button className="w-full bg-[#FFD369] text-[#222831] py-3 rounded-lg font-medium mt-2">
              Sign Up
            </button>
          </nav>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Track Your Crypto Portfolio Like a <span className="text-[#FFD369]">Pro</span>
              </h1>
              <p className="text-lg mb-8 text-[#EEEEEE]/90 max-w-lg">
                HODLSync provides real-time tracking, advanced analytics, and insights for crypto investors. Take control of your digital assets in one secure platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-[#FFD369] text-[#222831] px-8 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-opacity">
                  Get Started
                </button>
                <button className="border border-[#FFD369] text-[#FFD369] px-8 py-3 rounded-lg font-medium hover:bg-[#FFD369]/10 transition-colors">
                  View Demo
                </button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-[#FFD369]/30 to-[#FFD369]/10 blur-xl"></div>
                <div className="relative bg-[#393E46] p-2 rounded-xl overflow-hidden">
                  <img src="/api/placeholder/600/400" alt="HODLSync Dashboard" className="rounded-lg w-full"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-[#393E46]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful <span className="text-[#FFD369]">Features</span></h2>
            <p className="max-w-2xl mx-auto text-[#EEEEEE]/80">
              Everything you need to manage and optimize your cryptocurrency investments.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-[#222831] p-6 rounded-xl hover:translate-y-[-5px] transition-transform duration-300">
                {feature.icon}
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-[#EEEEEE]/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section id="dashboard" className="py-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0 md:pr-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Intuitive <span className="text-[#FFD369]">Dashboard</span></h2>
              <p className="mb-6 text-[#EEEEEE]/80">
                Our clean, user-friendly interface puts important information at your fingertips. Manage your portfolio with ease.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-[#FFD369]/20 p-1 rounded mr-3 mt-1">
                    <ArrowRight size={16} className="text-[#FFD369]" />
                  </div>
                  <span>Track multiple wallets and exchanges in one place</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-[#FFD369]/20 p-1 rounded mr-3 mt-1">
                    <ArrowRight size={16} className="text-[#FFD369]" />
                  </div>
                  <span>Visualize performance with interactive charts</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-[#FFD369]/20 p-1 rounded mr-3 mt-1">
                    <ArrowRight size={16} className="text-[#FFD369]" />
                  </div>
                  <span>Set price alerts and notifications</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-[#FFD369]/20 p-1 rounded mr-3 mt-1">
                    <ArrowRight size={16} className="text-[#FFD369]" />
                  </div>
                  <span>Generate tax reports with a single click</span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-[#FFD369]/20 to-transparent blur-xl"></div>
                <div className="relative bg-[#393E46] p-3 rounded-2xl shadow-xl">
                  <img src="/api/placeholder/600/400" alt="HODLSync Dashboard Interface" className="rounded-xl w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-[#393E46]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple <span className="text-[#FFD369]">Pricing</span></h2>
            <p className="max-w-2xl mx-auto text-[#EEEEEE]/80">
              Choose the plan that fits your investment strategy.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-[#222831] rounded-xl overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Starter</h3>
                <p className="text-[#EEEEEE]/70 mb-6">Perfect for beginners</p>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold">Free</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <ArrowRight size={16} className="text-[#FFD369] mr-2" />
                    <span>Track up to 5 assets</span>
                  </li>
                  <li className="flex items-center">
                    <ArrowRight size={16} className="text-[#FFD369] mr-2" />
                    <span>Basic portfolio analytics</span>
                  </li>
                  <li className="flex items-center">
                    <ArrowRight size={16} className="text-[#FFD369] mr-2" />
                    <span>Daily price alerts</span>
                  </li>
                </ul>
              </div>
              <div className="px-6 pb-6">
                <button className="w-full border border-[#FFD369] text-[#FFD369] py-2 rounded-lg hover:bg-[#FFD369]/10 transition-colors">
                  Get Started
                </button>
              </div>
            </div>
            
            {/* Pro Plan */}
            <div className="bg-gradient-to-b from-[#222831] to-[#2A303A] rounded-xl overflow-hidden relative shadow-lg transform scale-105">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFD369]/70 to-[#FFD369]"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Pro</h3>
                <p className="text-[#EEEEEE]/70 mb-6">For active investors</p>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold">$12</span>
                  <span className="ml-1 text-[#EEEEEE]/70">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <ArrowRight size={16} className="text-[#FFD369] mr-2" />
                    <span>Unlimited assets</span>
                  </li>
                  <li className="flex items-center">
                    <ArrowRight size={16} className="text-[#FFD369] mr-2" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center">
                    <ArrowRight size={16} className="text-[#FFD369] mr-2" />
                    <span>Real-time alerts</span>
                  </li>
                  <li className="flex items-center">
                    <ArrowRight size={16} className="text-[#FFD369] mr-2" />
                    <span>Portfolio optimization</span>
                  </li>
                  <li className="flex items-center">
                    <ArrowRight size={16} className="text-[#FFD369] mr-2" />
                    <span>API access</span>
                  </li>
                </ul>
              </div>
              <div className="px-6 pb-6">
                <button className="w-full bg-[#FFD369] text-[#222831] py-2 rounded-lg font-medium hover:bg-opacity-90 transition-opacity">
                  Get Started
                </button>
              </div>
            </div>
            
            {/* Enterprise Plan */}
            <div className="bg-[#222831] rounded-xl overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
                <p className="text-[#EEEEEE]/70 mb-6">For institutions</p>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold">$49</span>
                  <span className="ml-1 text-[#EEEEEE]/70">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <ArrowRight size={16} className="text-[#FFD369] mr-2" />
                    <span>Everything in Pro</span>
                  </li>
                  <li className="flex items-center">
                    <ArrowRight size={16} className="text-[#FFD369] mr-2" />
                    <span>Multi-user access</span>
                  </li>
                  <li className="flex items-center">
                    <ArrowRight size={16} className="text-[#FFD369] mr-2" />
                    <span>Dedicated support</span>
                  </li>
                  <li className="flex items-center">
                    <ArrowRight size={16} className="text-[#FFD369] mr-2" />
                    <span>Custom integrations</span>
                  </li>
                </ul>
              </div>
              <div className="px-6 pb-6">
                <button className="w-full border border-[#FFD369] text-[#FFD369] py-2 rounded-lg hover:bg-[#FFD369]/10 transition-colors">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked <span className="text-[#FFD369]">Questions</span></h2>
            <p className="max-w-2xl mx-auto text-[#EEEEEE]/80">
              Everything you need to know about HODLSync.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-[#393E46] p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-3">How secure is HODLSync?</h3>
              <p className="text-[#EEEEEE]/80">
                HODLSync employs industry-leading encryption and never stores your private keys. We use read-only API connections to exchanges and wallets, ensuring your funds remain secure at all times.
              </p>
            </div>
            <div className="bg-[#393E46] p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-3">Which exchanges are supported?</h3>
              <p className="text-[#EEEEEE]/80">
                HODLSync integrates with all major exchanges including Binance, Coinbase, Kraken, KuCoin, and more. We're constantly adding support for additional platforms.
              </p>
            </div>
            <div className="bg-[#393E46] p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-3">Can I track my DeFi investments?</h3>
              <p className="text-[#EEEEEE]/80">
                Yes! HODLSync supports wallet tracking across multiple blockchains including Ethereum, Binance Smart Chain, Polygon, Solana, and more, allowing you to monitor your DeFi positions.
              </p>
            </div>
            <div className="bg-[#393E46] p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-3">How accurate are the tax reports?</h3>
              <p className="text-[#EEEEEE]/80">
                Our tax reporting tool complies with regulations in major jurisdictions. However, we recommend reviewing reports with a tax professional, as cryptocurrency tax regulations vary by region.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#393E46]">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Take Control of Your <span className="text-[#FFD369]">Crypto Portfolio?</span></h2>
          <p className="max-w-2xl mx-auto mb-10 text-[#EEEEEE]/80">
            Join thousands of investors who are using HODLSync to optimize their crypto investments.
          </p>
          <button className="bg-[#FFD369] text-[#222831] px-8 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-opacity mx-auto">
            Get Started For Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#222831] py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-[#FFD369] flex items-center justify-center">
                  <Wallet className="text-[#222831]" size={16} />
                </div>
                <span className="font-bold text-xl">HODL<span className="text-[#FFD369]">Sync</span></span>
              </div>
              <p className="text-[#EEEEEE]/70 max-w-xs">
                Track, analyze, and optimize your crypto portfolio with confidence.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-[#EEEEEE]/70">
                  <li><a href="#" className="hover:text-[#FFD369]">Features</a></li>
                  <li><a href="#" className="hover:text-[#FFD369]">Pricing</a></li>
                  <li><a href="#" className="hover:text-[#FFD369]">API</a></li>
                  <li><a href="#" className="hover:text-[#FFD369]">Integrations</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Resources</h4>
                <ul className="space-y-2 text-[#EEEEEE]/70">
                  <li><a href="#" className="hover:text-[#FFD369]">Documentation</a></li>
                  <li><a href="#" className="hover:text-[#FFD369]">Blog</a></li>
                  <li><a href="#" className="hover:text-[#FFD369]">Community</a></li>
                  <li><a href="#" className="hover:text-[#FFD369]">Support</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-[#EEEEEE]/70">
                  <li><a href="#" className="hover:text-[#FFD369]">About Us</a></li>
                  <li><a href="#" className="hover:text-[#FFD369]">Careers</a></li>
                  <li><a href="#" className="hover:text-[#FFD369]">Privacy</a></li>
                  <li><a href="#" className="hover:text-[#FFD369]">Terms</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-[#EEEEEE]/10 mt-12 pt-8 text-center text-[#EEEEEE]/50">
            <p>© {new Date().getFullYear()} HODLSync. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}