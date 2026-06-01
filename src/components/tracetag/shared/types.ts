export type TTRole = 'user' | 'dealer' | 'admin';
export type TTItemStatus = 'clean' | 'stolen' | 'recovered' | 'transferred';
export type TTAccountType = 'individual' | 'dealer' | 'business' | 'admin';

export interface TTItem {
  id: string;
  owner_id: string;
  item_name: string;
  item_category: string;
  brand: string | null;
  model: string | null;
  color: string | null;
  serial_number: string | null;
  imei_1: string | null;
  imei_2: string | null;
  vin: string | null;
  plate_number: string | null;
  engine_number: string | null;
  frame_number: string | null;
  chassis_number: string | null;
  mac_address: string | null;
  kva_rating: string | null;
  screen_size: string | null;
  additional_identifiers: string | null;
  purchase_date: string | null;
  purchase_price: number | null;
  purchase_location: string | null;
  item_photos: string[];
  vivesa_asset_id: string;
  qr_url: string | null;
  status: TTItemStatus;
  created_at: string;
  updated_at: string;
}

export const ITEM_CATEGORIES = [
  { id: 'phone', label: 'Phone', emoji: '📱' },
  { id: 'laptop', label: 'Laptop', emoji: '💻' },
  { id: 'car', label: 'Car', emoji: '🚗' },
  { id: 'motorcycle', label: 'Motorcycle', emoji: '🏍️' },
  { id: 'generator', label: 'Generator', emoji: '⚡' },
  { id: 'tv', label: 'TV', emoji: '📺' },
  { id: 'jewelry', label: 'Jewelry', emoji: '💍' },
  { id: 'other', label: 'Other', emoji: '📦' },
] as const;

export const NIGERIAN_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
  'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT','Gombe','Imo',
  'Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa',
  'Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba',
  'Yobe','Zamfara',
];

export const SELLER_PLATFORMS = [
  'Jiji','Facebook Marketplace','Instagram','WhatsApp','Computer Village',
  'Alaba Market','Ikeja Market','Other online','Other physical market',
];

export const CIRCUMSTANCES = [
  'Armed robbery','Pickpocketing','Burglary','Carjacking','Bag snatching',
  'Lost','Fraud','Other',
];
