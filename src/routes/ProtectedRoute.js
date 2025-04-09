import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useContext(AuthContext);
    const location = useLocation();

    // Show loading state before deciding
    if (loading) {
        return <div>Loading...</div>;
    }

    //  Redirect only if user is NOT authenticated
    return isAuthenticated ? children : <Navigate to="/" state={{ from: location }} replace />;
};

export default ProtectedRoute;
