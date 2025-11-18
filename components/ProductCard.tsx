
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import Icon from './Icon';
import Button from './Button';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="group relative bg-panel rounded-card shadow-soft overflow-hidden transition-shadow hover:shadow-xl">
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-square w-full overflow-hidden">
          <img
            src={product.images[0].imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>
      
      <button className="absolute top-3 right-3 p-2 bg-white/70 rounded-full text-text-secondary hover:text-error hover:bg-white backdrop-blur-sm transition">
        <Icon name="heart" className="w-5 h-5" />
      </button>

      <div className="p-4 text-left">
        <h3 className="text-sm md:text-base font-semibold text-text-primary truncate">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="text-xs text-text-secondary mt-1">{product.category}</p>
        <div className="flex items-baseline space-x-2 mt-2">
            {product.salePrice ? (
                <>
                    <p className="text-base md:text-lg font-bold text-error">${product.salePrice.toFixed(2)}</p>
                    <p className="text-sm text-text-secondary line-through">${product.basePrice.toFixed(2)}</p>
                </>
            ) : (
                <p className="text-base md:text-lg font-bold text-text-primary">${product.basePrice.toFixed(2)}</p>
            )}
        </div>
      </div>

      <div className="p-4 pt-0">
          <Button variant='outline' className="w-full opacity-0 group-hover:opacity-100 md:opacity-100 transition-opacity duration-300">
            Quick Add
          </Button>
      </div>
    </div>
  );
};

export default ProductCard;
