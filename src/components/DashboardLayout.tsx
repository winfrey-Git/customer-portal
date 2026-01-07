import { useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/authContext";

// Icons
import { 
  FiGrid, 
  FiPackage, 
  FiUsers, 
  FiDollarSign, 
  FiPieChart, 
  FiMenu, 
  FiChevronDown,
  FiChevronRight
} from 'react-icons/fi';

const DashboardIcon = () => <FiGrid className="text-xl" />;
const ItemsIcon = () => <FiPackage className="text-xl" />;
const CustomersIcon = () => <FiUsers className="text-xl" />;
const SalesIcon = () => <FiDollarSign className="text-xl" />;
const ReportsIcon = () => <FiPieChart className="text-xl" />;
const MenuIcon = () => <FiMenu className="text-xl" />;
const ArrowIcon = ({ isOpen }: { isOpen: boolean }) => 
  isOpen ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />;

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const location = useLocation();
  const { logout } = useAuth();

  const navLinks = [
    { name: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
{
  name: "Items",
  icon: <ItemsIcon />,
  path: "/items",
  children: [
    {
      name: "Item List",
      path: "/items"
    },
      {
        name: "Item Categories",
        path: "/items/categories"
      },
      {
        name: "Product Posting Groups",
        path: "/items/posting-groups"
      }
    ]
  },
    {
    name: "Customers",
    icon: <CustomersIcon />,
    path: "/customers",
    children: [
      { 
        name: "Customer List", 
        path: "/customers" 
      },
      { 
        name: "Customer Statement", 
        path: "/customers/statement" 
      },
      { 
        name: "Customer Templates", 
        path: "/customers/templates" 
      },
      { 
        name: "Customer Ledger Entries", 
        path: "/customers/ledger-entries" 
      },
      { 
        name: "Customer Posting Groups", 
        path: "/customers/posting-groups" 
      },
      { 
        name: "Payment Terms", 
        path: "/customers/payment-terms" 
      },
      { 
        name: "VAT / Tax Setup", 
        path: "/customers/tax-setup" 
      }
    ]
  },
    {
      name: "Sales",
      icon: <SalesIcon />,
      path: "/sales/invoices",
      children: [
        { name: "Invoices", path: "/sales/invoices" },
        { name: "Posted Invoices", path: "/sales/posted-invoices" },
        { name: "Credit Memos", path: "/sales/credit-memos" },
        { name: "Quotes", path: "/sales/quotes" },
        { name: "Orders", path: "/sales/orders" },
      ],
    },
    { name: "Reports", icon: <ReportsIcon />, path: "/reports" },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  const toggleExpand = (name: string) =>
    setExpanded(expanded === name ? null : name);

  const formatPageTitle = (path: string) => {
    if (!path) return 'Dashboard';
    const parts = path.split('/').filter(Boolean);
    return parts[parts.length - 1]
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className={`sidebar ${isOpen ? 'w-64' : 'w-20'} bg-[#4F46E5] text-white transition-all duration-300 ease-in-out`}>
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between h-16 bg-[#4F46E5]">
          {isOpen && (
            <h1 className="text-xl font-bold tracking-wide text-white">SoftMaterial</h1>
          )}
          <button 
            onClick={toggleSidebar} 
            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-white"
            aria-label="Toggle sidebar"
          >
            <MenuIcon />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden">
          <ul className="py-2">
            {navLinks.map((link) => (
              <li key={link.name} className="px-2 py-1">
                <Link
                  to={link.path}
                  onClick={() => link.children && toggleExpand(link.name)}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                    location.pathname.startsWith(link.path)
                      ? 'bg-white/10 text-white'
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="text-lg mr-3">{link.icon}</span>
                  {isOpen && <span className="truncate">{link.name}</span>}
                  {link.children && isOpen && (
                    <span className="ml-auto transform transition-transform">
                      <ArrowIcon isOpen={expanded === link.name} />
                    </span>
                  )}
                </Link>

                {/* Child links */}
                {link.children && expanded === link.name && isOpen && (
                  <ul className="pl-14 py-2 bg-white/5 space-y-1">
                    {link.children.map((child) => (
                      <li key={child.name}>
                        <Link
                          to={child.path}
                          className={`block py-1.5 px-4 text-sm rounded-md transition-colors ${
                            location.pathname === child.path
                              ? 'text-white bg-white/10 font-medium'
                              : 'text-white/80 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-white/10 bg-[#4F46E5]">
          <div className="flex items-center space-x-3">
            <img
              src="https://i.pravatar.cc/100?img=32"
              alt="User"
              className="w-10 h-10 rounded-full border-2 border-white/20"
            />
            {isOpen && (
              <div className="overflow-hidden">
                <p className="font-medium text-white">Admin User</p>
                <button 
                  onClick={logout}
                  className="text-xs text-white/80 hover:text-white transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-gradient-to-r from-indigo-600 to-purple-700 shadow-sm relative">
          {/* Smooth curve element */}
          <div className="absolute left-0 top-0 w-8 h-8 -ml-8 overflow-hidden">
            <div className="absolute right-0 top-0 w-16 h-16 bg-[#4F46E5] rounded-br-full"></div>
          </div>
          
          <div className="px-6 py-2.5">
            <div className="flex items-center justify-between">
              {/* Left side - Page title */}
              <div className="flex items-center">
                <h1 className="text-base font-medium text-white">
                  {formatPageTitle(location.pathname)}
                </h1>
              </div>

              {/* Right side - Search, Notifications, Profile */}
              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-3.5 w-3.5 text-white/80" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="block w-40 pl-8 pr-3 py-1.5 border border-transparent rounded-md leading-4 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:bg-white/15 focus:ring-0 text-xs"
                    placeholder="Search"
                  />
                </div>

                {/* Notifications */}
                <button
                  type="button"
                  className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 focus:outline-none"
                >
                  <span className="sr-only">View notifications</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>

                {/* User Profile */}
                <div className="flex items-center space-x-2">
                  <div className="text-right hidden md:block">
                    <p className="text-xs text-white">Admin User</p>
                    <span className="text-[10px] text-white/80">Administrator</span>
                  </div>
                  <div className="relative">
                    <img
                      className="h-7 w-7 rounded-full border-2 border-white/30"
                      src="https://i.pravatar.cc/100?img=12"
                      alt="User profile"
                    />
                    <span className="absolute bottom-0 right-0 block h-1.5 w-1.5 rounded-full bg-green-400 ring-1 ring-purple-600"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}