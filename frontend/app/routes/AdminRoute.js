import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const AdminRoute = ({ children }) => {
    const isAuthenticated = Cookies.get('token');
    const userRoles = Cookies.get('userRole') || '';
    const isAdmin = isAuthenticated && userRoles.split(',').includes('admin');

    console.log('AdminRoute check - Is Authenticated:', isAuthenticated, 'Is Admin:', isAdmin); // Log checks
    
    return isAdmin ? children : <Navigate to="/home" />;
};

export default AdminRoute;