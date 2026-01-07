import { api } from './bcApiService';

export interface PostingGroup {
  code: string;
  description: string;
  receivablesAccount: string;
  paymentTerms: string;
  vatBusinessPostingGroup: string;
}

interface ODataResponse<T> {
  '@odata.context'?: string;
  value: T[];
}

interface RawPostingGroup {
  Code: string;
  Description: string;
  Receivables_Account: string;
  Payment_Terms?: string; // Adding this as it might be in the response
  '@odata.etag'?: string;
  // Add other fields from the API response if needed
}

export const getPostingGroups = async (): Promise<PostingGroup[]> => {
  try {
    const response = await api.get<ODataResponse<RawPostingGroup>>('/customerPostingGroups');
    
    // Transform the data to match our frontend model
    return response.data.value.map(item => ({
      code: item.Code,
      description: item.Description || '',
      receivablesAccount: item.Receivables_Account || '',
      paymentTerms: item.Payment_Terms || '',
      vatBusinessPostingGroup: '' // This field doesn't exist in the response, keeping it for compatibility
    }));
  } catch (error) {
    console.error('Error fetching posting groups:', error);
    throw error;
  }
};

// Helper function to transform data to the API format
const toApiFormat = (data: Partial<PostingGroup>): any => ({
  Code: data.code,
  Description: data.description,
  Receivables_Account: data.receivablesAccount,
  Payment_Terms: data.paymentTerms,
  // Add other fields if needed
});

// Helper function to transform data from the API format
const fromApiFormat = (data: RawPostingGroup): PostingGroup => ({
  code: data.Code,
  description: data.Description || '',
  receivablesAccount: data.Receivables_Account || '',
  paymentTerms: data.Payment_Terms || '',
  vatBusinessPostingGroup: '' // Default empty as it's not in the API response
});

export const createPostingGroup = async (group: Omit<PostingGroup, 'code'>): Promise<PostingGroup> => {
  try {
    const response = await api.post<RawPostingGroup>('/customerPostingGroups', toApiFormat(group));
    return fromApiFormat(response.data);
  } catch (error) {
    console.error('Error creating posting group:', error);
    throw error;
  }
};

export const updatePostingGroup = async (code: string, group: Partial<PostingGroup>): Promise<PostingGroup> => {
  try {
    const response = await api.patch<RawPostingGroup>(
      `/customerPostingGroups('${code}')`,
      toApiFormat({ ...group, code })
    );
    return fromApiFormat(response.data);
  } catch (error) {
    console.error('Error updating posting group:', error);
    throw error;
  }
};

export const deletePostingGroup = async (code: string): Promise<void> => {
  try {
    await api.delete(`/customerPostingGroups('${code}')`);
  } catch (error) {
    console.error('Error deleting posting group:', error);
    throw error;
  }
};
