import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/authContext";
import React from 'react';
import DashboardLayout from "./components/DashboardLayout";
import Login from "./pages/login";
import RegisterRequest from "./pages/registerRequest";
import ActivateAccount from "./pages/ActivateAccount";
import Customers from "./pages/Customers";
import CustomerCard from "./pages/CustomerCard";
import EditCustomer from './pages/EditCustomer';
import CreateCustomer from './pages/CreateCustomer';
import ItemsList from "./pages/ItemsList";
import ItemPage from "./pages/ItemPage";
import SalesInvoiceList from './pages/sales/SalesInvoiceList';
import SalesInvoiceDetail from './pages/sales/SalesInvoiceDetail';
import PostedSalesInvoices from './pages/sales/PostedSalesInvoices';
import PostedSalesInvoiceDetail from './pages/sales/PostedSalesInvoiceDetail';
import SalesQuotes from './pages/SalesQuotes';
import SalesQuoteDetail from './pages/SalesQuoteDetail';
import SalesOrders from './pages/SalesOrders';
import SalesOrderDetail from './pages/SalesOrderDetail';
import CreditMemoList from './pages/sales/CreditMemoList';
import CreditMemoDetail from './pages/sales/CreditMemoDetail';
import Contacts from './pages/Contacts';
import ItemLedgerEntries from './pages/ItemLedgerEntries';
import Dashboard from "./pages/dashboard";
import CustomerTemplates from "./pages/CustomerTemplates";
import CustomerTemplateDetail from "./pages/CustomerTemplateDetail";

import CustomerPostingGroups from "./pages/CustomerPostingGroups";
import CustomerPaymentTerms from "./pages/PaymentTerms";

//items
import ItemCategories from './pages/items/ItemCategories';
import ProductPostingGroups from './pages/items/ProductPostingGroups';

// Customer Portal Components
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerOrders from './pages/customer/CustomerOrders';
import CustomerInvoices from './pages/customer/CustomerInvoices';
import CustomerSettings from './pages/customer/CustomerSettings';
import CustomerLayout from './components/customer/CustomerLayout';

// Admin Components
import AdminLayout from './components/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import CustomerList from './pages/admin/customers/CustomerList';
import CustomerForm from './pages/admin/customers/CustomerForm';
import CustomerLedgerEntries from './pages/CustomerLedgerEntries';


// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Public Route Component
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Dashboard Layout Wrapper with ProtectedRoute
const DashboardLayoutWrapper: React.FC = () => (
  <ProtectedRoute>
    <DashboardLayout />
  </ProtectedRoute>
);

// Admin Layout Wrapper with ProtectedRoute
const AdminLayoutWrapper: React.FC = () => (
  <ProtectedRoute>
    <AdminLayout />
  </ProtectedRoute>
);

// Customer Portal Layout Wrapper with ProtectedRoute
const CustomerPortalLayoutWrapper: React.FC = () => (
  <ProtectedRoute>
    <CustomerLayout />
  </ProtectedRoute>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="App">
          <Routes>
          {/* Public Routes */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <RegisterRequest />
            </PublicRoute>
          } />
          <Route path="/activate" element={
            <PublicRoute>
              <ActivateAccount />
            </PublicRoute>
          } />

          {/* Protected Dashboard Routes */}
          <Route element={<DashboardLayoutWrapper />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Legacy Admin Routes - Consider migrating these to the new admin layout */}
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/templates" element={<CustomerTemplates />} />
            <Route path="/customers/ledger-entries" element={<CustomerLedgerEntries />} />
            <Route
  path="/customers/templates/:templateCode"
  element={<CustomerTemplateDetail />}
/>
<Route path="/customers/posting-groups" element={<CustomerPostingGroups />} />
<Route path="/customers/payment-terms" element={<CustomerPaymentTerms />} />

            <Route path="/customers/:id" element={<CustomerCard />} />
            <Route path="/customers/new" element={<CreateCustomer />} />
            <Route path="/customers/edit/:id" element={<EditCustomer />} />
            <Route path="/customers/:customerNo/ledger" element={<CustomerLedgerEntries />} />

            <Route path="/items" element={<ItemsList />} />
            <Route path="/items/:itemNo/ledger-entries" element={<ItemLedgerEntries />} />
            <Route path="/items/:itemNumber" element={<ItemPage />} />
            
            <Route path="/items/categories" element={<ItemCategories />} />
<Route path="/items/posting-groups" element={<ProductPostingGroups />} />
            <Route path="/sales/invoices" element={<SalesInvoiceList />} />
            <Route path="/sales/invoices/:invoiceNo" element={<SalesInvoiceDetail />} />
            <Route path="/sales/posted-invoices" element={<PostedSalesInvoices />} />
            <Route path="/sales/posted-invoices/:No" element={<PostedSalesInvoiceDetail />} />
            <Route path="/sales/quotes" element={<SalesQuotes />} />
            <Route path="/sales/quotes/:quoteNo" element={<SalesQuoteDetail />} />
            <Route path="/sales/orders" element={<SalesOrders />} />
            <Route path="/sales/orders/:orderNo" element={<SalesOrderDetail />} />
            <Route path="/sales/credit-memos" element={<CreditMemoList />} />
            <Route path="/sales/credit-memos/:memoNo" element={<CreditMemoDetail />} />
            <Route path="/contacts" element={<Contacts />} />
          </Route>

          {/* Admin Portal Routes */}
          <Route path="/admin" element={<AdminLayoutWrapper />}>
            <Route index element={<AdminDashboard />} />
            <Route path="customers" element={<CustomerList />} />
            <Route path="customers/new" element={<CustomerForm />} />
            <Route path="customers/edit/:id" element={<CustomerForm />} />
            {/* Add more admin routes here as needed */}
          </Route>

          {/* Customer Portal Routes */}
          <Route path="/customer" element={<CustomerPortalLayoutWrapper />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<CustomerDashboard />} />
            <Route path="orders" element={<CustomerOrders />} />
            <Route path="invoices" element={<CustomerInvoices />} />
            <Route path="settings" element={<CustomerSettings />} />
          </Route>

          {/* 404 - No route found */}
          <Route path="*" element={
            <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
              <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <h1 className="text-4xl font-bold text-red-500 dark:text-red-400 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Page Not Found</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">The page you're looking for doesn't exist or has been moved.</p>
                <a
                  href="/dashboard"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Go to Dashboard
                </a>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </AuthProvider>
  </BrowserRouter>
  );
}