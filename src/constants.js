// src/constants.js - COMPLETE REPLACEMENT CODE

// Service limits for different subscription plans
export const SERVICE_LIMITS = {
    'Free': 1,        // Free plan allows 1 service
    'Basic Pro': 5,   // Basic Pro allows 5 services
    'Premium': Infinity // Premium allows unlimited services
};

// Predetermined list of service categories for providers to choose from
// This will be used in a dropdown/searchable select on the frontend
// and for validation on the backend.
export const SERVICE_CATEGORIES = [
    'Technology & IT Services',
    'Home Services',
    'Personal Care & Wellness',
    'Creative & Design',
    'Education & Tutoring',
    'Automotive Services',
    'Event Services',
    'Professional Services',
    'Health & Fitness',
    'Repair & Maintenance',
    'Cleaning Services',
    'Pet Services',
    'Financial Services',
    'Legal Services',
    'Marketing & Advertising',
    'Writing & Translation',
    'Photography & Videography',
    'Travel & Hospitality',
    'Fashion & Apparel',
    'Childcare & Eldercare'
];

// Plans that require admin approval for service edits/deletions
export const PLANS_REQUIRING_APPROVAL_FRONTEND = ['Free', 'Basic Pro'];