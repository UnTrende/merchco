
import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import { MOCK_ORDERS } from '../../constants';

const MyOrdersPage: React.FC = () => {
  return (
    <Card padding="none">
      <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold text-text-primary">My Orders</h1>
      </div>
      <Table headers={['Order ID', 'Date', 'Amount', 'Status', '']}>
        {MOCK_ORDERS.map(order => (
          <tr key={order.id}>
            <td className="px-6 py-4 whitespace-nowrap font-medium text-accent">{order.id}</td>
            {/* FIX: Property 'date' does not exist on type 'Order'. Use 'createdAt' instead. */}
            <td className="px-6 py-4 whitespace-nowrap text-text-secondary">{order.createdAt}</td>
            {/* FIX: Property 'amount' does not exist on type 'Order'. Use 'totalAmount' instead. */}
            <td className="px-6 py-4 whitespace-nowrap font-semibold">${order.totalAmount.toFixed(2)}</td>
            <td className="px-6 py-4 whitespace-nowrap"><Badge status={order.orderStatus}>{order.orderStatus}</Badge></td>
            <td className="px-6 py-4 whitespace-nowrap text-right">
              <Link to={`/profile/orders/${order.id}`}>
                <Button variant="ghost" size="sm">
                  View <Icon name="eye" className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </td>
          </tr>
        ))}
      </Table>
    </Card>
  );
};

export default MyOrdersPage;
