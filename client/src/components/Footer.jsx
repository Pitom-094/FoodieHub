import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                            FoodieHub
                        </h3>
                        <p className="text-gray-400">
                            Delivering the best food experience to your doorstep. fast, fresh, and delicious.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-primary">Quick Links</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Menu</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-primary">Contact</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li>123 Foodie Street</li>
                            <li>Flavor Town, FT 12345</li>
                            <li>Phone: (123) 456-7890</li>
                            <li>Email: hello@foodiehub.com</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-primary">Follow Us</h4>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook size={24} /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter size={24} /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram size={24} /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Linkedin size={24} /></a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
                    <p>&copy; {new Date().getFullYear()} FoodieHub. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
