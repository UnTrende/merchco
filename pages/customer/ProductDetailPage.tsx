
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import ProductCard from '../../components/ProductCard';
import Modal from '../../components/Modal';
import Accordion, { AccordionItem } from '../../components/Accordion';
import Spinner from '../../components/Spinner';
import { Product, ProductVariant } from '../../types';
import * as api from '../../api/mockApi';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [mainImage, setMainImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("Product not found.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const [productRes, relatedRes] = await Promise.all([
          api.getProductById(id),
          api.getRelatedProducts(id)
        ]);
        setProduct(productRes.data || null);
        setMainImage(productRes.data?.images[0]?.imageUrl);
        setRelatedProducts(relatedRes.data);
      } catch (err) {
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const availableSizes = useMemo(() => {
    if (!product) return [];
    return [...new Set(product.variants.map(v => v.size))];
  }, [product]);
  
  const availableColors = useMemo(() => {
    if (!product) return [];
    return [...new Set(product.variants.filter(v => !selectedSize || v.size === selectedSize).map(v => v.color))];
  }, [product, selectedSize]);

  const selectedVariant = useMemo(() => {
    if (!product || !selectedSize || !selectedColor) return null;
    return product.variants.find(v => v.size === selectedSize && v.color === selectedColor) || null;
  }, [product, selectedSize, selectedColor]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
        if(confirm("Please login to add items to your cart.")) {
             navigate(`/login?next=${location.pathname}`);
        }
        return;
    }

    if (product && selectedVariant) {
        addToCart(product.id, product.name, product.images[0].imageUrl, selectedVariant, product.salePrice || product.basePrice);
        alert(`${product.name} added to cart!`);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
  if (error || !product) return <div className="text-center py-20">{error || 'Product not found.'}</div>;

  const currentPrice = product.salePrice || product.basePrice;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <div className="aspect-square bg-gray-100 rounded-card overflow-hidden mb-4">
            <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img) => (
              <button key={img.id} onClick={() => setMainImage(img.imageUrl)} className={`aspect-square rounded-lg overflow-hidden ring-2 ${mainImage === img.imageUrl ? 'ring-accent' : 'ring-transparent'}`}>
                <img src={img.imageUrl} alt={`${product.name} thumbnail ${img.sortOrder}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary">{product.name}</h1>
          <div className="flex items-baseline space-x-2 mt-2">
            {product.salePrice ? (
                <>
                    <p className="text-2xl font-bold text-error">${product.salePrice.toFixed(2)}</p>
                    <p className="text-lg text-text-secondary line-through">${product.basePrice.toFixed(2)}</p>
                </>
            ) : (
                <p className="text-2xl font-bold text-text-primary">${product.basePrice.toFixed(2)}</p>
            )}
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-text-primary">Select Size</h3>
              <button onClick={() => setIsSizeGuideOpen(true)} className="text-sm text-accent font-medium hover:underline">Size Guide</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map(size => (
                <button key={size} onClick={() => setSelectedSize(size)} className={`w-12 h-12 flex items-center justify-center text-sm border rounded-md transition ${selectedSize === size ? 'bg-accent text-white border-accent' : 'border-border hover:border-text-primary'}`}>{size}</button>
              ))}
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-text-primary mb-2">Select Color</h3>
            <div className="flex flex-wrap gap-3">
              {availableColors.map(color => (
                <button key={color} onClick={() => setSelectedColor(color)} style={{ backgroundColor: color }} className={`w-8 h-8 rounded-full border border-border transition ring-offset-2 ${selectedColor === color ? 'ring-2 ring-accent' : ''}`}></button>
              ))}
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <Button size="lg" className="w-full" onClick={handleAddToCart} disabled={!selectedVariant || selectedVariant.stock === 0}>
                {!selectedVariant ? 'Select Options' : selectedVariant.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>
           
           <div className="mt-8">
            <Accordion>
                <AccordionItem title="Description">
                    <p>{product.description}</p>
                </AccordionItem>
                <AccordionItem title="Material & Care">
                    <ul className="list-disc list-inside space-y-1">
                        <li>100% Premium Cotton</li>
                        <li>Machine wash cold</li>
                        <li>Tumble dry low</li>
                    </ul>
                </AccordionItem>
                <AccordionItem title="Shipping & Returns">
                    <p>Free shipping on orders over $50. Returns accepted within 30 days.</p>
                </AccordionItem>
            </Accordion>
           </div>
        </div>
      </div>
      
      <div className="mt-16 md:mt-24 space-y-16">
        <section>
          <h2 className="text-2xl font-bold text-center text-text-primary mb-8">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      </div>

      <Modal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} title="Size Guide">
        <table className="w-full text-left border-collapse">
            <thead>
                <tr>
                    <th className="py-2 border-b">Size</th>
                    <th className="py-2 border-b">Chest (in)</th>
                    <th className="py-2 border-b">Length (in)</th>
                </tr>
            </thead>
            <tbody>
                <tr><td className="py-2 border-b">S</td><td className="py-2 border-b">34-36</td><td className="py-2 border-b">28</td></tr>
                <tr><td className="py-2 border-b">M</td><td className="py-2 border-b">38-40</td><td className="py-2 border-b">29</td></tr>
                <tr><td className="py-2 border-b">L</td><td className="py-2 border-b">42-44</td><td className="py-2 border-b">30</td></tr>
                <tr><td className="py-2 border-b">XL</td><td className="py-2 border-b">46-48</td><td className="py-2 border-b">31</td></tr>
                <tr><td className="py-2 border-b">XXL</td><td className="py-2 border-b">50-52</td><td className="py-2 border-b">32</td></tr>
            </tbody>
        </table>
      </Modal>

      <div className="md:hidden fixed bottom-16 left-0 right-0 bg-panel p-4 border-t border-border shadow-[0_-2px_5px_rgba(0,0,0,0.05)] z-10">
        <Button size="lg" className="w-full" onClick={handleAddToCart} disabled={!selectedVariant || selectedVariant.stock === 0}>Add to Cart - ${currentPrice.toFixed(2)}</Button>
      </div>
    </div>
  );
};

export default ProductDetailPage;