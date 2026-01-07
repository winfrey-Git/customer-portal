import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AxiosError } from 'axios';
import { api } from '../../services/bcApiService';

interface PostedSalesInvoice {
  No: string;
  Posting_Date: string;
  Due_Date: string;
  // Handle both field name formats
  Customer_No?: string;
  Customer_Name?: string;
  Sell_to_Customer_No?: string;
  Sell_to_Customer_Name?: string;
  Amount: number;
  Amount_Including_VAT: number;
  Status?: string; // Will be calculated
  Document_Date: string;
  Payment_Terms_Code: string;
  Payment_Method_Code: string;
  // Add computed properties for easy access
  displayCustomerName: string;
  displayCustomerNo: string;
  // Add fields for status calculation
  Closed?: boolean;
  Cancelled?: boolean;
  // Add display status that will be calculated
  displayStatus: 'Paid' | 'Overdue' | 'Unpaid';
}

export default function PostedSalesInvoices() {
  const [invoices, setInvoices] = useState<PostedSalesInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchPostedInvoices = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching posted sales invoices...');
        const response = await api.get('/postedsalesinvoices');
        console.log('Posted invoices response:', response.data);
        
        // Handle different response formats
        let data = [];
        if (Array.isArray(response.data)) {
          data = response.data;
        } else if (response.data && Array.isArray(response.data.value)) {
          data = response.data.value;
        } else if (response.data && response.data.results) {
          data = response.data.results;
        }
        
        // Map the data to include computed properties for consistent field names
        const processedData = data.map((invoice: any) => {
          const dueDate = new Date(invoice.Due_Date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          // Determine status based on Closed, Cancelled, and Due_Date
          let displayStatus: 'Paid' | 'Overdue' | 'Unpaid' = 'Unpaid';
          
          if (invoice.Closed) {
            displayStatus = 'Paid';
          } else if (invoice.Cancelled) {
            displayStatus = 'Unpaid'; // Or 'Cancelled' if you want to show that specifically
          } else if (dueDate < today) {
            displayStatus = 'Overdue';
          }
          
          return {
            ...invoice,
            // Use Sell_to_Customer_* if Customer_* is not available
            displayCustomerName: invoice.Customer_Name || invoice.Sell_to_Customer_Name || 'Unknown',
            displayCustomerNo: invoice.Customer_No || invoice.Sell_to_Customer_No || '',
            // Set the display status
            displayStatus
          };
        });
        
        console.log('Processed invoices data:', processedData);
        setInvoices(processedData);
      } catch (err: unknown) {
        const errorMessage = err instanceof AxiosError 
          ? `Error ${err.response?.status}: ${err.response?.data?.message || err.message}`
          : 'Failed to load posted sales invoices';
        console.error('Error fetching posted sales invoices:', { error: err, message: errorMessage });
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPostedInvoices();
  }, []);

  const formatDate = (dateString: string) => {
    return dateString ? new Date(dateString).toLocaleDateString() : 'N/A';
  };

  const formatCurrency = (amount?: number | string) => {
    // Convert string to number if needed
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    // Check if the amount is a valid number
    if (numAmount === undefined || numAmount === null || isNaN(numAmount)) {
      return 'N/A';
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numAmount);
  };

  const filteredInvoices = useMemo(() => 
    invoices.filter(invoice => 
      !searchTerm ||
      invoice.No?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invoice.displayCustomerName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (invoice.displayCustomerNo?.toLowerCase().includes(searchTerm.toLowerCase()))
    ),
    [invoices, searchTerm]
  );

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Get current invoices
  const indexOfLastInvoice = currentPage * itemsPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - itemsPerPage;
  const currentInvoices = filteredInvoices.slice(indexOfFirstInvoice, indexOfLastInvoice);
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  // Change page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading posted sales invoices...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Posted Sales Invoices</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search posted invoices..."
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invoice No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Posting Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Due Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Amount
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  No posted invoices found
                </td>
              </tr>
            ) : (
              currentInvoices.map((invoice) => (
              <tr key={invoice.No} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {invoice.No}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="font-medium">{invoice.displayCustomerName}</div>
                  <div className="text-gray-500 text-xs">{invoice.displayCustomerNo}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                  {formatDate(invoice.Posting_Date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                  {formatDate(invoice.Due_Date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                  {formatCurrency(invoice.Amount_Including_VAT || invoice.Amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    invoice.displayStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                    invoice.displayStatus === 'Overdue' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {invoice.displayStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    to={`/sales/posted-invoices/${invoice.No}`}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    View
                  </Link>
                  <a 
                    href={`/api/postedsalesinvoices/${invoice.No}/pdf`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-900"
                  >
                    PDF
                  </a>
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
        
        {/* Pagination Controls */}
        {filteredInvoices.length > itemsPerPage && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Showing {indexOfFirstInvoice + 1} to {Math.min(indexOfLastInvoice, filteredInvoices.length)} of {filteredInvoices.length} invoices
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 rounded-md border ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600'
                    : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
                }`}
              >
                Previous
              </button>
              <span className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 rounded-md border ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600'
                    : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
