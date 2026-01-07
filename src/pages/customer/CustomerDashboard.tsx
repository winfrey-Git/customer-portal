// src/pages/customer/CustomerDashboard.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiBox, 
  FiDollarSign, 
  FiClock,
  FiAlertCircle,
  FiTruck,
  FiRefreshCw,
  FiCheckCircle,
  FiPackage
} from 'react-icons/fi';
import { customerService } from '../../services/customerService';
import { useAuth } from '../../context/authContext';

interface Order {
  id: string;
  number: string;
  date: string;
  status: string;
  amount: number;
  currencyCode: string;
  documentType: string;
  type: 'order' | 'invoice';
  dueDate?: string;
  isPaid?: boolean;
}

interface CustomerProfile {
  No: string;
  Name: string;
  Email?: string;
  Phone_No?: string;
  stats: {
    totalOrders: number;
    totalInvoices: number;
    totalSpent: number;
    currencyCode: string;
    memberSince: string;
  };
}

const CustomerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.customerNo) {
        setError('Customer number not found. Please contact support.');
        setLoading(false);
        return;
      }

      const [ordersData, profileData] = await Promise.all([
        customerService.getCustomerOrders(user.customerNo).catch(err => {
          console.error('Error fetching orders:', err);
          return []; // Ensure we return an empty array on error
        }),
        customerService.getCustomerProfile(user.customerNo).catch(err => {
          console.error('Error fetching profile:', err);
          return null;
        })
      ]);

      // Ensure orders is always an array, even if ordersData is null/undefined
      const safeOrders = Array.isArray(ordersData) ? ordersData : [];
      setOrders(safeOrders);
      setProfile(profileData);
      
    } catch (err) {
      console.error('Unexpected error in fetchData:', err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.customerNo]);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; icon: React.ReactNode }> = {
      'Paid': { color: 'bg-green-100 text-green-800', icon: <FiCheckCircle /> },
      'Shipped': { color: 'bg-blue-100 text-blue-800', icon: <FiTruck /> },
      'Processing': { color: 'bg-yellow-100 text-yellow-800', icon: <FiRefreshCw className="animate-spin" /> },
      'Pending': { color: 'bg-orange-100 text-orange-800', icon: <FiClock /> },
      'Overdue': { color: 'bg-red-100 text-red-800', icon: <FiAlertCircle /> },
    };

    const statusInfo = statusMap[status] || { color: 'bg-gray-100 text-gray-800', icon: <FiPackage /> };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.icon}
        <span className="ml-1">{status}</span>
      </span>
    );
  };

  const formatCurrency = (amount: number, currencyCode: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <FiAlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
            <div className="mt-2">
              <button
                onClick={fetchData}
                className="text-sm font-medium text-red-700 hover:text-red-600"
              >
                Try again <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {profile?.Name || 'Customer'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's what's happening with your account
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <FiBox className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-900">
                {profile?.stats?.totalOrders ?? 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FiClock className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending Orders</p>
              <p className="text-2xl font-semibold text-gray-900">
                {orders.filter(o => o.status === 'Pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FiDollarSign className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Spent</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(
                  profile?.stats?.totalSpent ?? 0, 
                  profile?.stats?.currencyCode ?? 'USD'
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FiPackage className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Member Since</p>
              <p className="text-lg font-semibold text-gray-900">
                {profile?.stats?.memberSince 
                  ? new Date(profile.stats.memberSince).toLocaleDateString() 
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          <button
            onClick={() => navigate('/customer/orders')}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View all
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length > 0 ? (
                orders.slice(0, 5).map((order) => (
                  <tr key={`${order.type}-${order.id}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                      {order.number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.documentType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(order.amount, order.currencyCode)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => navigate(`/customer/${order.type === 'order' ? 'orders' : 'invoices'}/${order.id}`)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No recent activity found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;