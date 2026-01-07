import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

type CreditMemo = {
  id: string;
  memoNo: string;
  customerName: string;
  date: string;
  amount: number;
  status: 'Open' | 'Posted' | 'Cancelled';
};

export default function CreditMemoList() {
  const [memos, setMemos] = useState<CreditMemo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchMemos = async () => {
      try {
        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data - replace with actual API call
        const mockData: CreditMemo[] = [
          {
            id: '1',
            memoNo: 'CM-2023-001',
            customerName: 'ABC Company',
            date: '2023-10-15',
            amount: 1250.75,
            status: 'Posted'
          },
          {
            id: '2',
            memoNo: 'CM-2023-002',
            customerName: 'XYZ Corp',
            date: '2023-10-18',
            amount: 850.50,
            status: 'Open'
          },
          {
            id: '3',
            memoNo: 'CM-2023-003',
            customerName: 'DEF Inc',
            date: '2023-10-20',
            amount: 1200.00,
            status: 'Posted'
          },
          {
            id: '4',
            memoNo: 'CM-2023-004',
            customerName: 'GHI Ltd',
            date: '2023-10-22',
            amount: 900.00,
            status: 'Open'
          },
          {
            id: '5',
            memoNo: 'CM-2023-005',
            customerName: 'JKL Corp',
            date: '2023-10-25',
            amount: 1500.00,
            status: 'Posted'
          },
          {
            id: '6',
            memoNo: 'CM-2023-006',
            customerName: 'MNO Inc',
            date: '2023-10-28',
            amount: 1000.00,
            status: 'Open'
          },
          {
            id: '7',
            memoNo: 'CM-2023-007',
            customerName: 'PQR Ltd',
            date: '2023-10-30',
            amount: 1100.00,
            status: 'Posted'
          },
          {
            id: '8',
            memoNo: 'CM-2023-008',
            customerName: 'STU Corp',
            date: '2023-11-01',
            amount: 1300.00,
            status: 'Open'
          },
          {
            id: '9',
            memoNo: 'CM-2023-009',
            customerName: 'VWX Inc',
            date: '2023-11-03',
            amount: 1400.00,
            status: 'Posted'
          },
          {
            id: '10',
            memoNo: 'CM-2023-010',
            customerName: 'YZA Ltd',
            date: '2023-11-05',
            amount: 1600.00,
            status: 'Open'
          },
        ];
        
        setMemos(mockData);
      } catch (error) {
        console.error('Error fetching credit memos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemos();
  }, []);

  const filteredMemos = useMemo(() => 
    memos.filter(memo =>
      memo.memoNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memo.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [memos, searchTerm]
  );

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Get current memos for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMemos = filteredMemos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMemos.length / itemsPerPage);

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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Credit Memos</h1>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search memos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Link
            to="/sales/credit-memos/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create Credit Memo
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Memo No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredMemos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No credit memos found
                  </td>
                </tr>
              ) : (
                currentMemos.map((memo) => (
                  <tr key={memo.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                      <Link to={`/sales/credit-memos/${memo.id}`} className="hover:underline">
                        {memo.memoNo}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {memo.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(memo.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                      ${memo.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        memo.status === 'Posted' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        memo.status === 'Open' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {memo.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/sales/credit-memos/${memo.id}`}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                      >
                        View
                      </Link>
                      {memo.status === 'Open' && (
                        <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          
          {/* Pagination Controls */}
          {filteredMemos.length > itemsPerPage && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredMemos.length)} of {filteredMemos.length} memos
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
    </div>
  );
}