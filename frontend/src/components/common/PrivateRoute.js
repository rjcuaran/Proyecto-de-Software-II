import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../../services/auth';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;