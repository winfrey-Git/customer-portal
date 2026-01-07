import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AxiosError } from 'axios';
import { api } from '../../services/bcApiService';

interface PostedSalesInvoice {
  No: string;
  Posting_Date: string;
  Due_Date: string;
  Customer_No: string;
  Customer_Name: string;
  Customer_Address: string;
  Customer_City: string;
  Customer_Post_Code: string;
  Customer_Country: string;
  Amount: number;
  Amount_Including_VAT: number;
  VAT_Amount: number;
  Status: string;
  Document_Date: string;
  Payment_Terms_Code: string;
  Payment_Method_Code: string;
  Payment_Reference: string;
  Your_Reference: string;
  Shipment_Method_Code: string;
  Sell_to_Contact: string;
  Sell_to_Phone_No: string;
  Sell_to_Email: string;
  Lines?: Array<{
    Line_No: number;
    Type: string;
    No: string;
    Description: string;
    Quantity: number;
    Unit_Price: number;
    Line_Amount: number;
    Line_Discount_Amount: number;
    Line_Amount_Including_VAT: number;
    VAT_Identifier: string;
    VAT_Percent: number;
  }>;
}

export default function PostedSalesInvoiceDetail() {
// In PostedSalesInvoiceDetail.tsx
  const { No: invoiceNo } = useParams<{ No: string }>();
  const [invoice, setInvoice] = useState<PostedSalesInvoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!invoiceNo) return;
      
      try {
        setLoading(true);
        setError(null);
        console.log(`Fetching posted sales invoice ${invoiceNo}...`);
        
        // First try to get the invoice with lines
        const response = await api.get(`/postedsalesinvoices/${invoiceNo}`);
        console.log('Invoice response:', response.data);
        
        // Handle different response formats
        let invoiceData = null;
        if (Array.isArray(response.data)) {
          invoiceData = response.data[0] || null;
        } else if (response.data && Array.isArray(response.data.value)) {
          invoiceData = response.data.value[0] || null;
        } else if (response.data) {
          invoiceData = response.data;
        }
        
        if (!invoiceData) {
          throw new Error('Invoice data is empty or in unexpected format');
        }
        
        // If we don't have lines, try to fetch them separately
        if (!invoiceData.Lines || invoiceData.Lines.length === 0) {
          try {
            console.log('Fetching invoice lines separately...');
            const linesResponse = await api.get(`/postedsalesinvoices/${invoiceNo}/lines`);
            console.log('Invoice lines response:', { 
          data: linesResponse.data,
          hasValue: !!linesResponse.data?.value,
          isArray: Array.isArray(linesResponse.data?.value),
          valueLength: linesResponse.data?.value?.length
        });
            
            // Handle different line response formats
            if (Array.isArray(linesResponse.data)) {
              invoiceData.Lines = linesResponse.data;
            } else if (linesResponse.data && Array.isArray(linesResponse.data.value)) {
              // Handle the case where lines are in a 'value' property
              invoiceData.Lines = linesResponse.data.value;
              console.log('Lines from value array:', invoiceData.Lines);
            } else if (linesResponse.data && linesResponse.data.Lines) {
              invoiceData.Lines = linesResponse.data.Lines;
            } else if (linesResponse.data) {
              // If the response is an object but doesn't match expected formats
              console.warn('Unexpected lines response format:', linesResponse.data);
              invoiceData.Lines = [];
            }
          } catch (lineError) {
            console.warn('Could not fetch invoice lines:', lineError);
            invoiceData.Lines = [];
          }
        }
        
        setInvoice(invoiceData);
      } catch (err: unknown) {
        const errorMessage = err instanceof AxiosError 
          ? `Error ${err.response?.status}: ${err.response?.data?.message || err.message}`
          : err instanceof Error 
            ? err.message 
            : 'Failed to load invoice';
            
        console.error('Error fetching invoice:', { error: err, message: errorMessage });
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error: {error || 'Invoice not found'}</p>
          <Link 
            to="/sales/posted-invoices" 
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Posted Invoices
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Posted Sales Invoice: {invoice.No}</h1>
        <div className="space-x-2">
          <Link
            to="/sales/posted-invoices"
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back to List
          </Link>
          <a
            href={`/api/postedsalesinvoices/${invoice.No}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Download PDF
          </a>
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
                    invoice.Status === 'Paid' ? 'bg-green-100 text-green-800' :
                    invoice.Status === 'Unpaid' ? 'bg-yellow-100 text-yellow-800' :
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
                <dd className="mt-1 text-sm text-gray-900">{invoice.Customer_No}</dd>
              </div>
              <div className="py-2 border-b border-gray-100">
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{invoice.Customer_Name}</dd>
              </div>
              <div className="py-2 border-b border-gray-100">
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {invoice.Customer_Address}<br />
                  {invoice.Customer_Post_Code} {invoice.Customer_City}<br />
                  {invoice.Customer_Country}
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
                {invoice.Lines?.map((line) => (
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
          to="/sales/posted-invoices"
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Back to List
        </Link>
        <a
          href={`/api/postedsalesinvoices/${invoice.No}/pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Download PDF
        </a>
      </div>
    </div>
  );
}
