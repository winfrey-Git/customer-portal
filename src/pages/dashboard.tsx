import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  getDashboardStats, 
  getSalesData, 
  getRevenueData, 
  getRecentOrders,
  type DashboardStats,
  type SalesData,
  type RevenueData as ServiceRevenueData,
  type RecentOrder
} from '../services/dashboardService';
import { 
  FiDollarSign, 
  FiShoppingCart, 
  FiUsers, 
  FiFileText,
  FiClock,
  FiPlus,
  FiFile,
  FiUserPlus,
  FiDollarSign as FiDollar,
  FiPieChart,
  FiAlertCircle
} from 'react-icons/fi';

interface ChartDataInput {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface RevenueData extends ServiceRevenueData, ChartDataInput {}

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    newCustomers: 0,
    pendingInvoices: 0
  });
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [revenueData, setRevenueData] = useState<ChartDataInput[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [recentActivities, setRecentActivities] = useState([
    { id: 1, type: 'order', user: 'John Doe', action: 'placed a new order', time: '2 min ago', icon: <FiShoppingCart className="text-blue-500" /> },
    { id: 2, type: 'payment', user: 'Jane Smith', action: 'completed payment', time: '10 min ago', icon: <FiDollar className="text-green-500" /> },
    { id: 3, type: 'user', user: 'Mike Johnson', action: 'signed up', time: '25 min ago', icon: <FiUserPlus className="text-purple-500" /> },
    { id: 4, type: 'report', user: 'System', action: 'generated monthly report', time: '1 hour ago', icon: <FiPieChart className="text-yellow-500" /> },
    { id: 5, type: 'alert', user: 'System', action: 'inventory low on Product X', time: '2 hours ago', icon: <FiAlertCircle className="text-red-500" /> }
  ]);
  const navigate = useNavigate();

  const handleQuickAction = (action: string) => {
    switch(action) {
      case 'New Order':
        navigate('/sales-orders/new');
        break;
      case 'Add Customer':
        navigate('/customers/new');
        break;
      case 'Create Invoice':
        navigate('/sales-invoices/new');
        break;
      case 'Record Payment':
        // Assuming there's a payments route, adjust if different
        navigate('/payments/new');
        break;
      default:
        break;
    }
  };

  const [quickActions, setQuickActions] = useState([
    { 
      id: 1, 
      title: 'New Order', 
      icon: <FiPlus className="w-5 h-5" />, 
      color: 'bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors',
      hoverColor: 'hover:bg-blue-50'
    },
    { 
      id: 2, 
      title: 'Add Customer', 
      icon: <FiUserPlus className="w-5 h-5" />, 
      color: 'bg-green-100 text-green-600 hover:bg-green-200 transition-colors',
      hoverColor: 'hover:bg-green-50'
    },
    { 
      id: 3, 
      title: 'Create Invoice', 
      icon: <FiFile className="w-5 h-5" />, 
      color: 'bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors',
      hoverColor: 'hover:bg-purple-50'
    },
    { 
      id: 4, 
      title: 'Record Payment', 
      icon: <FiDollar className="w-5 h-5" />, 
      color: 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors',
      hoverColor: 'hover:bg-yellow-50'
    }
  ]);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [statsData, sales, revenue, orders] = await Promise.all([
          getDashboardStats(),
          getSalesData(),
          getRevenueData(),
          getRecentOrders(5)
        ]);

        const formattedRevenue = revenue.map(item => ({
          ...item,
          name: item.name || 'Unknown',
          value: typeof item.value === 'number' ? item.value : 0
        }));

        setStats(statsData);
        setSalesData(sales);
        setRevenueData(formattedRevenue);
        setRecentOrders(orders);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);

  const formatNumber = (value: number) =>
    new Intl.NumberFormat('en-US').format(value);

  const statsData = [
    { 
      title: 'Total Revenue', 
      value: formatCurrency(stats.totalRevenue), 
      change: '+12.5%', 
      icon: <FiDollarSign className="text-blue-600" />,
      iconColor: 'bg-blue-100'
    },
    { 
      title: 'Total Orders', 
      value: formatNumber(stats.totalOrders), 
      change: '+8.2%', 
      icon: <FiShoppingCart className="text-purple-600" />,
      iconColor: 'bg-purple-100'
    },
    { 
      title: 'New Customers', 
      value: formatNumber(stats.newCustomers), 
      change: '+15.3%', 
      icon: <FiUsers className="text-green-600" />,
      iconColor: 'bg-green-100'
    },
    { 
      title: 'Pending Invoices', 
      value: formatNumber(stats.pendingInvoices), 
      change: '-5.1%', 
      icon: <FiFileText className="text-orange-600" />,
      iconColor: 'bg-orange-100'
    },
  ];

  return (
    <div className="p-6 h-full overflow-auto bg-gray-50 space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              {/* Icon with updated styling */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${stat.iconColor}`}>
                {stat.icon}
              </div>

              {/* Change percentage */}
              <span className={`text-sm font-medium ${
                stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>

            <h3 className="text-gray-500 text-xs font-medium mb-0.5">{stat.title}</h3>
            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sales Trend */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales Trend</h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ececec" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={3} />
              <Line type="monotone" dataKey="orders" stroke="#10B981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Sources */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Sources</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueData}
                cx="50%"
                cy="50%"
                outerRadius={85}
                labelLine={false}
                label={({ name = '', percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}
                dataKey="value"
              >
                {revenueData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activities and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Recent Activities</h3>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
              <FiClock className="mr-1" /> View All
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center mr-3">
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      <span className="font-semibold">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Quick Actions</h3>
          </div>
          <div className="p-4 grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action.title)}
                className={`p-4 rounded-lg flex flex-col items-center justify-center ${action.color} ${action.hoverColor} transition-colors duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 ${action.color.includes('blue') ? 'focus:ring-blue-200' : action.color.includes('green') ? 'focus:ring-green-200' : action.color.includes('purple') ? 'focus:ring-purple-200' : 'focus:ring-yellow-200'}`}
                aria-label={action.title}
              >
                <span className="mb-1">{action.icon}</span>
                <span className="text-sm font-medium">{action.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Recent Orders</h3>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(order.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                          order.status.toLowerCase().includes('released') || order.status.toLowerCase().includes('invoiced')
                            ? 'bg-green-100 text-green-800'
                            : order.status.toLowerCase().includes('pending') || order.status.toLowerCase() === 'open'
                            ? 'bg-yellow-100 text-yellow-800'
                            : order.status.toLowerCase() === 'overdue'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No orders found.
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

export default Dashboard;