import { useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { 
  FiHome,
  FiPackage, 
  FiFileText,
  FiSettings,
  FiMenu,
  FiLogOut,
  FiBell
} from 'react-icons/fi';

const DashboardIcon = () => <FiHome className="text-xl" />;
const OrdersIcon = () => <FiPackage className="text-xl" />;
const InvoicesIcon = () => <FiFileText className="text-xl" />;
const SettingsIcon = () => <FiSettings className="text-xl" />;
const MenuIcon = FiMenu;

interface CustomerLayoutProps {
  children?: React.ReactNode;
}

export default function CustomerLayout({ children }: CustomerLayoutProps) {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navLinks = [
    { name: "Dashboard", icon: <DashboardIcon />, path: "/customer/dashboard" },
    { name: "My Orders", icon: <OrdersIcon />, path: "/customer/orders" },
    { name: "Invoices", icon: <InvoicesIcon />, path: "/customer/invoices" },
    { name: "Settings", icon: <SettingsIcon />, path: "/customer/settings" },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${isOpen ? 'w-64' : 'w-20'} bg-indigo-700 text-white transition-all duration-300 ease-in-out flex flex-col`}>
        {/* Logo/Brand */}
        <div className="p-4 flex items-center justify-between h-16">
          {isOpen && (
            <h1 className="text-xl font-bold text-white">My Account</h1>
          )}
          <button 
            onClick={toggleSidebar} 
            className="p-2 rounded-lg hover:bg-indigo-600 transition-colors text-white"
            aria-label="Toggle sidebar"
          >
            <MenuIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Section */}
        <div className="px-4 py-6 border-b border-indigo-600">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            {isOpen && (
              <div>
                <p className="text-sm font-medium text-white">{user?.name || 'Customer'}</p>
                <p className="text-xs text-indigo-200">{user?.email || 'customer@example.com'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                    location.pathname === link.path
                      ? 'bg-indigo-800 text-white'
                      : 'text-indigo-100 hover:bg-indigo-600'
                  }`}
                >
                  <span className="mr-3">{link.icon}</span>
                  {isOpen && <span>{link.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-indigo-600">
          <button
            onClick={logout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-white rounded-md hover:bg-indigo-600 transition-colors"
          >
            <FiLogOut className="mr-3" />
            {isOpen && 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-xl font-semibold text-gray-800">
              {navLinks.find(link => link.path === location.pathname)?.name || 'Dashboard'}
            </h1>
            <div className="flex items-center space-x-4">
              <button className="p-1 text-gray-500 rounded-full hover:bg-gray-100">
                <FiBell className="w-5 h-5" />
              </button>
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
