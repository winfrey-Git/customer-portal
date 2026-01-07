import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import axios, { AxiosError } from 'axios';
import { createClient } from 'soap';

import path from 'path';
import { fileURLToPath } from 'url';

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Type definitions for the API responses
interface Customer {
  No: string;
  Name: string;
  // Add other customer fields as needed
}

interface SalesInvoice {
  No: string;
  // Add other invoice fields as needed
}

interface Item {
  No: string;
  Description: string;
  // Add other item fields as needed
}

interface ItemLedgerEntry {
  Entry_No: number;
  // Add other ledger entry fields as needed
}

const app = express();
// Middleware
app.use(cors());

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // or your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
const port = process.env.PORT || 5000;

// Environment variables
const bcUser = process.env.BC_USER;
const bcKey = process.env.BC_KEY;

if (!bcUser || !bcKey) {
  console.error('❌ BC_USER or BC_KEY not set in .env');
  process.exit(1);
}

const credentials = Buffer.from(`${bcUser}:${bcKey}`).toString('base64');
// Set the base URL to use the WebCustomerAPI
// Use the base URL without the /Customers suffix
const bcBaseUrl = process.env.BC_BASE_URL || "http://desktop-mpj0ppr:7048/BC240/ODataV4/Company('CRONUS%20USA%2C%20Inc.')";
const bcApiBaseUrl = bcBaseUrl;

// SOAP Web Services URL for customer creation
const bcSoapUrl =
  "http://desktop-mpj0ppr:7047/BC240/WS/CRONUS%20USA%2C%20Inc./Codeunit/WebCustomerAPI";


// Define your Business Central API endpoints
const endpoints = {
  // Add the base URL for item availability by location
  itemAvailabilityByLocation: (itemNo: string) => 
    `${process.env.BC_API_BASE_URL}/Company('${encodeURIComponent(process.env.BC_COMPANY_NAME || '')}')/ItemAvailabilitybyLocation?$filter=No eq '${encodeURIComponent(itemNo)}'`,

  // Using WebCustomerAPI for customer-related endpoints
  customers: `${bcApiBaseUrl}/Customers`,
  
  // SOAP endpoint for customer creation
  createCustomer: `${bcSoapUrl}`,
  // Keeping other endpoints as they might be used by other parts of the application
  salesInvoices: `${bcApiBaseUrl}/SalesInvoices`,
  postedSalesInvoices: `${bcApiBaseUrl}/PostedSalesInvoices`,
  salesInvoiceLines: `${bcApiBaseUrl}/SalesInvoiceLines`,
  postedSalesInvoiceLines: `${bcApiBaseUrl}/PostedSalesInvoiceLines`,
  items: `${bcApiBaseUrl}/Items`,
  // Note: The endpoint is case-sensitive and should be 'salesQuote' (lowercase)
  salesQuote: `${bcApiBaseUrl}/salesQuote`,
  // Keep both variations for backward compatibility
  salesQuotes: `${bcApiBaseUrl}/salesQuote`,
  salesQuoteLines: `${bcApiBaseUrl}/SalesQuoteLines`,
  salesCreditMemo: `${bcApiBaseUrl}/SalesCreditMemos`,
  salesCreditMemoLines: `${bcApiBaseUrl}/SalesCreditMemoLines`,
  contacts: `${bcApiBaseUrl}/Contacts`,
  SalesOrder: `${bcApiBaseUrl}/SalesOrder`, // Changed from SalesOrders to match the working URL
  SalesOrderLines: `${bcApiBaseUrl}/SalesOrderLines`,
  itemLedgerEntries: `${bcApiBaseUrl}/ItemLedgerEntries`,
  customerLedgerEntries: `${bcApiBaseUrl}/CustomerLedgerEntries`,

  paymentTerms: `${bcApiBaseUrl}/PaymentTerms`,
  paymentMethods: `${bcApiBaseUrl}/PaymentMethod`,
  countries: `${bcApiBaseUrl}/Countries`,
  customerPostingGroups: `${bcApiBaseUrl}/CustomerPostingGroups`,
  vatBusinessPostingGroups: `${bcApiBaseUrl}/VATBusinessPostingGroups`,
  genBusinessPostingGroups: `${bcApiBaseUrl}/GenBusinessPostingGroups`,
  locations: `${bcApiBaseUrl}/Locations`,
  shipmentMethods: `${bcApiBaseUrl}/ShipmentMethods`,
  shippingAgents: `${bcApiBaseUrl}/ShippingAgents`,
  currencies: `${bcApiBaseUrl}/Currencies`,
  customerPriceGroups: `${bcApiBaseUrl}/CustomerPriceGroups`,
  customerDiscountGroups: `${bcApiBaseUrl}/CustomerDiscountGroups`,
  salespersons: `${bcApiBaseUrl}/Salesperson`, 
  responsibilityCenters: `${bcApiBaseUrl}/ResponsibilityCenters`
};

// Helper function to fetch data from Business Central
interface FetchOptions extends RequestInit {
  body?: any;
}

async function fetchFromBC<T = any>(url: string, options: FetchOptions = {}): Promise<T> {
  // Create headers object
  const headers: Record<string, string> = {
    'Authorization': `Basic ${credentials}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  console.log('Making request to:', url);

  // Merge custom headers if provided
  if (options.headers) {
    const customHeaders = options.headers as Record<string, string>;
    Object.entries(customHeaders).forEach(([key, value]) => {
      if (value) headers[key] = String(value);
    });
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const text = await response.text();
    
    if (!response.ok) {
      console.error(`Error from BC [${response.status}]:`, {
        url,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: text
      });
      throw new Error(`HTTP ${response.status} - ${response.statusText}`);
    }

    // If the response is empty, return an empty object
    if (!text.trim()) {
      return {} as T;
    }

    return JSON.parse(text) as T;
  } catch (error) {
    console.error('Error in fetchFromBC:', error);
    throw error instanceof Error ? error : new Error('An unknown error occurred');
  }
}

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Helper function to create standard CRUD endpoints
function createStandardEndpoints(entityName: string, path: string) {
  // GET all
  app.get(`/api/${path}`, async (_req: Request, res: Response) => {
    try {
      const data = await fetchFromBC(endpoints[entityName as keyof typeof endpoints]);
      res.json(data);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : `Failed to fetch ${path}`;
      console.error(`Error fetching ${path}:`, errorMessage);
      res.status(500).json({ 
        error: `Failed to fetch ${path}`,
        details: errorMessage
      });
    }
  });

  // GET by ID
  app.get(`/api/${path}/:id`, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const url = `${endpoints[entityName as keyof typeof endpoints]}('${encodeURIComponent(id)}')`;
      const data = await fetchFromBC(url);
      res.json(data);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : `Failed to fetch ${path} item`;
      console.error(`Error fetching ${path} item:`, errorMessage);
      res.status(500).json({ 
        error: `Failed to fetch ${path} item`,
        details: errorMessage
      });
    }
  });
}

// Create endpoints for each entity
createStandardEndpoints('customerLedgerEntries', 'customerLedgerEntries');
createStandardEndpoints('paymentTerms', 'paymentTerms');
createStandardEndpoints('paymentMethods', 'paymentMethods');
createStandardEndpoints('countries', 'countries');
createStandardEndpoints('customerPostingGroups', 'customerPostingGroups');
createStandardEndpoints('vatBusinessPostingGroups', 'vatBusinessPostingGroups');
createStandardEndpoints('genBusinessPostingGroups', 'genBusinessPostingGroups');
createStandardEndpoints('locations', 'locations');
createStandardEndpoints('shipmentMethods', 'shipmentMethods');
createStandardEndpoints('shippingAgents', 'shippingAgents');
createStandardEndpoints('currencies', 'currencies');
createStandardEndpoints('customerPriceGroups', 'customerPriceGroups');
createStandardEndpoints('customerDiscountGroups', 'customerDiscGroups');
createStandardEndpoints('salespersons', 'salespeople');
createStandardEndpoints('responsibilityCenters', 'responsibilityCenters');

// Get OData service document
app.get('/api/service-document', async (_req: Request, res: Response) => {
  try {
    const serviceUrl = bcBaseUrl.split('?')[0]; // Remove any query parameters
    console.log('Fetching service document from:', serviceUrl);
    const response = await fetch(serviceUrl, {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status} - ${response.statusText}: ${text}`);
    }
    
    const data = await response.json();
    res.json({
      serviceUrl,
      endpoints: Object.keys(endpoints).map(key => ({
        name: key,
        url: endpoints[key as keyof typeof endpoints]
      })),
      serviceDocument: data
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch service document';
    console.error('Error fetching service document:', errorMessage);
    res.status(500).json({ 
      error: 'Failed to fetch service document',
      details: errorMessage,
      bcBaseUrl,
      credentials: !!credentials ? 'Credentials set' : 'No credentials'
    });
  }
});

// GET all customers
app.get('/api/customers', async (_req: Request, res: Response) => {
  try {
    console.log('Fetching customers from:', endpoints.customers);
    const data = await fetchFromBC(endpoints.customers);
    console.log('Customers response:', data ? 'Received data' : 'No data');
    res.json(data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch customers';
    console.error('Error fetching customers:', {
      message: errorMessage,
      url: endpoints.customers,
      error: error instanceof Error ? error.stack : 'No error stack'
    });
    res.status(500).json({ 
      error: 'Failed to fetch customers',
      details: errorMessage,
      url: endpoints.customers
    });
  }
});

// GET single customer by No
app.get('/api/customers/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const url = `${endpoints.customers}('${encodeURIComponent(id)}')`;
    const data = await fetchFromBC(url);
    res.json(data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch customer';
    console.error('Error fetching customer:', errorMessage);
    res.status(500).json({ 
      error: 'Failed to fetch customer',
      details: errorMessage
    });
  }
});

// Get customer ledger entries
app.get('/api/customers/:customerNo/ledger-entries', async (req: Request, res: Response) => {
  try {
    const { customerNo } = req.params;
    const { $filter, $orderby, $top, $skip } = req.query;
    
    let url = `${endpoints.customerLedgerEntries}?$filter=Customer_No eq '${encodeURIComponent(customerNo)}'`;
    
    // Add additional filters if provided
    if ($filter) url += ` and (${$filter})`;
    if ($orderby) url += `&$orderby=${$orderby}`;
    if ($top) url += `&$top=${$top}`;
    if ($skip) url += `&$skip=${$skip}`;

    console.log('Fetching customer ledger entries from:', url);
    const data = await fetchFromBC(url);
    res.json(data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch customer ledger entries';
    console.error('Error:', errorMessage);
    res.status(500).json({ 
      error: 'Failed to fetch customer ledger entries',
      details: errorMessage
    });
  }
});



// SALES INVOICES ENDPOINTS

// Get all sales invoices
app.get('/api/salesInvoices', async (req: Request, res: Response) => {
  try {
    const { $filter, $orderby, $top, $skip } = req.query;
    let url = endpoints.salesInvoices;
    
    const queryParams = new URLSearchParams();
    if ($filter) queryParams.append('$filter', $filter as string);
    if ($orderby) queryParams.append('$orderby', $orderby as string);
    if ($top) queryParams.append('$top', $top as string);
    if ($skip) queryParams.append('$skip', $skip as string);
    
    const queryString = queryParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    const data = await fetchFromBC(url);
    res.json(data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch sales invoices';
    console.error('Error fetching sales invoices:', errorMessage);
    res.status(500).json({ 
      error: 'Failed to fetch sales invoices',
      details: errorMessage
    });
  }
});

// Get single sales invoice by ID
app.get('/api/salesInvoices/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(`Fetching sales invoice with ID: ${id}`);
    
    // Get the invoice header
    const invoiceUrl = `${endpoints.salesInvoices}?$filter=No eq '${encodeURIComponent(id)}'`;
    console.log('Fetching invoice header from:', invoiceUrl);
    
    const invoiceResponse = await fetchFromBC(invoiceUrl);
    
    if (!invoiceResponse.value || !Array.isArray(invoiceResponse.value) || invoiceResponse.value.length === 0) {
      console.log('No invoice found with number:', id);
      return res.status(404).json({
        error: 'Not Found',
        message: `Sales invoice with number ${id} was not found.`,
        suggestion: 'Please verify the invoice number and try again.'
      });
    }
    
    const invoice = invoiceResponse.value[0];
    console.log('Found invoice header');
    
    // Get the invoice lines by filtering salesInvoiceLines with the document number
    try {
      const linesUrl = `${endpoints.salesInvoiceLines}?$filter=Document_No eq '${encodeURIComponent(id)}'`;
      console.log('Fetching invoice lines from:', linesUrl);
      
      const linesResponse = await fetchFromBC(linesUrl);
      
      if (linesResponse.value && Array.isArray(linesResponse.value)) {
        console.log(`Found ${linesResponse.value.length} invoice lines`);
        invoice.lines = linesResponse.value;
      } else {
        console.log('No invoice lines found');
        invoice.lines = [];
      }
    } catch (linesError: unknown) {
      const errorMessage = linesError instanceof Error ? linesError.message : 'Failed to fetch invoice lines';
      console.error('Error fetching invoice lines:', errorMessage);
      invoice.lines = [];
    }
    
    return res.json(invoice);
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch sales invoice';
    console.error('Error in /api/salesInvoices/:id:', errorMessage);
    
    const status = error instanceof Error ? 500 : 500;
    const message = error instanceof Error ? error.message : 'Failed to fetch sales invoice';
    
    res.status(status).json({
      error: 'Failed to fetch sales invoice',
      message: message,
      details: errorMessage
    });
  }
});

app.post("/api/customers", async (req: Request, res: Response) => {
  try {
    const {
      Name,
      Address,
      City,
      Post_Code,
      Country_Region_Code,
      Contact,
      Phone_No,
      E_Mail,
      CustomerTemplateCode,
    } = req.body;

    // Validate required fields
    const missingFields: string[] = [];
    if (!Name) missingFields.push("Name");
    if (!Address) missingFields.push("Address");
    if (!City) missingFields.push("City");
    if (!Post_Code) missingFields.push("Post_Code");
    if (!Country_Region_Code) missingFields.push("Country_Region_Code");
    if (!Phone_No) missingFields.push("Phone_No");
    if (!E_Mail) missingFields.push("E_Mail");
    if (!CustomerTemplateCode) missingFields.push("CustomerTemplateCode");

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Missing required fields",
        missingFields,
      });
    }

    // Escape XML special characters
    const escapeXml = (unsafe: string): string =>
      unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");

    // Construct SOAP envelope
const soapRequest = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <CreateCustomer xmlns="urn:microsoft-dynamics-schemas/codeunit/WebCustomerAPI">
      <name>${escapeXml(Name)}</name>
      <address>${escapeXml(Address)}</address>
      <city>${escapeXml(City)}</city>
      <postCode>${escapeXml(Post_Code)}</postCode>
      <countryCode>${escapeXml(Country_Region_Code)}</countryCode>
      <phoneNo>${escapeXml(Phone_No)}</phoneNo>
      <email>${escapeXml(E_Mail)}</email>
      <customerTemplateCode>${escapeXml(CustomerTemplateCode)}</customerTemplateCode>
    </CreateCustomer>
  </soap:Body>
</soap:Envelope>`;


    // Send SOAP request
    const response = await fetch(bcSoapUrl, {
      method: "POST",
headers: {
  "Content-Type": "text/xml; charset=utf-8",
  "SOAPAction":
    "urn:microsoft-dynamics-schemas/codeunit/WebCustomerAPI:CreateCustomer",
  "Authorization": `Basic ${credentials}`
},
      body: soapRequest,
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error("SOAP Response Error:", responseText);
      return res.status(500).json({
        error: "SOAP request failed",
        status: response.status,
        response: responseText,
      });
    }

    // Parse SOAP response
    const match = responseText.match(/<return_value>(.*?)<\/return_value>/);
    if (!match || !match[1]) {
      console.error("Invalid SOAP response:", responseText);
      return res.status(500).json({
        error: "Invalid response from Business Central",
        response: responseText,
      });
    }

    const customerNo = match[1].trim();
    res.status(201).json({
      success: true,
      customerNo,
      message: "Customer created successfully",
    });
  } catch (error: unknown) {
    console.error("Error creating customer:", error);
    res.status(500).json({
      error: "Failed to create customer",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Create a new sales invoice
app.post('/api/salesInvoices', async (req: Request, res: Response) => {
  try {
    const invoiceData = req.body;
    
    // Create the invoice header
    const invoiceResponse = await fetchFromBC(endpoints.salesInvoices, {
      method: 'POST',
      body: JSON.stringify(invoiceData.header)
    });

    // Add lines if they exist
    if (invoiceData.lines && invoiceData.lines.length > 0) {
      const invoiceId = invoiceResponse.No;
      const linesUrl = `${endpoints.salesInvoices}('${encodeURIComponent(invoiceId)}')/salesInvoiceLines`;
      
      for (const line of invoiceData.lines) {
        await fetchFromBC(linesUrl, {
          method: 'POST',
          body: JSON.stringify(line)
        });
      }
    }

    // Get the complete invoice with lines
    const completeInvoice = await fetchFromBC(
      `${endpoints.salesInvoices}('${encodeURIComponent(invoiceResponse.No)}')?$expand=salesInvoiceLines`
    );
    
    res.status(201).json(completeInvoice);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create sales invoice';
    console.error('Error creating sales invoice:', errorMessage);
    res.status(500).json({
      error: 'Failed to create sales invoice',
      details: errorMessage
    });
  }
});

// Get all items
app.get('/api/items', async (req: Request, res: Response) => {
  try {
    console.log('=== Items Endpoint Debug ===');
    console.log('1. Environment Variables:');
    console.log('   - NODE_ENV:', process.env.NODE_ENV);
    console.log('   - BC_BASE_URL:', process.env.BC_BASE_URL);
    console.log('2. Endpoints Configuration:');
    console.log('   - bcBaseUrl:', bcBaseUrl);
    console.log('   - bcApiBaseUrl:', bcApiBaseUrl);
    console.log('   - items endpoint:', endpoints.items);
    
    const { $filter, $orderby, $top, $skip, $search } = req.query;
    console.log('3. Request Query Parameters:', { $filter, $orderby, $top, $skip, $search });
    
    let url = endpoints.items;
    console.log('4. Initial URL:', url);
    
    const queryParams = new URLSearchParams();
    if ($filter) queryParams.append('$filter', $filter as string);
    if ($orderby) queryParams.append('$orderby', $orderby as string);
    if ($top) queryParams.append('$top', $top as string);
    if ($skip) queryParams.append('$skip', $skip as string);
    if ($search) {
      queryParams.append('$filter', `contains(Description, '${$search}') or contains(No_, '${$search}')`);
    }
    
    const queryString = queryParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    console.log('Final items URL:', url);
    
    const data = await fetchFromBC(url);
    console.log('Items fetched successfully');
    res.json(data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch items';
    console.error('Error fetching items:', errorMessage);
    res.status(500).json({
      error: 'Failed to fetch items',
      details: errorMessage
    });
  }
});

// GET all customer templates
app.get('/api/customerTemplates', async (_req: Request, res: Response) => {
  try {
    const url = `${endpoints.customers.split('/Customers')[0]}/CustomerTemplate`;
    console.log('Fetching customer templates from:', url);
    const response = await fetchFromBC<{ value: Array<{ Code: string; Description: string; Contact_Type: string }> }>(url);
    
    // Transform the data to match your frontend's expected format
    const transformedData = {
      value: response.value.map(template => ({
        code: template.Code,
        description: template.Description,
        contactType: template.Contact_Type
      }))
    };
    
    console.log('Customer templates response:', transformedData.value.length ? 'Received data' : 'No data');
    res.json(transformedData);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch customer templates';
    console.error('Error fetching customer templates:', {
      message: errorMessage,
      error: error instanceof Error ? error.stack : 'No error stack'
    });
    res.status(500).json({ 
      error: 'Failed to fetch customer templates',
      details: errorMessage
    });
  }
});

// GET single customer template by ID
app.get('/api/customerTemplates/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const url = `${endpoints.customers.split('/Customers')[0]}/CustomerTemplate('${encodeURIComponent(id)}')`;
    const template = await fetchFromBC<{ 
      Code: string; 
      Description: string; 
      Contact_Type: string 
    }>(url);
    
    // Transform the data to match your frontend's expected format
    const transformedData = {
      code: template.Code,
      description: template.Description,
      contactType: template.Contact_Type
    };
    
    res.json(transformedData);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch customer template';
    console.error('Error fetching customer template:', errorMessage);
    res.status(500).json({ 
      error: 'Failed to fetch customer template',
      details: errorMessage
    });
  }
});

// Get single item by No
app.get('/api/items/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const url = `${endpoints.items}('${encodeURIComponent(id)}')`;
    const data = await fetchFromBC(url);
    res.json(data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error fetching item ledger entries:', errorMessage);
    res.status(500).json({ error: errorMessage });
  }
});

// Get item inventory
app.get('/api/items/:id/inventory', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const url = `${endpoints.items}('${encodeURIComponent(id)}')/inventory`;
    const data = await fetchFromBC(url);
    res.json(data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch item inventory';
    console.error('Error fetching item inventory:', errorMessage);
    res.status(500).json({
      error: 'Failed to fetch item inventory',
      details: errorMessage
    });
  }
});

// Get all posted sales invoices
app.get('/api/postedSalesInvoices', async (req: Request, res: Response) => {
  try {
    const { $filter, $orderby, $top, $skip, $customerNo } = req.query;
    console.log('Fetching posted sales invoices with params:', { $filter, $orderby, $top, $skip, $customerNo });
    
    let url = endpoints.postedSalesInvoices;
    const queryParams = new URLSearchParams();
    
    // Build filter conditions
    const filterConditions = [];
    if ($filter) filterConditions.push($filter as string);
    if ($customerNo) filterConditions.push(`Sell_to_Customer_No eq '${$customerNo}'`);
    
    // Combine filter conditions
    if (filterConditions.length > 0) {
      queryParams.append('$filter', filterConditions.join(' and '));
    }
    
    // Add other query parameters
    if ($orderby) queryParams.append('$orderby', $orderby as string);
    if ($top) queryParams.append('$top', $top as string);
    if ($skip) queryParams.append('$skip', $skip as string);
    
    // Temporarily removed $expand until we confirm the correct property name
    // For now, we'll fetch just the invoice headers
    
    const queryString = queryParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
    
    console.log('Final URL for posted sales invoices:', url);
    const data = await fetchFromBC(url);
    
    // Log the response structure for debugging
    console.log('Posted sales invoices response structure:', Object.keys(data));
    
    res.json(data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch posted sales invoices';
    console.error('Error fetching posted sales invoices:', errorMessage);
    
    // More specific error handling
    if ((error as any)?.statusCode === 404) {
      return res.status(404).json({
        error: 'Posted sales invoice not found',
        details: errorMessage
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to fetch posted sales invoices',
      details: errorMessage,
      ...(error instanceof Error && process.env.NODE_ENV === 'development' ? { stack: error.stack } : {})
    });
  }
});

// Get single posted sales invoice by ID
app.get('/api/postedSalesInvoices/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(`Fetching posted sales invoice with ID: ${id}`);
    
    // Get the invoice header
    const url = `${endpoints.postedSalesInvoices}('${encodeURIComponent(id)}')`;
    console.log('Fetching invoice from:', url);
    
    const data = await fetchFromBC(url);
    
    if (!data) {
      console.log('No invoice found with number:', id);
      return res.status(404).json({
        error: 'Not Found',
        message: `Posted sales invoice with number ${id} was not found.`
      });
    }
    
    return res.json(data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch posted sales invoice';
    console.error('Error in /api/postedSalesInvoices/:id:', errorMessage);
    
    res.status(500).json({
      error: 'Failed to fetch posted sales invoice',
      message: errorMessage,
      details: error instanceof Error ? error.message : 'Unknown error',
      ...(error instanceof Error && process.env.NODE_ENV === 'development' ? { stack: error.stack } : {})
    });
  }
});

// Get posted sales invoice lines
app.get('/api/postedSalesInvoices/:id/lines', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(`Fetching lines for posted sales invoice: ${id}`);
    
    // Get the invoice header first to verify it exists
    const invoiceUrl = `${endpoints.postedSalesInvoices}('${encodeURIComponent(id)}')`;
    console.log('Verifying posted sales invoice exists:', invoiceUrl);
    
    const invoiceResponse = await fetchFromBC(invoiceUrl);
    
    if (!invoiceResponse) {
      console.log('No posted sales invoice found with number:', id);
      return res.status(404).json({
        error: 'Not Found',
        message: `Posted sales invoice with number ${id} was not found.`,
        suggestion: 'Please verify the invoice number and try again.'
      });
    }
    
    console.log('Found posted sales invoice header');
    
    // Get the invoice lines by filtering postedSalesInvoiceLines with the document number
    try {
      const linesUrl = `${endpoints.postedSalesInvoiceLines}?$filter=Document_No eq '${encodeURIComponent(id)}'`;
      console.log('Fetching posted sales invoice lines from:', linesUrl);
      
      const linesResponse = await fetchFromBC(linesUrl);
      console.log('Raw lines response from BC:', JSON.stringify(linesResponse, null, 2));
      
      if (linesResponse.value && Array.isArray(linesResponse.value)) {
        console.log(`Found ${linesResponse.value.length} posted sales invoice lines`);
        return res.json({
          value: linesResponse.value
        });
      } else {
        console.log('No posted sales invoice lines found');
        return res.json({
          value: []
        });
      }
    } catch (linesError: unknown) {
      const errorMessage = linesError instanceof Error ? linesError.message : 'Failed to fetch posted sales invoice lines';
      console.error('Error fetching posted sales invoice lines:', errorMessage);
      return res.json({
        value: []
      });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch posted sales invoice lines';
    console.error('Error in /api/postedSalesInvoices/:id/lines:', errorMessage, error);
    
    // More specific error handling
    if ((error as any)?.statusCode === 404) {
      return res.status(404).json({
        error: 'Posted sales invoice lines not found',
        details: errorMessage
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to fetch posted sales invoice lines',
      message: errorMessage,
      details: error instanceof Error ? error.message : 'Unknown error',
      ...(error instanceof Error && process.env.NODE_ENV === 'development' ? { stack: error.stack } : {})
    });
  }
});

// Search across multiple entities
app.get('/api/search', async (req: Request, res: Response) => {
  try {
    const { q, type = 'all', top = '10' } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }
  
  if (!q) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  const searchTerm = q.toString().trim();
  const results: any = {};

  // Search in customers
  if (type === 'all' || type === 'customers') {
    const customerUrl = `${endpoints.customers}?$filter=contains(Name, '${searchTerm}') or contains(No, '${searchTerm}')&$top=${top}`;
    results.customers = (await fetchFromBC(customerUrl)).value || [];
  }

  // Search in items
  if (type === 'all' || type === 'items') {
    const itemUrl = `${endpoints.items}?$filter=contains(Description, '${searchTerm}') or contains(No, '${searchTerm}')&$top=${top}`;
    results.items = (await fetchFromBC(itemUrl)).value || [];
  }

  // Search in invoices
  if (type === 'all' || type === 'invoices') {
    const invoiceUrl = `${endpoints.salesInvoices}?$filter=contains(No, '${searchTerm}')&$top=${top}`;
    results.invoices = (await fetchFromBC(invoiceUrl)).value || [];
  }

  res.json(results);
} catch (error: unknown) {
  const errorMessage = error instanceof Error ? error.message : 'Search failed';
  console.error('Search error:', errorMessage);
  res.status(500).json({ 
    error: 'Search failed',
    details: errorMessage,
    ...(error instanceof Error && process.env.NODE_ENV === 'development' ? { stack: error.stack } : {})
  });
}
});

// Get ledger entries for an item
app.get('/api/items/:id/ledger-entries', async (req: Request, res: Response) => {
try {
  const { id } = req.params;
  const { $filter, $orderby, $top, $skip } = req.query;
  
  let url = `${endpoints.itemLedgerEntries}?$filter=Item_No eq '${encodeURIComponent(id)}'`;
  
  if ($filter) url += ` and (${$filter})`;
  if ($orderby) url += `&$orderby=${$orderby}`;
  if ($top) url += `&$top=${$top}`;
  if ($skip) url += `&$skip=${$skip}`;

  const data = await fetchFromBC(url);
  res.json(data);
} catch (error: unknown) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
  console.error('Error fetching item ledger entries:', errorMessage);
  res.status(500).json({ error: errorMessage });
}
});

// ====================
// Sales Quotes Endpoints
// ====================

// ... rest of the code remains the same ...
// GET all sales quotes
app.get('/api/salesquotes', async (req: Request, res: Response) => {
  try {
    const { $filter, $orderby, $top, $skip } = req.query;
    let url = endpoints.salesQuote;
    
    const queryParams = [];
    if ($filter) queryParams.push(`$filter=${encodeURIComponent($filter as string)}`);
    if ($orderby) queryParams.push(`$orderby=${encodeURIComponent($orderby as string)}`);
    if ($top) queryParams.push(`$top=${$top}`);
    if ($skip) queryParams.push(`$skip=${$skip}`);
    
    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }
    
    console.log('Fetching sales quotes from:', url);
    const data = await fetchFromBC(url);
    res.json(data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch sales quotes';
    console.error('Error fetching sales quotes:', errorMessage);
    res.status(500).json({ error: errorMessage });
  }
});

// GET single sales quote by ID
app.get('/api/salesquotes/:id', async (req: Request, res: Response) => {
  let url: string = '';
  try {
    const { id } = req.params;
    const documentType = 'Quote'; // Document type for sales quotes
    
    // First try: With document type and number (most common format)
    url = `${endpoints.salesQuote}('${documentType}','${id}')?$expand=salesQuoteLines`;
    console.log('Trying sales quote URL (format 1):', url);
    
    try {
      const data = await fetchFromBC(url);
      return res.json(data);
    } catch (firstError) {
      console.log('First attempt failed, trying with company name...');
      
      // Second try: With company name and number (some APIs might use this)
      const companyName = 'CRONUS%20USA%2C%20Inc.';
      url = `${endpoints.salesQuote}('${companyName}','${id}')?$expand=salesQuoteLines`;
      console.log('Trying sales quote URL (format 2):', url);
      
      try {
        const data = await fetchFromBC(url);
        return res.json(data);
      } catch (secondError) {
        console.log('Second attempt failed, trying with just the number...');
        
        // Third try: With just the number (some APIs might accept this)
        url = `${endpoints.salesQuote}('${id}')?$expand=salesQuoteLines`;
        console.log('Trying sales quote URL (format 3):', url);
        
        try {
          const data = await fetchFromBC(url);
          return res.json(data);
        } catch (thirdError) {
          console.log('All attempts failed, returning error...');
          throw new Error(`All URL formats failed. Last error: ${thirdError instanceof Error ? thirdError.message : 'Unknown error'}`);
        }
      }
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch sales quote';
    console.error('Error in sales quote endpoint:', errorMessage);
    console.error('Full error:', error);
    res.status(500).json({ 
      error: errorMessage,
      details: error instanceof Error ? error.toString() : 'Unknown error',
      requestUrl: url
    });
  }
});

// GET sales quote lines
app.get('/api/salesquotes/:id/lines', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Try with document type and number first
    const documentType = 'Quote';
    let url = `${endpoints.salesQuote}('${documentType}','${id}')/salesQuoteLines`;
    
    try {
      const data = await fetchFromBC(url);
      return res.json(data);
    } catch (firstError) {
      console.log('First attempt failed, trying with just the number...');
      
      // Fallback to just the number
      url = `${endpoints.salesQuote}('${id}')/salesQuoteLines`;
      console.log('Trying sales quote lines URL (fallback):', url);
      
      const data = await fetchFromBC(url);
      res.json(data);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch sales quote lines';
    console.error('Error fetching sales quote lines:', errorMessage);
    res.status(500).json({ error: errorMessage });
  }
});

// ====================
// Sales Orders Endpoints
// ====================

// GET all sales orders
app.get('/api/salesorders', async (req: Request, res: Response) => {
  try {
    const { $filter, $orderby, $top, $skip } = req.query;
    let url = endpoints.SalesOrder;
    
    const queryParams = [];
    if ($filter) queryParams.push(`$filter=${encodeURIComponent($filter as string)}`);
    if ($orderby) queryParams.push(`$orderby=${encodeURIComponent($orderby as string)}`);
    if ($top) queryParams.push(`$top=${$top}`);
    if ($skip) queryParams.push(`$skip=${$skip}`);
    
    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }
    
    console.log('Fetching sales orders from:', url);
    const data = await fetchFromBC(url);
    res.json(data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch sales orders';
    console.error('Error fetching sales orders:', errorMessage);
    res.status(500).json({ error: errorMessage });
  }
});

// GET single sales order by ID
app.get('/api/salesorders/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const url = `${endpoints.SalesOrder}('${encodeURIComponent(id)}')?$expand=Sales_Order_Lines`;
    console.log('Fetching sales order:', url);
    const data = await fetchFromBC(url);
    res.json(data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch sales order';
    console.error('Error fetching sales order:', errorMessage);
    res.status(500).json({ error: errorMessage });
  }
});

// GET sales order lines
app.get('/api/salesorders/:id/lines', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const url = `${endpoints.SalesOrder}('${encodeURIComponent(id)}')/Sales_Order_Lines`;
    console.log('Fetching sales order lines:', url);
    const data = await fetchFromBC(url);
    res.json(data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch sales order lines';
    console.error('Error fetching sales order lines:', errorMessage);
    res.status(500).json({ error: errorMessage });
  }
});

// ====================
// Contacts Endpoints
// ====================

// GET all contacts
app.get('/api/contacts', async (req: Request, res: Response) => {
  try {
    const { $filter, $orderby, $top, $skip } = req.query;
    let url = endpoints.contacts;
    
    const queryParams = [];
    if ($filter) queryParams.push(`$filter=${encodeURIComponent($filter as string)}`);
    if ($orderby) queryParams.push(`$orderby=${encodeURIComponent($orderby as string)}`);
    if ($top) queryParams.push(`$top=${$top}`);
    if ($skip) queryParams.push(`$skip=${$skip}`);
    
    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }
    
    console.log('Fetching contacts from:', url);
    const data = await fetchFromBC(url);
    res.json(data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch contacts';
    console.error('Error fetching contacts:', errorMessage);
    res.status(500).json({ error: errorMessage });
  }
});

// GET single contact by ID
app.get('/api/contacts/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const url = `${endpoints.contacts}('${encodeURIComponent(id)}')`;
    console.log('Fetching contact:', url);
    const data = await fetchFromBC(url);
    res.json(data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch contact';
    console.error('Error fetching contact:', errorMessage);
    res.status(500).json({ error: errorMessage });
  }
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: Function) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Get customer orders
app.get('/api/customer/orders', async (req: Request, res: Response) => {
  try {
    const { customerNo } = req.query;
    
    if (!customerNo) {
      return res.status(400).json({ error: 'Customer number is required' });
    }

    // Fetch sales orders for the customer
    const salesOrders = await fetchFromBC<any>(`${endpoints.SalesOrder}?$filter=Customer_No eq '${customerNo}'`);
    
    // Fetch posted sales invoices for the customer
    const postedInvoices = await fetchFromBC<any>(`${endpoints.postedSalesInvoices}?$filter=Sell_to_Customer_No eq '${customerNo}'`);
    
    // Process and combine the data
    const orders = [
      ...(salesOrders.value || []).map((order: any) => ({
        id: order.No,
        type: 'order',
        number: order.No,
        date: order.Order_Date,
        status: order.Status,
        amount: order.Amount,
        currencyCode: order.Currency_Code,
        documentType: 'Order'
      })),
      ...(postedInvoices.value || []).map((invoice: any) => ({
        id: invoice.No,
        type: 'invoice',
        number: invoice.No,
        date: invoice.Posting_Date,
        dueDate: invoice.Due_Date,
        status: invoice.Status,
        amount: invoice.Amount_Including_VAT || invoice.Amount,
        currencyCode: invoice.Currency_Code,
        documentType: 'Invoice',
        isPaid: invoice.Status === 'Paid'
      }))
    ];

    // Sort by date (newest first)
    orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    res.json(orders);
  } catch (error: any) {
    console.error('Error fetching customer orders:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch customer orders' });
  }
});

// Get customer details
app.get('/api/customer/profile', async (req: Request, res: Response) => {
  try {
    const { customerNo } = req.query;
    
    if (!customerNo) {
      return res.status(400).json({ error: 'Customer number is required' });
    }

    const customer = await fetchFromBC<any>(`${endpoints.customers}('${customerNo}')`);
    
    // Get order count and total value
    const ordersResponse = await fetchFromBC<any>(
      `${endpoints.SalesOrder}?$filter=Customer_No eq '${customerNo}'&$count=true`
    );
    
    const invoicesResponse = await fetchFromBC<any>(
      `${endpoints.postedSalesInvoices}?$filter=Sell_to_Customer_No eq '${customerNo}'&$count=true`
    );

    // Calculate total spent (simplified - would need to sum invoice amounts in a real scenario)
    const totalSpent = 0; // This would be calculated from invoices
    
    const profile = {
      ...customer,
      stats: {
        totalOrders: ordersResponse['@odata.count'] || 0,
        totalInvoices: invoicesResponse['@odata.count'] || 0,
        totalSpent,
        currencyCode: customer.Currency_Code || 'USD',
        memberSince: customer.Customer_Since || new Date().toISOString().split('T')[0]
      }
    };

    res.json(profile);
  } catch (error: any) {
    console.error('Error fetching customer profile:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch customer profile' });
  }
});

// SOAP Client for Customer Management
const createSoapClient = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    // Create Basic Auth header
    const auth = 'Basic ' + Buffer.from(`${process.env.BC_USER}:${process.env.BC_KEY}`).toString('base64');
    
    // Configure WSDL options with authentication
    const wsdlOptions = {
      wsdl_headers: {
        'Authorization': auth,
        'Content-Type': 'text/xml;charset=UTF-8'
      },
      disableCache: true,
      forceSoap12Headers: true
    };
    
    // Create SOAP client with authentication
    createClient(bcSoapUrl, wsdlOptions, (err: any, client: any) => {
      if (err) {
        console.error('Error creating SOAP client:', err);
        reject(err);
      } else {
        // Set up SOAP headers for all requests
        client.wsdl.definitions.xmlns.wsse = 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd';
        client.wsdl.definitions.xmlns.wsu = 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd';
        
        // Add SOAP security header
        client.addSoapHeader({
          'wsse:Security': {
            'wsse:UsernameToken': {
              'wsse:Username': process.env.BC_USER,
              'wsse:Password': process.env.BC_KEY,
              'wsse:Nonce': 'abc123',
              'wsu:Created': new Date().toISOString()
            }
          }
        });
        
        // Add request interceptor to log requests
        client.on('request', (xml: string) => {
          console.log('SOAP Request:', xml);
        });
        
        // Add response interceptor to log responses
        client.on('response', (response: string) => {
          console.log('SOAP Response:', response);
        });
        
        resolve(client);
      }
    });
  });
};

// Update Customer Details
app.put('/api/customer/update', async (req: Request, res: Response) => {
  try {
    const {
      customerNo,
      name,
      name2 = '',
      address,
      address2 = '',
      city,
      postCode,
      county = '',
      countryRegionCode,
      phoneNo,
      email,
      vatRegistrationNo = '',
      currencyCode = 'USD',
      paymentTermsCode = '',
      genBusPostingGroup = '',
      customerPostingGroup = ''
    } = req.body;

    if (!customerNo) {
      return res.status(400).json({ error: 'Customer number is required' });
    }

    // First, get the existing customer to fill in any missing required fields
    let existingCustomer;
    try {
      existingCustomer = await fetchFromBC(`${endpoints.customers}('${encodeURIComponent(customerNo)}')`);
    } catch (error) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Update the customerData object to use proper property access
// In server.ts, update the customerData object
const customerData = {
  customerNo: customerNo,
  name: name ?? existingCustomer.Name,
  name2: name2 ?? existingCustomer["Name 2"] ?? '',
  address: address ?? existingCustomer.Address,
  address2: address2 ?? existingCustomer["Address 2"] ?? '',
  city: city ?? existingCustomer.City,
  postCode: postCode ?? existingCustomer["Post Code"],
  county: county ?? existingCustomer.County ?? '',
  countryRegionCode: countryRegionCode ?? existingCustomer["Country/Region Code"],
  phoneNo: phoneNo ?? existingCustomer["Phone No."],
  email: email ?? existingCustomer["E-Mail"],
  vATRegistrationNo: vatRegistrationNo ?? existingCustomer["VAT Registration No."] ?? '',
  // Only include currencyCode if it exists in the request or in existing customer
  ...((currencyCode || existingCustomer["Currency Code"]) && {
    currencyCode: currencyCode || existingCustomer["Currency Code"]
  }),
  paymentTermsCode: paymentTermsCode || existingCustomer["Payment Terms Code"] || '',
  genBusPostingGroup: genBusPostingGroup || existingCustomer["Gen. Bus. Posting Group"] || '',
  customerPostingGroup: customerPostingGroup || existingCustomer["Customer Posting Group"] || ''
};

// Log the customer data for debugging
console.log('Customer Data:', JSON.stringify(customerData, null, 2));


// Check and set default currency if needed
if (!customerData.currencyCode) {
  try {
    const defaultCurrency = await fetchFromBC(`${endpoints.currencies}?$filter=Code eq 'USD'`);
    if (defaultCurrency.value && defaultCurrency.value.length > 0) {
      customerData.currencyCode = 'USD';
    }
  } catch (error) {
    console.warn('Could not verify default currency:', error);
  }
}

    // Escape XML special characters
    const escapeXml = (unsafe: string | undefined): string => {
      if (unsafe === undefined || unsafe === null) return '';
      return String(unsafe)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
    };

    // Construct SOAP envelope
const soapRequest = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <UpdateCustomer xmlns="urn:microsoft-dynamics-schemas/codeunit/WebCustomerUpdateAPI">
      <customerNo>${escapeXml(customerData.customerNo)}</customerNo>
      <name>${escapeXml(customerData.name)}</name>
      <name2>${escapeXml(customerData.name2)}</name2>
      <address>${escapeXml(customerData.address)}</address>
      <address2>${escapeXml(customerData.address2)}</address2>
      <city>${escapeXml(customerData.city)}</city>
      <postCode>${escapeXml(customerData.postCode)}</postCode>
      <county>${escapeXml(customerData.county)}</county>
      <countryRegionCode>${escapeXml(customerData.countryRegionCode)}</countryRegionCode>
      <phoneNo>${escapeXml(customerData.phoneNo)}</phoneNo>
      <email>${escapeXml(customerData.email)}</email>
      <vATRegistrationNo>${escapeXml(customerData.vATRegistrationNo)}</vATRegistrationNo>
      // In the SOAP envelope, make currency code optional
${customerData.currencyCode ? `<currencyCode>${escapeXml(customerData.currencyCode)}</currencyCode>` : ''}
      <paymentTermsCode>${escapeXml(customerData.paymentTermsCode)}</paymentTermsCode>
      <genBusPostingGroup>${escapeXml(customerData.genBusPostingGroup)}</genBusPostingGroup>
      <customerPostingGroup>${escapeXml(customerData.customerPostingGroup)}</customerPostingGroup>
    </UpdateCustomer>
  </soap:Body>
</soap:Envelope>`;

// Add this right after the fetch call
console.log('SOAP Request:', {
  url: bcSoapUrl,
  headers: {
    "Content-Type": "text/xml; charset=utf-8",
    "SOAPAction": "urn:microsoft-dynamics-schemas/codeunit/WebCustomerUpdateAPI:UpdateCustomer"
  },
  body: soapRequest
});

const response = await fetch(bcSoapUrl, {
  method: "POST",
  headers: {
    "Content-Type": "text/xml; charset=utf-8",
    "SOAPAction": "urn:microsoft-dynamics-schemas/codeunit/WebCustomerUpdateAPI:UpdateCustomer",
    "Authorization": `Basic ${credentials}`
  },
  body: soapRequest
});

// Add this to log the response
const responseText = await response.text();
console.log('SOAP Response:', {
  status: response.status,
  statusText: response.statusText,
  headers: Object.fromEntries(response.headers.entries()),
  body: responseText
});

    if (!response.ok) {
      console.error("SOAP Response Error:", responseText);
      return res.status(500).json({
        error: "SOAP request failed",
        status: response.status,
        response: responseText,
      });
    }

    // Parse SOAP response
    const match = responseText.match(/<return_value>(.*?)<\/return_value>/i);
    const success = match ? match[1].toLowerCase() === 'true' : false;

    if (!success) {
      console.error("Update failed. SOAP Response:", responseText);
      return res.status(500).json({
        error: "Failed to update customer",
        response: responseText,
      });
    }

    res.json({
      success: true,
      message: 'Customer updated successfully',
      customerNo: customerData.customerNo
    });

  } catch (error: any) {
    console.error('Error updating customer:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to update customer',
      details: error.response?.data || error.toString()
    });
  }
});

// Start server
app.listen(port, () => {
console.log(`🚀 Server running on http://localhost:${port}`);
console.log(`🔌 Connected to Business Central at ${bcBaseUrl}`);
});