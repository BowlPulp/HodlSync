import React, { useState } from 'react'
import Footer from '../../footer/Footer';
import HomeNavbar from '../HomeNavbar/HomeNavbar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const HomeSignup = () => {
    
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        dob: "",
        password: "",
        addressesToTrack: [],
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://54.145.14.15:4000/api/users/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (data.success) {
                toast.success("User created successfully!");
                setTimeout(() => {
                    navigate("/login"); // Redirect after success
                }, 2000); // Delay for better UX
            } else {
                toast.error(data.error || "Failed to create user.");
            }
        } catch (error) {
            toast.error("Error connecting to the server.");
        }
    };

    return (
        <>
            <HomeNavbar />
            <section>

                <div className="flex h-screen md:flex-row flex-col bg-gradient-to-br from-green-400 via-gray-800 to-black">
                    <div className="w-full md:w-1/2 md:px-4">
                        <div className="h-screen flex items-center justify-center">
                            <div className="grid">
                                <h2 className="text-3xl font-bold leading-tight text-[black] sm:text-4xl">Sign up</h2>
                                <p className="mt-2 text-base text-[#1f2936] mb-5"> Already have an account?{' '}
                                    <a href="/login" className="font-semibold text-black transition-all duration-200 hover:underline">Login here</a>
                                </p>
                                <form onSubmit={handleSubmit}>
                                    <div className="flex flex-col gap-2 mt-5">
                                        <p className="text-lg">Username</p>
                                        <input className="w-full rounded-lg px-2 py-2 bg-inherit border-2 border-[#1f2936]" 
                                            type="text" 
                                            name="username" 
                                            placeholder="Username" 
                                            onChange={handleChange} 
                                            required 
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2 mt-5">
                                        <p className="text-lg">Email Address</p>
                                        <input className="w-full rounded-lg px-2 py-2 bg-inherit border-2 border-[#1f2936]" 
                                            type="email" 
                                            name="email" 
                                            placeholder="Email Address" 
                                            onChange={handleChange} 
                                            required 
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2 mt-5">
                                        <p className="text-lg">Date of Birth</p>
                                        <input className="w-full rounded-lg px-2 py-2 bg-inherit border-2 border-[#1f2936]" 
                                            type="date" 
                                            name="dob" 
                                            onChange={handleChange} 
                                            required 
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2 mt-5">
                                        <p className="text-lg">Password</p>
                                        <input className="w-full rounded-lg px-2 py-2 bg-inherit border-2 border-[#1f2936]" 
                                            type="password" 
                                            name="password" 
                                            placeholder="Password" 
                                            onChange={handleChange} 
                                            required 
                                        />
                                    </div>
                                    <button type="submit" className="mb-3 mt-5 inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80">
                                        Get started
                                    </button>
                                </form>
                                {message && <p className="mt-3 text-red-600">{message}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2  flex justify-center items-center hidden md:flex">
                        <img src="/signup.gif" alt="Signup illustration" />
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default HomeSignup;
