import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Show nothing while auth is loading (prevents flash)
    if (loading) {
        return (
            <div className="min-h-screen bg-[#EAE8E4] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#2C3E30] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;


