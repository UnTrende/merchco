
import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import { MOCK_CUSTOM_REQUESTS } from '../../constants';

const CustomRequestsPage: React.FC = () => {
  return (
    <Card padding="none">
       <div className="p-6 border-b border-border flex justify-between items-center">
          <h1 className="text-2xl font-bold text-text-primary">My Custom Requests</h1>
          <Link to="/custom-tshirt">
            <Button>New Request</Button>
          </Link>
      </div>
      <Table headers={['Request ID', 'Date', 'Size', 'Color', 'Status', '']}>
        {MOCK_CUSTOM_REQUESTS.map(req => (
          <tr key={req.id}>
            <td className="px-6 py-4 whitespace-nowrap font-medium text-accent">{req.id}</td>
            {/* FIX: Property 'date' does not exist on type 'CustomRequest'. Use 'createdAt' instead. */}
            <td className="px-6 py-4 whitespace-nowrap text-text-secondary">{req.createdAt}</td>
            <td className="px-6 py-4 whitespace-nowrap text-text-secondary">{req.size}</td>
            <td className="px-6 py-4 whitespace-nowrap text-text-secondary">{req.color}</td>
            <td className="px-6 py-4 whitespace-nowrap"><Badge status={req.status}>{req.status}</Badge></td>
            <td className="px-6 py-4 whitespace-nowrap text-right">
              <Link to={`/profile/requests/${req.id}`}>
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

export default CustomRequestsPage;
