// src/components/customer/CustomerHeader.tsx
import { FiBell, FiSearch, FiMenu } from 'react-icons/fi';
import { useState } from 'react';

const CustomerHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <button
            className="text-gray-500 focus:outline-none lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <FiMenu className="w-6 h-6" />
          </button>
          <div className="relative mx-4 lg:mx-0">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FiSearch className="w-5 h-5 text-gray-400" />
            </span>
            <input
              className="w-32 pl-10 pr-4 py-2 text-gray-700 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-blue-500 sm:w-64"
              placeholder="Search..."
              type="text"
            />
          </div>
        </div>
        <div className="flex items-center">
          <button className="p-1 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none">
            <FiBell className="w-6 h-6" />
          </button>
          <div className="ml-3 relative">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              JD
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CustomerHeader;