import React, { useState, useEffect } from 'react';
import { FileText, Loader2, ChevronRight, Eye, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  getAllCustomerTemplates,
  type CustomerTemplate
} from '../services/customerTemplateService';

type CustomerTemplateWithDate = CustomerTemplate & {
  lastModified?: string;
};

const CustomerTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<CustomerTemplateWithDate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setIsLoading(true);

        const data = await getAllCustomerTemplates();

        setTemplates(
          data.value.map((t: CustomerTemplate) => ({
            ...t,
            lastModified: new Date().toISOString()
          }))
        );

        setError(null);
      } catch (err: any) {
        console.error('Failed to load templates:', err);
        setError('Failed to load customer templates.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2">Loading templates...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Customer Templates</h1>
      <p className="text-sm text-gray-500 mb-6">
        Templates available for customer creation
      </p>

      <div className="bg-white shadow rounded-lg">
        {templates.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {templates.map(template => (
              <li key={template.code} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-center">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {template.description}
                      </p>
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      <span className="mr-4">
                        <strong>Code:</strong> {template.code}
                      </span>
                      <span>
                        <strong>Type:</strong> {template.contactType}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-sm text-gray-400">
                      {new Date(template.lastModified!).toLocaleDateString()}
                    </div>
                    
                    <div className="flex space-x-2">
<Link
  to={`/customers/templates/${encodeURIComponent(template.code)}`}
  className="p-1.5 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50"
  title="View details"
>
  <Eye className="h-4 w-4" />
</Link>

                      
<Link
  to={`/customers/templates/${encodeURIComponent(template.code)}/edit`}
  className="p-1.5 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50"
  title="Edit template"
>
  <Pencil className="h-4 w-4" />
</Link>

                    </div>
                    
                    <Link
  to={`/customers/templates/${encodeURIComponent(template.code)}`}
  className="ml-2 text-gray-400 hover:text-gray-600"
>
  <ChevronRight className="h-5 w-5" />
</Link>

                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-gray-500">No customer templates found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerTemplates;
