// src/pages/ItemPage.tsx
import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getItem } from '../services/bcApiService';

interface Item {
  No: string;
  Description: string;
  Unit_Price: number;
  Unit_Cost: number;
  Inventory: number;
  Base_Unit_of_Measure: string;
  Item_Category_Code: string;
  Last_Direct_Cost: number;
  Category?: string;
  Location?: string;
  ItemTrackingCode?: string;
  ReplenishmentSystem?: string;
  CostingMethod?: string;
  StandardCost?: number;
  VendorNo?: string;
  VendorItemNo?: string;
  Blocked?: boolean;
  BlockedText?: string;
  ItemDiscGroup?: string;
  AllowInvoiceDisc?: boolean;
  InventoryValue?: number;
  CostIsAdjusted?: boolean;
  LastDateModified?: string;
  Created?: string;
  LastDateTimeModified?: string;
  Type?: string;
  // Aliases for backward compatibility
  UnitPrice: number;
  UnitCost: number;
  UnitOfMeasure: string;
  ItemCategoryCode: string;
  LastDirectCost: number;
  BaseUnitOfMeasure: string;
}

interface ItemFilters {
  availability: 'all' | 'in-stock' | 'out-of-stock';
  location: string;
  category: string;
}

export default function ItemPage() {
  const { itemNumber } = useParams<{ itemNumber: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('general');
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ItemFilters>({
    availability: 'all',
    location: '',
    category: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [locations, setLocations] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null || isNaN(value)) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  useEffect(() => {
    const fetchItemDetails = async () => {
      if (!itemNumber) {
        setError('No item number provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log(`Fetching item ${itemNumber}...`);
        const data = await getItem(itemNumber);
        console.log('Item data received:', data);
        
        // Map the data to include all required fields with proper defaults
        const itemData: Item = {
          ...data,
          Inventory: data.Inventory || 0, // Ensure Inventory is always a number
          UnitPrice: data.Unit_Price,
          UnitCost: data.Unit_Cost,
          UnitOfMeasure: data.Base_Unit_of_Measure,
          ItemCategoryCode: data.Item_Category_Code,
          LastDirectCost: data.Last_Direct_Cost || 0,
          Last_Direct_Cost: data.Last_Direct_Cost || 0,
          BaseUnitOfMeasure: data.Base_Unit_of_Measure
        };
        
        setItem(itemData);
        
        // Create sample items for demonstration
        const sampleItems: Item[] = [
          {
            ...itemData,
            Location: 'MAIN',
            Category: 'CAT1'
          },
          {
            ...itemData,
            No: `${itemData.No}-01`,
            Location: 'WEST',
            Inventory: 0,
            Category: 'CAT2'
          }
        ];
        
        setItems(sampleItems);
        const uniqueLocations = [...new Set(sampleItems.map(i => i.Location).filter(Boolean))] as string[];
        const uniqueCategories = [...new Set(sampleItems.map(i => i.Category).filter(Boolean))] as string[];
        setLocations(uniqueLocations);
        setCategories(uniqueCategories);
      } catch (err: any) {
        console.error('Error in fetchItemDetails:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load item details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [itemNumber]);

  const handleFilterChange = (filterName: keyof ItemFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      availability: 'all',
      location: '',
      category: '',
    });
  };

  // Filter items based on current filters
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Availability filter
      const matchesAvailability = 
        filters.availability === 'all' ||
        (filters.availability === 'in-stock' && item.Inventory > 0) ||
        (filters.availability === 'out-of-stock' && (!item.Inventory || item.Inventory <= 0));
      
      // Location filter
      const matchesLocation = !filters.location || item.Location === filters.location;
      
      // Category filter
      const matchesCategory = !filters.category || item.Category === filters.category;
      
      return matchesAvailability && matchesLocation && matchesCategory;
    });
  }, [items, filters]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading item details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={() => navigate(-1)} 
            className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Item not found</p>
          <button 
            onClick={() => navigate('/items')} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Items
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold">
            {item.Description} ({item.No})
          </h1>
          <div className="flex space-x-2">
            <Link
              to={`/items/${item.No}/ledger-entries`}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              View Ledger Entries
            </Link>
            <button 
              onClick={() => navigate(-1)} 
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Back
            </button>
          </div>
        </div>
        <div className="flex space-x-4 text-sm text-gray-600">
          <span>Inventory: {(item.Inventory || 0).toLocaleString()} {item.UnitOfMeasure || 'PCS'}</span>
          <span>Base Unit of Measure: {item.BaseUnitOfMeasure || 'PCS'}</span>
          <span>Item Category: {item.ItemCategoryCode || 'N/A'}</span>
        </div>
      </div>

      {/* Filter Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Item Ledger Entries</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-0.5 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Availability Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                <div className="space-y-2 mt-1">
                  <div className="flex items-center">
                    <input
                      id="all-items"
                      name="availability"
                      type="radio"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      checked={filters.availability === 'all'}
                      onChange={() => handleFilterChange('availability', 'all')}
                    />
                    <label htmlFor="all-items" className="ml-2 block text-sm text-gray-900">
                      All Items
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="in-stock"
                      name="availability"
                      type="radio"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      checked={filters.availability === 'in-stock'}
                      onChange={() => handleFilterChange('availability', 'in-stock')}
                    />
                    <label htmlFor="in-stock" className="ml-2 block text-sm text-gray-900">
                      In Stock
                    </label>
                    <span className="ml-2 text-xs text-gray-500">
                      ({items.filter(i => i.Inventory > 0).length})
                    </span>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="out-of-stock"
                      name="availability"
                      type="radio"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      checked={filters.availability === 'out-of-stock'}
                      onChange={() => handleFilterChange('availability', 'out-of-stock')}
                    />
                    <label htmlFor="out-of-stock" className="ml-2 block text-sm text-gray-900">
                      Out of Stock
                    </label>
                    <span className="ml-2 text-xs text-gray-500">
                      ({items.filter(i => !i.Inventory || i.Inventory <= 0).length})
                    </span>
                  </div>
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">All Locations</option>
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap items-center gap-2">
                {filters.availability !== 'all' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {filters.availability === 'in-stock' ? 'In Stock' : 'Out of Stock'}
                    <button
                      onClick={() => handleFilterChange('availability', 'all')}
                      className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                    >
                      <span className="sr-only">Remove filter</span>
                      <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                        <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                      </svg>
                    </button>
                  </span>
                )}

                {filters.location && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Location: {filters.location}
                    <button
                      onClick={() => handleFilterChange('location', '')}
                      className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-green-400 hover:bg-green-200 hover:text-green-500 focus:outline-none"
                    >
                      <span className="sr-only">Remove filter</span>
                      <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                        <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                      </svg>
                    </button>
                  </span>
                )}

                {filters.category && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Category: {filters.category}
                    <button
                      onClick={() => handleFilterChange('category', '')}
                      className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-purple-400 hover:bg-purple-200 hover:text-purple-500 focus:outline-none"
                    >
                      <span className="sr-only">Remove filter</span>
                      <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                        <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                      </svg>
                    </button>
                  </span>
                )}

                {(filters.availability !== 'all' || filters.location || filters.category) && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Item Ledger Entries Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entry No.</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posting Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document No.</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining Quantity</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Cost Amount (Actual)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.length > 0 ? (
                  filteredItems.map((entry: Item, index: number) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.No}-{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date().toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.No}-DOC</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{entry.Description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                        {entry.Inventory.toLocaleString()} {entry.UnitOfMeasure || 'PCS'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                        {entry.Inventory.toLocaleString()} {entry.UnitOfMeasure || 'PCS'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                        {formatCurrency(entry.UnitCost * entry.Inventory)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      No ledger entries found matching the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Rest of your existing tabs and content */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'general'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'inventory'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Inventory
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'pricing'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Pricing
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {activeTab === 'general' && (
          <div className="px-4 py-5 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* General tab content */}
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="px-4 py-5 sm:px-6">
            {/* Inventory tab content */}
          </div>
        )}
      </div>
    </div>
  );
}