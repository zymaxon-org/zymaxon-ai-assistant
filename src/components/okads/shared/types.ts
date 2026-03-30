export interface OkadsCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface OkadsProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_price: number | null;
  image_url: string | null;
  category_id: string | null;
  weight_unit: string;
  in_stock: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
  okads_categories?: OkadsCategory;
}

export interface OkadsCartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  okads_products?: OkadsProduct;
}

export interface OkadsCustomer {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
}

export interface OkadsOrder {
  id: string;
  customer_id: string | null;
  user_id: string;
  order_number: string;
  status: string;
  total: number;
  delivery_fee: number;
  delivery_address: string;
  payment_reference: string | null;
  created_at: string;
  updated_at: string;
}

export interface OkadsOrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
}

export interface LocalCartItem {
  product_id: string;
  quantity: number;
  product?: OkadsProduct;
}
