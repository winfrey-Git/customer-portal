// src/layouts/CustomerLayout.tsx
import { Outlet } from 'react-router-dom';
import CustomerSidebar from '../../components/customer/CustomerSidebar';
import CustomerHeader from '../../components/customer/CustomerHeader';

const CustomerLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <CustomerSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <CustomerHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-4 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomerLayout;