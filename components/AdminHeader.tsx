
import React from 'react';
import Icon from './Icon';

interface AdminHeaderProps {
  toggleSidebar: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="bg-panel border-b border-border h-20 flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="lg:hidden mr-4 p-2 text-text-secondary hover:text-text-primary">
          <Icon name="menu" className="w-6 h-6" />
        </button>
        <h1 className="text-xl md:text-2xl font-semibold text-text-primary">Dashboard</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon name="search" className="w-5 h-5 text-text-secondary" />
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-[46px] pl-10 pr-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <button className="relative p-2 text-text-secondary rounded-full hover:bg-gray-100 hover:text-text-primary">
            <Icon name="bell" className="w-6 h-6" />
            <span className="absolute top-2 right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-error"></span>
            </span>
        </button>
        <div className="flex items-center space-x-2">
            <img src="https://picsum.photos/id/237/40/40" alt="Admin Avatar" className="w-10 h-10 rounded-full" />
            <div className='hidden md:block'>
                <p className="font-semibold text-text-primary">Admin User</p>
                <p className="text-xs text-text-secondary">Super Admin</p>
            </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
