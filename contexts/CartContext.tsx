import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { CartItem, ProductVariant } from '../types';
import * as api from '../api/mockApi';
import { AuthContext } from './AuthContext';

interface CartContextType {
  cart: CartItem[] | null;
  cartCount: number;
  loading: boolean;
  addToCart: (productId: string, productName: string, productImage: string, variant: ProductVariant, price: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = useContext(AuthContext);

  const fetchCart = async () => {
    if (auth?.isAuthenticated) {
        setLoading(true);
        try {
            const response = await api.getCart();
            setCart(response.data);
        } catch (error) {
            console.error("Failed to fetch cart", error);
            setCart([]);
        } finally {
            setLoading(false);
        }
    } else {
        setCart([]);
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [auth?.isAuthenticated]);

  const addToCart = async (productId: string, productName: string, productImage: string, variant: ProductVariant, price: number) => {
    await api.addToCart({ productId, productName, productImage, variant, quantity: 1, price });
    await fetchCart();
  };
  
  const updateQuantity = async (itemId: string, quantity: number) => {
    await api.updateCartItem(itemId, quantity);
    await fetchCart();
  };

  const removeFromCart = async (itemId: string) => {
    await api.removeCartItem(itemId);
    await fetchCart();
  };
  
  const clearCart = async () => {
    await api.clearCart();
    await fetchCart();
  };

  return (
    <CartContext.Provider value={{
      cart,
      cartCount: cart?.reduce((sum, item) => sum + item.quantity, 0) || 0,
      loading,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};
