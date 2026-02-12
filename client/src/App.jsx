import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Contact from './pages/Contact';
import OrderTracking from './pages/OrderTracking';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';
import Profile from './pages/Profile';
import About from './pages/About';
import { CartProvider } from './context/CartContext';
import Cart from './components/Cart';

function App() {
    return (
        <CartProvider>
            <Cart />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/tracking/:id" element={<OrderTracking />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/delivery" element={<DeliveryDashboard />} />
            </Routes>
        </CartProvider>
    );
}

export default App;
