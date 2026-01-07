// src/services/bcApiService.ts

import axios, { AxiosError } from 'axios';
import type { AxiosResponse } from 'axios';

// Base URL for the API
const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Type definitions
interface DropdownOption {
  code: string;
  description: string;
  [key: string]: any;
}

interface Item {
  No: string;
  Description: string;
  Unit_Price: number;
  Unit_Cost: number;
  InventoryField: number;
  Base_Unit_of_Measure: string;
  Item_Category_Code: string;
  // Mapped fields
  UnitPrice?: number;
  UnitCost?: number;
  Inventory?: number;
  UnitOfMeasure?: string;
  ItemCategoryCode?: string;
  [key: string]: any;
}

interface Customer {
  No: string;
  Name: string;
  name?: string; // For backward compatibility
  Address: string;
  Post_Code: string;
  City: string;
  Country_Region_Code: string;
  Phone_No?: string;
  phoneNo?: string; // For backward compatibility
  Email: string;
  [key: string]: any;
}

// Generic function to fetch dropdown options
const fetchDropdownOptions = async <T = DropdownOption>(endpoint: string, selectFields: string = 'Code,Description'): Promise<T[]> => {
  try {
    const response = await api.get(`/${endpoint}?$select=${selectFields}`);
    const data = response.data?.value || response.data || [];
    return Array.isArray(data) ? data : [];
  } catch (error: any) {
    console.error(`Error fetching ${endpoint}:`, error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    throw new Error(error.message || `Failed to load ${endpoint}. Please try again.`);
  }
};

// Customer Templates
export const getCustomerTemplates = async (): Promise<DropdownOption[]> => {
  return fetchDropdownOptions('customerTemplates');
};

// Payment Terms
export const getPaymentTerms = async (): Promise<DropdownOption[]> => {
  return fetchDropdownOptions('payment-terms');
};

// Payment Methods
export const getPaymentMethods = async (): Promise<DropdownOption[]> => {
  return fetchDropdownOptions('payment-methods');
};

// Countries
export const getCountries = async (): Promise<DropdownOption[]> => {
  return fetchDropdownOptions('countries', 'Code,Name,ISO_Code,ISO_Numeric_Code');
};

// Customer Posting Groups
export const getCustomerPostingGroups = async (): Promise<DropdownOption[]> => {
  return fetchDropdownOptions('customer-posting-groups');
};

// VAT Business Posting Groups
export const getVatBusinessPostingGroups = async (): Promise<DropdownOption[]> => {
  return fetchDropdownOptions('vat-business-posting-groups');
};

// General Business Posting Groups
export const getGenBusinessPostingGroups = async (): Promise<DropdownOption[]> => {
  return fetchDropdownOptions('gen-business-posting-groups');
};

// Locations
export const getLocations = async (): Promise<DropdownOption[]> => {
  return fetchDropdownOptions('locations', 'Code,Name,Address,City,Country_Region_Code');
};

// Shipment Methods
export const getShipmentMethods = async (): Promise<DropdownOption[]> => {
  return fetchDropdownOptions('shipment-methods');
};

// Shipping Agents
export const getShippingAgents = async (): Promise<DropdownOption[]> => {
  return fetchDropdownOptions('shipping-agents');
};

// Currencies
export const getCurrencies = async (): Promise<DropdownOption[]> => {
  return fetchDropdownOptions('currencies', 'Code,Description,Symbol,Amount_Decimal_Places');
};

// Customer Price Groups
export const getCustomerPriceGroups = async (): Promise<DropdownOption[]> => {
  return fetchDropdownOptions('customer-price-groups');
};

// Customer Discount Groups
export const getCustomerDiscountGroups = async (): Promise<DropdownOption[]> => {
  return fetchDropdownOptions('customer-discount-groups');
};

// Salespersons
export const getSalespersons = async (): Promise<DropdownOption[]> => {
  return fetchDropdownOptions('salespersons', 'Code,Name,Email,Phone_No');
};

// Responsibility Centers
export const getResponsibilityCenters = async (): Promise<DropdownOption[]> => {
  return fetchDropdownOptions('responsibility-centers', 'Code,Name,Address,City,Country_Region_Code');
};

// Items API
export const getItems = async (searchTerm: string = ''): Promise<Item[]> => {
  try {
    const response = await api.get('/items?$select=No,Description,Unit_Price,Unit_Cost,InventoryField,Base_Unit_of_Measure,Item_Category_Code');
    const items = response.data?.value || response.data || [];
    
    return (Array.isArray(items) ? items : []).map((item: any) => ({
      ...item,
      UnitPrice: item.Unit_Price,
      UnitCost: item.Unit_Cost,
      Inventory: item.InventoryField,
      UnitOfMeasure: item.Base_Unit_of_Measure,
      ItemCategoryCode: item.Item_Category_Code
    })).filter((item: Item) => 
      searchTerm ? 
      (item.No?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       item.Description?.toLowerCase().includes(searchTerm.toLowerCase()))
      : true
    );
  } catch (error: any) {
    console.error('Error in getItems:', error);
    throw new Error(error.message || 'Failed to load items. Please try again.');
  }
};

export const getItem = async (itemNumber: string): Promise<Item> => {
  try {
    const response = await api.get(
      `/items/${itemNumber}?$select=` +
      'No,Description,Unit_Price,Unit_Cost,InventoryField,Base_Unit_of_Measure,' +
      'Item_Category_Code,Last_Direct_Cost,Standard_Cost,Costing_Method,' +
      'Item_Tracking_Code,Blocked,Last_Date_Modified'
    );
    
    const itemData = response.data?.value || response.data;
    return {
      ...itemData,
      UnitPrice: itemData.Unit_Price,
      UnitCost: itemData.Unit_Cost,
      Inventory: itemData.InventoryField,
      UnitOfMeasure: itemData.Base_Unit_of_Measure,
      ItemCategoryCode: itemData.Item_Category_Code,
      LastDirectCost: itemData.Last_Direct_Cost,
      StandardCost: itemData.Standard_Cost,
      CostingMethod: itemData.Costing_Method,
      ItemTrackingCode: itemData.Item_Tracking_Code,
      Blocked: itemData.Blocked,
      LastDateModified: itemData.Last_Date_Modified
    };
  } catch (error: any) {
    console.error('Error in getItem:', error);
    throw new Error(error.message || 'Failed to load item details. Please try again.');
  }
};

// Customers API
export const getCustomers = async (): Promise<Customer[]> => {
  try {
    const response = await api.get('/customers?$select=No,Name,Address,Post_Code,City,Country_Region_Code,Phone_No,Email');
    const data = response.data?.value || response.data || [];
    return (Array.isArray(data) ? data : []).map(customer => ({
      ...customer,
      Name: customer.Name || customer.name,
      Phone_No: customer.Phone_No || customer.phoneNo
    }));
  } catch (error: any) {
    console.error('Error fetching customers:', error);
    throw new Error(error.message || 'Failed to load customers. Please try again.');
  }
};

// Add this function to your bcApiService.ts file, before the default export

/**
 * Creates a new customer in Business Central
 * @param customerData The customer data to create
 * @returns The created customer data
 */
export const createCustomer = async (customerData: any): Promise<Customer> => {
  try {
    console.log('Sending customer data:', customerData);
    
    const response = await api.post('/customers', customerData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = response.data;
    console.log('Customer created successfully:', responseData);
    return {
      ...responseData,
      Name: responseData.Name || responseData.name,
      Phone_No: responseData.Phone_No || responseData.phoneNo
    };
  } catch (error: any) {
    console.error('Error creating customer:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    
    // Format a more user-friendly error message
    let errorMessage = 'Failed to create customer.';
    if (error.response?.data) {
      const errorData = error.response.data;
      if (errorData.error) {
        errorMessage = `Error: ${errorData.error.message || errorData.error.code || 'Unknown error'}`;
      } else if (typeof errorData === 'string') {
        errorMessage = errorData;
      } else {
        errorMessage = JSON.stringify(errorData);
      }
    }
    
    throw new Error(errorMessage);
  }
};


// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log('Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('Response:', response.status, response.config.url);
    return response;
  },
  (error: AxiosError) => {
    console.error('Response error:', {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

// Export all functions and the axios instance
export { api };

// Default export with all API functions
export default {
  // Dropdown options
  getCustomerTemplates,
  getPaymentTerms,
  getPaymentMethods,
  getCountries,
  getCustomerPostingGroups,
  getVatBusinessPostingGroups,
  getGenBusinessPostingGroups,
  getLocations,
  getShipmentMethods,
  getShippingAgents,
  getCurrencies,
  getCustomerPriceGroups,
  getCustomerDiscountGroups,
  getSalespersons,
  getResponsibilityCenters,
  createCustomer, 
  
  // Main data
  getItems,
  getItem,
  getCustomers,
  
  // Axios instance
  api
};