import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

type LineItem = {
  id: string;
  itemNumber: string;
  description: string;
  quantity: number;
  unitPrice: number;
  lineAmount: number;
};

type CreditMemo = {
  id: string;
  memoNo: string;
  customerNo: string;
  customerName: string;
  date: string;
  status: 'Open' | 'Posted' | 'Cancelled';
  totalAmount: number;
  totalTax: number;
  totalAmountIncludingTax: number;
  lineItems: LineItem[];
  notes?: string;
};

export default function CreditMemoDetail() {
  const { id } = useParams<{ id: string }>();
  const [memo, setMemo] = useState<CreditMemo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  useEffect(() => {
    const fetchMemo = async () => {
      try {
        setLoading(true);
        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data - replace with actual API call
        const mockData: CreditMemo = {
          id: id || '1',
          memoNo: `CM-2023-${id?.padStart(3, '0') || '001'}`,
          customerNo: 'CUST-001',
          customerName: id === '1' ? 'ABC Company' : 'XYZ Corp',
          date: '2023-10-15',
          status: id === '1' ? 'Posted' : 'Open',
          totalAmount: 1250.75,
          totalTax: 187.61,
          totalAmountIncludingTax: 1438.36,
          notes: id === '1' 
            ? 'Issued for returned damaged goods' 
            : 'Price adjustment for promotional discount',
          lineItems: [
            {
              id: '1',
              itemNumber: 'ITEM-001',
              description: 'Premium Widget',
              quantity: 5,
              unitPrice: 250.15,
              lineAmount: 1250.75
            }
          ]
        };
        
        setMemo(mockData);
      } catch (err) {
        console.error('Error fetching credit memo:', err);
        setError('Failed to load credit memo. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMemo();
  }, [id]);

  const handlePost = async () => {
    if (!memo) return;
    
    try {
      setIsPosting(true);
      // TODO: Implement actual API call to post the memo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setMemo({
        ...memo,
        status: 'Posted',
        memoNo: `CM-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`
      });
      
      // Show success message or redirect
      alert('Credit memo posted successfully');
    } catch (err) {
      console.error('Error posting credit memo:', err);
      alert('Failed to post credit memo. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  const handleCancel = async () => {
    if (!memo) return;
    
    if (!window.confirm('Are you sure you want to cancel this credit memo? This action cannot be undone.')) {
      return;
    }
    
    try {
      setIsCanceling(true);
      // TODO: Implement actual API call to cancel the memo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setMemo({
        ...memo,
        status: 'Cancelled'
      });
      
      // Show success message
      alert('Credit memo cancelled successfully');
    } catch (err) {
      console.error('Error cancelling credit memo:', err);
      alert('Failed to cancel credit memo. Please try again.');
    } finally {
      setIsCanceling(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!memo) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">Credit memo not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 print:p-0">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Credit Memo: {memo.memoNo}
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Print
          </button>
          <Link
            to="/sales/credit-memos"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to List
          </Link>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`mb-6 p-4 rounded-md ${
        memo.status === 'Posted' ? 'bg-green-50 border border-green-200 dark:bg-green-900/30 dark:border-green-800' :
        memo.status === 'Cancelled' ? 'bg-red-50 border border-red-200 dark:bg-red-900/30 dark:border-red-800' :
        'bg-blue-50 border border-blue-200 dark:bg-blue-900/30 dark:border-blue-800'
      }`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {memo.status === 'Posted' ? (
              <svg className="h-5 w-5 text-green-500 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : memo.status === 'Cancelled' ? (
              <svg className="h-5 w-5 text-red-500 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-blue-500 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium">
              {memo.status === 'Posted' ? 'Posted' : memo.status === 'Cancelled' ? 'Cancelled' : 'Draft'}
            </h3>
            <div className="mt-1 text-sm">
              {memo.status === 'Posted' 
                ? 'This credit memo has been posted and cannot be modified.' 
                : memo.status === 'Cancelled'
                ? 'This credit memo has been cancelled and cannot be modified.'
                : 'This is a draft credit memo. Please review before posting.'}
            </div>
          </div>
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              {memo.status === 'Open' && (
                <div className="space-x-2">
                  <button
                    onClick={handlePrint}
                    className="mr-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                  >
                    Print
                  </button>
                  <Link
                    to="/sales/credit-memos"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Back to List
                  </Link>
                  <button
                    onClick={handleCancel}
                    disabled={isCanceling}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                  >
                    {isCanceling ? 'Canceling...' : 'Cancel Memo'}
                  </button>
                  <button
                    onClick={handlePost}
                    disabled={isPosting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {isPosting ? 'Posting...' : 'Post Memo'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Memo Details */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-6 print:shadow-none">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Credit Memo Details
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">MEMO NUMBER</h4>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">{memo.memoNo}</p>
              
              <h4 className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">CUSTOMER</h4>
              <p className="mt-1 text-sm text-gray-900 dark:text-white font-medium">{memo.customerName}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{memo.customerNo}</p>
            </div>
            <div className="text-right">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">DATE</h4>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {new Date(memo.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              
              <h4 className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">STATUS</h4>
              <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                memo.status === 'Posted' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                memo.status === 'Open' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {memo.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-6 print:shadow-none print:border">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Line Items
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Item
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {memo.lineItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{item.description}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{item.itemNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                      ${item.unitPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white">
                      ${item.lineAmount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <td colSpan={3} className="px-6 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                    Subtotal
                  </td>
                  <td className="px-6 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                    ${memo.totalAmount.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className="px-6 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                    Tax
                  </td>
                  <td className="px-6 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                    ${memo.totalTax.toFixed(2)}
                  </td>
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-700">
                  <td colSpan={3} className="px-6 py-3 text-right text-base font-bold text-gray-900 dark:text-white">
                    Total
                  </td>
                  <td className="px-6 py-3 text-right text-base font-bold text-gray-900 dark:text-white">
                    ${memo.totalAmountIncludingTax.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Notes */}
      {memo.notes && (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-6 print:shadow-none">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Notes
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {memo.notes}
            </p>
          </div>
        </div>
      )}

      {/* Print Footer - Only visible when printing */}
      <div className="hidden print:block mt-12 pt-8 border-t border-gray-200">
        <div className="text-center text-sm text-gray-500">
          <p>Thank you for your business!</p>
          <p className="mt-2">This is a computer-generated document. No signature is required.</p>
        </div>
      </div>
    </div>
  );
}
