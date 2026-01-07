import { Link } from 'react-router-dom';
import { useState } from 'react';

interface Feature {
  icon: string;
  name: string;
  description: string;
  color: string;
}

export default function Home() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you for subscribing with: ${email}`);
    setEmail('');
  };

  const features: Feature[] = [
    {
      icon: '👤',
      name: 'Account Management',
      description: 'Update your personal information, manage addresses, and set communication preferences with ease.',
      color: 'from-blue-600 to-blue-700'
    },
    {
      icon: '📦',
      name: 'Order History',
      description: 'View your complete order history, check order status in real-time, and download invoices instantly.',
      color: 'from-blue-600 to-blue-700'
    },
    {
      icon: '💬',
      name: 'Fast Support',
      description: 'Get help quickly with our integrated support system, live chat, and comprehensive FAQ section.',
      color: 'from-blue-600 to-blue-700'
    },
    {
      icon: '🔒',
      name: 'Secure Payments',
      description: 'Your payment information is always protected with bank-level security and encryption.',
      color: 'from-blue-600 to-blue-700'
    },
  ];

  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '50K+', label: 'Orders Processed' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Left */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-blue-700">
                BizPortal
              </Link>
            </div>
            
            {/* Center Navigation */}
            <div className="hidden md:flex items-center justify-center flex-1">
              <div className="flex space-x-8">
                <Link to="/" className="text-gray-900 hover:text-blue-700 px-3 py-2 text-sm font-medium">
                  Home
                </Link>
                <Link to="/customers" className="text-gray-500 hover:text-blue-700 px-3 py-2 text-sm font-medium">
                  Customers
                </Link>
                <Link to="/services" className="text-gray-500 hover:text-blue-700 px-3 py-2 text-sm font-medium">
                  Services
                </Link>
                <Link to="/about" className="text-gray-500 hover:text-blue-700 px-3 py-2 text-sm font-medium">
                  About
                </Link>
              </div>
            </div>
            
            {/* Right Side - Authentication */}
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-700"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="px-4 py-2 bg-blue-700 text-white text-sm font-medium rounded hover:bg-blue-800 transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Welcome to Your Customer Portal
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Access your account, view orders, track shipments, and manage your profile all in one powerful platform
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/customers"
                className="px-6 py-3 bg-white text-blue-700 font-medium rounded hover:bg-gray-100 transition-colors"
              >
                View Customers
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 border-2 border-white text-white font-medium rounded hover:bg-white/10 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
          
          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/10 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your customer relationships effectively
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-lg bg-gradient-to-br ${feature.color} text-white text-2xl mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.name}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of businesses already using our platform to manage their customers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-700 font-medium rounded hover:bg-gray-100 transition-colors"
            >
              Create Account
              <span className="ml-2">→</span>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-medium rounded hover:bg-white/10 transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Stay Updated
            </h2>
            <p className="text-gray-600 mb-6">
              Subscribe to our newsletter for the latest updates and news
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-700 text-white font-medium rounded hover:bg-blue-800 transition-colors"
              >
                Subscribe
              </button>
            </form>
            <p className="mt-3 text-sm text-gray-500">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link to="/" className="text-xl font-bold text-blue-700">
                BizPortal
              </Link>
            </div>
            <div className="flex space-x-6">
              <Link to="/about" className="text-sm text-gray-600 hover:text-blue-700">
                About
              </Link>
              <Link to="/contact" className="text-sm text-gray-600 hover:text-blue-700">
                Contact
              </Link>
              <Link to="/privacy" className="text-sm text-gray-600 hover:text-blue-700">
                Privacy
              </Link>
              <Link to="/terms" className="text-sm text-gray-600 hover:text-blue-700">
                Terms
              </Link>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200 text-center md:text-left">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} BizPortal. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}