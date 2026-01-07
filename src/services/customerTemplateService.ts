import axios from 'axios';

export type CustomerTemplate = {
  code: string;
  description: string;
  contactType: 'Company' | 'Person';
};

export const getAllCustomerTemplates = async () => {
  const response = await axios.get(
    'http://localhost:5000/api/customerTemplates'
  );
  return response.data;
};

export const getCustomerTemplateByCode = async (code: string): Promise<CustomerTemplate> => {
  const response = await axios.get(
    `http://localhost:5000/api/customerTemplates('${code}')`
  );
  return response.data;
};
