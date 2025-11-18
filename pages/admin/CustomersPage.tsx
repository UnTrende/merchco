
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import PageHeader from '../../components/PageHeader';
import Spinner from '../../components/Spinner';
import * as api from '../../api/mockApi';
import { Customer } from '../../types';

const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      api.getAdminCustomers().then(res => {
          setCustomers(res.data);
          setLoading(false);
      });
  }, []);

  if (loading) return <div className="flex justify-center items-center h-96"><Spinner /></div>;

  return (
    <div>
      <PageHeader title="Customers" />
      <Card padding="none">
        <Table headers={['Name', 'Email', 'Orders', 'Total Spent', 'Last Order', '']}>
          {customers.map(customer => (
            <tr key={customer.id}>
              <td className="px-6 py-4 whitespace-nowrap font-medium">{customer.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-text-secondary">{customer.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">{customer.ordersCount}</td>
              <td className="px-6 py-4 whitespace-nowrap font-semibold">${customer.totalSpent.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-text-secondary">{customer.lastOrderDate}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <Link to={`/admin/customers/${customer.id}`}>
                  <Button variant="ghost" size="sm"><Icon name="eye" className="w-5 h-5" /></Button>
                </Link>
              </td>
            </tr>
          ))}
        </Table>
        {customers.length === 0 && <div className="p-8 text-center text-text-secondary">No customers found.</div>}
      </Card>
    </div>
  );
};

export default CustomersPage;
