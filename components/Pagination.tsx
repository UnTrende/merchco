
import React from 'react';
import Icon from './Icon';

const Pagination: React.FC = () => {
  return (
    <nav aria-label="Pagination" className="flex items-center justify-center space-x-2 mt-12">
      <button className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50" disabled>
        <Icon name="chevron-left" className="w-5 h-5" />
        <span className="sr-only">Previous</span>
      </button>
      <button aria-current="page" className="w-10 h-10 rounded-md bg-accent text-white font-semibold text-sm">1</button>
      <button className="w-10 h-10 rounded-md hover:bg-gray-100 font-semibold text-sm">2</button>
      <button className="w-10 h-10 rounded-md hover:bg-gray-100 font-semibold text-sm">3</button>
      <span className="font-semibold text-text-secondary">...</span>
      <button className="w-10 h-10 rounded-md hover:bg-gray-100 font-semibold text-sm">10</button>
      <button className="p-2 rounded-md hover:bg-gray-100">
        <Icon name="chevron-right" className="w-5 h-5" />
        <span className="sr-only">Next</span>
      </button>
    </nav>
  );
};

export default Pagination;
