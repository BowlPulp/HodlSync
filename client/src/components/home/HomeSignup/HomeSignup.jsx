import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../../footer/Footer';
import HomeNavbar from '../HomeNavbar/HomeNavbar';
import { FiEye, FiEyeOff, FiUser, FiMail, FiCalendar, FiLock, FiShield, FiTrendingUp, FiActivity } from 'react-icons/fi';

const HomeSignup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        dob: "",
        password: "",
        confirmPassword: "",
        addressesToTrack: [],
    });
    
    const [errors, setErrors] = useState({});
    const [formTouched, setFormTouched] = useState({});

    // Handle field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        
        // Mark field as touched
        setFormTouched(prev => ({
            ...prev,
            [name]: true
        }));
    };

    // Validate form
    useEffect(() => {
        const newErrors = {};
        
        if (formTouched.username && !formData.username) {
            newErrors.username = "Username is required";
        } else if (formTouched.username && formData.username.length < 3) {
            newErrors.username = "Username must be at least 3 characters";
        }
        
        if (formTouched.email && !formData.email) {
            newErrors.email = "Email is required";
        } else if (formTouched.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }
        
        if (formTouched.dob && !formData.dob) {
            newErrors.dob = "Date of birth is required";
        } else if (formTouched.dob) {
            const birthDate = new Date(formData.dob);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            if (age < 13) {
                newErrors.dob = "You must be at least 13 years old";
            }
        }
        
        if (formTouched.password && !formData.password) {
            newErrors.password = "Password is required";
        } else if (formTouched.password && formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        } else if (formTouched.password && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = "Password must contain uppercase, lowercase, and number";
        }
        
        if (formTouched.confirmPassword && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords don't match";
        }
        
        setErrors(newErrors);
    }, [formData, formTouched]);

    const isFormValid = () => {
        return (
            formData.username &&
            formData.email &&
            formData.dob &&
            formData.password &&
            formData.confirmPassword &&
            formData.password === formData.confirmPassword &&
            Object.keys(errors).length === 0
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isFormValid()) {
            // Mark all fields as touched to show errors
            const allTouched = {};
            Object.keys(formData).forEach(key => {
                allTouched[key] = true;
            });
            setFormTouched(allTouched);
            return toast.error("Please fix all errors before submitting");
        }
        
        setLoading(true);
        
        // Remove confirmPassword before sending to API
        const submitData = { ...formData };
        delete submitData.confirmPassword;
        
        try {
            const response = await fetch("https://hodlsync-2.onrender.com/api/users/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(submitData),
                credentials: "include" // For cookies if needed
            });

            const data = await response.json();
            
            if (data.success) {
                toast.success("Account created successfully!");
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } else {
                toast.error(data.error || "Failed to create account");
            }
        } catch (error) {
            console.error("Signup error:", error);
            toast.error("Error connecting to the server. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <HomeNavbar />
            <section className=""> {/* Added padding-top to avoid navbar overlap */}
                <div className="flex min-h-screen md:flex-row flex-col bg-gradient-to-br from-green-400 via-gray-800 to-black">
                    <div className="w-full md:w-1/2 px-4 sm:px-6 lg:px-8 py-10">
                        <div className="h-full flex items-center justify-center">
                            <div className="mt-16 w-full max-w-md p-6 bg-white/10 backdrop-blur-md rounded-xl shadow-xl">
                                <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
                                    Create an account
                                </h2>
                                <p className="mt-2 text-base text-gray-200 mb-5">
                                    Already have an account?{' '}
                                    <a href="/login" className="font-semibold text-green-400 transition-all duration-200 hover:underline">
                                        Log in
                                    </a>
                                </p>
                                
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label htmlFor="username" className="block text-sm font-medium text-white mb-1">
                                            Username
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FiUser className="text-gray-400" />
                                            </div>
                                            <input
                                                id="username"
                                                type="text"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                aria-describedby="username-error"
                                                className={`w-full rounded-lg px-10 py-2.5 bg-gray-800/50 border ${errors.username ? 'border-red-500' : 'border-gray-600'} text-white placeholder-gray-400 focus:ring-2 focus:ring-green-400 focus:border-transparent transition duration-200`}
                                                placeholder="johndoe"
                                                required
                                            />
                                        </div>
                                        {errors.username && (
                                            <p id="username-error" className="mt-1 text-sm text-red-500">
                                                {errors.username}
                                            </p>
                                        )}
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FiMail className="text-gray-400" />
                                            </div>
                                            <input
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                aria-describedby="email-error"
                                                className={`w-full rounded-lg px-10 py-2.5 bg-gray-800/50 border ${errors.email ? 'border-red-500' : 'border-gray-600'} text-white placeholder-gray-400 focus:ring-2 focus:ring-green-400 focus:border-transparent transition duration-200`}
                                                placeholder="john@example.com"
                                                required
                                            />
                                        </div>
                                        {errors.email && (
                                            <p id="email-error" className="mt-1 text-sm text-red-500">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="dob" className="block text-sm font-medium text-white mb-1">
                                            Date of Birth
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FiCalendar className="text-gray-400" />
                                            </div>
                                            <input
                                                id="dob"
                                                type="date"
                                                name="dob"
                                                value={formData.dob}
                                                onChange={handleChange}
                                                aria-describedby="dob-error"
                                                className={`w-full rounded-lg px-10 py-2.5 bg-gray-800/50 border ${errors.dob ? 'border-red-500' : 'border-gray-600'} text-white placeholder-gray-400 focus:ring-2 focus:ring-green-400 focus:border-transparent transition duration-200`}
                                                required
                                            />
                                        </div>
                                        {errors.dob && (
                                            <p id="dob-error" className="mt-1 text-sm text-red-500">
                                                {errors.dob}
                                            </p>
                                        )}
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-white mb-1">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FiLock className="text-gray-400" />
                                            </div>
                                            <input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                aria-describedby="password-error"
                                                className={`w-full rounded-lg px-10 py-2.5 bg-gray-800/50 border ${errors.password ? 'border-red-500' : 'border-gray-600'} text-white placeholder-gray-400 focus:ring-2 focus:ring-green-400 focus:border-transparent transition duration-200`}
                                                placeholder="••••••••"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                                            >
                                                {showPassword ? <FiEyeOff /> : <FiEye />}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p id="password-error" className="mt-1 text-sm text-red-500">
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-1">
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FiLock className="text-gray-400" />
                                            </div>
                                            <input
                                                id="confirmPassword"
                                                type={showPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                aria-describedby="confirm-password-error"
                                                className={`w-full rounded-lg px-10 py-2.5 bg-gray-800/50 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-600'} text-white placeholder-gray-400 focus:ring-2 focus:ring-green-400 focus:border-transparent transition duration-200`}
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>
                                        {errors.confirmPassword && (
                                            <p id="confirm-password-error" className="mt-1 text-sm text-red-500">
                                                {errors.confirmPassword}
                                            </p>
                                        )}
                                    </div>
                                    
                                    <div className="flex items-center">
                                        <input
                                            id="terms"
                                            name="terms"
                                            type="checkbox"
                                            required
                                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-600 rounded"
                                        />
                                        <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
                                            I agree to the <a href="/terms" className="text-green-400 hover:underline">Terms of Service</a> and <a href="/privacy" className="text-green-400 hover:underline">Privacy Policy</a>
                                        </label>
                                    </div>
                                    
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Creating account...
                                            </>
                                        ) : (
                                            "Create Account"
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                    
                    <div className="w-full md:w-1/2 flex justify-center items-center p-6">
                        <div className="max-w-lg space-y-8">
                            <div className="bg-gray-900/70 backdrop-blur-sm p-6 rounded-xl shadow-lg">
                                <h3 className="text-2xl font-bold text-white mb-4">Why Join Our Platform?</h3>
                                
                                <div className="space-y-6">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 bg-green-500/20 p-3 rounded-full">
                                            <FiShield className="h-6 w-6 text-green-400" />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-lg font-medium text-white">Secure & Private</h4>
                                            <p className="mt-1 text-gray-300">Your crypto holdings remain private. We never store your private keys.</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 bg-green-500/20 p-3 rounded-full">
                                            <FiTrendingUp className="h-6 w-6 text-green-400" />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-lg font-medium text-white">Real-time Analytics</h4>
                                            <p className="mt-1 text-gray-300">Track your portfolio performance with professional-grade analytics.</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 bg-green-500/20 p-3 rounded-full">
                                            <FiActivity className="h-6 w-6 text-green-400" />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-lg font-medium text-white">Multi-chain Support</h4>
                                            <p className="mt-1 text-gray-300">Track assets across multiple blockchains in one unified dashboard.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm p-6 rounded-xl shadow-lg">
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-white mb-2">Be among the first one!</h3>
                                    <div className="flex justify-center space-x-4 mt-4">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-white">350k+</div>
                                            <div className="text-sm text-gray-300">Supported Coins</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-white">1</div>
                                            <div className="text-sm text-gray-300">Network</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-white">24/7</div>
                                            <div className="text-sm text-gray-300">Market Data</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default HomeSignup;