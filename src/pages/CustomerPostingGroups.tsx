import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Pencil, Save, Loader2 } from 'lucide-react';
import type { PostingGroup } from '@/services/postingGroupService';
import { getPostingGroups, createPostingGroup, updatePostingGroup, deletePostingGroup } from '@/services/postingGroupService';

const CustomerPostingGroups: React.FC = () => {
  const [postingGroups, setPostingGroups] = useState<PostingGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<PostingGroup, 'code'> & { code?: string }>({
    code: '',
    description: '',
    receivablesAccount: '',
    paymentTerms: '',
    vatBusinessPostingGroup: ''
  });

  const fetchPostingGroups = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching posting groups...');
      const data = await getPostingGroups();
      console.log('Received posting groups data:', data);
      
      // Ensure data is an array before setting it
      const postingGroupsData = Array.isArray(data) ? data : [];
      console.log('Processed posting groups:', postingGroupsData);
      
      setPostingGroups(postingGroupsData);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch posting groups:', err);
      setError('Failed to load posting groups. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPostingGroups();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      
      // If we're editing an existing group, make sure to keep the code
      if (editingIndex !== null && name !== 'code') {
        newData.code = postingGroups[editingIndex].code;
      }
      
      return newData;
    });
  };

  const handleAddGroup = async () => {
    if (!formData.description) return;
    
    try {
      setIsLoading(true);
      
      if (editingIndex !== null) {
        // Update existing group
        const groupToUpdate = postingGroups[editingIndex];
        await updatePostingGroup(groupToUpdate.code, formData);
      } else {
        // Add new group - create a complete PostingGroup object with an empty code
        const newGroup: Omit<PostingGroup, 'code'> & { code?: string } = { ...formData };
        await createPostingGroup(newGroup);
      }
      
      // Refresh the list
      await fetchPostingGroups();
      
      // Reset form
      setFormData({
        code: '',
        description: '',
        receivablesAccount: '',
        paymentTerms: '',
        vatBusinessPostingGroup: ''
      });
      setIsAdding(false);
      setEditingIndex(null);
    } catch (err) {
      console.error('Error saving posting group:', err);
      setError('Failed to save posting group. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditGroup = (index: number) => {
    const groupToEdit = postingGroups[index];
    setFormData({
      code: groupToEdit.code,
      description: groupToEdit.description,
      receivablesAccount: groupToEdit.receivablesAccount,
      paymentTerms: groupToEdit.paymentTerms,
      vatBusinessPostingGroup: groupToEdit.vatBusinessPostingGroup
    });
    setEditingIndex(index);
    setIsAdding(true);
  };

  const handleDeleteGroup = async (index: number) => {
    const groupToDelete = postingGroups[index];
    if (!window.confirm(`Are you sure you want to delete ${groupToDelete.description}?`)) return;
    
    try {
      setIsLoading(true);
      await deletePostingGroup(groupToDelete.code);
      await fetchPostingGroups();
    } catch (err) {
      console.error('Error deleting posting group:', err);
      setError('Failed to delete posting group. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Customer Posting Groups</h1>
        <button 
          onClick={() => {
            setFormData({
              description: '',
              receivablesAccount: '',
              paymentTerms: '',
              vatBusinessPostingGroup: ''
            });
            setEditingIndex(null);
            setIsAdding(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          New Posting Group
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingIndex !== null ? 'Edit Posting Group' : 'New Posting Group'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">Code *</label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="e.g., DOMESTIC"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description *</label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="e.g., Domestic Customers"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="receivablesAccount" className="block text-sm font-medium text-gray-700">Receivables Account</label>
                <input
                  type="text"
                  id="receivablesAccount"
                  name="receivablesAccount"
                  value={formData.receivablesAccount}
                  onChange={handleInputChange}
                  placeholder="e.g., 1100"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="paymentTerms" className="block text-sm font-medium text-gray-700">Payment Terms</label>
                <input
                  type="text"
                  id="paymentTerms"
                  name="paymentTerms"
                  value={formData.paymentTerms}
                  onChange={handleInputChange}
                  placeholder="e.g., NET 30"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="vatBusinessPostingGroup" className="block text-sm font-medium text-gray-700">VAT Business Posting Group</label>
                <input
                  type="text"
                  id="vatBusinessPostingGroup"
                  name="vatBusinessPostingGroup"
                  value={formData.vatBusinessPostingGroup}
                  onChange={handleInputChange}
                  placeholder="e.g., DOMESTIC"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="flex space-x-2 mt-6">
              <button 
                onClick={handleAddGroup}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2"
              >
                <Save className="mr-2 h-4 w-4" />
                {editingIndex !== null ? 'Update' : 'Save'}
              </button>
              <button 
                onClick={() => {
                  setIsAdding(false);
                  setEditingIndex(null);
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Posting Groups</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
              <span className="ml-2 text-gray-500">Loading posting groups...</span>
            </div>
          ) : postingGroups.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No posting groups</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new posting group.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Receivables Account
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Terms
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {postingGroups.map((group, index) => (
                    <tr key={group.code} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {group.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {group.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {group.receivablesAccount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {group.paymentTerms}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditGroup(index)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                          disabled={isLoading}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteGroup(index)}
                          className="text-red-600 hover:text-red-900"
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerPostingGroups;
