import React from 'react';
import { Star, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

const FoodCard = ({ food }) => {
    const { addToCart } = useCart();

    return (
        <motion.div
            whileHover={{ y: -10 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl"
        >
            <div className="relative h-48 overflow-hidden">
                <img
                    src={food.image}
                    alt={food.name}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-sm font-bold text-gray-800 flex items-center shadow-sm">
                    <Star size={14} className="text-yellow-400 mr-1 fill-current" />
                    {food.rating}
                </div>
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-800 line-clamp-1">{food.name}</h3>
                    <span className="text-lg font-bold text-primary">৳{food.price}</span>
                </div>

                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{food.description}</p>

                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                        {food.category}
                    </span>
                    <button
                        onClick={() => addToCart(food)}
                        className="flex items-center justify-center bg-primary hover:bg-emerald-600 text-white w-8 h-8 rounded-full transition-colors shadow-md shadow-primary/30"
                    >
                        <Plus size={18} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default FoodCard;
