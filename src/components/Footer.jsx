// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 font-inter">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div className="col-span-1">
          <h3 className="text-2xl font-bold text-blue-400 mb-4">ServiceHub</h3>
          <p className="text-gray-400 text-sm">
            Your trusted platform for connecting with local service professionals.
            Quality service, just a click away.
          </p>
        </div>

        {/* Quick Links */}
        <div className="col-span-1">
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul>
            <li className="mb-2"><Link to="/" className="text-gray-400 hover:text-white transition duration-200">Home</Link></li>
            <li className="mb-2"><Link to="/services" className="text-gray-400 hover:text-white transition duration-200">Browse Services</Link></li>
            <li className="mb-2"><Link to="/how-it-works" className="text-gray-400 hover:text-white transition duration-200">How It Works</Link></li>
            <li className="mb-2"><Link to="/register" className="text-gray-400 hover:text-white transition duration-200">Become a Provider</Link></li>
            {/* Add more links as needed, e.g., Privacy Policy, Terms of Service */}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="col-span-1">
          <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
          <p className="text-gray-400 text-sm mb-2">Email: <a href="mailto:info@servicehub.com" className="hover:underline">info@servicehub.com</a></p>
          <p className="text-gray-400 text-sm mb-2">Phone: <a href="tel:+1234567890" className="hover:underline">+1 (234) 567-890</a></p>
          <p className="text-gray-400 text-sm">Address: 123 Service Lane, Cityville, Country</p>
        </div>

        {/* Social Media (Placeholder) */}
        <div className="col-span-1">
          <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition duration-200">
              {/* Replace with actual SVG icons if desired */}
              <i className="fab fa-facebook-f text-xl"></i> {/* FontAwesome example */}
              Facebook
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition duration-200">
              <i className="fab fa-twitter text-xl"></i>
              Twitter
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition duration-200">
              <i className="fab fa-linkedin-in text-xl"></i>
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-10 pt-8 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} ServiceHub. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
