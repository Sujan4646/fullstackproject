import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import CarCard from '../components/CarCard'
import { motion, AnimatePresence } from 'framer-motion'
import { FaFilter, FaSearch, FaTimes } from 'react-icons/fa'

export default function CarListing() {
    const { search: urlSearch } = useLocation()
    const [cars, setCars] = useState([])
    const [filteredCars, setFilteredCars] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filters, setFilters] = useState({
        category: '',
        fuelType: '',
        minPrice: '',
        maxPrice: '',
        location: ''
    })

    useEffect(() => {
        const queryParams = new URLSearchParams(urlSearch)
        const locationParam = queryParams.get('location') || ''
        const searchParam = queryParams.get('search') || ''

        if (locationParam) setFilters(prev => ({ ...prev, location: locationParam }))
        if (searchParam) setSearchTerm(searchParam)

        const fetchCars = async () => {
            try {
                // Pass all query params to backend for efficient filtering
                const { data } = await axios.get(`/api/cars${urlSearch}`)
                setCars(data)
                setFilteredCars(data)
                setLoading(false)
            } catch (error) {
                console.error(error)
                setLoading(false)
            }
        }
        fetchCars()
    }, [urlSearch])

    useEffect(() => {
        let result = cars
        if (searchTerm) {
            result = result.filter(car =>
                car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                car.brand.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }
        if (filters.category) {
            result = result.filter(car => car.category === filters.category)
        }
        if (filters.fuelType) {
            result = result.filter(car => car.fuelType === filters.fuelType)
        }
        if (filters.minPrice) {
            result = result.filter(car => car.pricePerDay >= Number(filters.minPrice))
        }
        if (filters.maxPrice) {
            result = result.filter(car => car.pricePerDay <= Number(filters.maxPrice))
        }
        if (filters.location) {
            result = result.filter(car => car.location?.toLowerCase().includes(filters.location.toLowerCase()))
        }
        setFilteredCars(result)
    }, [filters, cars, searchTerm])

    const onFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const resetFilters = () => {
        setFilters({ category: '', fuelType: '', minPrice: '', maxPrice: '', location: '' })
        setSearchTerm('')
    }

    if (loading) return (
        <div className='flex flex-col items-center justify-center min-h-[60vh]'>
            <div className='spinner' />
            <p className='text-primary font-bold animate-pulse mt-4'>Scanning Fleet...</p>
        </div>
    )

    return (
        <div className='max-w-7xl mx-auto px-6 py-12'>
            <div className='flex flex-col md:flex-row justify-between items-center mb-12 gap-6'>
                <div>
                    <h1 className='text-4xl font-black mb-2 uppercase tracking-tighter'>Exclusive <span className='text-primary'>Fleet</span></h1>
                    <p className='text-slate-400 text-sm'>Select your ideal companion for the road ahead.</p>
                </div>

                <div className='relative w-full md:w-96'>
                    <FaSearch className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500' />
                    <input
                        type='text'
                        placeholder='Search brand or model...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:border-primary outline-none transition-all'
                    />
                </div>
            </div>

            <div className='flex flex-col lg:flex-row gap-8'>
                {/* Sidebar Filter */}
                <aside className='w-full lg:w-72 flex-shrink-0'>
                    <div className='glass-card sticky top-24'>
                        <div className='flex items-center justify-between mb-8'>
                            <h3 className='flex items-center gap-2 font-bold text-white'>
                                <FaFilter className='text-primary text-xs' />
                                Filters
                            </h3>
                            <button onClick={resetFilters} className='text-[10px] font-bold text-slate-500 hover:text-primary transition-colors uppercase'>
                                Reset All
                            </button>
                        </div>

                        <div className='space-y-6'>
                            <div className='space-y-3'>
                                <label className='text-xs font-bold text-slate-500 uppercase tracking-widest'>Location</label>
                                <input
                                    type='text'
                                    name='location'
                                    value={filters.location}
                                    placeholder='Search Location (e.g. Coimbatore)'
                                    onChange={onFilterChange}
                                    className='w-full bg-bg-dark border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-primary transition-all'
                                />
                            </div>

                            <div className='space-y-3'>
                                <label className='text-xs font-bold text-slate-500 uppercase tracking-widest'>Category</label>
                                <select
                                    name='category'
                                    value={filters.category}
                                    onChange={onFilterChange}
                                    className='w-full bg-bg-dark border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-primary transition-all cursor-pointer'
                                >
                                    <option value=''>All Types</option>
                                    <option value='SUV'>SUV</option>
                                    <option value='Sedan'>Sedan</option>
                                    <option value='Hatchback'>Hatchback</option>
                                    <option value='Luxury'>Luxury</option>
                                </select>
                            </div>

                            <div className='space-y-3'>
                                <label className='text-xs font-bold text-slate-500 uppercase tracking-widest'>Fuel Type</label>
                                <select
                                    name='fuelType'
                                    value={filters.fuelType}
                                    onChange={onFilterChange}
                                    className='w-full bg-bg-dark border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-primary transition-all cursor-pointer'
                                >
                                    <option value=''>All Energy</option>
                                    <option value='Petrol'>Petrol</option>
                                    <option value='Diesel'>Diesel</option>
                                    <option value='Electric'>Electric</option>
                                    <option value='Hybrid'>Hybrid</option>
                                </select>
                            </div>

                            <div className='space-y-3'>
                                <label className='text-xs font-bold text-slate-500 uppercase tracking-widest'>Budget (₹/Day)</label>
                                <div className='flex gap-2'>
                                    <input
                                        type='number'
                                        name='minPrice'
                                        value={filters.minPrice}
                                        placeholder='Min'
                                        onChange={onFilterChange}
                                        className='w-1/2 bg-bg-dark border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-primary transition-all'
                                    />
                                    <input
                                        type='number'
                                        name='maxPrice'
                                        value={filters.maxPrice}
                                        placeholder='Max'
                                        onChange={onFilterChange}
                                        className='w-1/2 bg-bg-dark border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-primary transition-all'
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className='flex-grow'>
                    <AnimatePresence mode='popLayout'>
                        {filteredCars.length > 0 ? (
                            <motion.div
                                layout
                                className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                            >
                                {filteredCars.map(car => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                        key={car._id}
                                    >
                                        <CarCard car={car} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className='glass-card flex flex-col items-center justify-center py-24 text-center'
                            >
                                <div className='w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6'>
                                    <FaTimes className='text-red-400/40 text-3xl' />
                                </div>
                                <h3 className='text-xl font-bold mb-2'>No Matches Found</h3>
                                <p className='text-slate-500 text-sm max-w-xs'>Adjust your filters or search terms to explore more of our fleet.</p>
                                <button
                                    onClick={resetFilters}
                                    className='mt-8 text-primary font-bold text-xs uppercase tracking-widest hover:underline'
                                >
                                    Clear all filters
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    )
}
