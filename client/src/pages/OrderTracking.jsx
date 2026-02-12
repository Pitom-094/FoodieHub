import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Truck, MapPin, Package } from 'lucide-react';

import { useParams } from 'react-router-dom';

const OrderTracking = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            const userInfo = localStorage.getItem('userInfo');
            if (!userInfo) {
                setLoading(false);
                return;
            }

            const { token } = JSON.parse(userInfo);

            try {
                const response = await fetch(`/api/orders/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setOrder(data);
            } catch (err) {
                console.error('Failed to fetch order');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    const steps = [
        { icon: <Package />, title: "Order Placed", desc: "We have received your order.", active: true },
        { icon: <Clock />, title: "Preparing", desc: "Your food is being prepared.", active: ['Preparing', 'Out for Delivery', 'Delivered'].includes(order?.status) },
        { icon: <Truck />, title: "Out for Delivery", desc: "Rider has picked up your order.", active: ['Out for Delivery', 'Delivered'].includes(order?.status) },
        { icon: <MapPin />, title: "Delivered", desc: "Enjoy your meal!", active: order?.status === 'Delivered' },
    ];

    if (loading) return <div className="pt-40 text-center">Loading...</div>;

    if (!order) return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-grow flex items-center justify-center pt-28">
                <div className="text-center">
                    <Package size={64} className="mx-auto text-gray-300 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800">No active orders</h2>
                    <p className="text-gray-500 mt-2">Hungry? Order something delicious!</p>
                </div>
            </div>
            <Footer />
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col text-slate-800">
            <Navbar />

            <div className="flex-grow pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
                >
                    <div className="flex justify-between items-center mb-8 border-b pb-4">
                        <h1 className="text-2xl font-bold text-gray-900">Order #{order._id.slice(-6).toUpperCase()}</h1>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">In Progress</span>
                    </div>

                    <div className="relative">
                        {/* Vertical Line */}
                        <div className="absolute left-6 top-8 bottom-8 w-1 bg-gray-200"></div>

                        <div className="space-y-12">
                            {steps.map((step, index) => (
                                <div key={index} className="relative flex items-start group">
                                    <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 border-white shadow-md transition-colors ${step.active ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}>
                                        {React.cloneElement(step.icon, { size: 20 })}
                                    </div>
                                    <div className="ml-6 pt-2">
                                        <h3 className={`text-lg font-bold ${step.active ? 'text-gray-900' : 'text-gray-400'}`}>{step.title}</h3>
                                        <p className="text-slate-500 text-sm">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-12 bg-gray-50 p-6 rounded-xl">
                        <h4 className="font-bold text-gray-800 mb-4">Order Summary</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                            {order.orderItems.map((item, idx) => (
                                <div key={idx} className="flex justify-between">
                                    <span>{item.name} x {item.qty}</span>
                                    <span>৳{(item.price * item.qty).toFixed(2)}</span>
                                </div>
                            ))}
                            <div className="border-t pt-2 mt-2 flex justify-between font-bold text-gray-900 text-base">
                                <span>Total Paid</span>
                                <span>৳{order.totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <Footer />
        </div>
    );
};

export default OrderTracking;
