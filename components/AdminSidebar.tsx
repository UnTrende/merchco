import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import Icon from './Icon';
import { useAuth } from '../hooks/useAuth';

interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const allNavItems = [
  { name: 'Dashboard', to: '/admin/dashboard', icon: 'bar-chart-2' as const, roles: ['owner', 'staff'] },
  { name: 'Orders', to: '/admin/orders', icon: 'package' as const, roles: ['owner', 'staff'] },
  { name: 'Custom Requests', to: '/admin/requests', icon: 'file-text' as const, roles: ['owner', 'staff', 'designer'] },
  { name: 'Products', to: '/admin/products', icon: 'tag' as const, roles: ['owner', 'staff'] },
  { name: 'Collections', to: '/admin/collections', icon: 'zap' as const, roles: ['owner', 'staff'] },
  { name: 'Marketing', to: '/admin/marketing', icon: 'zap' as const, roles: ['owner', 'staff'] },
  { name: 'Customers', to: '/admin/customers', icon: 'users' as const, roles: ['owner', 'staff'] },
  { name: 'Settings', to: '/admin/settings', icon: 'settings' as const, roles: ['owner'] },
  { name: 'Logs', to: '/admin/logs', icon: 'shield' as const, roles: ['owner'] },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, setIsOpen }) => {
  const { admin, adminLogout } = useAuth();
  const navigate = useNavigate();

  if (!admin) return null;
  
  const handleLogout = async () => {
    await adminLogout();
    navigate('/admin/login');
  };

  const navItems = allNavItems.filter(item => item.roles.includes(admin.role));

  const linkClass = 'flex items-center px-4 py-2.5 text-text-secondary rounded-lg hover:bg-gray-100 hover:text-text-primary transition-colors';
  const activeLinkClass = 'bg-accent/10 text-accent font-semibold';

  return (
    <>
      <aside className={`bg-panel border-r border-border flex-shrink-0 flex-col w-64 transition-all duration-300 ease-in-out ${isOpen ? 'flex' : 'hidden'} lg:flex`}>
        <div className="flex items-center h-20 px-6 border-b border-border">
          <Link to="/admin" className="text-2xl font-bold font-poppins text-text-primary">Admin</Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(item => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}
            >
              <Icon name={item.icon} className="w-5 h-5 mr-3" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
            <button onClick={handleLogout} className={`${linkClass} w-full`}>
                <Icon name="log-out" className="w-5 h-5 mr-3" />
                <span>Logout</span>
            </button>
        </div>
      </aside>
       {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setIsOpen(false)}></div>}
    </>
  );
};

export default AdminSidebar;
