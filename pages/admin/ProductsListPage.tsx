
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
import { Product } from '../../types';

const ProductsListPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchProducts = async () => {
          try {
              setLoading(true);
              const response = await api.getProducts();
              setProducts(response.data || []);
          } catch (error) {
              console.error("Failed to fetch products", error);
          } finally {
              setLoading(false);
          }
      };
      fetchProducts();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-96"><Spinner /></div>;

  return (
    <div>
      <PageHeader title="Products" buttonText="Add Product" onButtonClick={() => {}} />
      <Card padding="none">
        <Table headers={['', 'Name', 'Category', 'Price', 'Stock', 'Status', '']}>
          {products.map(product => (
            <tr key={product.id}>
              <td className="px-6 py-4">
                <img src={product.images[0]?.imageUrl || 'https://via.placeholder.com/40'} alt={product.name} className="w-12 h-12 object-cover rounded-md" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap font-medium">{product.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-text-secondary">{product.category}</td>
              <td className="px-6 py-4 whitespace-nowrap font-semibold">${(product.salePrice || product.basePrice).toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap">{product.variants.reduce((sum, v) => sum + v.stock, 0)}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge status={product.status}>{product.status}</Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <Link to={`/admin/products/edit/${product.id}`}>
                  <Button variant="ghost" size="sm"><Icon name="edit-3" className="w-5 h-5" /></Button>
                </Link>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
};

export default ProductsListPage;
