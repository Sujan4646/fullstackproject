import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { FaArrowRight, FaSearch, FaCar, FaUsers, FaCity, FaShieldAlt, FaRocket, FaGem } from 'react-icons/fa'

const StatItem = ({ icon: Icon, value, label }) => (
    <motion.div
        whileHover={{ y: -10 }}
        className="glass-card flex flex-col items-center text-center p-8 min-w-[200px]"
    >
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 text-primary text-3xl">
            <Icon />
        </div>
        <h3 className="text-4xl font-bold bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">{value}</h3>
        <p className="text-slate-400 mt-2 font-medium tracking-wide uppercase text-xs">{label}</p>
    </motion.div>
)

const FeatureCard = ({ icon: Icon, title, desc }) => (
    <motion.div
        whileHover={{ scale: 1.05 }}
        className="glass-card flex flex-col items-start p-8 group"
    >
        <div className="mb-6 p-4 rounded-xl bg-white/5 group-hover:bg-primary/20 transition-colors duration-300">
            <Icon className="text-primary text-3xl" />
        </div>
        <h4 className="text-xl font-bold mb-3 text-white">{title}</h4>
        <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
    </motion.div>
)

import { getCarImage } from '../utils/imagePath'

export default function Home() {
    const navigate = useNavigate()
    const [featured, setFeatured] = useState([])
    const [pickupLocation, setPickupLocation] = useState('')
    const [pickupDate, setPickupDate] = useState('')
    const autocompleteRef = useRef(null)
    const inputRef = useRef(null)
    const statsRef = useRef(null)

    const scrollToStats = () => {
        statsRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const { data } = await axios.get('/api/cars')
                setFeatured(Array.isArray(data) ? data.slice(0, 4) : [])
            } catch (err) {
                // silent error
            }
        }
        fetchFeatured()
    }, [])

    const handleSearch = (e) => {
        e.preventDefault()
        // Navigate to /cars with query parameters
        const queryParams = new URLSearchParams()
        if (pickupLocation) queryParams.append('location', pickupLocation)
        if (pickupDate) queryParams.append('date', pickupDate)

        navigate(`/cars?${queryParams.toString()}`)
    }

    return (
        <div className="relative">
            {/* Background Blobs */}
            <div className="blur-blob w-96 h-96 bg-primary/10 top-20 -left-20" />
            <div className="blur-blob w-96 h-96 bg-secondary/10 bottom-40 -right-20" />

            {/* Hero Section */}
            <section className="relative h-screen flex flex-col justify-center items-center overflow-hidden">
                {/* Hero Background */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/hero-car.png"
                        className="w-full h-full object-cover scale-105"
                        alt="Futuristic Car"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-bg-dark/40 via-bg-dark/60 to-bg-dark z-10" />
                </div>

                {/* Hero Content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="relative z-20 text-center px-4 max-w-5xl"
                >
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="inline-block px-4 py-1.5 rounded-full glass border-primary/20 text-primary text-xs font-bold tracking-[0.2em] uppercase mb-8"
                    >
                        The Future of Car Rentals
                    </motion.span>

                    <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight tracking-tight">
                        Find Your <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Dream Car</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                        Experience the pinnacle of luxury and performance. Our fleet of concept-grade vehicles awaits your command.
                    </p>

                    {/* Search Bar */}
                    <motion.form
                        onSubmit={handleSearch}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 }}
                        className="glass p-4 rounded-3xl flex flex-col md:flex-row gap-4 items-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-white/10"
                    >
                        <div className="flex-1 flex items-center gap-4 bg-white/5 rounded-2xl px-6 py-4 border border-white/5 w-full">
                            <FaSearch className="text-slate-400" />
                            <select
                                value={pickupLocation}
                                onChange={(e) => setPickupLocation(e.target.value)}
                                className="bg-transparent border-none outline-none text-white w-full text-sm font-medium cursor-pointer appearance-none"
                                id="location-input"
                            >
                                <option value="" className="bg-bg-dark text-slate-400">Select Pick-up Location</option>
                                <option value="Chennai" className="bg-bg-dark text-white">Chennai</option>
                                <option value="Mumbai" className="bg-bg-dark text-white">Mumbai</option>
                                <option value="Kolkata" className="bg-bg-dark text-white">Kolkata</option>
                                <option value="Bangalore" className="bg-bg-dark text-white">Bangalore</option>
                                <option value="Hyderabad" className="bg-bg-dark text-white">Hyderabad</option>
                                <option value="Cochin" className="bg-bg-dark text-white">Cochin</option>
                                <option value="Delhi" className="bg-bg-dark text-white">Delhi</option>
                                <option value="Pune" className="bg-bg-dark text-white">Pune</option>
                                <option value="Ahmedabad" className="bg-bg-dark text-white">Ahmedabad</option>
                                <option value="Jaipur" className="bg-bg-dark text-white">Jaipur</option>
                                <option value="Surat" className="bg-bg-dark text-white">Surat</option>
                                <option value="Lucknow" className="bg-bg-dark text-white">Lucknow</option>
                            </select>
                        </div>
                        <div className="flex-1 flex items-center gap-4 bg-white/5 rounded-2xl px-6 py-4 border border-white/5 w-full">
                            <input
                                type="date"
                                value={pickupDate}
                                onChange={(e) => setPickupDate(e.target.value)}
                                className="bg-transparent border-none outline-none text-white w-full text-sm font-medium [color-scheme:dark]"
                            />
                        </div>
                        <button type="submit" className="btn-primary w-full md:w-auto min-w-[180px]">
                            Search Fleet
                        </button>
                    </motion.form>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-10 z-20 flex flex-col items-center gap-2 cursor-pointer"
                    onClick={scrollToStats}
                >
                    <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center p-1">
                        <div className="w-1 h-2 bg-primary rounded-full" />
                    </div>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section ref={statsRef} className="py-24 px-6 md:px-12 bg-bg-dark hero-gradient">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                    <StatItem icon={FaCar} value="500+" label="Premium Cars" />
                    <StatItem icon={FaUsers} value="10k+" label="Happy Clients" />
                    <StatItem icon={FaCity} value="25+" label="Cities" />
                </div>
            </section>

            {/* Features Section */}
            <section className="py-32 px-6 md:px-12">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-20 text-center">
                        <h2 className="text-4xl md:text-5xl font-black mb-6">Why Choose <span className="text-primary">CarBooker</span>?</h2>
                        <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={FaShieldAlt}
                            title="Secured Insurance"
                            desc="Full coverage on all rentals, ensuring you drive with complete peace of mind."
                        />
                        <FeatureCard
                            icon={FaRocket}
                            title="Instant Booking"
                            desc="Reserve your dream ride in seconds with our lightning-fast booking engine."
                        />
                        <FeatureCard
                            icon={FaGem}
                            title="Elite Fleet"
                            desc="Access the world's most exclusive luxury and performance vehicles."
                        />
                    </div>
                </div>
            </section>

            {/* Featured Cars Section */}
            <section className="py-32 px-6 md:px-12 bg-bg-deep">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-end mb-16">
                        <div>
                            <h2 className="text-4xl font-black mb-4 underline decoration-primary/50 underline-offset-8">Featured Fleet</h2>
                            <p className="text-slate-400">Handpicked luxury for your next journey.</p>
                        </div>
                        <Link to="/cars" className="text-primary font-bold hover:underline flex items-center gap-2 group">
                            View All <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featured.map((car) => (
                            <motion.div
                                key={car._id}
                                whileHover={{ y: -10 }}
                                className="glass-card overflow-hidden group p-0"
                            >
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={getCarImage(car.images?.[0])}
                                        alt={car.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2">{car.name}</h3>
                                    <div className="flex justify-between items-center mt-4">
                                        <span className="text-primary font-bold text-lg">₹{car.pricePerDay}<span className="text-xs text-slate-500 font-normal">/day</span></span>
                                        <Link to={`/cars/${car._id}`} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-primary hover:text-black transition-colors">
                                            Details
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-6">
                <div className="max-w-5xl mx-auto glass p-12 rounded-[3rem] text-center relative overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                    <h2 className="text-4xl md:text-5xl font-black mb-8 relative z-10">Ready to Start Your <span className="text-primary">Journey</span>?</h2>
                    <p className="text-slate-300 mb-12 max-w-2xl mx-auto relative z-10 text-lg">
                        Join thousands of satisfied customers and experience the future of car rentals today.
                    </p>
                    <div className="flex flex-col md:flex-row gap-6 justify-center relative z-10">
                        <Link to="/register" className="btn-primary">Create Account</Link>
                        <Link to="/cars" className="btn-outline">Explore Fleet</Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
