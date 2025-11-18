import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Icon from './Icon';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
      logout();
      navigate('/');
      setIsProfileDropdownOpen(false);
  };

  const navLinkClasses = "text-text-secondary hover:text-text-primary transition-colors";
  const activeNavLinkClasses = "text-text-primary font-semibold";

  const navItems = [
    { name: 'Shop', to: '/shop' },
    { name: 'Men', to: '/shop/men' },
    { name: 'Women', to: '/shop/women' },
    { name: 'Children', to: '/shop/children' },
    { name: 'Custom T-shirt', to: '/custom-tshirt' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-panel/80 backdrop-blur-sm shadow-soft z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-gray-100">
              <Icon name={isMobileMenuOpen ? 'x' : 'menu'} className="w-6 h-6" />
            </button>
          </div>
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold font-poppins text-text-primary">
              MerchCo
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:space-x-8">
            {navItems.map(item => (
              <NavLink 
                key={item.name} 
                to={item.to} 
                className={({isActive}) => isActive ? `${navLinkClasses} ${activeNavLinkClasses}` : navLinkClasses}
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-gray-100">
              <Icon name="search" className="w-5 h-5" />
            </button>
            <Link to="/profile/wishlist" className="p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-gray-100">
              <Icon name="heart" className="w-5 h-5" />
            </Link>
            <Link to="/cart" className="relative p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-gray-100">
              <Icon name="shopping-cart" className="w-5 h-5" />
              {cartCount > 0 && <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-error text-white text-xs">{cartCount}</span>}
            </Link>
            
            <div className="hidden md:flex items-center">
                {!isAuthenticated ? (
                    <Link to="/login" className="p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-gray-100">
                        <Icon name="user" className="w-5 h-5" />
                    </Link>
                ) : (
                    <div className="flex items-center space-x-3 relative">
                        <Link to="/profile/notifications" className="relative p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-gray-100">
                            <Icon name="bell" className="w-5 h-5" />
                            <span className="absolute top-1 right-1 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-error"></span>
                            </span>
                        </Link>
                        
                        {/* Custom User Dropdown */}
                        <div className="relative">
                            <button 
                                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                className="flex items-center focus:outline-none"
                            >
                                <img 
                                    src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`} 
                                    alt="User" 
                                    className="w-8 h-8 rounded-full border border-border" 
                                />
                            </button>
                            
                            {isProfileDropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsProfileDropdownOpen(false)}></div>
                                    <div className="absolute right-0 mt-2 w-48 bg-panel rounded-md shadow-lg py-1 z-20 ring-1 ring-black ring-opacity-5">
                                        <div className="px-4 py-2 border-b border-border">
                                            <p className="text-sm font-medium text-text-primary truncate">{user?.name}</p>
                                            <p className="text-xs text-text-secondary truncate">{user?.email}</p>
                                        </div>
                                        <Link to="/profile" className="block px-4 py-2 text-sm text-text-secondary hover:bg-gray-100" onClick={() => setIsProfileDropdownOpen(false)}>Dashboard</Link>
                                        <Link to="/profile/orders" className="block px-4 py-2 text-sm text-text-secondary hover:bg-gray-100" onClick={() => setIsProfileDropdownOpen(false)}>My Orders</Link>
                                        <button 
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-error hover:bg-gray-100"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border">
          <nav className="flex flex-col px-4 py-3 space-y-2">
             {navItems.map(item => (
              <NavLink 
                key={item.name} 
                to={item.to} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={({isActive}) => `py-2 px-3 rounded-md text-base ${isActive ? 'bg-gray-100 text-text-primary font-semibold' : 'text-text-secondary'}`}
              >
                {item.name}
              </NavLink>
            ))}
            {!isAuthenticated ? (
                 <NavLink to="/login" onClick={() => setIsMobileMenuOpen(false)} className="py-2 px-3 rounded-md text-base text-text-secondary">Login</NavLink>
            ) : (
                <>
                    <div className="border-t border-border my-2"></div>
                    <NavLink to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="py-2 px-3 rounded-md text-base text-text-secondary">My Profile</NavLink>
                    <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="text-left py-2 px-3 rounded-md text-base text-error w-full">Logout</button>
                </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;