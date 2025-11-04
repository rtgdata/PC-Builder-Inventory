
export type ProductCategory = 'CPU' | 'GPU' | 'RAM' | 'Motherboard' | 'Storage' | 'PSU' | 'Case' | 'Custom PC' | 'Other';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  quantity: number;
  isSerialized: boolean;
  sku: string;
}

export type SerializedItemStatus = 'In Stock' | 'Used in Build' | 'Sold' | 'Returned';

export interface SerializedItem {
  id: string;
  productId: string;
  serialNumber: string;
  status: SerializedItemStatus;
}

export interface PCBuild {
  id: string;
  pcProductId: string;
  name: string;
  serialNumber: string;
  componentIds: string[]; // List of SerializedItem IDs or Product IDs
  customerId?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export type ToastMessage = {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
};