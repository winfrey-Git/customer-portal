import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, FileText, Loader2, Edit, Trash2, Users, User, Building2 } from 'lucide-react';
import { getCustomerTemplateByCode } from '../services/customerTemplateService';
import type { CustomerTemplate } from '../services/customerTemplateService';

const CustomerTemplateDetail: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<CustomerTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplate = async () => {
      if (!code) return;
      
      try {
        setLoading(true);
        const data = await getCustomerTemplateByCode(code);
        setTemplate(data);
        setError(null);
      } catch (err: any) {
        console.error('Failed to load template:', err);
        setError('Failed to load customer template details.');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [code]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2">Loading template details...</span>
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

  if (!template) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-gray-500">Template not found</p>
        <Link
          to="/customer-templates"
          className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Templates
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link
          to="/customer-templates"
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Templates
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {template.description}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Template Code: {template.code}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => navigate(`/customer-templates/${template.code}/edit`)}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </button>
              <button className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                  {template.contactType === 'Company' ? (
                    <Building2 className="h-5 w-5" />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-500">Contact Type</h3>
                  <p className="text-sm font-medium text-gray-900 capitalize">
                    {template.contactType.toLowerCase()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-green-100 text-green-600">
                  <Users className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-500">Template Usage</h3>
                  <p className="text-sm font-medium text-gray-900">
                    Used by 24 customers
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Template Details</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                This template is used when creating new customers of type <span className="font-medium">{template.contactType}</span>.
                It includes default settings and configurations that will be applied to all customers created with this template.
              </p>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Default Settings:</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                  <li>Default payment terms</li>
                  <li>Standard credit limit</li>
                  <li>Default currency settings</li>
                  <li>Standard tax settings</li>
                  <li>Default price group</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerTemplateDetail;
