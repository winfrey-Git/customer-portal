import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiArrowLeft, FiUser, FiMail, FiPhone, FiMapPin, FiGlobe, FiHome } from "react-icons/fi";
import {
  fetchCountries,
  fetchPaymentTerms,
  fetchPaymentMethods,
  fetchCustomerPostingGroups,
  fetchVatBusinessPostingGroups,
  fetchGenBusinessPostingGroups,
  fetchLocations,
  fetchShipmentMethods,
  fetchShippingAgents,
  fetchCurrencies,
  fetchCustomerPriceGroups,
  fetchCustomerDiscGroups,
  fetchSalespeople,
  fetchResponsibilityCenters
} from "../utils/lookupData";

interface CustomerForm {
  // Basic Info
  No: string;
  Name: string;
  Contact: string;
  Phone_No: string;
  Mobile_Phone_No: string;
  E_Mail: string;
  Home_Page: string;
  
  // Address
  Address: string;
  Address_2: string;
  City: string;
  Post_Code: string;
  Country_Region_Code: string;
  
  // Financial
  Customer_Posting_Group: string;
  Gen_Bus_Posting_Group: string;
  VAT_Bus_Posting_Group: string;
  Payment_Terms_Code: string;
  Payment_Method_Code: string;
  Currency_Code: string;
  
  // Shipping
  Location_Code: string;
  Shipment_Method_Code: string;
  Shipping_Agent_Code: string;
  Customer_Price_Group: string;
  Customer_Disc_Group: string;
  Salesperson_Code: string;
  Responsibility_Center: string;
}

interface LookupData {
  countries: any[];
  paymentTerms: any[];
  paymentMethods: any[];
  customerPostingGroups: any[];
  vatBusinessPostingGroups: any[];
  genBusinessPostingGroups: any[];
  locations: any[];
  shipmentMethods: any[];
  shippingAgents: any[];
  currencies: any[];
  customerPriceGroups: any[];
  customerDiscGroups: any[];
  salespeople: any[];
  responsibilityCenters: any[];
}

export default function EditCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<CustomerForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [lookupData, setLookupData] = useState<LookupData>({
    countries: [],
    paymentTerms: [],
    paymentMethods: [],
    customerPostingGroups: [],
    vatBusinessPostingGroups: [],
    genBusinessPostingGroups: [],
    locations: [],
    shipmentMethods: [],
    shippingAgents: [],
    currencies: [],
    customerPriceGroups: [],
    customerDiscGroups: [],
    salespeople: [],
    responsibilityCenters: []
  });

  // Load customer data and lookup data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load all lookup data in parallel
        const [
          countries,
          paymentTerms,
          paymentMethods,
          customerPostingGroups,
          vatBusinessPostingGroups,
          genBusinessPostingGroups,
          locations,
          shipmentMethods,
          shippingAgents,
          currencies,
          customerPriceGroups,
          customerDiscGroups,
          salespeople,
          responsibilityCenters
        ] = await Promise.all([
          fetchCountries(),
          fetchPaymentTerms(),
          fetchPaymentMethods(),
          fetchCustomerPostingGroups(),
          fetchVatBusinessPostingGroups(),
          fetchGenBusinessPostingGroups(),
          fetchLocations(),
          fetchShipmentMethods(),
          fetchShippingAgents(),
          fetchCurrencies(),
          fetchCustomerPriceGroups(),
          fetchCustomerDiscGroups(),
          fetchSalespeople(),
          fetchResponsibilityCenters()
        ]);

        setLookupData({
          countries,
          paymentTerms,
          paymentMethods,
          customerPostingGroups,
          vatBusinessPostingGroups,
          genBusinessPostingGroups,
          locations,
          shipmentMethods,
          shippingAgents,
          currencies,
          customerPriceGroups,
          customerDiscGroups,
          salespeople,
          responsibilityCenters
        });

        // Load customer data
        if (id) {
          const response = await axios.get(`http://localhost:5000/api/customers/${id}`);
          setForm(response.data);
        }
      } catch (err: any) {
        console.error("Error loading data:", err);
        setError("Failed to load customer data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => prev ? { ...prev, [name]: value } : null);
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!form) return;
  
  setSaving(true);
  setError("");

  try {
    // Ensure No field is included in the payload
// Update the destructuring to use the correct property name
const { Currency_Code, ...formData } = form;
const payload = {
  ...formData,
  customerNo: form.No,
  // Use the correct property name
  ...(Currency_Code && { currencyCode: Currency_Code })
};

    await axios.put(
      `http://localhost:5000/api/customer/update`,
      payload
    );
    alert("Customer updated successfully");
    navigate(`/customers/${id}`);
  } catch (err: any) {
    console.error("Update error:", err);
    setError(
      err.response?.data?.error?.message || 
      err.response?.data?.error || 
      "Failed to update customer"
    );
  } finally {
    setSaving(false);
  }
};

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">Customer not found or failed to load.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-900 mb-4"
        >
          <FiArrowLeft className="mr-2" /> Back to Customers
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          Edit Customer: {form.Name || 'New Customer'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Customer No: {form.No}
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
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
      )}

      <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
        {/* Customer Information */}
        <div className="space-y-8 divide-y divide-gray-200">
          <div className="pt-8">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Customer Information
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Basic details about the customer.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="Name" className="block text-sm font-medium text-gray-700">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="Name"
                    id="Name"
                    required
                    value={form.Name || ''}
                    onChange={handleChange}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="Contact" className="block text-sm font-medium text-gray-700">
                  Contact Person <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="Contact"
                    id="Contact"
                    required
                    value={form.Contact || ''}
                    onChange={handleChange}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="E_Mail" className="block text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="E_Mail"
                    id="E_Mail"
                    required
                    value={form.E_Mail || ''}
                    onChange={handleChange}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="Phone_No" className="block text-sm font-medium text-gray-700">
                  Phone <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="Phone_No"
                    id="Phone_No"
                    required
                    value={form.Phone_No || ''}
                    onChange={handleChange}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="Mobile_Phone_No" className="block text-sm font-medium text-gray-700">
                  Mobile
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="Mobile_Phone_No"
                    id="Mobile_Phone_No"
                    value={form.Mobile_Phone_No || ''}
                    onChange={handleChange}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="Home_Page" className="block text-sm font-medium text-gray-700">
                  Website
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiGlobe className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="url"
                    name="Home_Page"
                    id="Home_Page"
                    value={form.Home_Page || ''}
                    onChange={handleChange}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="pt-8">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Address Information
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Where this customer is located.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label htmlFor="Address" className="block text-sm font-medium text-gray-700">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiHome className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="Address"
                    id="Address"
                    required
                    value={form.Address || ''}
                    onChange={handleChange}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="Address_2" className="block text-sm font-medium text-gray-700">
                  Address Line 2
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="Address_2"
                    id="Address_2"
                    value={form.Address_2 || ''}
                    onChange={handleChange}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="City" className="block text-sm font-medium text-gray-700">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="City"
                  id="City"
                  required
                  value={form.City || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="Post_Code" className="block text-sm font-medium text-gray-700">
                  ZIP/Postal Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="Post_Code"
                  id="Post_Code"
                  required
                  value={form.Post_Code || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="Country_Region_Code" className="block text-sm font-medium text-gray-700">
                  Country/Region <span className="text-red-500">*</span>
                </label>
                <select
                  id="Country_Region_Code"
                  name="Country_Region_Code"
                  required
                  value={form.Country_Region_Code || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select a country</option>
                  {lookupData.countries.map((country) => (
                    <option key={country.Code} value={country.Code}>
                      {country.Name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="pt-8">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Financial Information
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Billing and payment details.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label htmlFor="Customer_Posting_Group" className="block text-sm font-medium text-gray-700">
                  Customer Posting Group
                </label>
                <select
                  id="Customer_Posting_Group"
                  name="Customer_Posting_Group"
                  value={form.Customer_Posting_Group || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select a posting group</option>
                  {lookupData.customerPostingGroups.map((group) => (
                    <option key={group.Code} value={group.Code}>
                      {group.Description || group.Code}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="Gen_Bus_Posting_Group" className="block text-sm font-medium text-gray-700">
                  Gen. Bus. Posting Group
                </label>
                <select
                  id="Gen_Bus_Posting_Group"
                  name="Gen_Bus_Posting_Group"
                  value={form.Gen_Bus_Posting_Group || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select a business posting group</option>
                  {lookupData.genBusinessPostingGroups.map((group) => (
                    <option key={group.Code} value={group.Code}>
                      {group.Description || group.Code}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="VAT_Bus_Posting_Group" className="block text-sm font-medium text-gray-700">
                  VAT Bus. Posting Group
                </label>
                <select
                  id="VAT_Bus_Posting_Group"
                  name="VAT_Bus_Posting_Group"
                  value={form.VAT_Bus_Posting_Group || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select a VAT posting group</option>
                  {lookupData.vatBusinessPostingGroups.map((group) => (
                    <option key={group.Code} value={group.Code}>
                      {group.Description || group.Code}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="Payment_Terms_Code" className="block text-sm font-medium text-gray-700">
                  Payment Terms
                </label>
                <select
                  id="Payment_Terms_Code"
                  name="Payment_Terms_Code"
                  value={form.Payment_Terms_Code || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select payment terms</option>
                  {lookupData.paymentTerms.map((term) => (
                    <option key={term.Code} value={term.Code}>
                      {term.Description || term.Code}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="Payment_Method_Code" className="block text-sm font-medium text-gray-700">
                  Payment Method
                </label>
                <select
                  id="Payment_Method_Code"
                  name="Payment_Method_Code"
                  value={form.Payment_Method_Code || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select payment method</option>
                  {lookupData.paymentMethods.map((method) => (
                    <option key={method.Code} value={method.Code}>
                      {method.Description || method.Code}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="Currency_Code" className="block text-sm font-medium text-gray-700">
                  Currency
                </label>
                <select
                  id="Currency_Code"
                  name="Currency_Code"
                  value={form.Currency_Code || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select currency</option>
                  {lookupData.currencies.map((currency) => (
                    <option key={currency.Code} value={currency.Code}>
                      {currency.Description || `${currency.Code} - ${currency.Symbol || ''}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="pt-8">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Shipping Information
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                How orders should be shipped to this customer.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label htmlFor="Location_Code" className="block text-sm font-medium text-gray-700">
                  Location Code
                </label>
                <select
                  id="Location_Code"
                  name="Location_Code"
                  value={form.Location_Code || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select location</option>
                  {lookupData.locations.map((location) => (
                    <option key={location.Code} value={location.Code}>
                      {location.Name || location.Code}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="Shipment_Method_Code" className="block text-sm font-medium text-gray-700">
                  Shipment Method
                </label>
                <select
                  id="Shipment_Method_Code"
                  name="Shipment_Method_Code"
                  value={form.Shipment_Method_Code || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select shipment method</option>
                  {lookupData.shipmentMethods.map((method) => (
                    <option key={method.Code} value={method.Code}>
                      {method.Description || method.Code}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="Shipping_Agent_Code" className="block text-sm font-medium text-gray-700">
                  Shipping Agent
                </label>
                <select
                  id="Shipping_Agent_Code"
                  name="Shipping_Agent_Code"
                  value={form.Shipping_Agent_Code || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select shipping agent</option>
                  {lookupData.shippingAgents.map((agent) => (
                    <option key={agent.Code} value={agent.Code}>
                      {agent.Name || agent.Code}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="Customer_Price_Group" className="block text-sm font-medium text-gray-700">
                  Customer Price Group
                </label>
                <select
                  id="Customer_Price_Group"
                  name="Customer_Price_Group"
                  value={form.Customer_Price_Group || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select price group</option>
                  {lookupData.customerPriceGroups.map((group) => (
                    <option key={group.Code} value={group.Code}>
                      {group.Description || group.Code}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="Customer_Disc_Group" className="block text-sm font-medium text-gray-700">
                  Customer Discount Group
                </label>
                <select
                  id="Customer_Disc_Group"
                  name="Customer_Disc_Group"
                  value={form.Customer_Disc_Group || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select discount group</option>
                  {lookupData.customerDiscGroups.map((group) => (
                    <option key={group.Code} value={group.Code}>
                      {group.Description || group.Code}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="Salesperson_Code" className="block text-sm font-medium text-gray-700">
                  Salesperson
                </label>
                <select
                  id="Salesperson_Code"
                  name="Salesperson_Code"
                  value={form.Salesperson_Code || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select salesperson</option>
                  {lookupData.salespeople.map((person) => (
                    <option key={person.Code} value={person.Code}>
                      {person.Name} ({person.Code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="Responsibility_Center" className="block text-sm font-medium text-gray-700">
                  Responsibility Center
                </label>
                <select
                  id="Responsibility_Center"
                  name="Responsibility_Center"
                  value={form.Responsibility_Center || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select responsibility center</option>
                  {lookupData.responsibilityCenters.map((center) => (
                    <option key={center.Code} value={center.Code}>
                      {center.Name || center.Code}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-5">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}