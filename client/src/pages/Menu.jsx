import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FoodCard from '../components/FoodCard';
// import { foodData } from '../data/foodData';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../utils/api';

const categories = ["All", "Burger", "Pizza", "Asian", "Mexican", "Healthy", "Dessert"];

const Menu = () => {
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFoods = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/food`);
                const data = await response.json();
                setFoods(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch menu items');
                setLoading(false);
            }
        };

        fetchFoods();
    }, []);

    const filteredFood = foods.filter((food) => {
        const matchesCategory = activeCategory === "All" || food.category === activeCategory;
        const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <Navbar />

            <div className="flex-grow pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Menu</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Explore our curated selection of dishes, crafted with passion and the finest ingredients.
                    </p>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                    {/* Categories */}
                    <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 w-full md:w-auto hide-scrollbar">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === category
                                    ? "bg-primary text-white shadow-md shadow-primary/30"
                                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-80">
                        <input
                            type="text"
                            placeholder="Search dishes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    </div>
                </div>

                {/* Food Grid */}
                {filteredFood.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredFood.map((food) => (
                            <FoodCard key={food._id} food={food} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No dishes found. Try a different category or search term.</p>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Menu;
