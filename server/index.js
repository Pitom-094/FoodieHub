const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));

const connectDB = require('./config/db');

// Connect to Database
connectDB();

const authRoutes = require('./routes/authRoutes');
const foodRoutes = require('./routes/foodRoutes');
const orderRoutes = require('./routes/orderRoutes');
const Food = require('./models/Food');

// Auto-seed data
const seedData = async () => {
    try {
        const count = await Food.countDocuments();
        if (count === 0) {
            const foodData = [
                {
                    name: "Truffle Mushroom Burger",
                    category: "Burger",
                    price: 18.99,
                    rating: 4.8,
                    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                    description: "Juicy beef patty topped with truffle oil, swiss cheese, and sautéed mushrooms.",
                },
                {
                    name: "Margherita Pizza",
                    category: "Pizza",
                    price: 14.50,
                    rating: 4.5,
                    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                    description: "Classic tomato sauce, fresh mozzarella, and basil on a wood-fired crust.",
                },
                {
                    name: "Salmon Poke Bowl",
                    category: "Healthy",
                    price: 22.00,
                    rating: 4.9,
                    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                    description: "Fresh salmon, avocado, edamame, and mango served over sushi rice.",
                },
                {
                    name: "Spicy Miso Ramen",
                    category: "Asian",
                    price: 16.00,
                    rating: 4.7,
                    image: "https://images.unsplash.com/photo-1557872943-16a5acbcbce3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                    description: "Rich miso broth with spicy chili oil, chashu pork, and soft-boiled egg.",
                },
                {
                    name: "Crispy Chicken Tacos",
                    category: "Mexican",
                    price: 12.99,
                    rating: 4.6,
                    image: "https://images.unsplash.com/photo-1613514785940-daed07799d9b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                    description: "Crispy fried chicken with slaw and spicy mayo in soft corn tortillas.",
                },
                {
                    name: "Chocolate Lava Cake",
                    category: "Dessert",
                    price: 9.50,
                    rating: 4.9,
                    image: "https://images.unsplash.com/photo-1617305855685-6187747e622b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                    description: "Warm chocolate cake with a molten center, served with vanilla bean ice cream.",
                }
            ];
            await Food.insertMany(foodData);
            console.log('Database seeded with initial food items!');
        }
    } catch (err) {
        console.error('Auto-seeding failed:', err.message);
    }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
    res.send('FoodieHub API is running...');
});

app.listen(PORT, async () => {
    await seedData();
    console.log(`Server running on port ${PORT}`);
});
