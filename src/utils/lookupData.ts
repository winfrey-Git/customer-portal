import axios from 'axios';

// Cache for lookup data
const lookupCache: Record<string, any[]> = {};

// Function to fetch lookup data
const fetchLookupData = async (endpoint: string) => {
  try {
    if (lookupCache[endpoint]) {
      return lookupCache[endpoint];
    }

    const response = await axios.get(`http://localhost:5000/api/${endpoint}`);
    const data = Array.isArray(response.data.value) 
      ? response.data.value 
      : response.data;
    
    lookupCache[endpoint] = data;
    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [];
  }
};

// Specific lookup functions
export const fetchCountries = async () => {
  return fetchLookupData('countries');
};

export const fetchPaymentTerms = async () => {
  return fetchLookupData('paymentTerms');
};

export const fetchPaymentMethods = async () => {
  return fetchLookupData('paymentMethods');
};

export const fetchCustomerPostingGroups = async () => {
  return fetchLookupData('customerPostingGroups');
};

export const fetchVatBusinessPostingGroups = async () => {
  return fetchLookupData('vatBusinessPostingGroups');
};

export const fetchGenBusinessPostingGroups = async () => {
  return fetchLookupData('genBusinessPostingGroups');
};

export const fetchLocations = async () => {
  return fetchLookupData('locations');
};

export const fetchShipmentMethods = async () => {
  return fetchLookupData('shipmentMethods');
};

export const fetchShippingAgents = async () => {
  return fetchLookupData('shippingAgents');
};

export const fetchCurrencies = async () => {
  return fetchLookupData('currencies');
};

export const fetchCustomerPriceGroups = async () => {
  return fetchLookupData('customerPriceGroups');
};

export const fetchCustomerDiscGroups = async () => {
  return fetchLookupData('customerDiscGroups');
};

export const fetchSalespeople = async () => {
  return fetchLookupData('salespeople');
};

export const fetchResponsibilityCenters = async () => {
  return fetchLookupData('responsibilityCenters');
};

export const fetchCustomerTemplates = async () => {
  return fetchLookupData('customerTemplates');
};
