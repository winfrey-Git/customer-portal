import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

interface Customer {
  No: string;
  Name: string;
  Address?: string;
  Address_2?: string;
  City?: string;
  Post_Code?: string;
  Country_Region_Code?: string;
  Phone_No?: string;
  Mobile_Phone_No?: string;
  E_Mail?: string;
  Home_Page?: string;
  Contact?: string;
  Credit_Limit_LCY?: string | number;
  Balance_LCY?: string | number;
  Payment_Terms_Code?: string;
  Payment_Method_Code?: string;
  Customer_Posting_Group?: string;
  Gen_Bus_Posting_Group?: string;
  VAT_Bus_Posting_Group?: string;
  Ship_to_Code?: string;
  Shipping_Agent_Code?: string;
  Shipment_Method_Code?: string;
  Location_Code?: string;
  VAT_Registration_No?: string;
  [key: string]: any;
}

export default function CustomerCard() {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axios.get<Customer>(
          `http://localhost:5000/api/customers/${id}`
        );
        setCustomer(response.data);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching customer:", err);
        setError(err.response?.data?.message || "Failed to fetch customer");
        setLoading(false);
      }
    };

    if (id) {
      fetchCustomer();
    } else {
      setError("No customer ID provided");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || "Customer not found"}
          <Link to="/customers" className="block mt-2 text-blue-600 hover:underline">
            &larr; Back to Customers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-sm rounded-t-lg border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-semibold text-gray-900">
                {customer.Name} ({customer.No})
              </h1>
            </div>
            <div className="flex space-x-2">
              <Link
                to={`/customers/${id}/ledger`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Ledger Entries
              </Link>
              <Link
                to={`/customers/${id}/edit`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white shadow overflow-hidden sm:rounded-b-lg">
          <div className="border-t border-gray-200">
            <dl>
              {/* General Section */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">General</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">No.</p>
                      <p className="mt-1">{customer.No}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="mt-1 font-medium">{customer.Name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contact</p>
                      <p className="mt-1">{customer.Contact || 'Not Specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone No.</p>
                      <p className="mt-1">{customer.Phone_No || 'Not Specified'}</p>
                    </div>
                  </div>
                </dd>
              </div>

              {/* Address Section */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="mt-1">{customer.Address || 'Not Specified'}</p>
                      {customer.Address_2 && <p className="mt-1">{customer.Address_2}</p>}
                      <p className="mt-1">
                        {[customer.Post_Code, customer.City].filter(Boolean).join(' ')}
                      </p>
                      <p className="mt-1">{customer.Country_Region_Code || 'Not Specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="mt-1">{customer.E_Mail || 'Not Specified'}</p>
                      <p className="mt-4 text-sm text-gray-500">Home Page</p>
                      <p className="mt-1">
                        {customer.Home_Page ? (
                          <a 
                            href={customer.Home_Page.startsWith('http') ? customer.Home_Page : `https://${customer.Home_Page}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 hover:underline"
                          >
                            {customer.Home_Page}
                          </a>
                        ) : 'Not Specified'}
                      </p>
                    </div>
                  </div>
                </dd>
              </div>

              {/* Financials Section */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Financials</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Balance (LCY)</p>
                      <p className={`mt-1 font-medium ${customer.Balance_LCY ? 'text-red-600' : ''}`}>
                        {customer.Balance_LCY !== undefined ? 
                          new Intl.NumberFormat('en-US', { 
                            style: 'currency', 
                            currency: 'USD' 
                          }).format(Number(customer.Balance_LCY)) : 'Not Specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Credit Limit (LCY)</p>
                      <p className="mt-1">
                        {customer.Credit_Limit_LCY !== undefined ? 
                          new Intl.NumberFormat('en-US', { 
                            style: 'currency', 
                            currency: 'USD' 
                          }).format(Number(customer.Credit_Limit_LCY)) : 'Not Specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payment Terms</p>
                      <p className="mt-1">{customer.Payment_Terms_Code || 'Not Specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payment Method</p>
                      <p className="mt-1">{customer.Payment_Method_Code || 'Not Specified'}</p>
                    </div>
                  </div>
                </dd>
              </div>

              {/* Shipping Section */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Shipping</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Location Code</p>
                      <p className="mt-1">{customer.Location_Code || 'Not Specified'}</p>
                      <p className="mt-4 text-sm text-gray-500">Shipment Method</p>
                      <p className="mt-1">{customer.Shipment_Method_Code || 'Not Specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Shipping Agent</p>
                      <p className="mt-1">{customer.Shipping_Agent_Code || 'Not Specified'}</p>
                      <p className="mt-4 text-sm text-gray-500">Ship-to Code</p>
                      <p className="mt-1">{customer.Ship_to_Code || 'Not Specified'}</p>
                    </div>
                  </div>
                </dd>
              </div>

              {/* Tax Section */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Tax</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">VAT Registration No.</p>
                      <p className="mt-1">{customer.VAT_Registration_No || 'Not Specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">VAT Business Group</p>
                      <p className="mt-1">{customer.VAT_Bus_Posting_Group || 'Not Specified'}</p>
                    </div>
                  </div>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}