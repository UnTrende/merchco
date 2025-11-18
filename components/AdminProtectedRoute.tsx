import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AdminUser } from '../types';

interface AdminProtectedRouteProps {
  children: React.ReactElement;
  roles?: AdminUser['role'][];
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children, roles }) => {
  const { isAdminAuthenticated, admin, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or a spinner
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  if (roles && admin && !roles.includes(admin.role)) {
      // You could render a "Forbidden" page here instead
      return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
