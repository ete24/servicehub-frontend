// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import AdminLoginPage from './pages/AdminLoginPage.jsx';
import ProviderDashboard from './components/ProviderDashboard.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ServiceListingPage from './pages/ServiceListingPage.jsx';
import ServiceDetailPage from './pages/ServiceDetailPage.jsx';
import HowItWorksPage from './pages/HowItWorksPage.jsx'; // NEW: Import HowItWorksPage
import ScrollToTop from './components/ScrollToTop.jsx'; 
import { jwtDecode } from 'jwt-decode';

// Main App component (wrapper for AppContent)
function App() {
    return (
        <AppContent />
    );
}

// AppContent component to access AuthContext
function AppContent() {
    const { user, token, logout, loading } = React.useContext(AuthContext); 
    
    useEffect(() => {
        console.log('AppContent mounted or user/loading changed. Current user:', user);
        console.log('Current loading state:', loading);
    }, [user, loading]);

    return (
        <div className="App">
            {/* NEW: Place ScrollToTop here to ensure it applies to all routes */}
            <ScrollToTop /> 

            {/* Navbar */}
            <nav className="navbar">
                <div className="nav-left">
                    <Link to="/" className="nav-link text-xl font-bold">ServiceHub</Link>
                    <Link to="/services" className="nav-link">Browse Services</Link>
                </div>
                <div className="nav-right">
                    {user ? ( // Show Logout and Dashboard links if logged in
                        <>
                            {user.role === 'provider' && (
                                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                            )}
                            {user.role === 'admin' && (
                                <Link to="/admin/dashboard" className="nav-link">Admin Dashboard</Link>
                            )}
                            <button onClick={logout} className="logout-button">Logout</button>
                        </>
                    ) : ( // Show Login, Register, and Admin Login links if not logged in
                        <>
                            <Link to="/login" className="nav-link">Login (Provider/Seeker)</Link>
                            <Link to="/register" className="nav-link">Register</Link>
                            <Link to="/admin/login" className="nav-link">Admin Login</Link>
                        </>
                    )}
                </div>
            </nav>

            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/services" element={<ServiceListingPage />} />
                <Route path="/services/:id" element={<ServiceDetailPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} /> {/* NEW: Route for How It Works page */}

                {/* Protected Routes using AuthRedirect as a wrapper */}
                <Route
                    path="/dashboard"
                    element={
                        <AuthRedirect expectedRole="provider">
                            <ProviderDashboard provider={user} token={token} />
                        </AuthRedirect>
                    }
                />
                <Route
                    path="/admin/dashboard"
                    element={
                        <AuthRedirect expectedRole="admin">
                            <AdminDashboardPage admin={user} token={token} />
                        </AuthRedirect>
                    }
                />

                {/* Fallback for unauthorized access attempts to specific routes */}
                <Route path="/unauthorized" element={<NotFound />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
}

// AuthRedirect component: Handles authentication and authorization for protected routes
const AuthRedirect = ({ children, expectedRole }) => {
    const { user, loading } = React.useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (loading) {
            return;
        }

        if (!user) {
            if (location.pathname !== '/login') {
                navigate('/login?auth=required', { replace: true });
            }
            return;
        }

        if (user.role !== expectedRole) {
            if (location.pathname !== '/unauthorized') {
                navigate('/unauthorized', { replace: true });
            }
            return;
        }

    }, [user, loading, expectedRole, navigate, location.pathname]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">Loading protected content...</div>;
    }

    return user && user.role === expectedRole ? children : null;
};

// Simple NotFound page (and Unauthorized page for wrong roles)
const NotFound = () => {
    const { user, loading } = React.useContext(AuthContext);

    const getRedirectPath = () => {
        if (loading) return '/';
        if (!user) return '/login';
        if (user.role === 'provider') return '/dashboard';
        if (user.role === 'admin') return '/admin/dashboard';
        return '/';
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center p-8 bg-white shadow-lg rounded-lg">
                <h1 className="text-5xl font-bold text-red-600 mb-4">
                    {location.pathname === '/unauthorized' ? 'Unauthorized Access' : '404 Page Not Found'}
                </h1>
                <p className="text-xl text-gray-700 mb-6">
                    {location.pathname === '/unauthorized' 
                        ? "You do not have permission to access this page." 
                        : "The page you are looking for does not exist."}
                </p>
                <Link
                    to={getRedirectPath()}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
                >
                    Go to {user && !loading ? (user.role === 'admin' ? 'Admin Dashboard' : 'Dashboard') : 'Login'}
                </Link>
            </div>
        </div>
    );
};

export default App;
