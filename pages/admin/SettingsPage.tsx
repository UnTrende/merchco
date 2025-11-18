
import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import PageHeader from '../../components/PageHeader';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Spinner from '../../components/Spinner';
import * as api from '../../api/mockApi';
import { StoreSettings, DeliverySettings } from '../../types';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Store');
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);
  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await api.getSettings();
            if (response.data) {
                setStoreSettings(response.data.storeSettings);
                setDeliverySettings(response.data.deliverySettings);
            }
        } catch (error) {
            console.error("Failed to fetch settings", error);
        } finally {
            setLoading(false);
        }
    };
    fetchSettings();
  }, []);

  const handleSave = async (data: Partial<StoreSettings & DeliverySettings>) => {
      setSaving(true);
      try {
          await api.updateSettings(data);
          alert('Settings saved successfully');
      } catch (error) {
          console.error("Failed to save settings", error);
          alert('Failed to save settings');
      } finally {
          setSaving(false);
      }
  };

  if (loading || !storeSettings || !deliverySettings) {
      return <div className="flex justify-center items-center h-64"><Spinner /></div>;
  }

  const tabs = ['Store', 'Payments', 'Delivery', 'Theme', 'Admin Users'];

  return (
    <div>
      <PageHeader title="Settings" />
      <div className="flex space-x-1 border-b border-border mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 -mb-px border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab 
              ? 'border-accent text-accent' 
              : 'border-transparent text-text-secondary hover:border-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <Card>
        {activeTab === 'Store' && (
             <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleSave({
                    storeName: formData.get('storeName') as string,
                    contactPhone: formData.get('contactPhone') as string,
                    address: formData.get('address') as string,
                    currency: formData.get('currency') as string
                });
             }} className="space-y-4">
                <Input name="storeName" label="Store Name" defaultValue={storeSettings.storeName} />
                <Input name="contactPhone" label="Contact Phone" defaultValue={storeSettings.contactPhone} />
                <Input name="address" label="Address" defaultValue={storeSettings.address} />
                <Input name="currency" label="Currency" defaultValue={storeSettings.currency} />
                <div className="pt-4 flex justify-end">
                    <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Store Settings'}</Button>
                </div>
            </form>
        )}
        
        {activeTab === 'Delivery' && (
             <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleSave({
                    baseFee: Number(formData.get('baseFee')),
                    freeAbove: Number(formData.get('freeAbove')),
                    deliveryText: formData.get('deliveryText') as string
                });
             }} className="space-y-4">
                <Input name="baseFee" label="Base Delivery Fee" type="number" step="0.01" defaultValue={deliverySettings.baseFee} />
                <Input name="freeAbove" label="Free Delivery Above" type="number" step="0.01" defaultValue={deliverySettings.freeAbove} />
                <Input name="deliveryText" label="Delivery Text" defaultValue={deliverySettings.deliveryText} />
                 <div className="pt-4 flex justify-end">
                    <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Delivery Settings'}</Button>
                </div>
            </form>
        )}

        {activeTab === 'Payments' && <div><p>Configure payment methods like Cash on Delivery (COD).</p></div>}
        {activeTab === 'Theme' && <div><p>Customize the look and feel of your storefront.</p></div>}
        {activeTab === 'Admin Users' && <div><p>Manage users who have access to this admin panel.</p></div>}
      </Card>
    </div>
  );
};

export default SettingsPage;
