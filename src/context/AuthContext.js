import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the auth context
export const AuthContext = createContext();

// Set the base URL for all API requests
axios.defaults.baseURL = 'http://localhost:8000';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    // Check if user is logged in on mount or when token changes
    useEffect(() => {
        const checkAuth = async () => {
            if (token) {
                try {
                    // Set axios auth header
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                    // Get user info
                    const response = await axios.get('/api/auth/me');
                    setUser(response.data);
                } catch (err) {
                    console.error("Auth check error:", err);
                    // If token is invalid, remove it
                    localStorage.removeItem('token');
                    delete axios.defaults.headers.common['Authorization'];
                    setToken(null);
                    setError('Session expired. Please log in again.');
                }
            } else {
                // No token means not logged in
                setUser(null);
            }

            setLoading(false);
        };

        checkAuth();
    }, [token]);

    // Login function
    const login = async (email, password) => {
        try {
            console.log("Logging in user:", email);

            // Use FormData for login (required by FastAPI's OAuth2)
            const formData = new FormData();
            formData.append('username', email);  // Note: FastAPI expects 'username' field
            formData.append('password', password);

            const response = await axios.post('/api/auth/token', formData);
            console.log("Login response:", response.data);

            const { access_token } = response.data;

            // Save token to localStorage and state
            localStorage.setItem('token', access_token);
            setToken(access_token);

            // Set axios auth header
            axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

            // Get user info
            const userResponse = await axios.get('/api/auth/me');
            setUser(userResponse.data);

            return { success: true };
        } catch (err) {
            console.error("Login error:", err);
            setError(err.response?.data?.detail || 'Login failed');
            return {
                success: false,
                error: err.response?.data?.detail || 'Login failed'
            };
        }
    };

    // Register function
    const register = async (email, password, fullName) => {
        try {
            console.log("Registering user:", email);

            const response = await axios.post('/api/auth/register', {
                email,
                password,
                full_name: fullName
            });

            console.log("Registration response:", response.data);
            return { success: true, user: response.data };
        } catch (err) {
            console.error("Registration error:", err);
            console.error("Error details:", err.response?.data);
            setError(err.response?.data?.detail || 'Registration failed');
            return {
                success: false,
                error: err.response?.data?.detail || 'Registration failed'
            };
        }
    };

    // Logout function
    const logout = () => {
        // Remove token from localStorage
        localStorage.removeItem('token');

        // Remove auth header
        delete axios.defaults.headers.common['Authorization'];

        // Clear user state
        setUser(null);
        setToken(null);
    };

    // Function to update user credits
    const updateCredits = (newCredits) => {
        if (user) {
            setUser({
                ...user,
                credits: newCredits
            });
        }
    };

    // Function to refresh user data
    const refreshUserData = async () => {
        if (token) {
            try {
                const response = await axios.get('/api/auth/me');
                setUser(response.data);
                return response.data;
            } catch (err) {
                console.error("Error refreshing user data:", err);
                if (err.response?.status === 401) {
                    // If unauthorized, log out
                    logout();
                }
                return null;
            }
        }
        return null;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                error,
                login,
                register,
                logout,
                updateCredits,
                refreshUserData,
                isAuthenticated: !!token
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};