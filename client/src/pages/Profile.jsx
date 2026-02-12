import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { User, Package, Clock, MapPin, CheckCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
            navigate('/login');
            return;
        }
        const parsedUser = JSON.parse(userInfo);
        setUser(parsedUser);

        const fetchOrders = async () => {
            try {
                const res = await fetch('/api/orders/myorders', {
                    headers: { 'Authorization': `Bearer ${parsedUser.token}` }
                });
                const data = await res.json();
                setOrders(data.reverse()); // Show newest first
            } catch (err) {
                console.error('Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/');
    };

    if (loading) return <div className="pt-40 text-center">Loading Profile...</div>;

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            <div className="max-w-4xl mx-auto pt-28 px-4 pb-20">
                {/* User Info Card */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
                    <div className="flex items-center gap-6">
                        <div className="bg-primary/10 p-5 rounded-full text-primary">
                            <User size={40} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">{user?.name}</h1>
                            <p className="text-gray-500">{user?.email}</p>
                            <span className="inline-block mt-2 px-3 py-1 bg-gray-100 rounded-full text-xs font-medium uppercase tracking-wide text-gray-600">
                                {user?.role} Account
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>

                {/* Order History */}
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Package className="text-primary" />
                    Order History
                </h2>

                <div className="space-y-6">
                    {orders.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
                            <Package size={48} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500">You haven't placed any orders yet.</p>
                            <button onClick={() => navigate('/menu')} className="mt-4 text-primary font-bold hover:underline">
                                Browse Menu
                            </button>
                        </div>
                    ) : (
                        orders.map(order => (
                            <div key={order._id} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="flex flex-col md:flex-row justify-between md:items-center border-b pb-4 mb-4 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-400 font-mono">ORDER #{order._id.slice(-6).toUpperCase()}</p>
                                        <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                                            order.status === 'Out for Delivery' ? 'bg-orange-100 text-orange-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {order.status === 'Delivered' ? <CheckCircle size={16} /> :
                                                order.status === 'Out for Delivery' ? <MapPin size={16} /> :
                                                    <Clock size={16} />}
                                            {order.status}
                                        </span>
                                        <div className="flex flex-col items-end ml-4">
                                            <p className="text-xl font-bold">৳{order.totalPrice.toFixed(2)}</p>
                                            <button
                                                onClick={() => navigate(`/tracking/${order._id}`)}
                                                className="text-xs text-primary font-bold hover:underline mt-1"
                                            >
                                                Track Details →
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {order.orderItems.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-sm text-gray-700">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-gray-400">x{item.qty}</span>
                                                <span>{item.name}</span>
                                            </div>
                                            <span>৳{(item.price * item.qty).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Profile;
