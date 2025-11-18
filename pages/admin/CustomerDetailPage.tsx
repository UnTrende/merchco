
import React from 'react';
import { useParams } from 'react-router-dom';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { Textarea } from '../../components/Input';
import { MOCK_CUSTOMERS, MOCK_ORDERS } from '../../constants';

const CustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const customer = MOCK_CUSTOMERS.find(c => c.id === id) || MOCK_CUSTOMERS[0];
  const customerOrders = MOCK_ORDERS.slice(0, 2);

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <img src={`https://i.pravatar.cc/150?u=${customer.id}`} alt={customer.name} className="w-20 h-20 rounded-full" />
        <div>
            <h1 className="text-2xl font-bold">{customer.name}</h1>
            <p className="text-text-secondary">{customer.email}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card padding="none">
             <div className="p-4 border-b border-border">
                <h2 className="text-lg font-semibold">Order History</h2>
            </div>
            <Table headers={['Order ID', 'Date', 'Amount', 'Status']}>
                {customerOrders.map(order => (
                    <tr key={order.id}>
                        <td className="px-6 py-4 font-medium text-accent">{order.id}</td>
                        {/* FIX: Property 'date' does not exist on type 'Order'. Use 'createdAt' instead. */}
                        <td className="px-6 py-4 text-text-secondary">{order.createdAt}</td>
                        {/* FIX: Property 'amount' does not exist on type 'Order'. Use 'totalAmount' instead. */}
                        <td className="px-6 py-4 font-semibold">${order.totalAmount.toFixed(2)}</td>
                        <td className="px-6 py-4"><Badge status={order.orderStatus}>{order.orderStatus}</Badge></td>
                    </tr>
                ))}
            </Table>
          </Card>
        </div>
        <div className="lg:col-span-1 space-y-8">
            <Card>
                <h2 className="text-lg font-semibold mb-4">Admin Notes</h2>
                <Textarea placeholder="Add a note about this customer..."/>
                <Button variant="outline" className="w-full mt-4">Add Note</Button>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailPage;
