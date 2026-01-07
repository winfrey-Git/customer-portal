import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Pencil, Save } from 'lucide-react';

interface TaxRate {
  code: string;
  description: string;
  rate: number;
  glAccount: string;
  vatBusinessPostingGroup: string;
  vatProductPostingGroup: string;
}

const VatTaxSetup: React.FC = () => {
  const [taxRates, setTaxRates] = useState<TaxRate[]>([
    {
      code: 'VAT20',
      description: 'Standard VAT 20%',
      rate: 20,
      glAccount: '2200',
      vatBusinessPostingGroup: 'DOMESTIC',
      vatProductPostingGroup: 'VAT20'
    },
    {
      code: 'VAT10',
      description: 'Reduced VAT 10%',
      rate: 10,
      glAccount: '2201',
      vatBusinessPostingGroup: 'DOMESTIC',
      vatProductPostingGroup: 'VAT10'
    },
    {
      code: 'VAT0',
      description: 'Zero Rated',
      rate: 0,
      glAccount: '2202',
      vatBusinessPostingGroup: 'EXPORT',
      vatProductPostingGroup: 'VAT0'
    }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<TaxRate>({
    code: '',
    description: '',
    rate: 0,
    glAccount: '',
    vatBusinessPostingGroup: '',
    vatProductPostingGroup: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rate' ? parseFloat(value) || 0 : value
    }));
  };

  const handleAddTaxRate = () => {
    if (!formData.code || !formData.description) return;
    
    if (editingIndex !== null) {
      // Update existing tax rate
      const updatedRates = [...taxRates];
      updatedRates[editingIndex] = formData;
      setTaxRates(updatedRates);
      setEditingIndex(null);
    } else {
      // Add new tax rate
      setTaxRates([...taxRates, formData]);
    }
    
    // Reset form
    setFormData({
      code: '',
      description: '',
      rate: 0,
      glAccount: '',
      vatBusinessPostingGroup: '',
      vatProductPostingGroup: ''
    });
    setIsAdding(false);
  };

  const handleEditTaxRate = (index: number) => {
    setFormData(taxRates[index]);
    setEditingIndex(index);
    setIsAdding(true);
  };

  const handleDeleteTaxRate = (index: number) => {
    setTaxRates(taxRates.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">VAT / Tax Setup</h1>
          <p className="text-sm text-gray-500">
            Configure VAT and tax rates for your organization
          </p>
        </div>
        <Button onClick={() => {
          setFormData({
            code: '',
            description: '',
            rate: 0,
            glAccount: '',
            vatBusinessPostingGroup: '',
            vatProductPostingGroup: ''
          });
          setEditingIndex(null);
          setIsAdding(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          New Tax Rate
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingIndex !== null ? 'Edit Tax Rate' : 'New Tax Rate'}
            </CardTitle>
            <CardDescription>
              Configure the details for this tax rate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Tax Code *</Label>
                <Input
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="e.g., VAT20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="e.g., Standard VAT 20%"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rate">Tax Rate (%) *</Label>
                <Input
                  type="number"
                  id="rate"
                  name="rate"
                  value={formData.rate}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder="e.g., 20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="glAccount">GL Account *</Label>
                <Input
                  id="glAccount"
                  name="glAccount"
                  value={formData.glAccount}
                  onChange={handleInputChange}
                  placeholder="e.g., 2200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vatBusinessPostingGroup">VAT Business Posting Group *</Label>
                <Input
                  id="vatBusinessPostingGroup"
                  name="vatBusinessPostingGroup"
                  value={formData.vatBusinessPostingGroup}
                  onChange={handleInputChange}
                  placeholder="e.g., DOMESTIC"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vatProductPostingGroup">VAT Product Posting Group *</Label>
                <Input
                  id="vatProductPostingGroup"
                  name="vatProductPostingGroup"
                  value={formData.vatProductPostingGroup}
                  onChange={handleInputChange}
                  placeholder="e.g., VAT20"
                />
              </div>
            </div>
            <div className="flex space-x-2 mt-6">
              <Button onClick={handleAddTaxRate}>
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

      <Card>
        <CardHeader>
          <CardTitle>Tax Rates</CardTitle>
          <CardDescription>
            Manage all tax rates and their configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                    Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    GL Account
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business Group
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {taxRates.map((rate, index) => (
                  <tr key={rate.code} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {rate.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {rate.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {rate.rate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {rate.glAccount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {rate.vatBusinessPostingGroup}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditTaxRate(index)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTaxRate(index)}
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
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>VAT Business Posting Groups</CardTitle>
            <CardDescription>
              Manage VAT business posting groups
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium">DOMESTIC</p>
                  <p className="text-sm text-gray-500">Domestic Transactions</p>
                </div>
                <Button variant="outline" size="sm">
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium">EXPORT</p>
                  <p className="text-sm text-gray-500">Export Transactions</p>
                </div>
                <Button variant="outline" size="sm">
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Business Posting Group
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>VAT Product Posting Groups</CardTitle>
            <CardDescription>
              Manage VAT product posting groups
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium">VAT20</p>
                  <p className="text-sm text-gray-500">Standard Rate (20%)</p>
                </div>
                <Button variant="outline" size="sm">
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium">VAT10</p>
                  <p className="text-sm text-gray-500">Reduced Rate (10%)</p>
                </div>
                <Button variant="outline" size="sm">
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium">VAT0</p>
                  <p className="text-sm text-gray-500">Zero Rated (0%)</p>
                </div>
                <Button variant="outline" size="sm">
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Product Posting Group
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VatTaxSetup;
