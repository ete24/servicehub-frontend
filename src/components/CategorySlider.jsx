// src/components/CategorySlider.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const categories = [
    { name: 'Cleaning', icon: '🧹' },
    { name: 'Repairs', icon: '🛠️' },
    { name: 'Tutoring', icon: '📚' },
    { name: 'Wellness', icon: '🧘' },
    { name: 'Beauty', icon: '💅' },
    { name: 'Tech Support', icon: '💻' },
    { name: 'Plumbing', icon: '💧' },
    { name: 'Electrical', icon: '💡' },
    { name: 'Gardening', icon: '🌳' },
    { name: 'Photography', icon: '📸' },
    { name: 'Pet Care', icon: '🐾' },
    { name: 'Delivery', icon: '📦' },
    { name: 'Writing', icon: '✍️' },
    { name: 'Fitness', icon: '💪' },
    { name: 'Automotive', icon: '🚗' },
];

const VISIBLE_CARDS_COUNT = 5; // How many cards are visible at once in the slider

// Create an extended list for seamless looping:
// Original categories + a slice of the beginning categories
const extendedCategories = [
    ...categories, 
    ...categories.slice(0, VISIBLE_CARDS_COUNT) 
];

const CategorySlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true); // Controls CSS transition for smooth slide/instant jump
    const navigate = useNavigate();
    const sliderRef = useRef(null); // Ref to the slider div for imperative control

    // Auto-sliding logic for continuous loop
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                const nextIndex = prevIndex + 1;
                // If we're about to slide into a "cloned" category (which visually matches the start)
                if (nextIndex >= categories.length) {
                    // Disable transition for an instant "jump" back to the real start
                    setIsTransitioning(false);
                    // After a very short delay (allowing the non-transitioned render), jump to 0
                    // The delay should be minimal but enough for the browser to register `isTransitioning(false)`
                    setTimeout(() => {
                        setCurrentIndex(0);
                        // Re-enable transition after the jump, for the *next* smooth slide
                        setTimeout(() => setIsTransitioning(true), 50); 
                    }, 500); // This delay should match the CSS transition duration
                }
                return nextIndex;
            });
        }, 3000); // Change category every 3 seconds

        return () => clearInterval(interval);
    }, [categories.length]); // Re-run effect if categories array length changes (though static here)

    // Handle click on a category card
    const handleCategoryClick = (categoryName) => {
        navigate('/services', { state: { category: categoryName } });
    };

    return (
        <section className="py-12 bg-gradient-to-r from-blue-50 to-indigo-50 overflow-hidden relative">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-10 drop-shadow-sm">
                    Browse by Category
                </h2>

                <div className="relative">
                    {/* Slider container - dynamically control transition */}
                    <div 
                        ref={sliderRef}
                        className={`flex ${isTransitioning ? 'transition-transform duration-500 ease-in-out' : ''}`}
                        style={{ transform: `translateX(-${currentIndex * (100 / VISIBLE_CARDS_COUNT)}%)` }}
                    >
                        {extendedCategories.map((category, index) => (
                            <div 
                                key={`${category.name}-${index}`} // Unique key using index is important for duplicated items
                                className="flex-none w-1/5 p-3" // Show 5 cards at a time, adjust width as needed
                                onClick={() => handleCategoryClick(category.name)}
                            >
                                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 flex flex-col items-center justify-center p-6 cursor-pointer border border-blue-100">
                                    <span className="text-5xl mb-4" role="img" aria-label={category.name}>
                                        {category.icon}
                                    </span>
                                    <h3 className="text-lg font-semibold text-gray-800 text-center">
                                        {category.name}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Dots (Optional) - now reflect the actual (non-extended) categories */}
                    <div className="flex justify-center mt-6 space-x-2">
                        {categories.map((_, index) => ( // Use original categories for dots
                            <span
                                key={index}
                                className={`h-2 w-2 rounded-full cursor-pointer transition-colors duration-300 ${
                                    (currentIndex % categories.length) === index ? 'bg-blue-600' : 'bg-gray-300'
                                }`}
                                onClick={() => {
                                    setIsTransitioning(true); // Ensure transition is on for manual click
                                    setCurrentIndex(index);
                                }}
                            ></span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CategorySlider;
