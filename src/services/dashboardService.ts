import { api } from './bcApiService';
import axios from 'axios';

declare const process: {
  env: {
    NODE_ENV: 'development' | 'production' | string;
  };
};

// Types for dashboard data
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  newCustomers: number;
  pendingInvoices: number;
}

export interface SalesData {
  month: string;
  sales: number;
  orders: number;
}

export interface RevenueData {
  name: string;
  value: number;
}

export interface RecentOrder {
  id: string;
  customer: string;
  amount: number;
  status: string;
  date: string;
}

// Mock data for development
const MOCK_STATS: DashboardStats = {
  totalRevenue: 125000,
  totalOrders: 342,
  newCustomers: 45,
  pendingInvoices: 23
};

const MOCK_SALES_DATA: SalesData[] = [
  { month: 'Jan', sales: 4000, orders: 24 },
  { month: 'Feb', sales: 3000, orders: 13 },
  { month: 'Mar', sales: 5000, orders: 28 },
  { month: 'Apr', sales: 2780, orders: 19 },
  { month: 'May', sales: 1890, orders: 21 },
  { month: 'Jun', sales: 2390, orders: 18 },
];

const MOCK_REVENUE_DATA: RevenueData[] = [
  { name: 'Products', value: 400 },
  { name: 'Services', value: 300 },
  { name: 'Subscriptions', value: 200 },
  { name: 'Other', value: 100 },
];

const MOCK_RECENT_ORDERS: RecentOrder[] = [
  { id: 'ORD-001', customer: 'John Doe', amount: 1200, status: 'Released', date: '2023-06-01' },
  { id: 'ORD-002', customer: 'Jane Smith', amount: 800, status: 'Pending Approval', date: '2023-06-02' },
  { id: 'ORD-003', customer: 'Acme Corp', amount: 2500, status: 'Invoiced', date: '2023-06-03' },
  { id: 'ORD-004', customer: 'XYZ Ltd', amount: 500, status: 'Overdue', date: '2023-05-30' },
  { id: 'ORD-005', customer: 'Test Company', amount: 1800, status: 'Open', date: '2023-06-04' },
];

// Fetch dashboard statistics
export const getDashboardStats = async (): Promise<DashboardStats> => {
  if (process.env.NODE_ENV === 'development') {
    return MOCK_STATS;
  }

  try {
    const [revenueRes, ordersRes, customersRes, invoicesRes] = await Promise.all([
      api.get('/sales/revenue/stats').catch(() => ({ data: { total: 0 } })),
      api.get('/sales/orders/count').catch(() => ({ data: { count: 0 } })),
      api.get('/customers/count?new=true').catch(() => ({ data: { count: 0 } })),
      api.get('/invoices/count?status=pending').catch(() => ({ data: { count: 0 } }))
    ]);

    return {
      totalRevenue: revenueRes?.data?.total || 0,
      totalOrders: ordersRes?.data?.count || 0,
      newCustomers: customersRes?.data?.count || 0,
      pendingInvoices: invoicesRes?.data?.count || 0
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return MOCK_STATS;
  }
};

// Fetch sales data for the chart
export const getSalesData = async (): Promise<SalesData[]> => {
  if (process.env.NODE_ENV === 'development') {
    return MOCK_SALES_DATA;
  }

  try {
    const response = await api.get('/sales/monthly').catch(() => ({ data: [] }));
    if (response.data && Array.isArray(response.data)) {
      return response.data.map((item: any) => ({
        month: item.month,
        sales: item.totalSales || 0,
        orders: item.orderCount || 0
      }));
    }
    return MOCK_SALES_DATA;
  } catch (error) {
    console.error('Error fetching sales data:', error);
    return MOCK_SALES_DATA;
  }
};

// Interface for API responses
interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: any;
  request?: any;
}

// Function to sort orders by date (newest first)
const sortOrdersByDate = (orders: RecentOrder[]): RecentOrder[] => {
  return [...orders].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
};

// Fetch sales orders from the API using the same endpoint as SalesOrders page
const fetchSalesOrders = async (): Promise<RecentOrder[]> => {
  try {
    const response = await axios.get("http://localhost:5000/api/salesorders");
    
    // Handle different possible response structures
    let ordersData = [];
    if (Array.isArray(response.data)) {
      ordersData = response.data;
    } else if (response.data && Array.isArray(response.data.value)) {
      ordersData = response.data.value;
    } else if (response.data && response.data.results) {
      ordersData = response.data.results;
    }

    // Map the orders to the RecentOrder format
    return ordersData.map((order: any) => ({
      id: order.No || order.Document_No || 'N/A',
      customer: order.Sell_to_Customer_Name || order.Customer_Name || 'Unknown Customer',
      amount: order.Amount || order.Amount_Including_VAT || 0,
      status: mapOrderStatus(order.Status),
      date: order.Order_Date || order.Posting_Date || order.Document_Date || new Date().toISOString().split('T')[0]
    }));

  } catch (error) {
    console.error('Error fetching sales orders:', error);
    throw error;
  }
};

// Return the original status from Business Central
const mapOrderStatus = (status: string): string => {
  // Return the original status or 'Open' if status is not provided
  return status || 'Open';
};

// Get the most recent orders
export const getRecentOrders = async (limit = 5): Promise<RecentOrder[]> => {
  try {
    const orders = await fetchSalesOrders();
    return sortOrdersByDate(orders).slice(0, limit);
  } catch (error) {
    console.error('Error in getRecentOrders:', error);
    // In case of error, return empty array instead of mock data
    return [];
  }
};

// Update the getRevenueData function
export const getRevenueData = async (): Promise<RevenueData[]> => {
  if (process.env.NODE_ENV === 'development') {
    return MOCK_REVENUE_DATA;
  }

  try {
    const response = await api.get<RevenueData[]>('/revenue/distribution')
      .catch<ApiResponse<RevenueData[]>>(() => ({
        data: MOCK_REVENUE_DATA,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
        request: {}
      }));

    return Array.isArray(response?.data) ? response.data : MOCK_REVENUE_DATA;
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    return MOCK_REVENUE_DATA;
  }
};