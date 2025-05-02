
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Home = () => {
  const [activeTab, setActiveTab] = useState('entrepreneurs');
  
  const benefits = {
    entrepreneurs: [
      { title: 'Quick Setup', description: 'Create your token in minutes, not days' },
      { title: 'Royalties', description: 'Earn passive income from every transfer' },
      { title: 'Low Cost', description: 'Starting at just 0.1 SOL - lowest in the market' },
    ],
    developers: [
      { title: 'API Integration', description: 'Seamless integration with your applications' },
      { title: 'Testing Tools', description: 'Safe environment to test token behavior' },
      { title: 'Flexible Extensions', description: 'Customizable hooks for any use case' },
    ],
    businesses: [
      { title: 'Brand Loyalty', description: 'Create tokens that match your brand identity' },
      { title: 'Customer Rewards', description: 'Easily reward loyal customers' },
      { title: 'Usage Analytics', description: 'Track how your token is being used' },
    ],
  };

  return (
    <div className="flex flex-col">
      {/* Hero section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-b from-white to-purple-50">
        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] bg-repeat opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
                Create Your <span className="gradient-text">Token</span> in Minutes
              </h1>
              <p className="mt-6 text-xl text-gray-600 max-w-3xl">
                TokenFlowzy simplifies the creation of Solana-based tokens with advanced features like transfer fees, staking rewards, and burn mechanisms.
              </p>
              <div className="mt-10 flex flex-wrap gap-4 justify-center lg:justify-start">
                <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white">
                  <Link to="/create">Create Token <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="#features">Learn More</a>
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg blur opacity-75"></div>
                <div className="relative bg-white p-6 rounded-lg shadow-xl">
                  <div className="w-full h-64 bg-gray-100 rounded-md flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <p className="text-gray-500">Your token preview will appear here</p>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Token Name</label>
                      <div className="mt-1 bg-gray-50 p-2 rounded-md">Sample Token</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Symbol</label>
                      <div className="mt-1 bg-gray-50 p-2 rounded-md">SMPL</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Supply</label>
                      <div className="mt-1 bg-gray-50 p-2 rounded-md">1,000,000</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Features</label>
                      <div className="mt-1 bg-gray-50 p-2 rounded-md">Transfer Fee</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Why Choose TokenFlowzy?</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform provides everything you need to create, deploy, and manage your custom token.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Fast Token Creation</h3>
              <p className="text-gray-600">
                Create your token in minutes with just a few clicks. No coding skills required.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Transfer Hook Extensions</h3>
              <p className="text-gray-600">
                Add custom behaviors to your token such as transfer fees, staking rewards, and more.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Token Analytics</h3>
              <p className="text-gray-600">
                Track your token's performance and user activity with our comprehensive dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Who section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Who Benefits from TokenFlowzy?</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform is designed for various users with different needs.
            </p>
          </div>

          <div className="mt-12">
            <div className="flex flex-wrap border-b border-gray-200 mb-8">
              <button
                className={`px-6 py-3 text-lg font-medium ${activeTab === 'entrepreneurs' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('entrepreneurs')}
              >
                Entrepreneurs
              </button>
              <button
                className={`px-6 py-3 text-lg font-medium ${activeTab === 'developers' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('developers')}
              >
                Developers
              </button>
              <button
                className={`px-6 py-3 text-lg font-medium ${activeTab === 'businesses' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('businesses')}
              >
                Businesses
              </button>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {benefits[activeTab as keyof typeof benefits].map((benefit, index) => (
                <div 
                  key={index} 
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold">Ready to Create Your Token?</h2>
          <p className="mt-4 text-xl max-w-2xl mx-auto">
            Start building your token in minutes with our easy-to-use platform.
          </p>
          <Button asChild size="lg" className="mt-8 bg-white text-purple-600 hover:bg-gray-100">
            <Link to="/create">Get Started Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
