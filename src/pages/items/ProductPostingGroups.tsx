import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

interface PostingGroup {
  code: string;
  description: string;
  inventoryAccount: string;
  cogsAccount: string;
}

const ProductPostingGroups: React.FC = () => {
  const [postingGroups, setPostingGroups] = useState<PostingGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPostingGroups([
        {
          code: 'RESALE',
          description: 'Resale Items',
          inventoryAccount: '1410',
          cogsAccount: '5110'
        },
        {
          code: 'RETAIL',
          description: 'Retail Items',
          inventoryAccount: '1420',
          cogsAccount: '5120'
        }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return <div className="p-4">Loading posting groups...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Posting Groups</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center">
          <FiPlus className="mr-2" />
          New Posting Group
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inventory Account</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">COGS Account</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {postingGroups.map((group) => (
              <tr key={group.code} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {group.code}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{group.description}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{group.inventoryAccount}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{group.cogsAccount}</td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                    <FiEdit2 className="inline" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <FiTrash2 className="inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductPostingGroups;