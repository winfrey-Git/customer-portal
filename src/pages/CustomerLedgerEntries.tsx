import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";

export default function CustomerLedgerEntries() {
  const { customerNo } = useParams<{ customerNo: string }>();
  const [ledgerEntries, setLedgerEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [customer, setCustomer] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [outstandingBalance, setOutstandingBalance] = useState(0);
  const entriesPerPage = 6;
  const navigate = useNavigate();

  // Calculate pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = ledgerEntries.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(ledgerEntries.length / entriesPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        if (customerNo) {
          // Fetch customer details
          const customerRes = await axios.get(`http://localhost:5000/api/customers/${customerNo}`);
          setCustomer(customerRes.data);

          // Fetch ledger entries for specific customer
          const ledgerRes = await axios.get(
            `http://localhost:5000/api/customers/${customerNo}/ledger-entries?$orderby=Posting_Date desc`
          );
          const entries = ledgerRes.data.value || [];
          setLedgerEntries(entries);
        } else {
          // Fetch all customer ledger entries
          const ledgerRes = await axios.get(
            'http://localhost:5000/api/customerLedgerEntries?$orderby=Posting_Date desc'
          );
          const entries = ledgerRes.data.value || [];
          setLedgerEntries(entries);
        }

        // Calculate outstanding balance (sum of all amounts)
        const balance = ledgerEntries.reduce((sum: number, entry: any) => {
          return sum + (parseFloat(entry.Amount) || 0);
        }, 0);
        setOutstandingBalance(balance);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch ledger entries");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [customerNo]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  if (loading) return <p className="p-6">Loading ledger entries...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  // Calculate summary values
  const totalOutstanding = ledgerEntries
    .filter(entry => parseFloat(entry.Amount) > 0)
    .reduce((sum, entry) => sum + parseFloat(entry.Amount), 0);

  const totalCreditBalance = Math.abs(ledgerEntries
    .filter(entry => parseFloat(entry.Amount) < 0)
    .reduce((sum, entry) => sum + parseFloat(entry.Amount), 0)
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {customerNo 
              ? `Ledger Entries for ${customer?.Name} (${customerNo})` 
              : "All Customer Ledger Entries"
            }
          </h1>
          {customerNo && customer && (
            <p className="text-sm text-gray-500">
              {customer?.Address} • {customer?.City} • {customer?.Phone_No}
            </p>
          )}
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back {customerNo ? "to Customer" : ""}
        </button>
      </div>

      <div className="rounded-lg border bg-white shadow-sm">
        <div className="border-b p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">
            {customerNo ? "Customer" : "All"} Transaction History
          </h3>
        </div>
        <div className="p-6">
          <div className="w-full overflow-auto">
            <table className="w-full text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b">
                  {!customerNo && (
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0">
                      Customer
                    </th>
                  )}
                  <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0">
                    Entry No
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0">
                    Posting Date
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0">
                    Document Type
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0">
                    Document No
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0">
                    Description
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0">
                    Debit Amount
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0">
                    Credit Amount
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {currentEntries.length > 0 ? (
                  currentEntries.map((entry) => (
                    <tr key={entry.Entry_No} className="border-b hover:bg-gray-50">
                      {!customerNo && (
                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                          {entry.Customer_No || '-'}
                        </td>
                      )}
                      <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">{entry.Entry_No}</td>
                      <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                        {entry.Posting_Date 
                          ? format(new Date(entry.Posting_Date), 'MMM dd, yyyy')
                          : '-'}
                      </td>
                      <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                        {entry.Document_Type || '-'}
                      </td>
                      <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                        {entry.Document_No || '-'}
                      </td>
                      <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                        {entry.Description || '-'}
                      </td>
                      <td className="p-4 text-right align-middle [&:has([role=checkbox])]:pr-0">
                        {entry.Debit_Amount ? formatCurrency(entry.Debit_Amount) : '-'}
                      </td>
                      <td className="p-4 text-right align-middle [&:has([role=checkbox])]:pr-0">
                        {entry.Credit_Amount ? formatCurrency(entry.Credit_Amount) : '-'}
                      </td>
                      <td className="p-4 text-right font-medium align-middle [&:has([role=checkbox])]:pr-0">
                        {formatCurrency(entry.Amount)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td 
                      colSpan={customerNo ? 8 : 9} 
                      className="p-4 text-center"
                    >
                      No ledger entries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Pagination */}
        {ledgerEntries.length > entriesPerPage && (
          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstEntry + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastEntry, ledgerEntries.length)}
                  </span>{' '}
                  of <span className="font-medium">{ledgerEntries.length}</span> results
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md px-3 py-2 text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-1">Previous</span>
                  </button>
                  <div className="flex items-center px-4">
                    <span className="text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>
                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-r-md px-3 py-2 text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="mr-1">Next</span>
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Summary Section */}
      <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Entries</p>
                <p className="text-xl font-semibold">{ledgerEntries.length}</p>
              </div>
              <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>
          <div className="border rounded-lg p-4 bg-yellow-50 border-yellow-200 group relative">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-1">
                  <p className="text-sm font-medium text-gray-500">Total Outstanding Balance</p>
                  <div className="relative flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 text-xs bg-gray-800 text-white rounded shadow-lg">
                      Total amount customers currently owe for unpaid invoices and services.
                    </div>
                  </div>
                </div>
                <p className="text-xl font-semibold text-yellow-700">
                  {formatCurrency(totalOutstanding)}
                </p>
              </div>
              <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="border rounded-lg p-4 bg-green-50 border-green-200 group relative">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-1">
                  <p className="text-sm font-medium text-gray-500">Customer Credits</p>
                  <div className="relative flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 text-xs bg-gray-800 text-white rounded shadow-lg">
                      Total amount of customer overpayments and credits available.
                    </div>
                  </div>
                </div>
                <p className="text-xl font-semibold text-green-700">
                  {formatCurrency(totalCreditBalance)}
                </p>
              </div>
              <div className="p-2 rounded-full bg-green-100 text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}