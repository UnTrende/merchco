
import React from 'react';
import { useParams } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import { MOCK_CUSTOM_REQUESTS } from '../../constants';
import Icon from '../../components/Icon';

const CustomRequestDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const request = MOCK_CUSTOM_REQUESTS.find(r => r.id === id) || MOCK_CUSTOM_REQUESTS[0];

  return (
    <div className="space-y-8">
      <Card>
        <div className="flex justify-between items-start mb-4">
            <div>
                <h1 className="text-2xl font-bold">Request #{request.id}</h1>
                <p className="text-text-secondary">Submitted on {request.createdAt}</p>
            </div>
            {/* FIX: The status prop was incorrect. Pass request.status directly. */}
            <Badge status={request.status}>{request.status.replace('_', ' ')}</Badge>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mt-6">
            <div>
                <h3 className="font-semibold mb-2">Your Request Details</h3>
                <p><strong className="text-text-secondary">Size:</strong> {request.size}</p>
                <p><strong className="text-text-secondary">Color:</strong> {request.color}</p>
                <p><strong className="text-text-secondary">Placement:</strong> {request.placement}</p>
                <p className="mt-2"><strong className="text-text-secondary">Description:</strong> {request.description}</p>
            </div>
            <div>
                <h3 className="font-semibold mb-2">Design Preview from Admin</h3>
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    {request.previewImageUrl ? <img src={request.previewImageUrl} alt="Preview" /> : <p className="text-text-secondary">Awaiting preview</p>}
                </div>
            </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex space-x-4">
            <Button variant="primary">Approve Design</Button>
            <Button variant="outline">Request Changes</Button>
        </div>
      </Card>
      
      <Card>
        <h2 className="text-lg font-semibold mb-4">Timeline</h2>
        <ol className="relative border-l border-gray-200">                  
            {request.history.map(event => (
                <li key={event.id} className="mb-6 ml-4">
                    <div className="absolute w-3 h-3 bg-accent rounded-full mt-1.5 -left-1.5 border border-white"></div>
                    <time className="mb-1 text-sm font-normal leading-none text-gray-400">{new Date(event.timestamp).toLocaleDateString()}</time>
                    <h3 className="text-base font-semibold text-gray-900 capitalize">Status updated to: {event.status.replace('_', ' ')}</h3>
                </li>
            ))}
        </ol>
      </Card>
    </div>
  );
};

export default CustomRequestDetailPage;
