import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { Truck, MapPin, CheckCircle } from 'lucide-react';

const DeliveryDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDeliveryData = async () => {
            const userInfo = localStorage.getItem('userInfo');
            const { token } = JSON.parse(userInfo);

            try {
                const res = await fetch('/api/orders/mydeliveries', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setOrders(data);

            } catch (err) {
                console.error('Failed to fetch delivery data');
            } finally {
                setLoading(false);
            }
        };

        fetchDeliveryData();
    }, []);

    const updateStatus = async (orderId, status) => {
        const userInfo = localStorage.getItem('userInfo');
        const { token } = JSON.parse(userInfo);

        try {
            const res = await fetch(`/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                alert(`Order marked as ${status}`);
                window.location.reload();
            }
        } catch (err) {
            alert('Update failed');
        }
    };

    if (loading) return <div className="pt-40 text-center">Loading Deliveries...</div>;

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            <div className="max-w-4xl mx-auto pt-28 px-4 pb-20">
                <div className="flex items-center gap-4 mb-8">
                    <Truck className="text-secondary" size={32} />
                    <h1 className="text-3xl font-bold">Delivery Partner Portal</h1>
                </div>

                <div className="space-y-6">
                    {orders.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                            <Truck size={48} className="mx-auto text-gray-200 mb-4" />
                            <p className="text-gray-500">No active deliveries assigned to you.</p>
                        </div>
                    ) : (
                        orders.map(order => (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-secondary"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-xs text-gray-400 font-mono">#{order._id.slice(-6).toUpperCase()}</p>
                                        <h3 className="font-bold text-lg">{order.user?.name || 'Customer'}</h3>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {order.status}
                                        </span>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${order.isPaid ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                            }`}>
                                            {order.isPaid ? 'PAID' : 'COLLECT CASH (COD)'}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div className="bg-gray-50 p-3 rounded-lg flex items-start gap-2">
                                        <MapPin size={16} className="text-red-500 mt-1 shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-bold">Delivery Address</p>
                                            <p className="text-sm">{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs text-gray-400 uppercase font-bold mb-1">Items to Deliver</p>
                                        <div className="space-y-1">
                                            {order.orderItems.map((item, idx) => (
                                                <div key={idx} className="flex justify-between text-xs">
                                                    <span>{item.name} <span className="text-primary font-bold">x{item.qty}</span></span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center bg-slate-900 text-white p-4 rounded-xl">
                                    <div>
                                        <p className="text-[10px] uppercase opacity-60">Total Bill</p>
                                        <p className="text-xl font-bold">৳{order.totalPrice.toFixed(2)}</p>
                                    </div>
                                    {order.status === 'Out for Delivery' ? (
                                        <button
                                            onClick={() => updateStatus(order._id, 'Delivered')}
                                            className="bg-emerald-500 hover:bg-emerald-600 px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
                                        >
                                            <CheckCircle size={18} />
                                            Finish Delivery
                                        </button>
                                    ) : (
                                        <span className="text-sm italic opacity-60">Status: {order.status}</span>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default DeliveryDashboard;
