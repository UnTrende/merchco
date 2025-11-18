
import React from 'react';
// FIX: Import `Product` type to extend the `Status` type.
import { Order, CustomRequest, Product } from '../types';

// FIX: Extended `Status` to include product status.
type Status = Order['orderStatus'] | Order['paymentStatus'] | CustomRequest['status'] | Product['status'];

interface BadgeProps {
  status: Status;
  children: React.ReactNode;
}

// FIX: Updated keys to match the actual type definitions for statuses.
const statusColors: Record<Status, string> = {
  // Order Status
  'received': 'bg-yellow-100 text-yellow-800',
  'in_review': 'bg-blue-100 text-blue-800',
  'in_packing': 'bg-blue-100 text-blue-800',
  'ready_for_dispatch': 'bg-blue-100 text-blue-800',
  'shipped': 'bg-indigo-100 text-indigo-800',
  'out_for_delivery': 'bg-indigo-100 text-indigo-800',
  'delivered': 'bg-green-100 text-green-800',
  'cancelled': 'bg-gray-100 text-gray-800',
  
  // Payment Status
  'paid': 'bg-green-100 text-green-800',
  'unpaid': 'bg-red-100 text-red-800',
  
  // Custom Request Status
  'new': 'bg-yellow-100 text-yellow-800',
  'in_progress': 'bg-blue-100 text-blue-800',
  'preview_sent': 'bg-indigo-100 text-indigo-800',
  'approved': 'bg-green-100 text-green-800',
  'rejected': 'bg-red-100 text-red-800',
  'completed': 'bg-purple-100 text-purple-800',

  // Product Status
  'active': 'bg-green-100 text-green-800',
  'inactive': 'bg-gray-100 text-gray-800',
};

const Badge: React.FC<BadgeProps> = ({ status, children }) => {
  const colorClass = statusColors[status] || 'bg-gray-100 text-gray-800';
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {children}
    </span>
  );
};

export default Badge;
