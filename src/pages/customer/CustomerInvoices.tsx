import React from 'react';
import { FiFileText, FiDownload, FiPrinter, FiMail } from 'react-icons/fi';

const CustomerInvoices = () => {
  // Mock data for invoices
  const invoices = [
    {
      id: 'INV-2023-1001',
      date: '2023-12-01',
      dueDate: '2023-12-31',
      amount: 1250.75,
      status: 'Paid',
      downloadUrl: '#'
    },
    {
      id: 'INV-2023-1002',
      date: '2023-11-15',
      dueDate: '2023-12-15',
      amount: 850.50,
      status: 'Paid',
      downloadUrl: '#'
    },
    {
      id: 'INV-2023-1003',
      date: '2024-01-05',
      dueDate: '2024-02-05',
      amount: 1250.75,
      status: 'Pending',
      downloadUrl: '#'
    },
    {
      id: 'INV-2023-1004',
      date: '2024-01-10',
      dueDate: '2024-02-10',
      amount: 850.50,
      status: 'Overdue',
      downloadUrl: '#'
    }
  ];

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">My Invoices</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invoice
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
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
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                  <div className="flex items-center">
                    <FiFileText className="mr-2" />
                    {invoice.id}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(invoice.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(invoice.dueDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(invoice.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button 
                      className="text-gray-500 hover:text-gray-700"
                      title="Download Invoice"
                    >
                      <FiDownload className="w-4 h-4" />
                    </button>
                    <button 
                      className="text-gray-500 hover:text-gray-700"
                      title="Print Invoice"
                    >
                      <FiPrinter className="w-4 h-4" />
                    </button>
                    <button 
                      className="text-gray-500 hover:text-gray-700"
                      title="Email Invoice"
                    >
                      <FiMail className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerInvoices;
