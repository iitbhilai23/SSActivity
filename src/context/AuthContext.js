import React, { createContext, useEffect, useState } from "react";
import interceptor from "../utils/interceptor";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(sessionStorage.getItem("token") || localStorage.getItem("token"));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }

            try {
                //  FIX: Use GET method instead of POST
                const response = await interceptor.get("/users/validate-token");

                if (response.data.status) {
                    setIsAuthenticated(true);
                    setUser(response.data.user);
                } else {
                    handleLogout();
                }
            } catch (error) {
                handleLogout();
            } finally {
                setLoading(false);
            }
        };

        validateToken();
    }, [token]);

    //  Logout function to clear token & redirect user
    const handleLogout = () => {
        sessionStorage.removeItem("token");
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUser(null);  
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, setToken, user, loading, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
