import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input, { Textarea } from '../../components/Input';
import Icon from '../../components/Icon';
import Spinner from '../../components/Spinner';
import { Product, ProductVariant } from '../../types';
import * as api from '../../api/mockApi';

const ProductEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Product>>({
      name: '',
      description: '',
      basePrice: 0,
      salePrice: undefined,
      category: 'Men',
      status: 'active',
      images: [],
      variants: [{ id: Math.random().toString(36).substring(7), size: 'S', color: '#000000', stock: 10 }]
  });

  useEffect(() => {
    if (isEditing && id) {
        api.getProductById(id).then(res => {
            if (res.success && res.data) {
                setFormData(res.data);
            }
            setLoading(false);
        });
    }
  }, [id, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
          ...prev,
          [name]: name === 'basePrice' || name === 'salePrice' ? Number(value) : value
      }));
  };

  const handleAddVariant = () => {
    setFormData(prev => ({
        ...prev,
        variants: [...(prev.variants || []), { id: Math.random().toString(36).substring(7), size: 'S', color: '#000000', stock: 0 }]
    }));
  };

  const handleRemoveVariant = (index: number) => {
    setFormData(prev => ({
        ...prev,
        variants: prev.variants?.filter((_, i) => i !== index)
    }));
  };

  const handleVariantChange = (index: number, field: keyof ProductVariant, value: any) => {
      const newVariants = [...(formData.variants || [])];
      newVariants[index] = { ...newVariants[index], [field]: value };
      setFormData(prev => ({ ...prev, variants: newVariants }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          // Create local preview
          const mockUrl = URL.createObjectURL(file);
          setFormData(prev => ({
              ...prev,
              images: [...(prev.images || []), { 
                  id: Math.random().toString(), 
                  imageUrl: mockUrl, 
                  sortOrder: (prev.images?.length || 0),
                  file: file // Store file for actual upload on save
              }]
          }));
      }
  };

  const handleSave = async () => {
      setSaving(true);
      try {
          // 1. Upload new images
          const processedImages = await Promise.all((formData.images || []).map(async (img) => {
              if (img.file) {
                  const publicUrl = await api.uploadFile(img.file);
                  return { ...img, imageUrl: publicUrl, file: undefined }; // Replace with public URL
              }
              return img;
          }));
          
          const finalData = { ...formData, images: processedImages };

          if (isEditing && id) {
              await api.updateProduct(id, finalData);
              alert('Product updated successfully');
          } else {
              await api.createProduct(finalData);
              alert('Product created successfully');
              navigate('/admin/products');
          }
      } catch (error) {
          console.error(error);
          alert('Failed to save product');
      } finally {
          setSaving(false);
      }
  };
  
  const handleDelete = async () => {
      if (!confirm('Are you sure you want to delete this product?')) return;
      if (id) {
          await api.deleteProduct(id);
          navigate('/admin/products');
      }
  };

  if (loading) return <div className="flex justify-center items-center h-96"><Spinner /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{isEditing ? `Edit Product` : 'Add New Product'}</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <h2 className="text-lg font-semibold mb-4">Basic Info</h2>
            <div className="space-y-4">
              <Input name="name" label="Product Name" placeholder="e.g. Classic T-Shirt" value={formData.name} onChange={handleInputChange} />
              <Textarea name="description" label="Description" placeholder="Detailed product description..." value={formData.description} onChange={handleInputChange} />
            </div>
          </Card>
          <Card>
            <h2 className="text-lg font-semibold mb-4">Images</h2>
            <div className="grid grid-cols-4 gap-2 mb-4">
                {formData.images?.map((img, idx) => (
                    <img key={idx} src={img.imageUrl} alt="Product" className="w-full h-24 object-cover rounded-md" />
                ))}
            </div>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Icon name="upload-cloud" className="mx-auto h-12 w-12 text-text-secondary" />
                <label htmlFor="file-upload" className="cursor-pointer text-accent hover:underline">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageUpload} />
                </label>
              </div>
            </div>
          </Card>
          <Card>
            <h2 className="text-lg font-semibold mb-4">Pricing</h2>
            <div className="grid grid-cols-2 gap-4">
                <Input name="basePrice" label="Base Price" placeholder="0.00" type="number" value={formData.basePrice} onChange={handleInputChange} />
                <Input name="salePrice" label="Sale Price (Optional)" placeholder="0.00" type="number" value={formData.salePrice || ''} onChange={handleInputChange} />
            </div>
          </Card>
           <Card>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Variants</h2>
                <Button variant="outline" size="sm" onClick={handleAddVariant}>Add Variant</Button>
            </div>
            <div className="space-y-4">
              {formData.variants?.map((variant, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center border-b border-border pb-4">
                  <Input label="Size" value={variant.size} onChange={(e) => handleVariantChange(index, 'size', e.target.value)} />
                  <Input label="Color" type="color" value={variant.color} onChange={(e) => handleVariantChange(index, 'color', e.target.value)} />
                  <Input label="Stock" type="number" value={variant.stock} onChange={(e) => handleVariantChange(index, 'stock', Number(e.target.value))} />
                  <Button variant="danger" size="sm" onClick={() => handleRemoveVariant(index)} className="mt-5 self-end">Remove</Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="lg:col-span-1 space-y-8">
          <Card>
            <h2 className="text-lg font-semibold mb-4">Status</h2>
             <select name="status" value={formData.status} onChange={handleInputChange} className="w-full h-[46px] rounded-lg border-border focus:ring-accent focus:border-accent">
                <option value="active">Published</option>
                <option value="inactive">Draft</option>
            </select>
          </Card>
          <Card>
            <h2 className="text-lg font-semibold mb-4">Category</h2>
            <select name="category" value={formData.category} onChange={handleInputChange} className="w-full h-[46px] rounded-lg border-border focus:ring-accent focus:border-accent">
                <option>Men</option>
                <option>Women</option>
                <option>Children</option>
            </select>
          </Card>
           <div className="flex flex-col space-y-4">
            <Button size="lg" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Product'}</Button>
            {isEditing && <Button variant="danger" onClick={handleDelete}>Delete Product</Button>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductEditPage;