import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import Spinner from '../../components/Spinner';
import { useCart } from '../../hooks/useCart';

const CartPage: React.FC = () => {
  const { cart, loading, updateQuantity, removeFromCart } = useCart();

  const subtotal = cart?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;
  const shipping = subtotal > 0 ? 5.00 : 0;
  const total = subtotal + shipping;

  if (loading) {
    return <div className="flex justify-center items-center h-96"><Spinner /></div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">Your Cart</h1>
      
      {cart && cart.length > 0 ? (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <Card key={item.id} padding="md" className="flex items-start space-x-4">
                <img src={item.productImage} alt={item.productName} className="w-24 h-24 object-cover rounded-lg" />
                <div className="flex-grow">
                  <h2 className="font-semibold">{item.productName}</h2>
                  <p className="text-sm text-text-secondary">Size: {item.variant.size}</p>
                   <div className="flex items-center space-x-2 mt-1">
                     <span className="text-sm text-text-secondary">Color:</span>
                     <span style={{ backgroundColor: item.variant.color }} className="w-4 h-4 rounded-full border border-border"></span>
                   </div>
                  <p className="font-bold mt-2">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex flex-col items-end justify-between h-full">
                  <div className="flex items-center border border-border rounded-md">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="px-2 py-1 disabled:opacity-50"><Icon name="minus" className="w-4 h-4" /></button>
                    <span className="px-3 text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1"><Icon name="plus" className="w-4 h-4" /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-text-secondary hover:text-error mt-4"><Icon name="trash-2" className="w-5 h-5" /></button>
                </div>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card padding="lg" className="sticky top-24">
              <h2 className="text-xl font-bold mb-4">Summary</h2>
              <div className="space-y-2 text-text-secondary">
                <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
                <div className="border-t border-border my-2"></div>
                <div className="flex justify-between font-bold text-text-primary text-lg"><span>Total</span><span>${total.toFixed(2)}</span></div>
              </div>
              <Link to="/checkout"><Button size="lg" className="w-full mt-6">Proceed to Checkout</Button></Link>
              <Link to="/shop"><Button variant="outline" className="w-full mt-2">Continue Shopping</Button></Link>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-20">
          <Icon name="shopping-cart" className="w-16 h-16 mx-auto text-text-secondary" />
          <h2 className="mt-4 text-xl font-semibold">Your cart is empty</h2>
          <p className="mt-2 text-text-secondary">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/shop"><Button className="mt-6">Start Shopping</Button></Link>
        </div>
      )}
      
      {cart && cart.length > 0 &&
        <div className="lg:hidden fixed bottom-16 left-0 right-0 bg-panel p-4 border-t border-border shadow-[0_-2px_5px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-2">
                <span className="text-text-secondary">Total:</span>
                <span className="font-bold text-lg">${total.toFixed(2)}</span>
            </div>
            <Link to="/checkout"><Button size="lg" className="w-full">Checkout</Button></Link>
        </div>
      }
    </div>
  );
};

export default CartPage;
