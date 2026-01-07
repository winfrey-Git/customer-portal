import { api } from './bcApiService';

interface ODataResponse<T> {
  '@odata.context'?: string;
  value: T[];
}

export interface PaymentTerm {
  code: string;
  description: string;
  dueDateCalculation: string;
  discountDateCalculation?: string;
  discountPercent?: number;
}

interface RawPaymentTerm {
  Code: string;
  Description: string;
  Due_Date_Calculation: string;
  Discount_Date_Calculation?: string;
  Discount_Percent?: number;
  '@odata.etag'?: string;
}

const toApiFormat = (data: Partial<PaymentTerm>): any => ({
  Code: data.code,
  Description: data.description,
  Due_Date_Calculation: data.dueDateCalculation,
  Discount_Date_Calculation: data.discountDateCalculation,
  Discount_Percent: data.discountPercent
});

const fromApiFormat = (data: RawPaymentTerm): PaymentTerm => ({
  code: data.Code,
  description: data.Description || '',
  dueDateCalculation: data.Due_Date_Calculation || '',
  discountDateCalculation: data.Discount_Date_Calculation,
  discountPercent: data.Discount_Percent
});

export const getPaymentTerms = async (): Promise<PaymentTerm[]> => {
  try {
    const response = await api.get<ODataResponse<RawPaymentTerm>>('/paymentTerms');
    return response.data.value.map(fromApiFormat);
  } catch (error) {
    console.error('Error fetching payment terms:', error);
    throw error;
  }
};

export const createPaymentTerm = async (term: Omit<PaymentTerm, 'code'>): Promise<PaymentTerm> => {
  try {
    const response = await api.post<RawPaymentTerm>('/paymentTerms', toApiFormat(term));
    return fromApiFormat(response.data);
  } catch (error) {
    console.error('Error creating payment term:', error);
    throw error;
  }
};

export const updatePaymentTerm = async (code: string, term: Partial<PaymentTerm>): Promise<PaymentTerm> => {
  try {
    const response = await api.patch<RawPaymentTerm>(
      `/paymentTerms('${code}')`,
      toApiFormat({ ...term, code })
    );
    return fromApiFormat(response.data);
  } catch (error) {
    console.error('Error updating payment term:', error);
    throw error;
  }
};

export const deletePaymentTerm = async (code: string): Promise<void> => {
  try {
    await api.delete(`/paymentTerms('${code}')`);
  } catch (error) {
    console.error('Error deleting payment term:', error);
    throw error;
  }
};
