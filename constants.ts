
import { Product, Order, CustomRequest, Customer, Collection, Notification, Log, HeroSlide, StoreSettings, DeliverySettings } from './types';

export const MOCK_PRODUCTS: Product[] = [
  { 
    id: '1', name: 'Classic Crew Neck T-Shirt', description: 'A timeless classic, this crew neck t-shirt is made from 100% premium cotton.', 
    basePrice: 29.99, category: "Men", collections: ['1'], status: 'active', isNew: true, isBestSeller: true,
    images: [
      { id: 'img1', imageUrl: 'https://picsum.photos/id/10/800/800', sortOrder: 1 },
      { id: 'img2', imageUrl: 'https://picsum.photos/id/11/800/800', sortOrder: 2 },
    ],
    variants: [
      { id: 'v1', size: 'M', color: '#000000', stock: 50 },
      { id: 'v2', size: 'L', color: '#000000', stock: 30 },
      { id: 'v3', size: 'M', color: '#FFFFFF', stock: 45 },
    ]
  },
  { 
    id: '2', name: 'V-Neck Cotton Tee', description: 'A stylish V-neck made with a soft cotton blend for ultimate comfort.', 
    basePrice: 34.99, salePrice: 29.99, category: "Women", collections: ['2'], status: 'active', isNew: false, isBestSeller: true,
    images: [
      { id: 'img3', imageUrl: 'https://picsum.photos/id/20/800/800', sortOrder: 1 },
      { id: 'img4', imageUrl: 'https://picsum.photos/id/21/800/800', sortOrder: 2 },
    ],
    variants: [
      { id: 'v4', size: 'S', color: '#EF4444', stock: 25 },
      { id: 'v5', size: 'M', color: '#EF4444', stock: 0 },
      { id: 'v6', size: 'S', color: '#F59E0B', stock: 30 },
    ]
  },
  { 
    id: '3', name: 'Kids Graphic T-Shirt', description: 'Fun and durable graphic tee for kids, made from playground-proof cotton.', 
    basePrice: 19.99, category: "Children", collections: [], status: 'active', isNew: true, isBestSeller: false,
    images: [
      { id: 'img5', imageUrl: 'https://picsum.photos/id/30/800/800', sortOrder: 1 },
    ],
    variants: [
      { id: 'v7', size: 'S', color: '#3B82F6', stock: 100 },
      { id: 'v8', size: 'M', color: '#EC4899', stock: 120 },
    ]
  },
   { 
    id: '4', name: 'Long Sleeve Henley', description: 'A versatile long sleeve henley perfect for layering.', 
    basePrice: 45.00, category: "Men", collections: ['1'], status: 'active', isNew: false, isBestSeller: false,
    images: [
      { id: 'img6', imageUrl: 'https://picsum.photos/id/40/800/800', sortOrder: 1 },
    ],
    variants: [
      { id: 'v9', size: 'L', color: '#1F2937', stock: 60 },
      { id: 'v10', size: 'XL', color: '#1F2937', stock: 40 },
    ]
  },
];

export const MOCK_ORDERS: Order[] = [
    { 
      id: 'ORD-001', userId: 'CUST-001', totalAmount: 64.98, deliveryFee: 5.00, paymentMethod: 'COD', paymentStatus: 'paid', orderStatus: 'delivered', 
      name: 'John Doe', phone: '123-456-7890', customerEmail: 'john.doe@example.com', address: '123 Main St', city: 'Anytown', postalCode: '12345', createdAt: '2023-10-24',
      items: [
        { id: 'oi1', productId: '1', productName: 'Classic Crew Neck T-Shirt', productImage: 'https://picsum.photos/id/10/100/100', size: 'M', color: '#000000', price: 29.99, quantity: 2 },
      ],
      history: [
        { id: 'h1', status: 'delivered', timestamp: '2023-10-26 14:30:00' },
        { id: 'h2', status: 'shipped', timestamp: '2023-10-25 11:00:00' },
        { id: 'h3', status: 'received', timestamp: '2023-10-24 09:10:00' },
      ]
    },
    { 
      id: 'ORD-002', userId: 'CUST-002', totalAmount: 34.99, deliveryFee: 5.00, paymentMethod: 'COD', paymentStatus: 'paid', orderStatus: 'shipped', 
      name: 'Jane Smith', phone: '123-456-7890', customerEmail: 'jane.smith@example.com', address: '456 Oak Ave', city: 'Somecity', postalCode: '67890', createdAt: '2023-10-25',
      items: [
         { id: 'oi2', productId: '2', productName: 'V-Neck Cotton Tee', productImage: 'https://picsum.photos/id/20/100/100', size: 'S', color: '#EF4444', price: 29.99, quantity: 1 },
      ],
      history: [
        { id: 'h4', status: 'shipped', timestamp: '2023-10-25 17:00:00' },
        { id: 'h5', status: 'received', timestamp: '2023-10-25 10:20:00' },
      ]
    },
];

export const MOCK_CUSTOM_REQUESTS: CustomRequest[] = [
    { 
      id: 'REQ-001', userId: 'CUST-001', customerName: 'Alice Williams', color: 'Royal Blue', size: 'L', placement: 'back', status: 'approved', createdAt: '2023-10-22',
      description: 'A phoenix rising from ashes on the back.',
      history: [
          {id: 'crh1', status: 'approved', timestamp: '2023-10-24'},
          {id: 'crh2', status: 'preview_sent', timestamp: '2023-10-23'},
          {id: 'crh3', status: 'new', timestamp: '2023-10-22'},
      ]
    },
    { 
      id: 'REQ-002', userId: 'CUST-002', customerName: 'Charlie Brown', color: 'Black', size: 'XL', placement: 'front', status: 'new', createdAt: '2023-10-21', 
      description: 'Company logo on the front-left chest.',
      history: [
           {id: 'crh4', status: 'new', timestamp: '2023-10-21'},
      ]
    },
];

export const MOCK_CUSTOMERS: Customer[] = [
    { id: 'CUST-001', name: 'John Doe', email: 'john.doe@example.com', ordersCount: 5, totalSpent: 345.50, lastOrderDate: '2023-10-26' },
    { id: 'CUST-002', name: 'Jane Smith', email: 'jane.smith@example.com', ordersCount: 2, totalSpent: 89.98, lastOrderDate: '2023-10-25' },
];

export const MOCK_COLLECTIONS: Collection[] = [
    { id: '1', name: 'Fall Collection 2023', description: 'Cozy and stylish tees for the autumn season.', imageUrl: 'https://picsum.photos/id/101/600/300', showOnHome: true },
    { id: '2', name: 'Summer Vibes', description: 'Bright and fun designs to celebrate summer.', imageUrl: 'https://picsum.photos/id/102/600/300', showOnHome: false },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
    { id: '1', userId: 'CUST-001', title: 'Order Shipped', message: 'Your order #ORD-002 has been shipped.', relatedType: 'order', relatedId: 'ORD-002', createdAt: '2 hours ago', isRead: false },
    { id: '2', userId: 'CUST-001', title: 'Flash Sale!', message: 'Get 20% off all items for the next 24 hours.', relatedType: 'custom_request', relatedId: 'REQ-001', createdAt: '1 day ago', isRead: false },
    { id: '3', userId: 'CUST-001', title: 'Request Approved', message: 'Your custom request #REQ-001 has been approved.', relatedType: 'custom_request', relatedId: 'REQ-001', createdAt: '3 days ago', isRead: true },
];

export const MOCK_LOGS: Log[] = [
    { id: '1', createdAt: '2023-10-27 10:05:14', adminId: '1', adminName: 'Admin User', action: 'Updated Product', details: 'Product ID: 2, Name: V-Neck Cotton Tee' },
    { id: '2', createdAt: '2023-10-27 09:45:02', adminId: '1', adminName: 'Admin User', action: 'Updated Order Status', details: 'Order ID: ORD-002, Status: Shipped' },
    { id: '3', createdAt: '2023-10-26 15:20:33', adminId: '2', adminName: 'Super Admin', action: 'Created Collection', details: 'Collection: Holiday Specials' },
];

export const SALES_DATA = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
];

export const MOCK_HERO_SLIDES: HeroSlide[] = [
    { id: '1', imageUrl: 'https://picsum.photos/id/1018/1200/500', title: 'Style That Speaks', subtitle: 'Discover premium quality merch and create your own unique designs with ease.', link: '/shop', isActive: true },
    { id: '2', imageUrl: 'https://picsum.photos/id/102/1200/500', title: 'New Fall Collection', subtitle: 'Cozy up with our latest autumn-inspired designs.', link: '/shop/collections/1', isActive: true },
    { id: '3', imageUrl: 'https://picsum.photos/id/1040/1200/500', title: 'Create Your Own', subtitle: 'Bring your ideas to life with our custom t-shirt designer.', link: '/custom-tshirt', isActive: true },
];


export const MOCK_STORE_SETTINGS: StoreSettings = {
    storeName: "MerchCo",
    logoUrl: "",
    contactPhone: "555-123-4567",
    address: "123 Merch Lane, Style City, 12345",
    currency: "USD",
};

export const MOCK_DELIVERY_SETTINGS: DeliverySettings = {
    baseFee: 5.00,
    freeAbove: 50.00,
    deliveryText: "Standard delivery: 3-5 business days."
};
