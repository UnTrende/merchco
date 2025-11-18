
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Textarea } from '../../components/Input';
import Spinner from '../../components/Spinner';
import * as api from '../../api/mockApi';
import { CustomRequest } from '../../types';

const CustomRequestDetailsAdminPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [request, setRequest] = useState<CustomRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchRequest = async () => {
      if (!id) return;
      try {
          setLoading(true);
          const response = await api.getRequestById(id);
          if(response.success && response.data) setRequest(response.data);
      } catch(e) {
          console.error(e);
      } finally {
          setLoading(false);
      }
  }

  useEffect(() => {
      fetchRequest();
  }, [id]);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
      if(!id) return;
      const newStatus = e.target.value as CustomRequest['status'];
      setUpdating(true);
      try {
          await api.updateRequestStatus(id, newStatus);
          await fetchRequest();
      } catch(e) {
          alert('Failed to update status');
      } finally {
          setUpdating(false);
      }
  }

  if (loading) return <div className="flex justify-center items-center h-96"><Spinner /></div>;
  if (!request) return <div>Request not found</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Request #{request.id.slice(0,8)}</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <h2 className="text-lg font-semibold mb-4">Customer's Description</h2>
            <p className="text-text-secondary mb-4">{request.description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="font-semibold">Color:</span> {request.color}</div>
                <div><span className="font-semibold">Size:</span> {request.size}</div>
                <div><span className="font-semibold">Placement:</span> {request.placement}</div>
                <div><span className="font-semibold">Customer:</span> {request.customerName}</div>
            </div>
          </Card>
          <Card>
            <h2 className="text-lg font-semibold mb-4">Uploaded Files</h2>
            <p className="text-text-secondary">No files uploaded yet (Feature coming soon).</p>
          </Card>
          <Card>
            <h2 className="text-lg font-semibold mb-4">Timeline</h2>
             <ol className="relative border-l border-gray-200">                  
                {request.history.map(event => (
                    <li key={event.id} className="mb-6 ml-4">
                        <div className="absolute w-3 h-3 bg-accent rounded-full mt-1.5 -left-1.5 border border-white"></div>
                        <time className="mb-1 text-sm font-normal leading-none text-gray-400">{new Date(event.timestamp).toLocaleString()}</time>
                        <h3 className="text-base font-semibold text-gray-900 capitalize">Status: {event.status.replace('_', ' ')}</h3>
                    </li>
                ))}
            </ol>
          </Card>
        </div>
        <div className="lg:col-span-1 space-y-8">
            <Card>
                <h2 className="text-lg font-semibold mb-4">Upload Preview</h2>
                <Button variant="outline" className="w-full">Upload Design Preview</Button>
            </Card>
            <Card>
                <h2 className="text-lg font-semibold mb-4">Request Status</h2>
                <select value={request.status} onChange={handleStatusChange} disabled={updating} className="w-full h-[46px] rounded-lg border-border focus:ring-accent focus:border-accent">
                    <option value="new">New</option>
                    <option value="in_progress">In Progress</option>
                    <option value="preview_sent">Preview Sent</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                </select>
            </Card>
            <Card>
                <h2 className="text-lg font-semibold mb-4">Notes</h2>
                <Textarea placeholder="Add a note for the customer or internal team..."/>
            </Card>
             <Button size="lg" className="w-full">Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

export default CustomRequestDetailsAdminPage;
