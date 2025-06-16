// src/pages/AdminDashboardPage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
// import { useAuth } from "../context/AuthContext.jsx"; // This import is not used in this component, removing for clarity
import './AdminDashboardPage.css'; // Import the correct CSS file for Admin Dashboard

const API_BASE_URL = 'http://localhost:5001/api'; // Define your API base URL

const AdminDashboardPage = ({ admin, token }) => {
    const [pendingProviders, setPendingProviders] = useState([]);
    const [pendingServiceUpdates, setPendingServiceUpdates] = useState([]); // New state for service updates
    const [pendingServiceDeletions, setPendingServiceDeletions] = useState([]); // New state for service deletions
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionMessage, setActionMessage] = useState(''); // State for overall feedback messages

    // --- Data Fetching Functions ---

    // Function to fetch pending providers
    const fetchPendingProviders = useCallback(async () => {
        console.log("AdminDashboardPage: Fetching pending providers...");
        if (!token) {
            console.log("AdminDashboardPage: No token for fetching providers.");
            return []; // Return empty array to prevent issues
        }
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/providers/pending`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("AdminDashboardPage: Pending providers fetched successfully:", response.data.length);
            return response.data;
        } catch (err) {
            console.error('AdminDashboardPage: Error fetching pending providers:', err.response?.status, err.response?.data);
            throw new Error(err.response?.data?.error || 'Failed to load pending providers.');
        }
    }, [token]);

    // Function to fetch pending service updates
    const fetchPendingServiceUpdates = useCallback(async () => {
        console.log("AdminDashboardPage: Fetching pending service updates...");
        if (!token) {
            console.log("AdminDashboardPage: No token for fetching service updates.");
            return [];
        }
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/services/pending-updates`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("AdminDashboardPage: Pending service updates fetched successfully:", response.data.length);
            return response.data;
        } catch (err) {
            console.error('AdminDashboardPage: Error fetching pending service updates:', err.response?.status, err.response?.data);
            throw new Error(err.response?.data?.error || 'Failed to load pending service updates.');
        }
    }, [token]);

    // Function to fetch pending service deletions
    const fetchPendingServiceDeletions = useCallback(async () => {
        console.log("AdminDashboardPage: Fetching pending service deletions...");
        if (!token) {
            console.log("AdminDashboardPage: No token for fetching service deletions.");
            return [];
        }
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/services/pending-deletions`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("AdminDashboardPage: Pending service deletions fetched successfully:", response.data.length);
            return response.data;
        } catch (err) {
            console.error('AdminDashboardPage: Error fetching pending service deletions:', err.response?.status, err.response?.data);
            throw new Error(err.response?.data?.error || 'Failed to load pending service deletions.');
        }
    }, [token]);


    // Effect to fetch all data on component mount and when token changes
    useEffect(() => {
        const fetchAllAdminData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch all data concurrently
                const [providers, updates, deletions] = await Promise.all([
                    fetchPendingProviders(),
                    fetchPendingServiceUpdates(),
                    fetchPendingServiceDeletions()
                ]);
                setPendingProviders(providers);
                setPendingServiceUpdates(updates);
                setPendingServiceDeletions(deletions);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAllAdminData();
    }, [fetchPendingProviders, fetchPendingServiceUpdates, fetchPendingServiceDeletions]); // Dependencies on memoized fetch functions

    // --- Action Handlers ---

    // Handler for approving a provider
    const handleApproveProvider = async (providerId) => {
        setActionMessage(''); // Clear previous messages
        console.log(`AdminDashboardPage: Attempting to approve provider: ${providerId}`);
        try {
            const response = await axios.put(`${API_BASE_URL}/admin/providers/approve/${providerId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setActionMessage(response.data.message || 'Provider approved successfully!');
            console.log('AdminDashboardPage: Approve provider success response:', response.data);
            fetchPendingProviders(); // Re-fetch only providers to update UI
        } catch (err) {
            console.error('AdminDashboardPage: Error approving provider (API call):', err.response?.status, err.response?.data);
            setActionMessage(err.response?.data?.error || 'Failed to approve provider.');
        }
    };

    // Handler for rejecting a provider
    const handleRejectProvider = async (providerId) => {
        setActionMessage(''); // Clear previous messages
        console.log(`AdminDashboardPage: Attempting to reject provider: ${providerId}`);
        try {
            const response = await axios.put(`${API_BASE_URL}/admin/providers/reject/${providerId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setActionMessage(response.data.message || 'Provider rejected successfully!');
            console.log('AdminDashboardPage: Reject provider success response:', response.data);
            fetchPendingProviders(); // Re-fetch only providers to update UI
        } catch (err) {
            console.error('AdminDashboardPage: Error rejecting provider (API call):', err.response?.status, err.response?.data);
            setActionMessage(err.response?.data?.error || 'Failed to reject provider.');
        }
    };

    // Handler for approving a service update
    const handleApproveServiceUpdate = async (serviceId) => {
        setActionMessage('');
        console.log(`AdminDashboardPage: Attempting to approve service update: ${serviceId}`);
        try {
            const response = await axios.put(`${API_BASE_URL}/admin/services/approve-update/${serviceId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setActionMessage(response.data.message || 'Service update approved successfully!');
            console.log('AdminDashboardPage: Approve service update success response:', response.data);
            fetchPendingServiceUpdates(); // Re-fetch only pending updates
        } catch (err) {
            console.error('AdminDashboardPage: Error approving service update (API call):', err.response?.status, err.response?.data);
            setActionMessage(err.response?.data?.error || 'Failed to approve service update.');
        }
    };

    // Handler for rejecting a service update
    const handleRejectServiceUpdate = async (serviceId) => {
        setActionMessage('');
        console.log(`AdminDashboardPage: Attempting to reject service update: ${serviceId}`);
        try {
            const response = await axios.put(`${API_BASE_URL}/admin/services/reject-update/${serviceId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setActionMessage(response.data.message || 'Service update rejected successfully!');
            console.log('AdminDashboardPage: Reject service update success response:', response.data);
            fetchPendingServiceUpdates(); // Re-fetch only pending updates
        } catch (err) {
            console.error('AdminDashboardPage: Error rejecting service update (API call):', err.response?.status, err.response?.data);
            setActionMessage(err.response?.data?.error || 'Failed to reject service update.');
        }
    };

    // Handler for approving a service deletion
    const handleApproveServiceDeletion = async (serviceId) => {
        setActionMessage('');
        console.log(`AdminDashboardPage: Attempting to approve service deletion: ${serviceId}`);
        try {
            const response = await axios.delete(`${API_BASE_URL}/admin/services/approve-deletion/${serviceId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setActionMessage(response.data.message || 'Service deletion approved successfully!');
            console.log('AdminDashboardPage: Approve service deletion success response:', response.data);
            fetchPendingServiceDeletions(); // Re-fetch only pending deletions
        } catch (err) {
            console.error('AdminDashboardPage: Error approving service deletion (API call):', err.response?.status, err.response?.data);
            setActionMessage(err.response?.data?.error || 'Failed to approve service deletion.');
        }
    };

    // Handler for rejecting a service deletion
    const handleRejectServiceDeletion = async (serviceId) => {
        setActionMessage('');
        console.log(`AdminDashboardPage: Attempting to reject service deletion: ${serviceId}`);
        try {
            const response = await axios.put(`${API_BASE_URL}/admin/services/reject-deletion/${serviceId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setActionMessage(response.data.message || 'Service deletion rejected successfully!');
            console.log('AdminDashboardPage: Reject service deletion success response:', response.data);
            fetchPendingServiceDeletions(); // Re-fetch only pending deletions
        } catch (err) {
            console.error('AdminDashboardPage: Error rejecting service deletion (API call):', err.response?.status, err.response?.data);
            setActionMessage(err.response?.data?.error || 'Failed to reject service deletion.');
        }
    };


    // Log current state on every render for debugging
    console.log("AdminDashboardPage render: Admin:", admin?.email, "Token exists:", !!token);

    if (loading) {
        return <div className="admin-dashboard-message">Loading admin data...</div>;
    }

    if (error) {
        return <div className="admin-dashboard-error">Error: {error}</div>;
    }

    if (!admin) {
        return <div className="admin-dashboard-message">No admin user data available. Please log in as an administrator.</div>;
    }

    return (
        <div className="admin-dashboard-container">
            <h1>Welcome, Administrator!</h1>
            <p>Email: {admin.email}</p>
            {/* Display action feedback */}
            {actionMessage && <div className="action-message">{actionMessage}</div>}

            {/* --- Pending Provider Applications Section --- */}
            <div className="admin-section">
                <h2>Pending Provider Applications</h2>
                {pendingProviders.length === 0 ? (
                    <p>No pending provider applications at this time.</p>
                ) : (
                    <div className="list-container">
                        {pendingProviders.map(provider => (
                            <div key={provider.id} className="card pending-provider-card">
                                <h3>{provider.name || 'N/A'}</h3>
                                <p>Email: {provider.email}</p>
                                <p>Plan: {provider.subscription_plan || 'N/A'}</p>
                                <p>Status: <span className={`status-${provider.status}`}>{provider.status}</span></p>
                                <div className="card-actions">
                                    <button
                                        className="btn-approve"
                                        onClick={() => handleApproveProvider(provider.id)}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        className="btn-reject"
                                        onClick={() => handleRejectProvider(provider.id)}
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* --- Pending Service Updates Section --- */}
            <div className="admin-section">
                <h2>Pending Service Updates</h2>
                {pendingServiceUpdates.length === 0 ? (
                    <p>No pending service updates at this time.</p>
                ) : (
                    <div className="list-container">
                        {pendingServiceUpdates.map(service => (
                            <div key={service.id} className="card pending-service-card">
                                <h3>{service.name} (ID: {service.id.substring(0, 8)}...)</h3>
                                <p>Provider: {service.provider_name} ({service.provider_email})</p>
                                <p>Category: {service.category}</p>
                                <p>Description: {service.description}</p>
                                <p>Price: ${service.price}</p>
                                <p>Status: <span className={`status-${service.status}`}>{service.status}</span></p>
                                <p>Availability:</p>
                                <ul className="availability-list">
                                    {Object.entries(service.availability || {}).map(([day, time]) => (
                                        <li key={day}>
                                            <strong>{day.charAt(0).toUpperCase() + day.slice(1)}:</strong> {time || 'N/A'}
                                        </li>
                                    ))}
                                </ul>
                                <div className="card-actions">
                                    <button
                                        className="btn-approve"
                                        onClick={() => handleApproveServiceUpdate(service.id)}
                                    >
                                        Approve Update
                                    </button>
                                    <button
                                        className="btn-reject"
                                        onClick={() => handleRejectServiceUpdate(service.id)}
                                    >
                                        Reject Update
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* --- Pending Service Deletions Section --- */}
            <div className="admin-section">
                <h2>Pending Service Deletions</h2>
                {pendingServiceDeletions.length === 0 ? (
                    <p>No pending service deletion requests at this time.</p>
                ) : (
                    <div className="list-container">
                        {pendingServiceDeletions.map(service => (
                            <div key={service.id} className="card pending-deletion-card">
                                <h3>{service.name} (ID: {service.id.substring(0, 8)}...)</h3>
                                <p>Provider: {service.provider_name} ({service.provider_email})</p>
                                <p>Category: {service.category}</p>
                                <p>Description: {service.description}</p>
                                <p>Price: ${service.price}</p>
                                <p>Status: <span className={`status-${service.status}`}>{service.status}</span></p>
                                <div className="card-actions">
                                    <button
                                        className="btn-approve"
                                        onClick={() => handleApproveServiceDeletion(service.id)}
                                    >
                                        Approve Deletion
                                    </button>
                                    <button
                                        className="btn-reject"
                                        onClick={() => handleRejectServiceDeletion(service.id)}
                                    >
                                        Reject Deletion
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboardPage;
