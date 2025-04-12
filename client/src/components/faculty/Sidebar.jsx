import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const Sidebar = ({ features, activeFeature, setActiveFeature, handleLogout, setIsSidebarOpen }) => {
    return (
        <div className="w-64 bg-gray-800 text-white p-6 relative min-h-screen shadow-lg">
            {/* Close Button */}
            <button
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-200 focus:outline-none"
                aria-label="Close sidebar"
            >
                <AiOutlineClose className="w-5 h-5" />
            </button>

            {/* Features List */}
            <div className="mt-12">
                <ul className="space-y-4">
                    {features.map((feature) => (
                        <li
                            key={feature.name}
                            className={`cursor-pointer p-3 rounded-lg text-lg font-medium transition-all duration-300 ${
                                activeFeature === feature.name
                                    ? 'bg-blue-600 text-white'
                                    : 'hover:bg-gray-700'
                            }`}
                            onClick={() => setActiveFeature(feature.name)}
                        >
                            {feature.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;