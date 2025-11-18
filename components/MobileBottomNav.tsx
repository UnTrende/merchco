import React from 'react';
import { NavLink } from 'react-router-dom';
import Icon from './Icon';
import { useCart } from '../hooks/useCart';

const MobileBottomNav: React.FC = () => {
  const { cartCount } = useCart();
  const navItems = [
    { name: 'Home', to: '/', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
    { name: 'Shop', to: '/shop', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> },
    { name: 'Custom', to: '/custom-tshirt', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg> },
    { name: 'Cart', to: '/cart', icon: <Icon name="shopping-cart" />, badge: cartCount > 0 ? cartCount : 0 },
    { name: 'Profile', to: '/profile', icon: <Icon name="user" /> },
  ];

  const linkClass = "relative flex flex-col items-center justify-center text-text-secondary w-full pt-2 pb-1 transition-colors";
  const activeLinkClass = "text-accent";

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-panel shadow-[0_-2px_5px_rgba(0,0,0,0.05)] border-t border-border z-40">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}
          >
            <div className="w-6 h-6 mb-1">{item.icon}</div>
            <span className="text-xs">{item.name}</span>
            {item.badge && item.badge > 0 && (
                <span className="absolute top-1 right-1/2 -mr-5 flex h-4 w-4 items-center justify-center rounded-full bg-error text-white text-[10px]">{item.badge}</span>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default MobileBottomNav;
