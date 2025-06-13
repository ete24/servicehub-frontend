// src/components/EditServiceForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- NEW: Define plans that require approval (must match backend) ---
const PLANS_REQUIRING_APPROVAL = ['Free', 'Basic Pro'];

function EditServiceForm({ serviceToEdit, token, onServiceUpdated, onClose, providerSubscriptionPlan }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const requiresApproval = PLANS_REQUIRING_APPROVAL.includes(providerSubscriptionPlan);

    useEffect(() => {
        // Pre-fill form fields when serviceToEdit changes
        // Use pending_ fields if service is pending_edit, otherwise use active fields
        if (serviceToEdit) {
            if (serviceToEdit.status === 'pending_edit' && serviceToEdit.pending_name) {
                // If service is pending_edit and has pending data, use it for pre-filling
                setName(serviceToEdit.pending_name || '');
                setDescription(serviceToEdit.pending_description || '');
                setPrice(serviceToEdit.pending_price || '');
                setCategory(serviceToEdit.pending_category || '');
                setMessage('This service is currently pending approval. You can resubmit changes.');
            } else {
                // Otherwise, use active data
                setName(serviceToEdit.name || '');
                setDescription(serviceToEdit.description || '');
                setPrice(serviceToEdit.price || '');
                setCategory(serviceToEdit.category || '');
            }
        }
    }, [serviceToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        if (!name || !description || !price || !category) {
            setError('All fields are required.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:5000/api/services/${serviceToEdit.id}`,
                { name, description, price, category },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Display message based on backend response (which is now conditional)
            setMessage(response.data.message);
            onServiceUpdated(response.data.service); // Callback to update parent and close modal
        } catch (err) {
            console.error('Error updating service:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.error || 'Failed to update service.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}
            {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

            <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Service Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                    required
                />
            </div>
            <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description:</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', minHeight: '80px' }}
                    required
                ></textarea>
            </div>
            <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Price:</label>
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                    required
                />
            </div>
            <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Category:</label>
                <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                    required
                />
            </div>
            <button
                type="submit"
                disabled={loading}
                style={{
                    padding: '12px 20px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '1em',
                    marginTop: '10px'
                }}
            >
                {loading ? 'Submitting...' : 'Save Changes'}
            </button>
            <button
                type="button"
                onClick={onClose}
                style={{
                    padding: '10px 15px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '0.9em',
                    marginTop: '5px'
                }}
            >
                Cancel
            </button>
        </form>
    );
}

export default EditServiceForm;