import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AxiosError } from 'axios';
import { api } from '../../services/bcApiService';

interface SalesInvoiceLine {
  Line_No: number;
  Type: string;
  No: string;
  Description: string;
  Quantity: number;
  Unit_Price: number;
  VAT_Percent: number;
  Line_Amount: number;
  Line_Amount_Including_VAT: number;
}

interface SalesInvoice {
  No: string;
  Sell_to_Customer_No: string;
  Sell_to_Customer_Name: string;
  Sell_to_Address: string;
  Sell_to_City: string;
  Sell_to_Post_Code: string;
  Sell_to_Country_Region_Code: string;
  Sell_to_Contact: string;
  Sell_to_Phone_No: string;
  Sell_to_Email: string;
  Posting_Date: string;
  Due_Date: string;
  Document_Date: string;
  Payment_Terms_Code: string;
  Status: string;
  Amount: number;
  Amount_Including_VAT: number;
  VAT_Amount: number;
  salesInvoiceLines?: SalesInvoiceLine[];
  lines?: SalesInvoiceLine[]; // Added to match backend response
  // Add other fields that might be returned by the API
  entryId?: string;
  id?: string;
}

export default function SalesInvoiceDetail() {
  const { invoiceNo } = useParams<{ invoiceNo: string }>();
  const [invoice, setInvoice] = useState<SalesInvoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!invoiceNo) return;
      
      try {
        setLoading(true);
        setError(null);
        console.log(`Fetching invoice ${invoiceNo}...`);
        
        const response = await api.get(`/salesInvoices/${invoiceNo}?$expand=salesInvoiceLines`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          // Add response type to handle potential non-JSON responses
          transformResponse: [function (data) {
            try {
              return JSON.parse(data);
            } catch (e) {
              console.error('Failed to parse response as JSON:', data);
              throw new Error('Received invalid response from server');
            }
          }]
        });
        
        console.log('API Response:', response);
        
        // Check if response is HTML (error page)
        if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
          throw new Error('Server returned an HTML error page');
        }
        
        // Handle both OData format and direct response
        const invoiceData = response.data?.value?.[0] || response.data;
        
        if (!invoiceData) {
          throw new Error('Invoice data is empty');
        }
        
        // Ensure salesInvoiceLines is always an array
        if (invoiceData && !Array.isArray(invoiceData.salesInvoiceLines)) {
          invoiceData.salesInvoiceLines = [];
        }
        
        setInvoice(invoiceData);
      } catch (err: any) {
        console.error('Error fetching invoice:', err);
        
        // More specific error messages based on the error type
        let errorMessage = 'Failed to load invoice. Please try again.';
        
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Response data:', err.response.data);
          console.error('Response status:', err.response.status);
          
          if (err.response.status === 404) {
            errorMessage = 'Invoice not found. Please check the invoice number and try again.';
          } else if (err.response.status === 500) {
            errorMessage = 'Server error occurred while fetching the invoice.';
          }
        } else if (err.request) {
          // The request was made but no response was received
          console.error('No response received:', err.request);
          errorMessage = 'No response from server. Please check your connection.';
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error setting up request:', err.message);
        }
        
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          url: err.config?.url
        });
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceNo]);

  const formatDate = (dateString: string) => {
    return dateString ? new Date(dateString).toLocaleDateString() : 'N/A';
  };

  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null || isNaN(value)) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading invoice details...</p>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            {error || 'Invoice not found'}
          </h2>
          <p className="text-gray-600 mb-4">
            We couldn't load the requested invoice. Please check the invoice number and try again.
          </p>
          <div className="space-x-4">
            <Link 
              to="/sales/invoices" 
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Back to Sales Invoices
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="ml-2 px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sales Invoice: {invoice.No}</h1>
        <div className="space-x-2">
          <Link
            to="/sales/invoices"
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back to List
          </Link>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Print
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Invoice Information</h3>
            <dl className="mt-2 space-y-2">
              <div className="py-2 border-b border-gray-100">
                <dt className="text-sm font-medium text-gray-500">Invoice No</dt>
                <dd className="mt-1 text-sm text-gray-900">{invoice.No}</dd>
              </div>
              <div className="py-2 border-b border-gray-100">
                <dt className="text-sm font-medium text-gray-500">Posting Date</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(invoice.Posting_Date)}</dd>
              </div>
              <div className="py-2 border-b border-gray-100">
                <dt className="text-sm font-medium text-gray-500">Document Date</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(invoice.Document_Date)}</dd>
              </div>
              <div className="py-2 border-b border-gray-100">
                <dt className="text-sm font-medium text-gray-500">Due Date</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(invoice.Due_Date)}</dd>
              </div>
              <div className="py-2 border-b border-gray-100">
                <dt className="text-sm font-medium text-gray-500">Payment Terms</dt>
                <dd className="mt-1 text-sm text-gray-900">{invoice.Payment_Terms_Code || 'N/A'}</dd>
              </div>
              <div className="py-2 border-b border-gray-100">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    invoice.Status === 'Released' ? 'bg-green-100 text-green-800' :
                    invoice.Status === 'Open' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {invoice.Status || 'N/A'}
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900">Customer Information</h3>
            <dl className="mt-2 space-y-2">
              <div className="py-2 border-b border-gray-100">
                <dt className="text-sm font-medium text-gray-500">Customer No</dt>
                <dd className="mt-1 text-sm text-gray-900">{invoice.Sell_to_Customer_No}</dd>
              </div>
              <div className="py-2 border-b border-gray-100">
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{invoice.Sell_to_Customer_Name}</dd>
              </div>
              <div className="py-2 border-b border-gray-100">
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {invoice.Sell_to_Address}<br />
                  {invoice.Sell_to_Post_Code} {invoice.Sell_to_City}<br />
                  {invoice.Sell_to_Country_Region_Code || ''}
                </dd>
              </div>
              {invoice.Sell_to_Contact && (
                <div className="py-2 border-b border-gray-100">
                  <dt className="text-sm font-medium text-gray-500">Contact</dt>
                  <dd className="mt-1 text-sm text-gray-900">{invoice.Sell_to_Contact}</dd>
                </div>
              )}
              {invoice.Sell_to_Phone_No && (
                <div className="py-2 border-b border-gray-100">
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">{invoice.Sell_to_Phone_No}</dd>
                </div>
              )}
              {invoice.Sell_to_Email && (
                <div className="py-2 border-b border-gray-100">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{invoice.Sell_to_Email}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium text-gray-900">Invoice Lines</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Unit Price
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    VAT %
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Line Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(invoice.lines || invoice.salesInvoiceLines || []).map((line) => (
                  <tr key={line.Line_No} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {line.No}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {line.Description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                      {line.Quantity.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                      {formatCurrency(line.Unit_Price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                      {line.VAT_Percent?.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                      {formatCurrency(line.Line_Amount_Including_VAT || line.Line_Amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={5} className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                    Subtotal:
                  </td>
                  <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                    {formatCurrency(invoice.Amount)}
                  </td>
                </tr>
                {invoice.VAT_Amount > 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                      VAT Amount:
                    </td>
                    <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                      {formatCurrency(invoice.VAT_Amount)}
                    </td>
                  </tr>
                )}
                <tr>
                  <td colSpan={5} className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                    Total Amount:
                  </td>
                  <td className="px-6 py-3 text-right text-sm font-bold text-gray-900">
                    {formatCurrency(invoice.Amount_Including_VAT || invoice.Amount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Link
          to="/sales/invoices"
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Back to List
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
          </svg>
          Print
        </button>
      </div>
    </div>
  );
}
