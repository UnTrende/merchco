import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Icon from '../../components/Icon';
import { useAuth } from '../../hooks/useAuth';

const ProfileLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', to: '/profile', icon: 'bar-chart-2' as const, end: true },
    { name: 'My Orders', to: '/profile/orders', icon: 'package' as const, end: false },
    { name: 'Custom Requests', to: '/profile/requests', icon: 'file-text' as const, end: false },
    { name: 'Wishlist', to: '/profile/wishlist', icon: 'heart' as const, end: false },
    { name: 'Notifications', to: '/profile/notifications', icon: 'bell' as const, end: false },
    { name: 'Settings', to: '/profile/settings', icon: 'settings' as const, end: false },
  ];

  const linkClass = 'flex items-center px-4 py-3 text-text-secondary rounded-lg hover:bg-gray-100 hover:text-text-primary transition-colors';
  const activeLinkClass = 'bg-accent/10 text-accent font-semibold';

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <Card padding="md">
            <div className="flex items-center space-x-4 mb-6">
              <img src={`https://i.pravatar.cc/64?u=${user?.id}`} alt="User Avatar" className="w-16 h-16 rounded-full" />
              <div>
                <h2 className="font-bold text-lg text-text-primary">{user?.name}</h2>
                <p className="text-sm text-text-secondary truncate">{user?.email}</p>
              </div>
            </div>
            <nav className="space-y-2">
              {navItems.map(item => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}
                >
                  <Icon name={item.icon} className="w-5 h-5 mr-3" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
               <button onClick={handleLogout} className={`${linkClass} w-full`}>
                <Icon name="log-out" className="w-5 h-5 mr-3" />
                <span>Logout</span>
              </button>
            </nav>
          </Card>
        </aside>
        <main className="md:col-span-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProfileLayout;
