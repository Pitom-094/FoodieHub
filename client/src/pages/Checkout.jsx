import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Banknote, Shield, CheckCircle, Lock, ArrowLeft } from 'lucide-react';
import { API_BASE_URL } from '../utils/api';

const Checkout = () => {
    const { cart, total } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [step, setStep] = useState('address'); // 'address' | 'payment' | 'bank-verify' | 'success'

    // Online Banking form
    const [bankDetails, setBankDetails] = useState({
        bankName: '',
        accountNumber: '',
        accountHolder: ''
    });
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpSent, setOtpSent] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [verified, setVerified] = useState(false);
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [demoOtpDisplay, setDemoOtpDisplay] = useState('');

    const [address, setAddress] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: 'Bangladesh'
    });

    const banks = [
        { id: 'bkash', name: 'bKash', color: 'bg-pink-500' },
        { id: 'nagad', name: 'Nagad', color: 'bg-orange-500' },
        { id: 'rocket', name: 'Rocket', color: 'bg-purple-600' },
        { id: 'dbbl', name: 'Dutch-Bangla', color: 'bg-green-700' },
        { id: 'city', name: 'City Bank', color: 'bg-blue-600' },
        { id: 'brac', name: 'BRAC Bank', color: 'bg-indigo-600' },
    ];

    const handleAddressSubmit = (e) => {
        e.preventDefault();
        setStep('payment');
    };

    const handleSendOtp = async () => {
        if (!bankDetails.bankName || !bankDetails.accountNumber || !bankDetails.accountHolder) {
            setError('Please fill in all banking details');
            return;
        }
        setError('');
        setVerifying(true);

        // Simulate OTP generation & sending
        const fakeOtp = String(Math.floor(100000 + Math.random() * 900000));
        setGeneratedOtp(fakeOtp);

        setTimeout(() => {
            setOtpSent(true);
            setVerifying(false);
            // Show OTP inline for demo purposes
            setDemoOtpDisplay(fakeOtp);
        }, 1500);
    };

    const handleVerifyOtp = () => {
        const enteredOtp = otp.join('');
        if (enteredOtp.length !== 6) {
            setError('Please enter the complete 6-digit OTP');
            return;
        }

        setVerifying(true);
        setError('');

        setTimeout(() => {
            if (enteredOtp === generatedOtp) {
                setVerified(true);
                setVerifying(false);
            } else {
                setError('Invalid OTP. Please try again.');
                setVerifying(false);
            }
        }, 1000);
    };

    const handleOtpChange = (index, value) => {
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        setError('');

        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
            setError('Please login to place an order');
            setLoading(false);
            return;
        }

        const { token } = JSON.parse(userInfo);

        const order = {
            orderItems: cart.map(item => ({
                name: item.name,
                qty: item.quantity,
                image: item.image,
                price: item.price,
                food: item._id
            })),
            shippingAddress: address,
            paymentMethod: paymentMethod,
            itemsPrice: total,
            taxPrice: 0,
            shippingPrice: 0,
            totalPrice: total,
            isPaid: paymentMethod === 'Online Banking',
            paidAt: paymentMethod === 'Online Banking' ? new Date() : undefined,
            paymentResult: paymentMethod === 'Online Banking' ? {
                id: `TXN-${Date.now()}`,
                status: 'COMPLETED',
                bank: bankDetails.bankName,
                accountHolder: bankDetails.accountHolder,
                verifiedAt: new Date()
            } : undefined
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(order)
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('cart', JSON.stringify([]));
                setStep('success');
                setTimeout(() => {
                    navigate(`/tracking/${data._id}`);
                }, 2500);
            } else {
                setError(data.message || 'Failed to place order');
            }
        } catch (err) {
            setError('Server connection failed');
        } finally {
            setLoading(false);
        }
    };

    // Success screen
    if (step === 'success') {
        return (
            <div className="bg-gray-50 min-h-screen pt-28">
                <Navbar />
                <div className="max-w-lg mx-auto px-4 pb-20 text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        className="bg-white p-12 rounded-3xl shadow-2xl border border-gray-100 mt-12"
                    >
                        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="text-emerald-500" size={48} />
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Order Placed!</h2>
                        <p className="text-gray-500 mb-2">
                            {paymentMethod === 'Online Banking'
                                ? 'Payment verified & confirmed ✅'
                                : 'Pay with cash when your order arrives 💵'}
                        </p>
                        <div className="mt-4 inline-block bg-gray-100 px-4 py-2 rounded-full">
                            <span className="text-sm text-gray-600">Payment: </span>
                            <span className="font-bold text-primary">{paymentMethod}</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-6">Redirecting to tracking page...</p>
                        <div className="mt-4 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                            <motion.div
                                className="bg-primary h-full rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 2.5 }}
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pt-28">
            <Navbar />
            <div className="max-w-5xl mx-auto px-4 pb-20">
                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-2 mb-10">
                    {['Address', 'Payment', 'Confirm'].map((label, i) => (
                        <div key={label} className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${i === 0 ? 'bg-primary text-white' :
                                i === 1 && (step === 'payment' || step === 'bank-verify') ? 'bg-primary text-white' :
                                    i === 2 && step === 'bank-verify' && verified ? 'bg-primary text-white' :
                                        'bg-gray-200 text-gray-500'
                                }`}>
                                {i + 1}
                            </div>
                            <span className={`text-sm font-medium ${(i === 0) ||
                                (i === 1 && (step === 'payment' || step === 'bank-verify')) ||
                                (i === 2 && step === 'bank-verify' && verified)
                                ? 'text-gray-900' : 'text-gray-400'
                                }`}>{label}</span>
                            {i < 2 && <div className="w-12 h-0.5 bg-gray-200 mx-2"></div>}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            {/* Step 1: Address */}
                            {step === 'address' && (
                                <motion.div
                                    key="address"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
                                >
                                    <h2 className="text-xl font-bold mb-6">📍 Delivery Address</h2>
                                    <form onSubmit={handleAddressSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. House 12, Road 5, Dhanmondi"
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                                value={address.address}
                                                onChange={(e) => setAddress({ ...address, address: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="e.g. Dhaka"
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                                    value={address.city}
                                                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="e.g. 1205"
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                                    value={address.postalCode}
                                                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={cart.length === 0}
                                            className="w-full py-4 bg-primary text-white font-bold rounded-xl mt-4 shadow-lg shadow-primary/30 hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Continue to Payment →
                                        </button>
                                    </form>
                                </motion.div>
                            )}

                            {/* Step 2: Payment Method Selection */}
                            {step === 'payment' && (
                                <motion.div
                                    key="payment"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <button
                                        onClick={() => setStep('address')}
                                        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm font-medium transition-colors"
                                    >
                                        <ArrowLeft size={16} /> Back to Address
                                    </button>

                                    <h2 className="text-xl font-bold">💳 Choose Payment Method</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* COD Option */}
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setPaymentMethod('COD')}
                                            className={`p-6 rounded-2xl border-2 text-left transition-all ${paymentMethod === 'COD'
                                                ? 'border-primary bg-emerald-50 shadow-lg shadow-emerald-100'
                                                : 'border-gray-200 bg-white hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4 mb-3">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${paymentMethod === 'COD' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                    <Banknote size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg">Cash on Delivery</h3>
                                                    <p className="text-sm text-gray-500">Pay when you receive</p>
                                                </div>
                                            </div>
                                            {paymentMethod === 'COD' && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    className="mt-3 pt-3 border-t border-emerald-200"
                                                >
                                                    <p className="text-emerald-700 text-sm flex items-center gap-2">
                                                        <CheckCircle size={14} /> No upfront payment needed
                                                    </p>
                                                </motion.div>
                                            )}
                                        </motion.button>

                                        {/* Online Banking Option */}
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setPaymentMethod('Online Banking')}
                                            className={`p-6 rounded-2xl border-2 text-left transition-all ${paymentMethod === 'Online Banking'
                                                ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-100'
                                                : 'border-gray-200 bg-white hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4 mb-3">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${paymentMethod === 'Online Banking' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                    <CreditCard size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg">Online Banking</h3>
                                                    <p className="text-sm text-gray-500">bKash, Nagad, Bank Transfer</p>
                                                </div>
                                            </div>
                                            {paymentMethod === 'Online Banking' && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    className="mt-3 pt-3 border-t border-blue-200"
                                                >
                                                    <p className="text-blue-700 text-sm flex items-center gap-2">
                                                        <Shield size={14} /> Secured with OTP verification
                                                    </p>
                                                </motion.div>
                                            )}
                                        </motion.button>
                                    </div>

                                    {/* Action Buttons */}
                                    {paymentMethod && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                            {paymentMethod === 'COD' ? (
                                                <button
                                                    onClick={handlePlaceOrder}
                                                    disabled={loading}
                                                    className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-emerald-600 transition-all disabled:opacity-50"
                                                >
                                                    {loading ? 'Processing...' : `Confirm Order - ৳${total.toFixed(2)}`}
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => setStep('bank-verify')}
                                                    className="w-full py-4 bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-300 hover:bg-blue-600 transition-all"
                                                >
                                                    Proceed to Verification →
                                                </button>
                                            )}
                                        </motion.div>
                                    )}

                                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                                </motion.div>
                            )}

                            {/* Step 3: Online Banking Verification */}
                            {step === 'bank-verify' && (
                                <motion.div
                                    key="bank-verify"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <button
                                        onClick={() => { setStep('payment'); setOtpSent(false); setVerified(false); setOtp(['', '', '', '', '', '']); }}
                                        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm font-medium transition-colors"
                                    >
                                        <ArrowLeft size={16} /> Back to Payment
                                    </button>

                                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                                <Lock className="text-blue-600" size={20} />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold">Secure Payment</h2>
                                                <p className="text-sm text-gray-500">OTP-verified banking</p>
                                            </div>
                                        </div>

                                        {/* Bank Selection */}
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-3">Select Your Bank / Wallet</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {banks.map(bank => (
                                                    <button
                                                        key={bank.id}
                                                        onClick={() => setBankDetails({ ...bankDetails, bankName: bank.name })}
                                                        className={`p-3 rounded-xl border-2 text-center text-sm font-bold transition-all ${bankDetails.bankName === bank.name
                                                            ? `border-blue-500 bg-blue-50 text-blue-700`
                                                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                                            }`}
                                                    >
                                                        {bank.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Account Details */}
                                        <div className="space-y-4 mb-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Account / Mobile Number</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. 01XXXXXXXXX"
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
                                                    value={bankDetails.accountNumber}
                                                    onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter your full name"
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
                                                    value={bankDetails.accountHolder}
                                                    onChange={(e) => setBankDetails({ ...bankDetails, accountHolder: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        {/* OTP Section */}
                                        {!otpSent ? (
                                            <button
                                                onClick={handleSendOtp}
                                                disabled={verifying}
                                                className="w-full py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition-all disabled:opacity-50"
                                            >
                                                {verifying ? (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                        </svg>
                                                        Sending OTP...
                                                    </span>
                                                ) : 'Send OTP Verification'}
                                            </button>
                                        ) : !verified ? (
                                            <div className="space-y-4">
                                                <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                                                    <p className="text-blue-700 text-sm font-medium text-center">
                                                        📱 OTP sent to your registered number
                                                    </p>
                                                </div>

                                                {/* Demo OTP Display */}
                                                {demoOtpDisplay && (
                                                    <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-xl text-center">
                                                        <p className="text-amber-800 text-xs font-medium mb-1">🔑 DEMO MODE — Your OTP Code:</p>
                                                        <p className="text-3xl font-black tracking-[0.5em] text-amber-700">{demoOtpDisplay}</p>
                                                        <p className="text-amber-600 text-xs mt-1">In production, this would be sent via SMS</p>
                                                    </div>
                                                )}

                                                {/* OTP Input */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-3 text-center">Enter 6-Digit OTP</label>
                                                    <div className="flex justify-center gap-2">
                                                        {otp.map((digit, index) => (
                                                            <input
                                                                key={index}
                                                                id={`otp-${index}`}
                                                                type="text"
                                                                maxLength="1"
                                                                className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                                                value={digit}
                                                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={handleVerifyOtp}
                                                    disabled={verifying}
                                                    className="w-full py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition-all disabled:opacity-50"
                                                >
                                                    {verifying ? 'Verifying...' : 'Verify OTP'}
                                                </button>

                                                <button
                                                    onClick={handleSendOtp}
                                                    className="w-full py-2 text-blue-500 text-sm font-medium hover:underline"
                                                >
                                                    Resend OTP
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <motion.div
                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    className="bg-emerald-50 border border-emerald-200 p-5 rounded-xl text-center"
                                                >
                                                    <CheckCircle className="text-emerald-500 mx-auto mb-2" size={32} />
                                                    <p className="font-bold text-emerald-700">Payment Verified Successfully!</p>
                                                    <p className="text-sm text-emerald-600 mt-1">
                                                        {bankDetails.bankName} • ****{bankDetails.accountNumber.slice(-4)}
                                                    </p>
                                                </motion.div>

                                                <button
                                                    onClick={handlePlaceOrder}
                                                    disabled={loading}
                                                    className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-emerald-600 transition-all disabled:opacity-50"
                                                >
                                                    {loading ? 'Processing...' : `Pay ৳${total.toFixed(2)} & Place Order`}
                                                </button>
                                            </div>
                                        )}

                                        {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-28">
                            <h2 className="text-lg font-bold mb-4">🛒 Order Summary</h2>
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 mb-4">
                                {cart.map(item => (
                                    <div key={item._id} className="flex gap-3">
                                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-sm truncate">{item.name}</h3>
                                            <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                                            <p className="text-primary font-bold text-sm">৳{(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Subtotal</span>
                                    <span>৳{total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Delivery</span>
                                    <span className="text-emerald-500 font-medium">FREE</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                                    <span>Total</span>
                                    <span className="text-primary">৳{total.toFixed(2)}</span>
                                </div>
                            </div>

                            {paymentMethod && (
                                <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-2 text-sm">
                                        {paymentMethod === 'COD' ? <Banknote size={16} className="text-emerald-500" /> : <CreditCard size={16} className="text-blue-500" />}
                                        <span className="font-medium">{paymentMethod}</span>
                                        {paymentMethod === 'Online Banking' && verified && (
                                            <span className="ml-auto text-emerald-500 text-xs font-bold flex items-center gap-1">
                                                <CheckCircle size={12} /> Verified
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Checkout;
