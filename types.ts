
export interface User {
  id: string;
  name?: string;
  email: string;
  address?: string;
  city?: string;
  postalCode?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'staff' | 'designer';
  status: 'active' | 'disabled';
}

export interface ProductImage {
  id: string;
  imageUrl: string;
  sortOrder: number;
  file?: File; // Added for frontend handling of uploads
}

export interface ProductVariant {
  id: string;
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  color: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  salePrice?: number;
  category: 'Men' | 'Women' | 'Children';
  collections: string[];
  status: 'active' | 'inactive';
  isNew: boolean;
  isBestSeller: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  variant: ProductVariant;
  quantity: number;
  price: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
}

export interface OrderStatusHistory {
    id: string;
    status: Order['orderStatus'];
    timestamp: string;
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  deliveryFee: number;
  paymentMethod: 'COD';
  paymentStatus: 'unpaid' | 'paid';
  orderStatus: 'received' | 'in_review' | 'in_packing' | 'ready_for_dispatch' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
  name: string;
  phone: string; // Shipping phone number
  customerEmail: string;
  address: string;
  city: string;
  postalCode: string;
  createdAt: string;
  items: OrderItem[];
  history: OrderStatusHistory[];
}


export interface CustomRequestHistory {
    id: string;
    status: CustomRequest['status'];
    timestamp: string;
}

export interface CustomRequest {
  id: string;
  userId: string;
  color: string;
  size: string;
  placement: 'front' | 'back' | 'both';
  description: string;
  imageUrl?: string;
  previewImageUrl?: string;
  status: 'new' | 'in_progress' | 'preview_sent' | 'approved' | 'completed' | 'rejected';
  createdAt: string;
  customerName: string; // From join with users table
  history: CustomRequestHistory[];
}

export interface Customer { // This can be a simplified view of the User
  id: string;
  name: string;
  email: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
}

export interface Address {
    name: string;
    phone: string;
    addressLine: string;
    city: string;
    postalCode: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  showOnHome: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  relatedType: 'order' | 'custom_request';
  relatedId: string;
  isRead: boolean;
  createdAt: string;
}

export interface Log {
    id: string;
    adminId: string;
    adminName: string; // for convenience
    action: string;
    details: string;
    createdAt: string;
}

export interface HeroSlide {
    id: string;
    imageUrl: string;
    title: string;
    subtitle: string;
    link: string;
    isActive: boolean;
}

export interface StoreSettings {
    storeName: string;
    logoUrl: string;
    contactPhone: string;
    address: string;
    currency: string;
    announcementBarText?: string; // Added
}

export interface DeliverySettings {
    baseFee: number;
    freeAbove: number;
    deliveryText: string;
}