
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import { MOCK_ORDERS } from '../../constants';

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const order = MOCK_ORDERS.find(o => o.id === id) || MOCK_ORDERS[0];

  const statusSteps: (typeof order.orderStatus)[] = ['received', 'in_packing', 'shipped', 'delivered'];
  const currentStepIndex = statusSteps.indexOf(order.orderStatus);

  return (
    <div className="space-y-8">
      <Card>
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 pb-6 border-b border-border">
          <div>
            <h1 className="text-2xl font-bold">Order #{order.id}</h1>
            <p className="text-text-secondary">Placed on {order.createdAt}</p>
          </div>
          <Badge status={order.orderStatus}>{order.orderStatus.replace('_', ' ')}</Badge>
        </div>

        {/* Progress Tracker */}
        <div className="my-8">
          <ol className="flex items-center w-full">
            {statusSteps.map((step, index) => (
              <li key={step} className={`flex w-full items-center ${index <= currentStepIndex ? 'text-accent' : 'text-gray-400'} ${index !== statusSteps.length - 1 ? "after:content-[''] after:w-full after:h-1 after:border-b after:border-4 after:inline-block " + (index < currentStepIndex ? 'after:border-accent' : 'after:border-gray-200') : ''}`}>
                <span className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${index <= currentStepIndex ? 'bg-accent text-white' : 'bg-gray-200'}`}>{index + 1}</span>
              </li>
            ))}
          </ol>
           <div className="flex justify-between mt-2 text-sm font-medium capitalize">
             {statusSteps.map((step, index) => <span key={step} className={index <= currentStepIndex ? 'text-accent' : 'text-gray-400'}>{step.replace('_', ' ')}</span>)}
           </div>
        </div>
      </Card>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <h2 className="text-lg font-semibold mb-4">Items Ordered</h2>
                <div className="space-y-4 divide-y divide-border">
                  {order.items.map(item => (
                    <div key={item.id} className="flex items-center space-x-4 pt-4 first:pt-0">
                      <img src={item.productImage} alt={item.productName} className="w-16 h-16 rounded-md" />
                      <div className="flex-grow">
                        <p className="font-semibold">{item.productName}</p>
                        <p className="text-sm text-text-secondary">Qty: {item.quantity}</p>
                      </div>
                      <p className="ml-auto font-medium">${item.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
            </Card>
            <Card>
                <h2 className="text-lg font-semibold mb-4">Timeline</h2>
                 <ol className="relative border-l border-gray-200">                  
                    {order.history.map(event => (
                        <li key={event.id} className="mb-6 ml-4">
                            <div className="absolute w-3 h-3 bg-accent rounded-full mt-1.5 -left-1.5 border border-white"></div>
                            <time className="mb-1 text-sm font-normal leading-none text-gray-400">{new Date(event.timestamp).toLocaleString()}</time>
                            <h3 className="text-base font-semibold text-gray-900 capitalize">Order {event.status.replace('_', ' ')}</h3>
                        </li>
                    ))}
                </ol>
            </Card>
        </div>
        <div className="lg:col-span-1 space-y-8">
             <Card>
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                <div className="space-y-2">
                    <div className="flex justify-between text-text-secondary">
                        <span>Subtotal</span>
                        <span>${(order.totalAmount - order.deliveryFee).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-text-secondary">
                        <span>Shipping</span>
                        <span>${order.deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-border my-2"></div>
                    <div className="flex justify-between font-bold text-lg text-text-primary">
                        <span>Total</span>
                        <span>${order.totalAmount.toFixed(2)}</span>
                    </div>
                </div>
            </Card>
            <Card>
                 <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
                <address className="not-italic text-text-secondary space-y-1">
                  <p className="font-semibold text-text-primary">{order.name}</p>
                  <p>{order.address}</p>
                  <p>{order.city}, {order.postalCode}</p>
                  <p>{order.phone}</p>
                </address>
                 <div className="border-t border-border mt-6 pt-6 flex justify-end">
                    <Button>Buy Again</Button>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
