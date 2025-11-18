import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Spinner from '../../components/Spinner';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import * as api from '../../api/mockApi';

const CheckoutPage: React.FC = () => {
    const { cart, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [shippingInfo, setShippingInfo] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
    });

    useEffect(() => {
        if (user) {
            setShippingInfo({
                name: user.name || '',
                phone: '', // User model doesn't have phone, so leave blank
                address: user.address || '',
                city: user.city || '',
                postalCode: user.postalCode || ''
            });
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setShippingInfo(prev => ({ ...prev, [id]: value }));
    };

    const subtotal = cart?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;
    const shipping = subtotal > 0 ? 5.00 : 0;
    const total = subtotal + shipping;
    
    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await api.placeOrder(shippingInfo);
            await clearCart();
            navigate(`/profile/orders/${response.data.orderId}`);
        } catch (error) {
            console.error("Failed to place order", error);
            alert("There was an error placing your order.");
        } finally {
            setIsSubmitting(false);
        }
    };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">Checkout</h1>
      <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card padding="lg" className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Full Name" id="name" type="text" value={shippingInfo.name} onChange={handleInputChange} required />
                  <Input label="Phone Number" id="phone" type="tel" value={shippingInfo.phone} onChange={handleInputChange} required />
                  <div className="sm:col-span-2">
                    <Input label="Address" id="address" type="text" value={shippingInfo.address} onChange={handleInputChange} required />
                  </div>
                  <Input label="City" id="city" type="text" value={shippingInfo.city} onChange={handleInputChange} required />
                  <Input label="Postal Code" id="postalCode" type="text" value={shippingInfo.postalCode} onChange={handleInputChange} required />
                </div>
              </section>
              <div className="border-t border-border"></div>
              {/* Payment and Delivery sections */}
          </Card>
        </div>

        <div className="lg:col-span-1">
           <Card padding="lg" className="sticky top-24">
              <h2 className="text-xl font-bold mb-4">Your Order</h2>
              <div className="space-y-4">
                {cart?.map(item => (
                    <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <img src={item.productImage} alt={item.productName} className="w-14 h-14 rounded-md" />
                            <div>
                                <p className="font-semibold">{item.productName}</p>
                                <p className="text-sm text-text-secondary">Qty: {item.quantity}</p>
                            </div>
                        </div>
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                ))}
              </div>
              <div className="border-t border-border my-4"></div>
              <div className="space-y-2 text-text-secondary">
                <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
                <div className="border-t border-border my-2"></div>
                <div className="flex justify-between font-bold text-text-primary text-lg"><span>Total</span><span>${total.toFixed(2)}</span></div>
              </div>
              <Button type="submit" size="lg" className="w-full mt-6" disabled={isSubmitting || !cart || cart.length === 0}>
                {isSubmitting ? <Spinner /> : 'Place Order'}
              </Button>
            </Card>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
