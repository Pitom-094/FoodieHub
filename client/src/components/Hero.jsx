import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <div className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-900">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')",
                    filter: "brightness(0.3)"
                }}
            />

            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="block text-secondary font-semibold tracking-wider uppercase mb-4">
                        Welcome to FoodieHub
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        Taste the <span className="text-primary italic">Extraordinary</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                        Experience culinary excellence delivered to your doorstep. Fresh ingredients, masterful recipes, and passion in every bite.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button className="px-8 py-4 bg-primary hover:bg-emerald-600 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-lg shadow-primary/30 w-full sm:w-auto">
                            View Menu
                        </button>
                        <button className="px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 font-bold rounded-full transition-all w-full sm:w-auto">
                            Book a Table
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;
