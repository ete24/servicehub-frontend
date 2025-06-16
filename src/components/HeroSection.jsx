// src/components/HeroSection.jsx
import React, { useState, useEffect } from 'react';
import ServiceSearchForm from './ServiceSearchForm.jsx'; // Ensure .jsx extension

const HeroSection = () => {
  // Array of image URLs for the slider
  // Use placeholder images for now. Replace with actual images later.
  const images = [
    'https://placehold.co/1200x600/add8e6/000000?text=ServiceHub+Cleaning',
    'https://placehold.co/1200x600/90ee90/000000?text=ServiceHub+Repairs',
    'https://placehold.co/1200x600/f08080/000000?text=ServiceHub+Tutoring',
    'https://placehold.co/1200x600/dda0dd/000000?text=ServiceHub+Wellness',
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Automatically cycle through images every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative w-full h-96 md:h-[500px] lg:h-[600px] overflow-hidden flex items-center justify-center">
      {/* Background Image Slider */}
      {images.map((imgSrc, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url(${imgSrc})` }}
          // Fallback image in case the primary image fails to load
          onError={(e) => { e.target.src = 'https://placehold.co/1200x600/cccccc/000000?text=Image+Not+Found'; }}
        ></div>
      ))}

      {/* Overlay for tint and text/search form */}
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center p-4 text-center z-10">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
          Your Go-To for Local Services
        </h1>
        <p className="text-xl sm:text-2xl text-white mb-8 max-w-2xl drop-shadow-md">
          Connecting you with trusted professionals right in your neighborhood.
        </p>

        {/* Search Form Overlay */}
        <div className="w-full max-w-4xl px-4">
          <ServiceSearchForm />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
