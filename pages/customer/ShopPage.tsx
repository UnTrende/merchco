import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import Icon from '../../components/Icon';
import Button from '../../components/Button';
import Pagination from '../../components/Pagination';
import Spinner from '../../components/Spinner';
import { Product } from '../../types';
import * as api from '../../api/mockApi';

const FilterSection: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="py-4 border-b border-border">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center">
                <h3 className="font-semibold text-text-primary">{title}</h3>
                <Icon name="chevron-down" className={`w-5 h-5 transition-transform ${isOpen ? '' : '-rotate-90'}`} />
            </button>
            {isOpen && <div className="mt-4 space-y-2">{children}</div>}
        </div>
    )
};

const ColorSwatch: React.FC<{ color: string; name: string; }> = ({ color, name }) => (
    <label className="flex items-center space-x-2 cursor-pointer">
        <input type="checkbox" className="hidden peer" />
        <span style={{ backgroundColor: color }} className="w-6 h-6 rounded-full border border-border block peer-checked:ring-2 peer-checked:ring-offset-1 peer-checked:ring-accent"></span>
        <span className="text-sm text-text-secondary">{name}</span>
    </label>
);

const ShopPage: React.FC = () => {
    const { category } = useParams<{ category: string }>();
    const location = useLocation();
    
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const queryParams = new URLSearchParams(location.search);
                const filters = {
                    category,
                    search: queryParams.get('search'),
                    sort: queryParams.get('sort'),
                };
                const response = await api.getProducts(filters);
                // Simple client-side filtering since mock API doesn't filter
                const filtered = category ? response.data.filter(p => p.category.toLowerCase() === category.toLowerCase()) : response.data;
                setProducts(filtered);
            } catch (err) {
                setError('Failed to load products.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [category, location.search]);
    
    const pageTitle = category ? `Shop ${category.charAt(0).toUpperCase() + category.slice(1)}` : 'Shop All Products';
    const pageDescription = category ? `Browse our collection for ${category}.` : 'Find your perfect fit from our wide range of products.';

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-poppins text-text-primary">{pageTitle}</h1>
        <p className="mt-2 text-text-secondary">{pageDescription}</p>
      </div>

      <div className="flex">
        <aside className="hidden md:block w-1/4 lg:w-1/5 pr-8">
            <h2 className="text-lg font-bold mb-4">Filters</h2>
            {/* FIX: Add children to FilterSection to satisfy component props type. */}
            <FilterSection title="Category">
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" className="rounded text-accent focus:ring-accent" /> <span className="text-sm">Men</span></label>
                <label className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" className="rounded text-accent focus:ring-accent" /> <span className="text-sm">Women</span></label>
                <label className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" className="rounded text-accent focus:ring-accent" /> <span className="text-sm">Children</span></label>
              </div>
            </FilterSection>
            {/* FIX: Add children to FilterSection to satisfy component props type. */}
            <FilterSection title="Size">
              <div className="flex flex-wrap gap-2">
                {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                  <label key={size}>
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-10 h-10 flex items-center justify-center text-sm border border-border rounded-md cursor-pointer peer-checked:bg-accent peer-checked:text-white peer-checked:border-accent">{size}</div>
                  </label>
                ))}
              </div>
            </FilterSection>
        </aside>

        <main className="w-full md:w-3/4 lg:w-4/5">
            <div className="flex justify-between items-center mb-6">
                <Button onClick={() => setIsFiltersOpen(true)} variant="outline" className="md:hidden"><Icon name="settings" className="w-4 h-4 mr-2" /> Filters</Button>
                <div className="text-sm text-text-secondary hidden md:block">{products.length} products</div>
                <div className="flex items-center space-x-2">{/* ... */}</div>
            </div>
            
            {loading ? (
                <div className="flex justify-center items-center h-96"><Spinner /></div>
            ) : error ? (
                <div className="text-center text-error h-96">{error}</div>
            ) : (
                <>
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {products.map(product => <ProductCard key={product.id} product={product} />)}
                    </div>
                    <Pagination />
                </>
            )}
        </main>
      </div>

       {isFiltersOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-background shadow-lg p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Filters</h2>
              <button onClick={() => setIsFiltersOpen(false)}><Icon name="x" className="w-6 h-6" /></button>
            </div>
            <Button onClick={() => setIsFiltersOpen(false)} className="w-full mt-8">Apply Filters</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
