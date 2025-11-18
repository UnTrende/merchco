
import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import PageHeader from '../../components/PageHeader';
import Spinner from '../../components/Spinner';
import * as api from '../../api/mockApi';

const MarketingPage: React.FC = () => {
  const [announcement, setAnnouncement] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
      api.getSettings().then(res => {
          if (res.data) {
              setAnnouncement(res.data.storeSettings.announcementBarText || '');
          }
          setLoading(false);
      });
  }, []);

  const handleSaveAnnouncement = async () => {
      setSaving(true);
      try {
          await api.updateSettings({ announcementBarText: announcement });
          alert('Announcement updated!');
      } catch (e) {
          alert('Failed to update');
      } finally {
          setSaving(false);
      }
  };

  if (loading) return <div className="flex justify-center items-center h-96"><Spinner /></div>;

  return (
    <div>
      <PageHeader title="Marketing" />
      <div className="space-y-8">
        <Card>
          <h2 className="text-lg font-semibold mb-4">Announcement Bar</h2>
          <Input label="Text" value={announcement} onChange={(e) => setAnnouncement(e.target.value)} placeholder="e.g. FREE SHIPPING OVER $50" />
          <Button className="mt-4" onClick={handleSaveAnnouncement} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
          </Button>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold mb-4">Hero Slider</h2>
          <p className="text-text-secondary mb-4">Manage the images on your homepage slider.</p>
          <Button variant="outline">Manage Slides</Button>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold mb-4">Offer Cards</h2>
           <p className="text-text-secondary mb-4">Highlight special offers or collections.</p>
          <Button variant="outline">Manage Offer Cards</Button>
        </Card>
         <Card>
          <h2 className="text-lg font-semibold mb-4">Coupons</h2>
           <p className="text-text-secondary mb-4">Create and manage discount codes.</p>
          <Button variant="outline">Manage Coupons</Button>
        </Card>
      </div>
    </div>
  );
};

export default MarketingPage;