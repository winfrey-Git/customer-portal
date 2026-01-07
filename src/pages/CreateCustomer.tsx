import { useState, useEffect } from "react";
import { getCustomerTemplates } from '../services/bcApiService';
// Add these imports at the top of the file
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
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
  // General
  No?: string;
  Name: string;
  Name2?: string;
  SearchName?: string;
  Address: string;
  Address_2?: string;
  City: string;
  Post_Code: string;
  County: string;
  Country_Region_Code: string;
  Contact: string;
  Contact2?: string;
  Phone_No: string;
  Mobile_Phone_No?: string;
  Fax_No?: string;
  E_Mail: string;
  HomePage?: string;
  LanguageCode: string;
  VATRegistrationNo: string;
  GLN?: string;
  IC_Partner_Code?: string;
  Blocked?: string;
  Privacy_Blocked?: boolean;
  Last_Date_Modified?: Date;
  
  // Communication
  Primary_Contact_No?: string;
  Responsibility_Center?: string;
  Service_Zone_Code?: string;
  Location_Code?: string;
  Salesperson_Code?: string;
  Customer_Posting_Group?: string;
  Customer_Price_Group?: string;
  Customer_Disc_Group?: string;
  Allow_Line_Disc?: boolean;
  Customer_Posting_Group_2?: string;
  Currency_Code?: string;
  Payment_Terms_Code?: string;
  Payment_Method_Code?: string;
  Reminder_Terms_Code?: string;
  Fin_Charge_Terms_Code?: string;
  Cash_Flow_Payment_Terms_Code?: string;
  Print_Statements?: boolean;
  Block_Payment_Tolerance?: boolean;
  Preferred_Bank_Account?: string;
  Credit_Limit_LCY?: number;
  Balance_LCY?: number;
  Balance_Due_LCY?: number;
  Sales_LCY?: number;
  Profit_LCY?: number;
  Payments_LCY?: number;
  Refunds_LCY?: number;
  Finance_Charge_Memo_Amounts_LCY?: number;
  Outstanding_Orders_LCY?: number;
  Shipped_Not_Invoiced_LCY?: number;
  Application_Method?: string;
  Prices_Including_VAT: boolean;
  Gen_Bus_Posting_Group?: string;
  VAT_Bus_Posting_Group?: string;
  Payment_Bank_Account_No?: string;
  Payment_Registration_ID?: string;
  Last_Statement_No?: number;
  Blocked_Payment_Reasons?: string;
  Preferred_Bank_Account_Code?: string;
  Partner_Type?: string;
  Partner_Code?: string;
  Preferred_Carrier_Service_Code?: string;
  Shipping_Advice?: string;
  Shipment_Method_Code?: string;
  Shipping_Agent_Code?: string;
  Shipping_Agent_Service_Code?: string;
  Shipping_Time?: string;
  Base_Calendar_Code?: string;
  Customized_Calendar?: string;
  Price_Calculation_Method?: string;
  Allow_Item_Charge_Assignment?: boolean;
  Invoice_Copies?: number;
  Invoice_Disc_Code?: string;
  Copy_Sell_to_Addr_to_Qte_From?: string;
  Template_Code?: string;
  CustomerTemplateCode?: string;
}

interface CustomerTemplate {
  code: string;
  description: string;
}

export default function CreateCustomer() {
 const initialFormState: CustomerForm = {
  Name: "",
  Address: "",
  City: "",
  Post_Code: "",
  County: "",
  Country_Region_Code: "",
  Contact: "",
  Phone_No: "",
  E_Mail: "",
  LanguageCode: "ENU",
  VATRegistrationNo: "",
  Prices_Including_VAT: false,
  CustomerTemplateCode: 'DEFAULT',
  Credit_Limit_LCY: 0,
  Allow_Line_Disc: false,
  Print_Statements: true,
  Block_Payment_Tolerance: false,
  Allow_Item_Charge_Assignment: true,
  Invoice_Copies: 1
  
};

  const [templates, setTemplates] = useState<CustomerTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [form, setForm] = useState<CustomerForm>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadingLookups, setLoadingLookups] = useState(true);
  
  
  const navigate = useNavigate();
  // In the lookupData state, remove duplicates:
const [lookupData, setLookupData] = useState({
  countries: [] as any[],
  paymentTerms: [] as any[],
  paymentMethods: [] as any[],
  customerPostingGroups: [] as any[],
  vatBusinessPostingGroups: [] as any[],
  genBusinessPostingGroups: [] as any[],
  locations: [] as any[],
  shipmentMethods: [] as any[],
  shippingAgents: [] as any[],
  currencies: [] as any[],  // Keep only one instance
  customerPriceGroups: [] as any[],
  customerDiscGroups: [] as any[],
  salespeople: [] as any[],
  responsibilityCenters: [] as any[],
  customerTemplates: [] as any[],
  // Removed duplicates: currencies, genBusPostingGroups, vatBusPostingGroups
  reminderTerms: [] as any[],
  financeChargeTerms: [] as any[],
  cashFlowPaymentTerms: [] as any[],
  bankAccounts: [] as any[],
  partnerTypes: [] as any[],
  carrierServices: [] as any[],
  baseCalendars: [] as any[],
  priceCalculationMethods: [
    { code: " ", description: " " },
    { code: "Lowest Price", description: "Lowest Price" },
    { code: "Lowest Price per Line", description: "Lowest Price per Line" }
  ],
  shippingAdviceOptions: [
    { code: " ", description: " " },
    { code: "Partial", description: "Partial" },
    { code: "Complete", description: "Complete" }
  ],
  applicationMethods: [
    { code: " ", description: " " },
    { code: "Manual", description: "Manual" },
    { code: "Apply to Oldest", description: "Apply to Oldest" }
  ],
  
  blockPaymentReasons: [
    { code: " ", description: " " },
    { code: " ", description: "No Blocked" },
    { code: "Credit Limit Exceeded", description: "Credit Limit Exceeded" },
    { code: "Past Due Date", description: "Past Due Date" }
  ]
});
// Fix 2: Update the fetchTemplates function
const fetchTemplates = async () => {
  setLoadingTemplates(true);
  try {
    const templates = await getCustomerTemplates();
    if (templates.length === 0) {
      console.warn('No templates found or empty response from server');
      setError('No customer templates available. Please contact support.');
    } else {
      setTemplates(templates);
    }
  } catch (error: any) {  // Add type annotation here
    console.error('Failed to load customer templates:', error);
    setError(error.message || 'Failed to load customer templates. Please try again later.');
  } finally {
    setLoadingTemplates(false);
  }
};

// Fix 3: Make sure to call fetchTemplates in a useEffect
useEffect(() => {
  fetchTemplates();
}, []);


  // Fetch all lookup data
  useEffect(() => {
   const fetchData = async () => {
    try {
      setLoadingLookups(true);
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

      setLookupData(prev => ({
        ...prev,
        countries: countries || [],
        paymentTerms: paymentTerms || [],
        paymentMethods: paymentMethods || [],
        customerPostingGroups: customerPostingGroups || [],
        vatBusinessPostingGroups: vatBusinessPostingGroups || [],
        genBusinessPostingGroups: genBusinessPostingGroups || [],
        locations: locations || [],
        shipmentMethods: shipmentMethods || [],
        shippingAgents: shippingAgents || [],
        currencies: currencies || [],
        customerPriceGroups: customerPriceGroups || [],
        customerDiscGroups: customerDiscGroups || [],
        salespeople: salespeople || [],
        responsibilityCenters: responsibilityCenters || []
      }));
    } catch (error) {
      console.error('Error fetching lookup data:', error);
      setError('Failed to load required data. Please refresh the page.');
    } finally {
      setLoadingLookups(false);
    }
  };
    
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'CustomerTemplateCode') {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
      return;
    }

    const target = e.target as HTMLInputElement;
    const inputValue = target.type === 'checkbox' ? target.checked : target.value;
    
    setForm(prev => ({
      ...prev,
      [name]: inputValue
    }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setSuccess("");
  // Required fields with labels
  const requiredFields = [
    { field: 'Name', label: 'Customer Name' },
    { field: 'County', label: 'County' },
    { field: 'Address', label: 'Address' },
    { field: 'City', label: 'City' },
    { field: 'Country_Region_Code', label: 'Country/Region Code' },

    { field: 'Phone_No', label: 'Phone Number' },
    { field: 'E_Mail', label: 'Email' },
    
  ];

  // Check for missing required fields
  const missingFields = requiredFields
    .filter(({ field }) => {
      const value = form[field as keyof CustomerForm];
      return !value || (typeof value === 'string' && !value.trim());
    })
    .map(({ label }) => label);

  if (missingFields.length > 0) {
    const errorMessage = `The following fields are required: ${missingFields.join(', ')}`;
    setError(errorMessage);
    toast.error(errorMessage);
    return;
  }

  // Validate email format if provided
  if (form.E_Mail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.E_Mail)) {
    const errorMessage = 'Please enter a valid email address';
    setError(errorMessage);
    toast.error(errorMessage);
    return;
  }

  try {
    setLoading(true);
    toast.loading('Creating customer...');

    // Prepare the customer data with proper formatting
const customerData = {
  Name: form.Name.trim(),
  Address: form.Address?.trim(),
  City: form.City?.trim(),
  Post_Code: form.Post_Code?.trim(),
  Country_Region_Code: form.Country_Region_Code,
  // Remove the Contact field to let Business Central handle it automatically
  Phone_No: form.Phone_No,
  E_Mail: form.E_Mail?.trim().toLowerCase(),
  CustomerTemplateCode: form.CustomerTemplateCode || 'DEFAULT'
};



    // Remove any undefined or empty values
    Object.keys(customerData).forEach(key => {
      if (customerData[key as keyof typeof customerData] === '' || 
          customerData[key as keyof typeof customerData] === undefined) {
        delete customerData[key as keyof typeof customerData];
      }
    });

    console.log('Submitting customer data:', customerData);

    // Make the API call
    const response = await fetch("http://localhost:5000/api/customers", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(customerData),
    });

    const data = await response.json();
    console.log('API Response:', data);

    if (!response.ok) {
      throw new Error(
        data?.message || 
        data?.error?.message || 
        data?.details || 
        "Failed to create customer. Please try again."
      );
    }

 // Update this part in the handleSubmit function
const successMessage = `Customer "${form.Name}" created successfully! Customer No: ${data.customerNo || data.No || data.Customer_No || 'N/A'}`;
setSuccess(successMessage);
toast.success(successMessage);
    
    // Reset form
    setForm(initialFormState);
    
    // Redirect after a short delay
    setTimeout(() => {
      navigate('/customers');
    }, 2000);

  } catch (err: any) {
    console.error('Error creating customer:', err);
    
    // Format error message
    let errorMessage = "Failed to create customer. Please try again.";
    if (err.message) {
      errorMessage = err.message;
    } else if (err.response?.data) {
      errorMessage = typeof err.response.data === 'string' 
        ? err.response.data 
        : JSON.stringify(err.response.data);
    }
    
    setError(errorMessage);
    toast.error(errorMessage);
  } finally {
    setLoading(false);
    toast.dismiss(); // Dismiss any loading toasts
  }
};

  const renderSelect = (
    name: keyof CustomerForm,
    label: string,
    options: any[],
    valueField: string,
    displayField: string,
    required = false
  ) => (
    <div className="mb-4">
      <label className="block mb-1 font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={form[name]?.toString() || ''}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
        required={required}
      >
        <option value="">Select {label}</option>
        {options.map((item) => (
          <option key={item[valueField]} value={item[valueField]}>
            {item[displayField] || item[valueField]}
          </option>
        ))}
      </select>
    </div>
  );

  if (loadingLookups) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create Customer</h2>
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Template Selection */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Customer Template</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Template <span className="text-red-500">*</span>
              </label>
              <select
                name="CustomerTemplateCode"
                value={form.CustomerTemplateCode || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={loadingTemplates}
              >
                <option value="">-- {loadingTemplates ? 'Loading templates...' : 'Select a template'} --</option>
                {templates.map(template => (
                  <option key={template.code} value={template.code}>
                    {template.description || template.code}
                  </option>
                ))}
              </select>
              {loadingTemplates && (
                <p className="mt-1 text-sm text-gray-500">Loading templates...</p>
              )}
            </div>
          </div>
        </div>
{/* General Information */}
<div className="bg-white p-6 rounded-lg shadow mb-6">
  <h3 className="text-lg font-semibold mb-4 border-b pb-2">General</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">No.</label>
      <input
        type="text"
        name="No"
        value={form.No || ''}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        readOnly
      />
    </div>
    
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
      <input
        type="text"
        name="Name"
        value={form.Name}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Name 2</label>
      <input
        type="text"
        name="Name2"
        value={form.Name2 || ''}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Search Name</label>
      <input
        type="text"
        name="SearchName"
        value={form.SearchName || ''}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Contact <span className="text-red-500">*</span></label>
      <input
        type="text"
        name="Contact"
        value={form.Contact}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
       
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Contact 2</label>
      <input
        type="text"
        name="Contact2"
        value={form.Contact2 || ''}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {renderSelect(
      'Responsibility_Center',
      'Responsibility Center',
      lookupData.responsibilityCenters,
      'Code',
      'Name'
    )}

    {renderSelect(
      'Location_Code',
      'Location Code',
      lookupData.locations,
      'Code',
      'Name'
    )}

    {renderSelect(
      'Salesperson_Code',
      'Salesperson Code',
      lookupData.salespeople,
      'Code',
      'Name'
    )}
// In your form's JSX, add:
<div className="flex items-center mb-4">
<input
  type="checkbox"
  id="Prices_Including_VAT"
  name="Prices_Including_VAT"  // Match the interface exactly
  checked={form.Prices_Including_VAT || false}
  onChange={handleChange}
  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
/>
<label htmlFor="Prices_Including_VAT" className="ml-2 block text-sm text-gray-700">
  Prices Include VAT
</label>
</div>
    <div className="flex items-center">
      <input
        type="checkbox"
        name="Prices_Including_VAT"
        checked={form.Prices_Including_VAT}
        onChange={handleChange}
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
      <label className="ml-2 block text-sm text-gray-700">Prices Including VAT</label>
    </div>

    <div className="flex items-center">
      <input
        type="checkbox"
        name="Allow_Line_Disc"
        checked={form.Allow_Line_Disc || false}
        onChange={handleChange}
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
      <label className="ml-2 block text-sm text-gray-700">Allow Line Disc.</label>
    </div>
  </div>
</div>

{/* Communication Section */}
<div className="bg-white p-6 rounded-lg shadow mb-6">
  <h3 className="text-lg font-semibold mb-4 border-b pb-2">Communication</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Phone No. <span className="text-red-500">*</span></label>
      <input
        type="tel"
        name="Phone_No"
        value={form.Phone_No}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Phone No.</label>
      <input
        type="tel"
        name="Mobile_Phone_No"
        value={form.Mobile_Phone_No || ''}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail <span className="text-red-500">*</span></label>
      <input
        type="email"
        name="E_Mail"
        value={form.E_Mail}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Fax No.</label>
      <input
        type="tel"
        name="Fax_No"
        value={form.Fax_No || ''}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Home Page</label>
      <input
        type="url"
        name="HomePage"
        value={form.HomePage || ''}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {renderSelect(
      'LanguageCode',
      'Language Code',
      [
        { code: 'ENU', name: 'English (United States)' },
        { code: 'ESP', name: 'Spanish' },
        { code: 'FRA', name: 'French' },
        { code: 'DEU', name: 'German' },
        { code: 'JPN', name: 'Japanese' },
        { code: 'CHS', name: 'Chinese (Simplified)' }
      ],
      'Code',
      'Name'
    )}

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">VAT Registration No. <span className="text-red-500">*</span></label>
      <input
        type="text"
        name="VATRegistrationNo"
        value={form.VATRegistrationNo}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">GLN</label>
      <input
        type="text"
        name="GLN"
        value={form.GLN || ''}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>
</div>

{/* Address Section */}
<div className="bg-white p-6 rounded-lg shadow mb-6">
  <h3 className="text-lg font-semibold mb-4 border-b pb-2">Address</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">Address <span className="text-red-500">*</span></label>
      <input
        type="text"
        name="Address"
        value={form.Address}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>

    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">Address 2</label>
      <input
        type="text"
        name="Address_2"
        value={form.Address_2 || ''}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
      <input
        type="text"
        name="City"
        value={form.City}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">County</label>
      <input
        type="text"
        name="County"
        value={form.County || ''}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Post Code <span className="text-red-500">*</span></label>
      <input
        type="text"
        name="Post_Code"
        value={form.Post_Code}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>

    {renderSelect(
      'Country_Region_Code',
      'Country/Region Code',
      lookupData.countries,
      'Code',
      'Name',
      true
    )}
  </div>
</div>

{/* Posting Section */}
<div className="bg-white p-6 rounded-lg shadow mb-6">
  <h3 className="text-lg font-semibold mb-4 border-b pb-2">Posting</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {renderSelect(
      'Gen_Bus_Posting_Group',
      'Gen. Bus. Posting Group',
      lookupData.genBusinessPostingGroups,
      'Code',
      'Description'
    )}

    {renderSelect(
      'VAT_Bus_Posting_Group',
      'VAT Bus. Posting Group',
      lookupData.vatBusinessPostingGroups,
      'Code',
      'Description'
    )}

    {renderSelect(
      'Customer_Posting_Group',
      'Customer Posting Group',
      lookupData.customerPostingGroups,
      'Code',
      'Description'
    )}

    {renderSelect(
      'Customer_Price_Group',
      'Customer Price Group',
      lookupData.customerPriceGroups,
      'Code',
      'Description'
    )}

    {renderSelect(
      'Customer_Disc_Group',
      'Customer Disc. Group',
      lookupData.customerDiscGroups,
      'Code',
      'Description'
    )}

    {renderSelect(
      'Invoice_Disc_Code',
      'Invoice Disc. Code',
      [], // You'll need to fetch this data
      'Code',
      'Description'
    )}
  </div>
</div>

{/* Payments Section */}
<div className="bg-white p-6 rounded-lg shadow mb-6">
  <h3 className="text-lg font-semibold mb-4 border-b pb-2">Payments</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {renderSelect(
      'Payment_Terms_Code',
      'Payment Terms Code',
      lookupData.paymentTerms,
      'Code',
      'Description'
    )}

    {renderSelect(
      'Payment_Method_Code',
      'Payment Method Code',
      lookupData.paymentMethods,
      'Code',
      'Description'
    )}

    {renderSelect(
      'Reminder_Terms_Code',
      'Reminder Terms Code',
      lookupData.reminderTerms,
      'Code',
      'Description'
    )}

    {renderSelect(
      'Fin_Charge_Terms_Code',
      'Fin. Charge Terms Code',
      lookupData.financeChargeTerms,
      'Code',
      'Description'
    )}

    {renderSelect(
      'Cash_Flow_Payment_Terms_Code',
      'Cash Flow Payment Terms Code',
      lookupData.cashFlowPaymentTerms,
      'Code',
      'Description'
    )}

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Credit Limit (LCY)</label>
      <input
        type="number"
        name="Credit_Limit_LCY"
        value={form.Credit_Limit_LCY || 0}
        onChange={handleChange}
        step="0.01"
        min="0"
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div className="flex items-center">
      <input
        type="checkbox"
        name="Print_Statements"
        checked={form.Print_Statements !== false}
        onChange={handleChange}
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
      <label className="ml-2 block text-sm text-gray-700">Print Statements</label>
    </div>

    <div className="flex items-center">
      <input
        type="checkbox"
        name="Block_Payment_Tolerance"
        checked={form.Block_Payment_Tolerance || false}
        onChange={handleChange}
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
      <label className="ml-2 block text-sm text-gray-700">Block Payment Tolerance</label>
    </div>
  </div>
</div>

{/* Shipping Section */}
<div className="bg-white p-6 rounded-lg shadow mb-6">
  <h3 className="text-lg font-semibold mb-4 border-b pb-2">Shipping</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {renderSelect(
      'Shipment_Method_Code',
      'Shipment Method Code',
      lookupData.shipmentMethods,
      'Code',
      'Description'
    )}

    {renderSelect(
      'Shipping_Agent_Code',
      'Shipping Agent Code',
      lookupData.shippingAgents,
      'Code',
      'Name'
    )}

    {renderSelect(
      'Shipping_Agent_Service_Code',
      'Shipping Agent Service Code',
      [], // You'll need to fetch this data
      'Code',
      'Description'
    )}

    {renderSelect(
      'Shipping_Advice',
      'Shipping Advice',
      lookupData.shippingAdviceOptions,
      'Code',
      'Description'
    )}

    {renderSelect(
      'Preferred_Carrier_Service_Code',
      'Preferred Carrier Service',
      lookupData.carrierServices,
      'Code',
      'Description'
    )}

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Time</label>
      <input
        type="text"
        name="Shipping_Time"
        value={form.Shipping_Time || ''}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>
</div>

{/* Foreign Trade Section */}
<div className="bg-white p-6 rounded-lg shadow mb-6">
  <h3 className="text-lg font-semibold mb-4 border-b pb-2">Foreign Trade</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {renderSelect(
      'Currency_Code',
      'Currency Code',
      lookupData.currencies,
      'Code',
      'Description'
    )}

    {renderSelect(
      'Price_Calculation_Method',
      'Price Calculation Method',
      lookupData.priceCalculationMethods,
      'Code',
      'Description'
    )}

    <div className="flex items-center">
      <input
        type="checkbox"
        name="Allow_Item_Charge_Assignment"
        checked={form.Allow_Item_Charge_Assignment !== false}
        onChange={handleChange}
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
      <label className="ml-2 block text-sm text-gray-700">Allow Item Charge Assignment</label>
    </div>
  </div>
</div>

{/* Application Section */}
<div className="bg-white p-6 rounded-lg shadow mb-6">
  <h3 className="text-lg font-semibold mb-4 border-b pb-2">Application</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {renderSelect(
      'Application_Method',
      'Application Method',
      lookupData.applicationMethods,
      'Code',
      'Description'
    )}

    {renderSelect(
      'Partner_Type',
      'Partner Type',
      lookupData.partnerTypes,
      'Code',
      'Description'
    )}

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Partner Code</label>
      <input
        type="text"
        name="Partner_Code"
        value={form.Partner_Code || ''}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>
</div>

{/* Invoice Section */}
<div className="bg-white p-6 rounded-lg shadow mb-6">
  <h3 className="text-lg font-semibold mb-4 border-b pb-2">Invoice</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Copies</label>
      <input
        type="number"
        name="Invoice_Copies"
        value={form.Invoice_Copies || 1}
        onChange={handleChange}
        min="1"
        max="999"
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {renderSelect(
      'Invoice_Disc_Code',
      'Invoice Disc. Code',
      [], // You'll need to fetch this data
      'Code',
      'Description'
    )}

    {renderSelect(
      'Copy_Sell_to_Addr_to_Qte_From',
      'Copy Sell-to Addr. to Qte. From',
      [
        { code: "Company", description: "Company" },
        { code: "Customer", description: "Customer" }
      ],
      'Code',
      'Description'
    )}
  </div>
</div>



        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Customer'}
          </button>
        </div>
      </form>
    </div>
  );
}