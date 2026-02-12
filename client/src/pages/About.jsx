import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { Utensils, Award, Users, Heart, CheckCircle } from 'lucide-react';

const About = () => {
    const stats = [
        { icon: <Utensils className="text-primary" />, label: 'Exquisite Dishes', value: '150+' },
        { icon: <Users className="text-secondary" />, label: 'Happy Customers', value: '50K+' },
        { icon: <Award className="text-amber-500" />, label: 'Awards Won', value: '12' },
        { icon: <Heart className="text-red-500" />, label: 'Years of Love', value: '10+' },
    ];

    const values = [
        {
            title: "Quality First",
            description: "We source only the finest, freshest ingredients from local sustainable farms to ensure every bite is a masterpiece.",
            icon: <CheckCircle className="text-primary" size={24} />
        },
        {
            title: "Fast Delivery",
            description: "Our dedicated logistics team ensures your meal reaches you steaming hot and ready to enjoy within minutes.",
            icon: <CheckCircle className="text-primary" size={24} />
        },
        {
            title: "Passionate Chefs",
            description: "Our world-class chefs bring international expertise and artistic flair to every recipe they craft.",
            icon: <CheckCircle className="text-primary" size={24} />
        }
    ];

    return (
        <div className="bg-slate-50 min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:w-1/2"
                    >
                        <span className="text-primary font-bold uppercase tracking-widest text-sm bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 mb-6 inline-block">
                            Our Story
                        </span>
                        <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 mb-6 leading-tight">
                            Redefining the <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Dining Experience</span>
                        </h1>
                        <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                            Founded in 2014, FoodieHub started with a simple belief: that everyone deserves restaurant-quality food at their doorstep. What began as a small passion project has evolved into a leading culinary movement.
                        </p>
                        <div className="flex gap-4">
                            <button className="bg-primary text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-primary/30 hover:bg-emerald-600 transition-all transform hover:-translate-y-1">
                                Discover More
                            </button>
                            <button className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-full font-bold hover:bg-slate-50 transition-all">
                                Contact Us
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:w-1/2 relative"
                    >
                        <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                            <img src="https://images.unsplash.com/photo-1550966842-28c460d3817f?auto=format&fit=crop&w=800&q=80" alt="Our Kitchen" className="w-full h-auto" />
                        </div>
                        {/* Decorative background elements */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl -z-0"></div>
                        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-primary/10 rounded-full blur-3xl -z-0"></div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all"
                        >
                            <div className="flex justify-center mb-4 text-3xl">
                                {stat.icon}
                            </div>
                            <h3 className="text-3xl font-extrabold text-slate-900 mb-1">{stat.value}</h3>
                            <p className="text-slate-500 font-medium">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-24 px-4">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row-reverse items-center gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:w-1/2"
                    >
                        <h2 className="text-4xl font-bold text-slate-900 mb-8">Our Mission & Core Values</h2>
                        <div className="space-y-8 text-slate-600">
                            {values.map((v, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="mt-1 shadow-sm h-fit">
                                        {v.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-slate-900 mb-2">{v.title}</h4>
                                        <p>{v.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="lg:w-1/2 grid grid-cols-2 gap-4"
                    >
                        <div className="space-y-4 pt-12">
                            <img src="https://images.unsplash.com/photo-1466632346940-1ed49e32f4c4?auto=format&fit=crop&w=500&q=80" alt="Fresh Food" className="rounded-2xl shadow-lg border-4 border-white" />
                            <div className="bg-secondary p-8 rounded-2xl text-white text-center shadow-lg">
                                <p className="text-4xl font-black italic">100%</p>
                                <p className="font-bold opacity-80">Natural</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-primary p-8 rounded-2xl text-white text-center shadow-lg">
                                <p className="text-4xl font-black">FAST</p>
                                <p className="font-bold opacity-80">Delivery</p>
                            </div>
                            <img src="https://images.unsplash.com/photo-1600566752355-397921163098?auto=format&fit=crop&w=500&q=80" alt="Our Team" className="rounded-2xl shadow-lg border-4 border-white" />
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default About;
