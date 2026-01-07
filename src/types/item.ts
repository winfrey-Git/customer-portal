export interface Item {
  id: string;
  number: string;
  displayName: string;
  type: 'Inventory' | 'Service' | 'Non-Inventory' | string;
  itemCategoryId: string;
  itemCategoryCode: string;
  itemCategoryDisplayName: string;
  baseUnitOfMeasureId: string;
  baseUnitOfMeasure: {
    code: string;
    displayName: string;
  };
  gtin: string;
  inventory: number;
  unitPrice: number;
  priceIncludesTax: boolean;
  unitCost: number;
  taxGroupId: string;
  taxGroupCode: string;
  blocked: boolean;
  lastModifiedDateTime: string;
  description?: string;
  vendorNo?: string;
  vendorItemNo?: string;
  imageUrl?: string;
}

export interface ItemListResponse {
  value: Item[];
}
