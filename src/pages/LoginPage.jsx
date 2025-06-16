// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; // Corrected import to useAuth hook

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login, user } = useAuth(); // Destructure login function and user object from useAuth hook

    useEffect(() => {
        setError(''); // Clear error messages when component mounts
        console.log('LoginPage: Mounted. Current user:', user); // Log user state on mount
        if (user) {
            // If already logged in, navigate away
            console.log('LoginPage: User already logged in, navigating away.');
            if (user.role === 'provider') {
                navigate('/dashboard');
            } else if (user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        }
    }, [user, navigate]); // Depend on user and navigate for automatic redirection

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        console.log('LoginPage: Attempting login for email:', email); // Log login attempt

        try {
            const response = await axios.post('http://localhost:5001/api/auth/login', {
                email,
                password,
            });

            console.log('LoginPage: Backend login response received:', response.data); // Log full response data

            const { token, role, user: userDataFromBackend } = response.data; // Destructure `user` if backend sends it

            // Call the login function from AuthContext to store token and update user state
            // It expects `login(token, decodedPayload)` or similar.
            // Ensure the `AuthContext`'s `login` function correctly sets the user.role based on the token or provided role.
            login(token, { ...userDataFromBackend, role: role }); // Pass user data and role

            console.log('LoginPage: Login successful for role:', role);

            // Redirect based on role
            if (role === 'provider') {
                navigate('/dashboard');
            } else if (role === 'seeker') {
                navigate('/'); // Or a seeker-specific dashboard
            } else if (role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }

        } catch (err) {
            console.error('LoginPage: Login error caught:', err); // Log full error object
            if (err.response) {
                console.error('LoginPage: Error response data:', err.response.data);
                console.error('LoginPage: Error response status:', err.response.status);
                setError(err.response.data.error || err.response.data.message || 'An unexpected error occurred during login. Please try again.');
            } else if (err.request) {
                setError('No response from server. Please check your internet connection or try again later.');
            } else {
                setError('Error setting up the login request. Please try again.');
            }
        } finally {
            setLoading(false);
            console.log('LoginPage: Loading state set to false.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 font-inter">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login to ServiceHub</h2>
                <form onSubmit={handleSubmit}>
                    {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                            Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                            required
                            autoComplete="username"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                            Password:
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                            required
                            autoComplete="current-password"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
