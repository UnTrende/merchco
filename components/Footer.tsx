
import React from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';

const Footer: React.FC = () => {
  return (
    <footer className="bg-panel border-t border-border mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h2 className="text-xl font-bold font-poppins text-text-primary mb-4">MerchCo</h2>
            <p className="text-text-secondary text-sm">Your one-stop shop for premium merchandise and custom apparel.</p>
          </div>
          <div>
            <h3 className="font-semibold text-text-primary mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/shop" className="text-text-secondary hover:text-text-primary text-sm">Shop All</Link></li>
              <li><Link to="/custom-tshirt" className="text-text-secondary hover:text-text-primary text-sm">Custom T-Shirts</Link></li>
              <li><Link to="/about" className="text-text-secondary hover:text-text-primary text-sm">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-text-primary mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-text-secondary hover:text-text-primary text-sm">Contact</Link></li>
              <li><Link to="/faq" className="text-text-secondary hover:text-text-primary text-sm">FAQ</Link></li>
              <li><Link to="/policies" className="text-text-secondary hover:text-text-primary text-sm">Policies</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-text-primary mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-text-secondary hover:text-text-primary"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.644-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.947s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98-1.28-.059-1.688-.073-4.947-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z"/></svg></a>
              <a href="#" className="text-text-secondary hover:text-text-primary"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.295 1.613 4.21 3.753 4.649-.65.177-1.354.23-2.075.188 1.004 2.13 3.13 3.32 5.253 3.18-2.065 1.62-4.662 2.58-7.398 2.33 2.15 1.49 4.65 2.3 7.2 2.3 7.8 0 12.3-6.8 11.8-12.5 1.05-.72 1.95-1.6 2.7-2.6z"/></svg></a>
              <a href="#" className="text-text-secondary hover:text-text-primary"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg></a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-text-secondary">
          <p>&copy; {new Date().getFullYear()} MerchCo. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
