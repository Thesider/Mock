import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../api/LoginApi';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole, 
  redirectTo = '/login' 
}) => {
  // Check if user is authenticated
  if (!isAuthenticated()) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check role if required
  if (requiredRole) {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsed = JSON.parse(user);
        const userRole = parsed.role;
        
        // Allow access if user has the required role or is Admin (Admin can access everything)
        if (userRole !== requiredRole && userRole !== 'Admin') {
          return <Navigate to="/unauthorized" replace />;
        }
      } catch {
        return <Navigate to={redirectTo} replace />;
      }
    } else {
      return <Navigate to={redirectTo} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
