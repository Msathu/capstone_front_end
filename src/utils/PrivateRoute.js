import React from 'react';
import { Navigate,Outlet } from 'react-router-dom';
import { isAuthenticated } from '../services/Auth';

const PrivateRoute = ({ element: Component, ...rest }) => {

  return  isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;