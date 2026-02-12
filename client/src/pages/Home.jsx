import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import FoodCard from '../components/FoodCard';

const Home = () => {
    const [featuredFoods, setFeaturedFoods] = useState([]);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const response = await fetch('/api/food');
                const data = await response.json();
                setFeaturedFoods(data.slice(0, 3));
            } catch (err) {
                console.error('Failed to fetch featured foods');
            }
        };
        fetchFeatured();
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            <Hero />
            {/* Featured Section */}
            <div className="py-20 px-4 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Our Signature Dishes</h2>
                    <p className="text-gray-600">Top picks from our master chefs</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredFoods.map((food) => (
                        <FoodCard key={food._id} food={food} />
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Home;
