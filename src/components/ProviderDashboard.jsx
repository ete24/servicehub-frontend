// src/components/ProviderDashboard.jsx
import React, { useState, useEffect, useContext } from 'react'; // FIXED: Removed ' => 'react'
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx'; // Ensure .jsx extension
import { useNavigate } from 'react-router-dom';

// Import your CSS file for ProviderDashboard
// IMPORTANT: Adjust this path if your ProviderDashboard.css is located elsewhere.
import './ProviderDashboard.css'; // <--- THIS IS THE MOST LIKELY CORRECT PATH

// Define your API base URL (ensure this matches your backend's URL)
const API_BASE_URL = 'http://localhost:5001/api';

// ProviderDashboard component receives 'provider' and 'token' as props from App.jsx
const ProviderDashboard = ({ provider, token }) => {
    // We still use AuthContext to get the logout function
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // State to hold the provider's profile data fetched from the API
    const [providerProfile, setProviderProfile] = useState(null);
    // State to hold the list of services fetched from the API
    const [services, setServices] = useState([]);
    // Loading state for initial data fetch
    const [loading, setLoading] = useState(true);
    // Error state for displaying any fetch errors
    const [error, setError] = useState(null);

    // NEW STATE: Controls the visibility of the Add/Edit Service form MODAL
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State for the Add/Edit Service form inputs.
    // Availability is now an object mapping day to time string or empty string.
    const [serviceForm, setServiceForm] = useState({
        name: '',
        category: '',
        description: '',
        price: '',
        availability: { // Default empty time for each day
            monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '',
        },
        image_url: '',
    });
    // State to track if the form is in 'edit' mode
    const [isEditing, setIsEditing] = useState(false);
    // State to store the ID of the service currently being edited
    const [editServiceId, setEditServiceId] = useState(null);
    // State for messages displayed after form submission (success/error)
    const [formMessage, setFormMessage] = useState('');

    // Helper function to determine service limit based on subscription plan
    const getServiceLimit = (plan) => {
        switch (plan) {
            case 'Free': return 1;
            case 'Basic Pro': return 3;
            case 'Premium Pro': return 10;
            case 'Elite Pro': return Infinity; // Represent unlimited
            default: return 0; // Default for unrecognized plans
        }
    };

    // Calculate the service limit based on the provider's subscription plan
    const serviceLimit = providerProfile && providerProfile.subscription_plan 
                         ? getServiceLimit(providerProfile.subscription_plan) 
                         : 0;

    // --- Data Fetching: Provider Profile and Services ---
    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchDashboardData = async () => {
            try {
                setError(null);
                setFormMessage('');

                const profileResponse = await axios.get(`${API_BASE_URL}/providers/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProviderProfile(profileResponse.data.provider);

                const servicesResponse = await axios.get(`${API_BASE_URL}/providers/services`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setServices(Array.isArray(servicesResponse.data) ? servicesResponse.data : []);
                
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError(err.response?.data?.message || 'Failed to load dashboard data.');
                if (err.response?.status === 401 || err.response?.status === 403) {
                    logout();
                    navigate('/login?expired=true');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [token, navigate, logout]);

    // --- Form Handling: Input Changes ---
    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.startsWith('availability.')) {
            const day = name.split('.')[1];
            setServiceForm(prev => ({
                ...prev,
                availability: {
                    ...prev.availability,
                    [day]: value // For text inputs, use the value directly
                }
            }));
        } else {
            setServiceForm(prev => ({
                ...prev,
                [name]: type === 'number' ? parseFloat(value) : value
            }));
        }
    };

    // --- Form Handling: Submission (Add/Edit) ---
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormMessage('');

        if (!serviceForm.name || !serviceForm.category || !serviceForm.description || !serviceForm.price) {
            setFormMessage('Please fill in all required fields (Name, Category, Description, Price).');
            return;
        }
        if (isNaN(parseFloat(serviceForm.price)) || parseFloat(serviceForm.price) < 0) {
            setFormMessage('Price must be a valid non-negative number.');
            return;
        }

        if (!isEditing && services.length >= serviceLimit && serviceLimit !== Infinity) {
            setFormMessage(`You have reached your service limit (${serviceLimit}) for the '${providerProfile.subscription_plan}' plan. Consider upgrading!`);
            return;
        }

        try {
            let response;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };

            const payload = {
                ...serviceForm,
                availability: serviceForm.availability // Send the object directly
            };

            if (isEditing) {
                response = await axios.put(`${API_BASE_URL}/providers/services/${editServiceId}`, payload, config);
            } else {
                response = await axios.post(`${API_BASE_URL}/providers/services`, payload, config);
            }

            let successMsg = response.data.message || 'Service saved successfully!';
            if (providerProfile && (providerProfile.subscription_plan === 'Free' || providerProfile.subscription_plan === 'Basic Pro')) {
                if (isEditing) {
                    successMsg = 'Service update submitted for admin approval.';
                } else {
                    successMsg = 'Service added successfully. Awaiting admin approval.';
                }
            } else {
                successMsg = response.data.message || 'Service saved successfully!';
            }
            setFormMessage(successMsg);
            
            const updatedServicesResponse = await axios.get(`${API_BASE_URL}/providers/services`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setServices(Array.isArray(updatedServicesResponse.data) ? updatedServicesResponse.data : []);

            resetServiceForm();
            setIsEditing(false);
            setEditServiceId(null);
            setIsModalOpen(false); // <--- NEW: Close the modal on successful submission

        } 
        catch (err) {
            console.error('Error saving service:', err);
            setFormMessage(err.response?.data?.error || err.response?.data?.message || 'Failed to save service.');
        }
    };

    // --- Service Actions: Edit ---
    const handleEditService = (service) => {
        console.log('Attempting to edit service:', service); 
        
        const availabilityForForm = {};
        Object.keys(serviceForm.availability).forEach(day => {
            availabilityForForm[day] = service.availability?.[day] || '';
        });

        setServiceForm({
            name: service.name,
            category: service.category,
            description: service.description,
            price: service.price,
            availability: availabilityForForm,
            image_url: service.image_url || '',
        });
        setIsEditing(true);
        setEditServiceId(service.id);
        setFormMessage('');
        setIsModalOpen(true); // <--- NEW: Open the modal when editing
        console.log('Edit form opened for service ID:', service.id);
    };

    // --- Service Actions: Delete ---
    const handleDeleteService = async (serviceId) => {
        console.log('Attempting to delete service with ID:', serviceId); 
        if (window.confirm("Are you sure you want to request deletion for this service?")) {
            console.log('User confirmed deletion for service ID:', serviceId);
            try {
                const response = await axios.delete(`${API_BASE_URL}/providers/services/${serviceId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log('Delete API response:', response.data);

                let successMsg = response.data.message || 'Service deletion processed.';
                if (providerProfile && (providerProfile.subscription_plan === 'Free' || providerProfile.subscription_plan === 'Basic Pro')) {
                    successMsg = 'Service deletion requested successfully. Awaiting admin approval.';
                } else {
                    successMsg = response.data.message || 'Service deleted successfully.';
                }
                setFormMessage(successMsg);
                
                const updatedServicesResponse = await axios.get(`${API_BASE_URL}/providers/services`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setServices(Array.isArray(updatedServicesResponse.data) ? updatedServicesResponse.data : []);
                console.log('Services re-fetched after deletion.');

            } catch (err) {
                console.error('Error deleting service:', err.response?.data || err.message);
                setFormMessage(err.response?.data?.error || err.response?.data?.message || 'Failed to delete service.');
            }
        } else {
            console.log('User cancelled deletion.');
        }
    };

    // --- Form Actions: Cancel Edit / Close Modal ---
    const handleCloseModal = () => { // <--- NEW: Function to close modal
        console.log('Closing modal and resetting form.');
        resetServiceForm();
        setIsEditing(false);
        setEditServiceId(null);
        setFormMessage('');
        setIsModalOpen(false); // <--- NEW: Close the modal
    };

    // Helper function to reset the service form to its initial empty state
    const resetServiceForm = () => {
        setServiceForm({
            name: '',
            category: '',
            description: '',
            price: '',
            availability: {
                monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '',
            },
            image_url: '',
        });
    };

    // --- Conditional Rendering for Loading, Error, and Authentication ---
    if (loading) {
        return <div className="loading-message">Loading dashboard...</div>;
    }

    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    if (!providerProfile) {
        return <div className="loading-message">Please log in to view the dashboard.</div>;
    }

    // --- Main Dashboard JSX Structure ---
    return (
        <div className="provider-dashboard-container">
            <h2 className="dashboard-title">Provider Dashboard</h2>
            <p className="welcome-message">Welcome, {providerProfile.name || providerProfile.email}!</p>
            <p className="subscription-info">
                Your Current Plan: <strong>{providerProfile.subscription_plan}</strong> -
                Services: {`${services.length}/${serviceLimit === Infinity ? 'Unlimited' : serviceLimit}`}
                {services.length >= serviceLimit && serviceLimit !== Infinity && (
                    <span className="limit-warning"> (You've reached your service limit. Consider upgrading!)</span>
                )}
            </p>
            
            <button onClick={logout} className="logout-button">Logout</button>

            <hr/>

            {/* Button to open the Add New Service Form Modal */}
            <button 
                onClick={() => {
                    setIsModalOpen(true); // Open the modal
                    resetServiceForm(); // Clear form for new service
                    setIsEditing(false); // Ensure it's in "Add" mode
                    setEditServiceId(null);
                    setFormMessage(''); // Clear any previous messages
                }}
                className="primary-button button add-service-toggle-button" 
            >
                Add New Service
            </button>

            {/* Service Form MODAL - Conditionally rendered */}
            {isModalOpen && (
                <div className="modal-overlay"> {/* Styling for overlay */}
                    <div className="modal-content"> {/* Styling for modal box */}
                        <button className="modal-close-button" onClick={handleCloseModal}>&times;</button> {/* Close button */}
                        <h3>{isEditing ? 'Edit Service' : 'Add New Service'}</h3>
                        {formMessage && <p className={`form-message ${formMessage.includes('successfully') || formMessage.includes('submitted') || formMessage.includes('approval') || formMessage.includes('requested') ? 'success' : 'error'}`}>{formMessage}</p>}
                        
                        <form onSubmit={handleFormSubmit} className="service-form">
                            <div className="form-group">
                                <label htmlFor="name">Service Name:</label>
                                <input type="text" id="name" name="name" value={serviceForm.name} onChange={handleFormChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="category">Category:</label>
                                <input type="text" id="category" name="category" value={serviceForm.category} onChange={handleFormChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description:</label>
                                <textarea id="description" name="description" value={serviceForm.description} onChange={handleFormChange} required></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="price">Price:</label>
                                <input type="number" id="price" name="price" value={serviceForm.price} onChange={handleFormChange} step="0.01" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="image_url">Image URL (Optional):</label>
                                <input type="text" id="image_url" name="image_url" value={serviceForm.image_url} onChange={handleFormChange} />
                            </div>
                            {/* Availability inputs for each day with time */}
                            <div className="form-group">
                                <label className="block-label">Availability:</label>
                                <p className="hint-text">Enter time range (e.g., "9am-5pm") or "Closed" for each day.</p>
                                {Object.keys(serviceForm.availability).map(day => (
                                    <div key={day} className="availability-day-input-row">
                                        <label htmlFor={`availability-${day}`}>{day.charAt(0).toUpperCase() + day.slice(1)}:</label>
                                        <input
                                            type="text"
                                            id={`availability-${day}`}
                                            name={`availability.${day}`}
                                            value={serviceForm.availability[day]}
                                            onChange={handleFormChange}
                                            placeholder="e.g. 9am-5pm or Closed"
                                            className="availability-time-input"
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="primary-button button">
                                    {isEditing ? 'Update Service' : 'Add Service'}
                                </button>
                                <button type="button" className="secondary-button button" onClick={handleCloseModal}> {/* Changed to close modal */}
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <hr/>

            {/* My Services Section: Displays the list of services */}
            <div className="dashboard-section my-services-section">
                <h3>My Services</h3>
                {services.length === 0 ? (
                    <p className="no-services-message">You have not added any services yet.</p>
                ) : (
                    <div className="services-list">
                        {services.map((service) => (
                            <div key={service.id} className="service-card">
                                {/* Service details */}
                                <h4>{service.name} ({service.status})</h4>
                                <p>Category: {service.category}</p>
                                <p>Description: {service.description}</p>
                                <p>Price: ${service.price}</p>
                                {/* Display formatted availability with times */}
                                <p>Availability:</p>
                                <ul className="availability-list">
                                    {Object.entries(service.availability || {}).map(([day, time]) => (
                                        <li key={day}>
                                            <strong>{day.charAt(0).toUpperCase() + day.slice(1)}:</strong> {time || 'N/A'}
                                        </li>
                                    ))}
                                </ul>
                                {service.image_url && <img src={service.image_url} alt={service.name} className="service-image" />}
                                
                                {/* Action buttons for each service */}
                                <div className="service-actions">
                                    <button onClick={() => handleEditService(service)} className="edit-button button">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDeleteService(service.id)} className="delete-button button">
                                        Delete
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

export default ProviderDashboard;
