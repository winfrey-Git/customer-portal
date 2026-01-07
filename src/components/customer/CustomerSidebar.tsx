import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiPackage, 
  FiDollarSign, 
  FiTruck, 
  FiUser, 
  FiSettings 
} from 'react-icons/fi';

const CustomerSidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { to: '/customer', icon: <FiHome />, label: 'Dashboard' },
    { to: '/customer/orders', icon: <FiPackage />, label: 'Orders' },
    { to: '/customer/invoices', icon: <FiDollarSign />, label: 'Invoices' },
    { to: '/customer/shipments', icon: <FiTruck />, label: 'Shipments' },
    { to: '/customer/profile', icon: <FiUser />, label: 'Profile' },
    { to: '/customer/settings', icon: <FiSettings />, label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800">Customer Portal</h1>
      </div>
      <nav className="mt-4">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 ${
              location.pathname === item.to ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-500' : ''
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default CustomerSidebar;
