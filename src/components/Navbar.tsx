// src/components/Navbar.tsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Emoji icon components with better accessibility
const MenuIcon = () => <span role="img" aria-label="Menu" className="text-2xl">☰</span>;
const CloseIcon = () => <span role="img" aria-label="Close menu" className="text-2xl">✕</span>;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Items', path: '/items' },
    { name: 'Customers', path: '/customers' },
    { 
      name: 'Sales', 
      path: '#', 
      children: [
        { name: 'Sales Invoices', path: '/sales/invoices' },
        { name: 'Posted Invoices', path: '/sales/posted-invoices' },
        { name: 'Credit Memos', path: '/sales/credit-memos' },
        { name: 'Sales Quotes', path: '/sales/quotes' },
        { name: 'Orders', path: '/sales/orders' },
      ] 
    },
    { name: 'Reports', path: '/reports' },
  ];

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Left */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="text-2xl font-bold text-blue-700"
            >
              BizPortal
            </Link>
          </div>
          
          {/* Center Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex space-x-1">
              {navLinks.map((link) => (
                <div key={link.name} className="relative group">
                  {link.children ? (
                    <>
                      <button
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center ${
                          link.children.some(child => location.pathname === child.path)
                            ? 'text-blue-700 bg-blue-50'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-blue-700'
                        }`}
                      >
                        {link.name}
                        <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <div className="absolute left-0 mt-1 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="py-1">
                          {link.children.map((child) => (
                            <Link
                              key={child.name}
                              to={child.path}
                              className={`block px-4 py-2 text-sm ${
                                location.pathname === child.path
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      to={link.path}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        location.pathname === link.path
                          ? 'text-blue-700 bg-blue-50'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-blue-700'
                      }`}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
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

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              aria-expanded={isOpen}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div 
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 bg-white border-t border-gray-200">
          {navLinks.map((link) => (
            <div key={link.name}>
              {link.children ? (
                <div className="space-y-1">
                  <div className="px-4 py-3 text-base font-medium text-gray-700">
                    {link.name}
                  </div>
                  <div className="pl-4 space-y-1">
                    {link.children.map((child) => (
                      <Link
                        key={child.name}
                        to={child.path}
                        className={`block px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${
                          location.pathname === child.path
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-blue-700'
                        }`}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  to={link.path}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                    location.pathname === link.path
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-blue-700'
                  }`}
                >
                  {link.name}
                </Link>
              )}
            </div>
          ))}
          
          {/* Mobile authentication */}
          <div className="pt-4 mt-4 border-t border-gray-200">
            <Link
              to="/login"
              className="block w-full px-4 py-3 text-left text-base font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="block w-full mt-2 px-4 py-3 text-center text-base font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;