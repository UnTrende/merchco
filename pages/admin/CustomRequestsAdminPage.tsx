
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import PageHeader from '../../components/PageHeader';
import Spinner from '../../components/Spinner';
import * as api from '../../api/mockApi';
import { CustomRequest } from '../../types';

const CustomRequestsAdminPage: React.FC = () => {
  const [requests, setRequests] = useState<CustomRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchRequests = async () => {
          try {
              setLoading(true);
              const response = await api.getAllRequests();
              setRequests(response.data || []);
          } catch (error) {
              console.error("Failed to fetch requests", error);
          } finally {
              setLoading(false);
          }
      };
      fetchRequests();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-96"><Spinner /></div>;

  return (
    <div>
      <PageHeader title="Custom Requests" />
      <Card padding="none">
        <Table headers={['Request ID', 'Customer', 'Color', 'Size', 'Status', 'Date', '']}>
          {requests.map(req => (
            <tr key={req.id}>
              <td className="px-6 py-4 whitespace-nowrap font-medium text-accent">{req.id.slice(0,8)}...</td>
              <td className="px-6 py-4 whitespace-nowrap">{req.customerName}</td>
              <td className="px-6 py-4 whitespace-nowrap">{req.color}</td>
              <td className="px-6 py-4 whitespace-nowrap">{req.size}</td>
              <td className="px-6 py-4 whitespace-nowrap"><Badge status={req.status}>{req.status.replace('_', ' ')}</Badge></td>
              <td className="px-6 py-4 whitespace-nowrap text-text-secondary">{req.createdAt}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <Link to={`/admin/requests/${req.id}`}>
                  <Button variant="ghost" size="sm"><Icon name="eye" className="w-5 h-5" /></Button>
                </Link>
              </td>
            </tr>
          ))}
        </Table>
        {requests.length === 0 && <div className="p-8 text-center text-text-secondary">No requests found.</div>}
      </Card>
    </div>
  );
};

export default CustomRequestsAdminPage;
