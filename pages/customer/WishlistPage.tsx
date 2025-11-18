
import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import ProductCard from '../../components/ProductCard';
import Icon from '../../components/Icon';
import Spinner from '../../components/Spinner';
import { Product } from '../../types';
import * as api from '../../api/mockApi';

const WishlistPage: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const response = await api.getWishlist();
            setWishlistItems(response.data || []);
        } catch (error) {
            console.error("Failed to fetch wishlist", error);
        } finally {
            setLoading(false);
        }
    };
    fetchWishlist();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64"><Spinner /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">My Wishlist</h1>
      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {wishlistItems.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-16">
          <Icon name="heart" className="w-12 h-12 mx-auto text-text-secondary" />
          <h2 className="mt-4 text-lg font-semibold">Your wishlist is empty</h2>
          <p className="mt-1 text-text-secondary">Add items you love to your wishlist to save them for later.</p>
        </Card>
      )}
    </div>
  );
};

export default WishlistPage;
