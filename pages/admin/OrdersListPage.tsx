
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import Input from '../../components/Input';
import PageHeader from '../../components/PageHeader';
import Spinner from '../../components/Spinner';
import * as api from '../../api/mockApi';
import { Order } from '../../types';

const OrdersListPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchOrders = async () => {
          try {
              setLoading(true);
              const response = await api.getAllOrders();
              setOrders(response.data || []);
          } catch (error) {
              console.error("Failed to fetch orders", error);
          } finally {
              setLoading(false);
          }
      };
      fetchOrders();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-96"><Spinner /></div>;

  return (
    <div>
      <PageHeader title="Orders" />
      <Card padding="none">
        <div className="p-4 flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0 border-b border-border">
          <Input type="search" placeholder="Search orders..." className="w-full md:w-auto" />
          <div className="flex items-center space-x-2">
            <Input type="date" className="w-full md:w-auto" />
            <select className="h-[46px] rounded-lg border-border focus:ring-accent focus:border-accent text-sm">
              <option>Status: All</option>
              <option>Pending</option>
              <option>Shipped</option>
              <option>Delivered</option>
            </select>
          </div>
        </div>
        <Table headers={['Order ID', 'Customer', 'Amount', 'Payment', 'Status', 'Date', '']}>
          {orders.map(order => (
            <tr key={order.id}>
              <td className="px-6 py-4 whitespace-nowrap font-medium text-accent">{order.id.slice(0,8)}...</td>
              <td className="px-6 py-4 whitespace-nowrap">{order.name}</td>
              <td className="px-6 py-4 whitespace-nowrap font-semibold">${order.totalAmount.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap"><Badge status={order.paymentStatus}>{order.paymentStatus}</Badge></td>
              <td className="px-6 py-4 whitespace-nowrap"><Badge status={order.orderStatus}>{order.orderStatus.replace('_', ' ')}</Badge></td>
              <td className="px-6 py-4 whitespace-nowrap text-text-secondary">{order.createdAt}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <Link to={`/admin/orders/${order.id}`}>
                  <Button variant="ghost" size="sm"><Icon name="eye" className="w-5 h-5" /></Button>
                </Link>
              </td>
            </tr>
          ))}
        </Table>
        {orders.length === 0 && <div className="p-8 text-center text-text-secondary">No orders found.</div>}
      </Card>
    </div>
  );
};

export default OrdersListPage;
