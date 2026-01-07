import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";

interface Customer {
  No: string;
  Name: string;
  Address: string;
  City: string;
  Phone_No: string;
  Email: string;
  Balance_LCY: number;
}

interface LedgerEntry {
  Entry_No: number;
  Posting_Date: string;
  Document_Type: string;
  Document_No: string;
  Description: string;
  Debit_Amount: number;
  Credit_Amount: number;
  Amount: number;
}

export default function CustomerDetails() {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<'details' | 'ledger'>('details');
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Fetch customer details
        const customerRes = await axios.get(`http://localhost:5000/api/customers/${id}`);
        setCustomer(customerRes.data);
        
        // Fetch ledger entries for this customer
        const ledgerRes = await axios.get(
          `http://localhost:5000/api/customerLedgerEntries?$filter=Customer_No eq '${id}'&$orderby=Posting_Date desc`
        );
        setLedgerEntries(ledgerRes.data.value || []);
        
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch customer data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Calculate pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = ledgerEntries.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(ledgerEntries.length / entriesPerPage);
  
  // Change page
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  if (loading) return <p className="p-6">Loading customer details...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!customer) return <p className="p-6">Customer not found</p>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customer Details</h1>
        <div className="flex space-x-2">
          <Link
            to={`/customers/${id}/ledger`}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            View Full Ledger
          </Link>
          <button
            onClick={() => navigate("/customers")}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Back to Customers
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {customer?.Name} ({customer?.No})
        </h1>
        <p className="text-sm text-gray-500">
          {customer?.Address} • {customer?.City} • {customer?.Phone_No}
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('details')}
            className={`${activeTab === 'details' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Customer Details
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`${activeTab === 'ledger' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Ledger Entries
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {activeTab === 'details' ? (
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Customer Information</h3>
            <div className="mt-5 border-t border-gray-200">
              <dl className="sm:divide-y sm:divide-gray-200">
                <DetailRow label="Customer No" value={customer.No} />
                <DetailRow label="Name" value={customer.Name} />
                <DetailRow label="Address" value={customer.Address} />
                <DetailRow label="City" value={customer.City} />
                <DetailRow label="Phone" value={customer.Phone_No} />
                <DetailRow label="Email" value={customer.Email} />
                <DetailRow label="Balance" value={formatCurrency(customer.Balance_LCY)} isCurrency />
              </dl>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="w-full overflow-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entry No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posting Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document No</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Debit</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Credit</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentEntries.length > 0 ? (
                    currentEntries.map((entry) => (
                      <tr key={entry.Entry_No} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.Entry_No}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {entry.Posting_Date ? format(new Date(entry.Posting_Date), 'MMM dd, yyyy') : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.Document_Type || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.Document_No || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                          {entry.Debit_Amount ? formatCurrency(entry.Debit_Amount) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                          {entry.Credit_Amount ? formatCurrency(entry.Credit_Amount) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                          {formatCurrency(entry.Amount)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                        No ledger entries found for this customer.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {ledgerEntries.length > entriesPerPage && (
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value, isCurrency = false }: { label: string; value: string | number; isCurrency?: boolean }) {
  return (
    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
        {isCurrency && typeof value === 'number' 
          ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
          : value || '-'}
      </dd>
    </div>
  );
}
