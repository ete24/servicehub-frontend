// src/components/ServiceFormModal.jsx
import React, { useState, useEffect } from 'react';
import './ServiceFormModal.css'; // You'll need to create this CSS file too

const ServiceFormModal = ({ isOpen, onClose, onSubmit, initialData = {}, isEditing }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        price: '',
        image_url: '',
        availability: {
            monday: '', tuesday: '', wednesday: '', thursday: '',
            friday: '', saturday: '', sunday: ''
        }
    });
    const [formError, setFormError] = useState('');

    useEffect(() => {
        // Populate form if we are editing an existing service
        if (isEditing && initialData) {
            setFormData({
                name: initialData.name || '',
                category: initialData.category || '',
                description: initialData.description || '',
                price: initialData.price !== undefined ? initialData.price.toString() : '', // Convert number to string
                image_url: initialData.image_url || '',
                availability: initialData.availability || {
                    monday: '', tuesday: '', wednesday: '', thursday: '',
                    friday: '', saturday: '', sunday: ''
                }
            });
        } else {
            // Reset form for adding new service
            setFormData({
                name: '', category: '', description: '', price: '', image_url: '',
                availability: { monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '' }
            });
        }
        setFormError(''); // Clear error when modal opens/changes mode
    }, [isEditing, initialData, isOpen]); // Reset when modal opens or initialData changes

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvailabilityChange = (day, value) => {
        setFormData(prev => ({
            ...prev,
            availability: {
                ...prev.availability,
                [day]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        // Basic client-side validation
        if (!formData.name || !formData.category || !formData.description || !formData.price) {
            setFormError('Please fill in all required fields.');
            return;
        }
        if (isNaN(parseFloat(formData.price))) {
            setFormError('Price must be a valid number.');
            return;
        }

        try {
            await onSubmit(isEditing ? initialData.id : null, { // Pass serviceId if editing
                ...formData,
                price: parseFloat(formData.price) // Ensure price is a number for submission
            });
            onClose(); // Close modal on successful submission (handled by parent)
        } catch (error) {
            // Error handling will be done by the parent component's onSubmit (e.g., handleAddService/handleUpdateService)
            // The parent will update its formMessage state, which ProviderDashboard can display.
            // For now, we'll just log an internal error for this modal.
            console.error('ServiceFormModal: Submission failed, parent to handle error state.');
        }
    };

    // List of days for availability
    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close-button" onClick={onClose}>&times;</button>
                <h2>{isEditing ? 'Edit Service' : 'Add New Service'}</h2>
                {formError && <p className="form-message error">{formError}</p>}
                <form onSubmit={handleSubmit} className="service-form">
                    <div className="form-group">
                        <label htmlFor="name">Service Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="category">Category:</label>
                        <input
                            type="text"
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description:</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Price (e.g., 50.00):</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="image_url">Image URL (Optional):</label>
                        <input
                            type="text"
                            id="image_url"
                            name="image_url"
                            value={formData.image_url}
                            onChange={handleChange}
                        />
                    </div>

                    <h3 className="block-label">Availability:</h3>
                    <p className="hint-text">E.g., "9:00 AM - 5:00 PM" or "By Appointment"</p>
                    {daysOfWeek.map(day => (
                        <div className="availability-day-input-row" key={day}>
                            <label htmlFor={`availability-${day}`}>{day.charAt(0).toUpperCase() + day.slice(1)}:</label>
                            <input
                                type="text"
                                id={`availability-${day}`}
                                value={formData.availability[day]}
                                onChange={(e) => handleAvailabilityChange(day, e.target.value)}
                                className="availability-time-input"
                            />
                        </div>
                    ))}

                    <div className="form-actions">
                        <button type="button" onClick={onClose} className="button secondary-button">Cancel</button>
                        <button type="submit" className="button primary-button">{isEditing ? 'Update Service' : 'Add Service'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ServiceFormModal;
