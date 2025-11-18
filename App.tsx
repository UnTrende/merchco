import React from 'react';
import { HashRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';

// Providers
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

// Guards
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';

// Layouts
import CustomerLayout from './components/CustomerLayout';
import AdminLayout from './components/AdminLayout';
import ProfileLayout from './pages/customer/ProfileLayout';

// Customer Pages
import HomePage from './pages/customer/HomePage';
import ShopPage from './pages/customer/ShopPage';
import ProductDetailPage from './pages/customer/ProductDetailPage';
import CustomTshirtPage from './pages/customer/CustomTshirtPage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import AuthPage from './pages/customer/AuthPage';
import ProfileDashboardPage from './pages/customer/ProfileDashboardPage';
import MyOrdersPage from './pages/customer/MyOrdersPage';
import OrderDetailPage from './pages/customer/OrderDetailPage';
import CustomRequestsPage from './pages/customer/CustomRequestsPage';
import CustomRequestDetailPage from './pages/customer/CustomRequestDetailPage';
import NotificationsPage from './pages/customer/NotificationsPage';
import ProfileSettingsPage from './pages/customer/ProfileSettingsPage';
import ContactPage from './pages/customer/ContactPage';
import AboutPage from './pages/customer/AboutPage';
import WishlistPage from './pages/customer/WishlistPage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import OrdersListPage from './pages/admin/OrdersListPage';
import OrderDetailsAdminPage from './pages/admin/OrderDetailsAdminPage';
import CustomRequestsAdminPage from './pages/admin/CustomRequestsAdminPage';
import CustomRequestDetailsAdminPage from './pages/admin/CustomRequestDetailsAdminPage';
import ProductsListPage from './pages/admin/ProductsListPage';
import ProductEditPage from './pages/admin/ProductEditPage';
import CollectionsPage from './pages/admin/CollectionsPage';
import MarketingPage from './pages/admin/MarketingPage';
import CustomersPage from './pages/admin/CustomersPage';
import CustomerDetailPage from './pages/admin/CustomerDetailPage';
import SettingsPage from './pages/admin/SettingsPage';
import LogsPage from './pages/admin/LogsPage';


const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <HashRouter>
          <Routes>
            {/* Customer Facing Routes */}
            <Route element={<CustomerLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/shop/:category" element={<ShopPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/about" element={<AboutPage />} />
              
              <Route path="/custom-tshirt" element={<ProtectedRoute><CustomTshirtPage /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />

              <Route path="/profile" element={<ProtectedRoute><ProfileLayout /></ProtectedRoute>}>
                <Route index element={<ProfileDashboardPage />} />
                <Route path="orders" element={<MyOrdersPage />} />
                <Route path="orders/:id" element={<OrderDetailPage />} />
                <Route path="requests" element={<CustomRequestsPage />} />
                <Route path="requests/:id" element={<CustomRequestDetailPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="settings" element={<ProfileSettingsPage />} />
                <Route path="wishlist" element={<WishlistPage />} />
              </Route>
            </Route>
            
            {/* Admin Login */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Admin Panel Routes */}
            <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="orders" element={<OrdersListPage />} />
              <Route path="orders/:id" element={<OrderDetailsAdminPage />} />
              <Route path="requests" element={<CustomRequestsAdminPage />} />
              <Route path="requests/:id" element={<CustomRequestDetailsAdminPage />} />
              <Route path="products" element={<ProductsListPage />} />
              <Route path="products/new" element={<ProductEditPage />} />
              <Route path="products/edit/:id" element={<ProductEditPage />} />
              <Route path="collections" element={<CollectionsPage />} />
              <Route path="marketing" element={<MarketingPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="customers/:id" element={<CustomerDetailPage />} />
              <Route path="settings" element={<AdminProtectedRoute roles={['owner']}><SettingsPage /></AdminProtectedRoute>} />
              <Route path="logs" element={<AdminProtectedRoute roles={['owner']}><LogsPage /></AdminProtectedRoute>} />
            </Route>
          </Routes>
        </HashRouter>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
