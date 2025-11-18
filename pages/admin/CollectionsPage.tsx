
import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import PageHeader from '../../components/PageHeader';
import Spinner from '../../components/Spinner';
import Modal from '../../components/Modal';
import Input, { Textarea } from '../../components/Input';
import * as api from '../../api/mockApi';
import { Collection } from '../../types';

const CollectionsPage: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchCollections = async () => {
      setLoading(true);
      try {
          const res = await api.getCollections();
          setCollections(res.data);
      } catch (e) {
          console.error(e);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchCollections();
  }, []);

  const handleEdit = (collection: Collection) => {
      setEditingCollection(collection);
      setIsModalOpen(true);
  };

  const handleCreate = () => {
      setEditingCollection(null);
      setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
      if (!confirm("Are you sure?")) return;
      await api.deleteCollection(id);
      fetchCollections();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSaving(true);
      const formData = new FormData(e.currentTarget);
      const data = {
          name: formData.get('name') as string,
          description: formData.get('description') as string,
          imageUrl: formData.get('imageUrl') as string,
          showOnHome: formData.get('showOnHome') === 'on'
      };

      try {
          if (editingCollection) {
              await api.updateCollection(editingCollection.id, data);
          } else {
              await api.createCollection(data);
          }
          setIsModalOpen(false);
          fetchCollections();
      } catch (e) {
          alert('Failed to save collection');
      } finally {
          setSaving(false);
      }
  };

  if (loading) return <div className="flex justify-center items-center h-96"><Spinner /></div>;

  return (
    <div>
      <PageHeader title="Collections" buttonText="Create Collection" onButtonClick={handleCreate} />
      <Card padding="none">
        <Table headers={['Image', 'Name', 'Description', 'Visible', '']}>
          {collections.map(collection => (
            <tr key={collection.id}>
              <td className="px-6 py-4">
                <img src={collection.imageUrl || 'https://via.placeholder.com/100'} alt={collection.name} className="w-24 h-12 object-cover rounded-md" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap font-medium">{collection.name}</td>
              <td className="px-6 py-4 text-text-secondary max-w-sm truncate">{collection.description}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className={`w-10 h-5 rounded-full p-0.5 ${collection.showOnHome ? 'bg-accent' : 'bg-gray-300'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${collection.showOnHome ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(collection)}><Icon name="edit-3" className="w-5 h-5" /></Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(collection.id)} className="text-error hover:text-red-700"><Icon name="trash-2" className="w-5 h-5" /></Button>
              </td>
            </tr>
          ))}
        </Table>
        {collections.length === 0 && <div className="p-8 text-center text-text-secondary">No collections found.</div>}
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCollection ? 'Edit Collection' : 'New Collection'}>
          <form onSubmit={handleSubmit} className="space-y-4">
              <Input name="name" label="Collection Name" defaultValue={editingCollection?.name} required />
              <Textarea name="description" label="Description" defaultValue={editingCollection?.description} />
              <Input name="imageUrl" label="Image URL" placeholder="https://..." defaultValue={editingCollection?.imageUrl} />
              <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" name="showOnHome" defaultChecked={editingCollection?.showOnHome} className="rounded text-accent focus:ring-accent" />
                  <span className="text-sm font-medium text-text-primary">Show on Homepage</span>
              </label>
              <div className="pt-4 flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
              </div>
          </form>
      </Modal>
    </div>
  );
};

export default CollectionsPage;