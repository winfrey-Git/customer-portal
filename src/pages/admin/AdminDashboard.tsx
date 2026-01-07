import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiUsers, 
  FiDollarSign, 
  FiPackage, 
  FiTrendingUp, 
  FiSettings 
} from 'react-icons/fi';

export const AdminDashboard: React.FC = () => {
  // Mock data - replace with actual data from your API
  const stats = [
    { name: 'Total Customers', value: '0', icon: FiUsers, change: '+0%', changeType: 'increase' },
    { name: 'Total Revenue', value: '$0', icon: FiDollarSign, change: '+0%', changeType: 'increase' },
    { name: 'Total Orders', value: '0', icon: FiPackage, change: '+0%', changeType: 'increase' },
    { name: 'Avg. Order Value', value: '$0', icon: FiTrendingUp, change: '0%', changeType: 'neutral' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
      
      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md bg-indigo-500 p-3">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="truncate text-sm font-medium text-gray-500">{stat.name}</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                    <div
                      className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'increase' 
                          ? 'text-green-600' 
                          : stat.changeType === 'decrease' 
                            ? 'text-red-600' 
                            : 'text-gray-500'
                      }`}
                    >
                      {stat.change}
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/admin/customers"
            className="flex items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-5 shadow-sm hover:bg-gray-50"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md bg-indigo-500 p-2">
                <FiUsers className="h-5 w-5 text-white" />
              </div>
              <p className="ml-3 text-sm font-medium text-gray-900">Manage Customers</p>
            </div>
          </Link>
          
          <Link
            to="/admin/orders"
            className="flex items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-5 shadow-sm hover:bg-gray-50"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md bg-green-500 p-2">
                <FiPackage className="h-5 w-5 text-white" />
              </div>
              <p className="ml-3 text-sm font-medium text-gray-900">View Orders</p>
            </div>
          </Link>
          
          <Link
            to="/admin/reports"
            className="flex items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-5 shadow-sm hover:bg-gray-50"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md bg-blue-500 p-2">
                <FiTrendingUp className="h-5 w-5 text-white" />
              </div>
              <p className="ml-3 text-sm font-medium text-gray-900">View Reports</p>
            </div>
          </Link>
          
          <Link
            to="/admin/settings"
            className="flex items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-5 shadow-sm hover:bg-gray-50"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md bg-yellow-500 p-2">
                <FiSettings className="h-5 w-5 text-white" />
              </div>
              <p className="ml-3 text-sm font-medium text-gray-900">Settings</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};