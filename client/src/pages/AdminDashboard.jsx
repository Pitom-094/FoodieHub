import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { ShoppingBag, Users, Truck, CheckCircle } from 'lucide-react';
import { API_BASE_URL } from '../utils/api';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('orders');
    const [orders, setOrders] = useState([]);
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deliveryUsers, setDeliveryUsers] = useState([]);
    const [showFoodForm, setShowFoodForm] = useState(false);
    const [newFood, setNewFood] = useState({
        name: '', category: '', price: '', description: '', image: '', rating: 4.5
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchAdminData = async () => {
            const userInfo = localStorage.getItem('userInfo');
            const { token } = JSON.parse(userInfo);

            try {
                const [ordersRes, foodsRes, deliveryRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/orders`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch(`${API_BASE_URL}/api/food`),
                    fetch(`${API_BASE_URL}/api/auth/delivery`, { headers: { 'Authorization': `Bearer ${token}` } })
                ]);

                const ordersData = await ordersRes.json();
                const foodsData = await foodsRes.json();
                const deliveryData = await deliveryRes.json();

                setOrders(ordersData);
                setFoods(foodsData);
                setDeliveryUsers(deliveryData);

            } catch (err) {
                console.error('Failed to fetch admin data');
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, []);

    const handleAssign = async (orderId, deliveryPersonId) => {
        const userInfo = localStorage.getItem('userInfo');
        const { token } = JSON.parse(userInfo);
        try {
            const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/assign`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ deliveryPersonId })
            });
            if (res.ok) window.location.reload();
        } catch (err) { alert('Failed to assign order'); }
    };

    const handleUpdateStatus = async (orderId, status) => {
        const userInfo = localStorage.getItem('userInfo');
        const { token } = JSON.parse(userInfo);
        try {
            const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status })
            });
            if (res.ok) window.location.reload();
        } catch (err) { alert('Failed to update status'); }
    };

    const handleDeleteFood = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        const userInfo = localStorage.getItem('userInfo');
        const { token } = JSON.parse(userInfo);
        try {
            const res = await fetch(`${API_BASE_URL}/api/food/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setFoods(foods.filter(f => f._id !== id));
            }
        } catch (err) { alert('Failed to delete food'); }
    };

    const handleAddFood = async (e) => {
        e.preventDefault();
        const userInfo = localStorage.getItem('userInfo');
        const { token } = JSON.parse(userInfo);

        // Auto-generate image if not provided
        let foodData = { ...newFood };
        if (!foodData.image || foodData.image.trim() === '') {
            try {
                const imageRes = await fetch(`${API_BASE_URL}/api/food/generate-image`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ foodName: newFood.name, category: newFood.category })
                });

                if (imageRes.ok) {
                    const imageData = await imageRes.json();
                    foodData.image = imageData.imageUrl;
                } else {
                    throw new Error('Backend generation failed');
                }
            } catch (err) {
                console.error('Image generation failed:', err);
                foodData.image = `https://loremflickr.com/400/300/food,${encodeURIComponent(newFood.name)}`;
            }
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/food`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(foodData)
            });
            if (res.ok) window.location.reload();
        } catch (err) { alert('Failed to add food'); }
    };

    if (loading) return <div className="pt-40 text-center">Loading Admin Panel...</div>;

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            <div className="max-w-7xl mx-auto pt-28 px-4 pb-20">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Admin Hub</h1>
                    <div className="flex bg-white p-1 rounded-lg shadow-sm">
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`px-4 py-2 rounded-md font-medium transition-all ${activeTab === 'orders' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            Orders
                        </button>
                        <button
                            onClick={() => setActiveTab('menu')}
                            className={`px-4 py-2 rounded-md font-medium transition-all ${activeTab === 'menu' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            Menu Management
                        </button>
                    </div>
                </div>

                {activeTab === 'orders' ? (
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-600 text-sm font-medium">
                                    <tr>
                                        <th className="px-6 py-4">Order ID</th>
                                        <th className="px-6 py-4">Customer</th>
                                        <th className="px-6 py-4">Total</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {orders.map((order) => (
                                        <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs">#{order._id.slice(-6).toUpperCase()}</td>
                                            <td className="px-6 py-4 font-medium">{order.user?.name || 'Guest'}</td>
                                            <td className="px-6 py-4 font-bold text-primary">৳{order.totalPrice.toFixed(2)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                                                    order.status === 'Out for Delivery' ? 'bg-orange-100 text-orange-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    } `}>{order.status}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {order.status === 'Pending' ? (
                                                    <button
                                                        onClick={() => handleUpdateStatus(order._id, 'Preparing')}
                                                        className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-blue-600 transition-colors"
                                                    >
                                                        Accept & Prepare
                                                    </button>
                                                ) : order.status === 'Preparing' ? (
                                                    <select
                                                        onChange={(e) => handleAssign(order._id, e.target.value)}
                                                        className="text-sm border rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-primary"
                                                        defaultValue=""
                                                    >
                                                        <option value="" disabled>Assign Rider</option>
                                                        {deliveryUsers.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                                                    </select>
                                                ) : <span className="text-gray-400 text-sm italic">Assigned</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="flex justify-end mb-6">
                            <button
                                onClick={() => setShowFoodForm(!showFoodForm)}
                                className="bg-primary text-white px-6 py-2 rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-primary/30"
                            >
                                {showFoodForm ? 'Cancel' : '+ Add New Item'}
                            </button>
                        </div>

                        {showFoodForm && (
                            <motion.form
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                onSubmit={handleAddFood}
                                className="bg-white p-8 rounded-2xl shadow-xl mb-8 border border-gray-100"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <input required placeholder="Name" className="border p-3 rounded-lg" value={newFood.name} onChange={e => setNewFood({ ...newFood, name: e.target.value })} />
                                    <input required placeholder="Category" className="border p-3 rounded-lg" value={newFood.category} onChange={e => setNewFood({ ...newFood, category: e.target.value })} />
                                    <input required type="number" placeholder="Price" className="border p-3 rounded-lg" value={newFood.price} onChange={e => setNewFood({ ...newFood, price: e.target.value })} />
                                    <input placeholder="Image URL (leave blank for auto-generate)" className="border p-3 rounded-lg" value={newFood.image} onChange={e => setNewFood({ ...newFood, image: e.target.value })} />
                                    <textarea required placeholder="Description" className="border p-3 rounded-lg md:col-span-2" value={newFood.description} onChange={e => setNewFood({ ...newFood, description: e.target.value })} />
                                </div>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className={`mt-4 bg-gray-900 text-white px-8 py-3 rounded-xl font-bold transition-all ${saving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'}`}
                                >
                                    {saving ? 'Generating Beautiful Image...' : 'Save Item'}
                                </button>
                            </motion.form>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {foods.map(food => (
                                <div key={food._id} className="bg-white p-4 rounded-xl shadow-md flex gap-4 items-center">
                                    <img src={food.image} alt={food.name} className="w-20 h-20 rounded-lg object-cover" />
                                    <div className="flex-1">
                                        <h3 className="font-bold">{food.name}</h3>
                                        <p className="text-gray-500 text-sm">৳{food.price}</p>
                                    </div>
                                    <button onClick={() => handleDeleteFood(food._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                                        Trash
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default AdminDashboard;
