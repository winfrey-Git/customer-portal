import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Pencil, Save, Loader2 } from 'lucide-react';
import type { PaymentTerm } from '@/services/paymentTermService';
import { 
  getPaymentTerms, 
  createPaymentTerm, 
  updatePaymentTerm, 
  deletePaymentTerm 
} from '@/services/paymentTermService';

const PaymentTerms: React.FC = () => {
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<PaymentTerm>({
    code: '',
    description: '',
    dueDateCalculation: '',
    discountDateCalculation: '',
    discountPercent: 0
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'discountPercent' ? parseFloat(value) || 0 : value
    }));
  };

  useEffect(() => {
    const fetchPaymentTerms = async () => {
      try {
        setIsLoading(true);
        const data = await getPaymentTerms();
        setPaymentTerms(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch payment terms:', err);
        setError('Failed to load payment terms. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentTerms();
  }, []);

  const handleAddTerm = async () => {
    if (!formData.code || !formData.description || !formData.dueDateCalculation) return;
    
    try {
      setIsLoading(true);
      
      if (editingIndex !== null) {
        // Update existing term
        const updatedTerm = await updatePaymentTerm(formData.code, formData);
        const updatedTerms = [...paymentTerms];
        updatedTerms[editingIndex] = updatedTerm;
        setPaymentTerms(updatedTerms);
        setEditingIndex(null);
      } else {
        // Add new term
        const newTerm = await createPaymentTerm(formData);
        setPaymentTerms([...paymentTerms, newTerm]);
      }
      
      // Reset form
      setFormData({
        code: '',
        description: '',
        dueDateCalculation: '',
        discountDateCalculation: '',
        discountPercent: 0
      });
      setIsAdding(false);
    } catch (err) {
      console.error('Error saving payment term:', err);
      setError('Failed to save payment term. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTerm = (index: number) => {
    const termToEdit = paymentTerms[index];
    setFormData({
      code: termToEdit.code,
      description: termToEdit.description,
      dueDateCalculation: termToEdit.dueDateCalculation,
      discountDateCalculation: termToEdit.discountDateCalculation || '',
      discountPercent: termToEdit.discountPercent || 0
    });
    setEditingIndex(index);
    setIsAdding(true);
  };

  const handleDeleteTerm = async (index: number) => {
    const termToDelete = paymentTerms[index];
    if (!window.confirm(`Are you sure you want to delete ${termToDelete.description}?`)) return;
    
    try {
      setIsLoading(true);
      await deletePaymentTerm(termToDelete.code);
      setPaymentTerms(paymentTerms.filter((_, i) => i !== index));
    } catch (err) {
      console.error('Error deleting payment term:', err);
      setError('Failed to delete payment term. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Payment Terms</h1>
        <Button onClick={() => {
          setFormData({
            code: '',
            description: '',
            dueDateCalculation: '',
            discountDateCalculation: '',
            discountPercent: 0
          });
          setEditingIndex(null);
          setIsAdding(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          New Payment Term
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingIndex !== null ? 'Edit Payment Term' : 'New Payment Term'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Code *</Label>
                <Input
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="e.g., NET30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="e.g., Net 30 Days"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDateCalculation">Due Date Calculation *</Label>
                <Input
                  id="dueDateCalculation"
                  name="dueDateCalculation"
                  value={formData.dueDateCalculation}
                  onChange={handleInputChange}
                  placeholder="e.g., 30D (for 30 days)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountDateCalculation">Discount Date Calculation (optional)</Label>
                <Input
                  id="discountDateCalculation"
                  name="discountDateCalculation"
                  value={formData.discountDateCalculation || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., 10D (for 10 days)"
                />
              </div>
              {formData.discountDateCalculation && (
                <div className="space-y-2">
                  <Label htmlFor="discountPercent">Discount % (if applicable)</Label>
                  <Input
                    type="number"
                    id="discountPercent"
                    name="discountPercent"
                    value={formData.discountPercent}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="e.g., 2"
                  />
                </div>
              )}
            </div>
            <div className="flex space-x-2 mt-6">
              <Button onClick={handleAddTerm}>
                <Save className="mr-2 h-4 w-4" />
                {editingIndex !== null ? 'Update' : 'Save'}
              </Button>
              <Button variant="outline" onClick={() => {
                setIsAdding(false);
                setEditingIndex(null);
              }}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-4">
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

      <Card>
        <CardHeader>
          <CardTitle>Payment Terms</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
              <span className="ml-2 text-gray-500">Loading payment terms...</span>
            </div>
          ) : paymentTerms.length === 0 ? (
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
              <h3 className="mt-2 text-sm font-medium text-gray-900">No payment terms</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new payment term.</p>
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
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Discount
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paymentTerms.map((term, index) => (
                    <tr key={term.code} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {term.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {term.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {term.dueDateCalculation}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {term.discountPercent ? `${term.discountPercent}% within ${term.discountDateCalculation}` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditTerm(index)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTerm(index)}
                          className="text-red-600 hover:text-red-900"
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

export default PaymentTerms;
