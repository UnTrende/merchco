
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import { Textarea } from '../../components/Input';
import Spinner from '../../components/Spinner';
import * as api from '../../api/mockApi';
import { Order } from '../../types';

const OrderDetailsAdminPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const fetchOrder = async () => {
    if (!id) return;
    try {
        setLoading(true);
        const response = await api.getOrderById(id);
        if (response.success && response.data) {
             setOrder(response.data);
        }
    } catch (error) {
        console.error("Failed to fetch order", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
      fetchOrder();
  }, [id]);

  const handleStatusUpdate = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!order || !id) return;
      
      const form = e.target as HTMLFormElement;
      const newStatus = (form.elements.namedItem('status') as HTMLSelectElement).value as Order['orderStatus'];
      
      setStatusUpdating(true);
      try {
          await api.updateOrderStatus(id, newStatus);
          alert('Status updated successfully');
          await fetchOrder(); // Refresh to show history
      } catch (error) {
          alert('Failed to update status');
      } finally {
          setStatusUpdating(false);
      }
  };

  if (loading) return <div className="flex justify-center items-center h-96"><Spinner /></div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Order #{order.id.slice(0,8)}</h1>
        <Button variant="outline">Print Invoice</Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            {order.items.map(item => (
                <div key={item.id} className="flex items-center space-x-4 mb-4">
                    <img src={item.productImage} alt={item.productName} className="w-16 h-16 rounded-md object-cover" />
                    <div className="flex-grow">
                        <p className="font-semibold">{item.productName}</p>
                        <p className="text-sm text-text-secondary">Size: {item.size} | Color: {item.color}</p>
                    </div>
                    <p className="text-sm text-text-secondary">{item.quantity} x ${item.price.toFixed(2)}</p>
                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
            ))}
          </Card>
          <Card>
            <h2 className="text-lg font-semibold mb-4">Timeline</h2>
             <ol className="relative border-l border-gray-200">                  
                {order.history.map(event => (
                    <li key={event.id} className="mb-6 ml-4">
                        <div className="absolute w-3 h-3 bg-accent rounded-full mt-1.5 -left-1.5 border border-white"></div>
                        <time className="mb-1 text-sm font-normal leading-none text-gray-400">{new Date(event.timestamp).toLocaleString()}</time>
                        <h3 className="text-base font-semibold text-gray-900 capitalize">Order {event.status.replace('_', ' ')}</h3>
                    </li>
                ))}
            </ol>
          </Card>
        </div>
        <div className="lg:col-span-1 space-y-8">
            <Card>
                <h2 className="text-lg font-semibold mb-4">Order Status</h2>
                 <form onSubmit={handleStatusUpdate}>
                     <select name="status" defaultValue={order.orderStatus} className="w-full h-[46px] rounded-lg border-border focus:ring-accent focus:border-accent">
                        <option value="received">Received</option>
                        <option value="in_packing">In Packing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <Button type="submit" className="w-full mt-4" disabled={statusUpdating}>{statusUpdating ? 'Updating...' : 'Update Status'}</Button>
                </form>
            </Card>
            <Card>
                <h2 className="text-lg font-semibold mb-4">Customer Info</h2>
                <p className="font-semibold">{order.name}</p>
                <a href={`mailto:${order.customerEmail}`} className="text-sm text-accent block mb-1">{order.customerEmail}</a>
                <p className="text-sm text-text-secondary">{order.phone}</p>
                <p className="text-sm text-text-secondary mt-2">{order.address}, {order.city}, {order.postalCode}</p>
            </Card>
             <Card>
                <h2 className="text-lg font-semibold mb-4">Admin Notes</h2>
                <Textarea placeholder="Add a note for internal use..."/>
                <Button className="w-full mt-4" variant="outline">Add Note</Button>
             </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsAdminPage;
