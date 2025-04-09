import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader"; // ✅ Optional Loader Component

const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return <Loader />; // Show a better loading experience
    }

    return isAuthenticated ? <Navigate to={location.state?.from?.pathname || "/dashboard"} replace /> : children;
};

export default PublicRoute;
