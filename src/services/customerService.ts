import { fetchWrapper } from '../utils/fetchWrapper';

export interface CustomerOrder {
  id: string;
  type: 'order' | 'invoice';
  number: string;
  date: string;
  dueDate?: string;
  status: string;
  amount: number;
  currencyCode: string;
  documentType: string;
  isPaid?: boolean;
}

export interface CustomerProfile {
  No: string;
  Name: string;
  Email?: string;
  Phone_No?: string;
  Mobile_Phone_No?: string;
  Address?: string;
  Address_2?: string;
  City?: string;
  Post_Code?: string;
  Country_Region_Code?: string;
  Contact?: string;
  stats: {
    totalOrders: number;
    totalInvoices: number;
    totalSpent: number;
    currencyCode: string;
    memberSince: string;
  };
}

export interface Customer extends Omit<CustomerProfile, 'stats'> {
  // This interface includes all customer fields without the nested stats
}

export const customerService = {
  // Customer CRUD Operations
  async getCustomers(): Promise<{ value: Customer[] }> {
    try {
      return await fetchWrapper('/api/customers');
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  async getCustomer(customerNo: string): Promise<Customer> {
    try {
      return await fetchWrapper(`/api/customers/${encodeURIComponent(customerNo)}`);
    } catch (error) {
      console.error(`Error fetching customer ${customerNo}:`, error);
      throw error;
    }
  },

  async createCustomer(customerData: Omit<Customer, 'No'>): Promise<Customer> {
    try {
      return await fetchWrapper('/api/customers', {
        method: 'POST',
        body: JSON.stringify(customerData)
      });
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  async updateCustomer(customerNo: string, customerData: Partial<Customer>): Promise<Customer> {
    try {
      return await fetchWrapper(`/api/customers/${encodeURIComponent(customerNo)}`, {
        method: 'PUT',
        body: JSON.stringify(customerData)
      });
    } catch (error) {
      console.error(`Error updating customer ${customerNo}:`, error);
      throw error;
    }
  },

  async deleteCustomer(customerNo: string): Promise<void> {
    try {
      await fetchWrapper(`/api/customers/${encodeURIComponent(customerNo)}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error(`Error deleting customer ${customerNo}:`, error);
      throw error;
    }
  },

  // Existing customer service methods
  async getCustomerOrders(customerNo: string): Promise<CustomerOrder[]> {
    try {
      const response = await fetchWrapper(`/api/customer/orders?customerNo=${encodeURIComponent(customerNo)}`);
      return response;
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      throw error;
    }
  },

  async getCustomerProfile(customerNo: string): Promise<CustomerProfile> {
    try {
      const response = await fetchWrapper(`/api/customer/profile?customerNo=${encodeURIComponent(customerNo)}`);
      return response;
    } catch (error) {
      console.error('Error fetching customer profile:', error);
      throw error;
    }
  },

  async getCustomerInvoices(customerNo: string): Promise<CustomerOrder[]> {
    try {
      const response = await fetchWrapper(`/api/postedSalesInvoices?$filter=Sell_to_Customer_No eq '${encodeURIComponent(customerNo)}'`);
      return response.value.map((invoice: any) => ({
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
      }));
    } catch (error) {
      console.error('Error fetching customer invoices:', error);
      throw error;
    }
  }
};
