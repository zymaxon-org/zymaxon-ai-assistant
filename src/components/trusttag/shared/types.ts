export type TTRole = 'user' | 'manufacturer' | 'admin';

export interface TTProfile {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  country: string | null;
}

export interface TTItem {
  id: string;
  owner_id: string;
  product_id: string | null;
  name: string;
  category: string;
  brand: string;
  model: string;
  serial_number: string;
  purchase_date: string | null;
  description: string;
  photos: string[];
  status: 'active' | 'lost' | 'recovered' | 'transferred';
  created_at: string;
}

export interface TTQRCode {
  id: string;
  token: string;
  item_id: string | null;
  product_id: string | null;
  batch_id: string | null;
  scan_count: number;
  created_at: string;
}

export interface TTManufacturer {
  id: string;
  user_id: string;
  company_name: string;
  website: string;
  logo_url: string | null;
  description: string;
  verified: boolean;
  verification_status: string;
  created_at: string;
}

export interface TTProduct {
  id: string;
  manufacturer_id: string;
  name: string;
  category: string;
  model: string;
  description: string;
  image_url: string | null;
  warranty_months: number;
  created_at: string;
}

export interface TTNotification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  link: string;
  read: boolean;
  created_at: string;
}

export const ITEM_CATEGORIES = [
  'Phone', 'Laptop', 'Tablet', 'Watch', 'Jewelry',
  'Bag', 'Vehicle', 'Document', 'Electronics', 'Other',
];
