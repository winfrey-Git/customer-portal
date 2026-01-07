// src/components/Footer.tsx
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Social media icons with better accessibility
const SocialIcon = ({ icon, label, url }: { icon: string; label: string; url: string }) => (
  <a 
    href={url} 
    target="_blank" 
    rel="noopener noreferrer"
    className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-200"
    aria-label={label}
  >
    <span className="text-lg">{icon}</span>
  </a>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [isMounted, setIsMounted] = useState(false);

  // Fix for hydration mismatch in Next.js/React
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const footerLinks = {
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Our Team', path: '/team' },
      { name: 'Careers', path: '/careers' },
      { name: 'Blog', path: '/blog' },
    ],
    resources: [
      { name: 'Documentation', path: '/docs' },
      { name: 'Guides', path: '/guides' },
      { name: 'API Status', path: '/status' },
      { name: 'Help Center', path: '/help' },
    ],
    legal: [
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Cookie Policy', path: '/cookies' },
      { name: 'GDPR', path: '/gdpr' },
    ],
    contact: [
      { 
        icon: '✉️', 
        text: 'support@bizportal.com',
        href: 'mailto:support@bizportal.com'
      },
      { 
        icon: '📞', 
        text: '+1 (555) 123-4567',
        href: 'tel:+15551234567'
      },
      { 
        icon: '📍', 
        text: '123 Business Ave, Suite 100',
        subtext: 'San Francisco, CA 94107'
      },
      { 
        icon: '🕒', 
        text: 'Mon-Fri: 9:00 AM - 6:00 PM',
        subtext: 'Sat-Sun: Closed'
      },
    ],
  };

  const socialLinks = [
    { icon: 'f', label: 'Facebook', url: 'https://facebook.com' },
    { icon: '𝕏', label: 'Twitter', url: 'https://twitter.com' },
    { icon: '📷', label: 'Instagram', url: 'https://instagram.com' },
    { icon: 'in', label: 'LinkedIn', url: 'https://linkedin.com' },
    { icon: '▶', label: 'YouTube', url: 'https://youtube.com' },
  ];

  if (!isMounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Description */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                BizPortal
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Empowering businesses with innovative solutions to drive growth and success in the digital age. 
              Join thousands of satisfied customers who trust our platform.
            </p>
            
            {/* Newsletter Subscription */}
            <div className="pt-2">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Subscribe to our newsletter</h4>
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200">
                  Subscribe
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                We'll never share your email. Unsubscribe at any time.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Legal */}
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Contact</h3>
              <ul className="space-y-3">
                {footerLinks.contact.map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="mt-0.5 text-gray-500 dark:text-gray-500">{item.icon}</span>
                    <div>
                      {item.href ? (
                        <a 
                          href={item.href}
                          className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                        >
                          {item.text}
                        </a>
                      ) : (
                        <span className="block text-sm text-gray-600 dark:text-gray-400">
                          {item.text}
                        </span>
                      )}
                      {item.subtext && (
                        <span className="block text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                          {item.subtext}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Legal</h3>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                {footerLinks.legal.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.path} 
                      className="text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Follow Us</h3>
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => (
                  <SocialIcon 
                    key={index} 
                    icon={social.icon} 
                    label={social.label}
                    url={social.url} 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright & Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              &copy; {currentYear} BizPortal. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                v1.0.0
              </span>
              <button 
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                onClick={() => {
                  // Toggle dark mode logic can be added here
                  document.documentElement.classList.toggle('dark');
                }}
              >
                {document.documentElement.classList.contains('dark') ? '☀️ Light Mode' : '🌙 Dark Mode'}
              </button>
              <Link to="/cookies" className="text-sm text-gray-400 hover:text-white">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;