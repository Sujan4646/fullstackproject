import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaChevronLeft, FaChevronRight, FaGasPump, FaCogs, FaUsers, FaArrowLeft, FaCalendarAlt, FaCheckCircle, FaStar, FaMapMarkerAlt } from 'react-icons/fa'

import { getCarImage } from '../utils/imagePath'

export default function CarDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [car, setCar] = useState(null)
    const [loading, setLoading] = useState(true)
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const { data } = await axios.get(`/api/cars/${id}`)
                setCar(data)
                setLoading(false)
            } catch (error) {
                console.error(error)
                setLoading(false)
            }
        }
        fetchCar()
    }, [id])

    if (loading) return (
        <div className='flex flex-col items-center justify-center min-h-[60vh]'>
            <div className='spinner' />
            <p className='text-primary font-bold animate-pulse mt-4'>Initializing Vehicle Data...</p>
        </div>
    )

    if (!car) return (
        <div className='flex flex-col items-center justify-center min-h-[60vh]'>
            <h2 className='text-2xl font-bold'>Vehicle Not Found</h2>
            <Link to='/cars' className='mt-4 text-primary underline'>Return to Fleet</Link>
        </div>
    )

    const images = car.images && car.images.length > 0 ? car.images.map(img => getCarImage(img)) : [getCarImage(null)]

    const prev = () => setIndex((i) => (i - 1 + images.length) % images.length)
    const next = () => setIndex((i) => (i + 1) % images.length)

    const SpecItem = ({ icon: Icon, label, value }) => (
        <div className='glass p-6 rounded-2xl flex flex-col items-center text-center gap-2 group hover:border-primary/30 transition-all'>
            <Icon className='text-primary text-2xl mb-1 group-hover:scale-110 transition-transform' />
            <span className='text-[10px] uppercase tracking-widest text-slate-500 font-bold'>{label}</span>
            <span className='text-sm font-bold text-white'>{value}</span>
        </div>
    )

    return (
        <div className='max-w-7xl mx-auto px-6 py-12'>
            {/* Back Button */}
            <motion.button
                whileHover={{ x: -10 }}
                onClick={() => navigate('/cars')}
                className='flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm font-bold uppercase tracking-widest'
            >
                <FaArrowLeft /> Back to Fleet
            </motion.button>

            <div className='grid grid-cols-1 lg:grid-cols-12 gap-12'>
                {/* Left: Gallery */}
                <div className='lg:col-span-7 space-y-6'>
                    <div className='relative aspect-[16/10] glass rounded-3xl overflow-hidden group shadow-2xl'>
                        <AnimatePresence mode='wait'>
                            <motion.img
                                key={index}
                                src={images[index]}
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.5 }}
                                className='w-full h-full object-cover'
                                alt={car.name}
                            />
                        </AnimatePresence>

                        <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none' />

                        {images.length > 1 && (
                            <div className='absolute inset-0 flex items-center justify-between px-4'>
                                <button onClick={prev} className='w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all'>
                                    <FaChevronLeft />
                                </button>
                                <button onClick={next} className='w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all'>
                                    <FaChevronRight />
                                </button>
                            </div>
                        )}

                        <div className='absolute bottom-6 right-6 glass px-4 py-2 rounded-xl text-xs font-bold'>
                            {index + 1} / {images.length}
                        </div>
                    </div>

                    <div className='flex gap-4 overflow-x-auto pb-4 scrollbar-hide'>
                        {images.map((img, idx) => (
                            <motion.button
                                key={idx}
                                whileHover={{ y: -5 }}
                                onClick={() => setIndex(idx)}
                                className={`flex-shrink-0 w-24 h-20 rounded-xl overflow-hidden border-2 transition-all ${idx === index ? 'border-primary outline outline-offset-2 outline-primary/20' : 'border-white/5 opacity-60 hover:opacity-100'}`}
                            >
                                <img src={img} className='w-full h-full object-cover' alt='Thumbnail' />
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Right: Info & Booking */}
                <div className='lg:col-span-5 flex flex-col'>
                    <div className='glass-card flex-grow flex flex-col p-10'>
                        <div className='flex items-center gap-3 mb-6 flex-wrap'>
                            <span className='px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em]'>
                                {car.category}
                            </span>
                            {car.location && (
                                <span className='px-3 py-1 bg-white/5 text-slate-300 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5'>
                                    <FaMapMarkerAlt className='text-primary' /> {car.location}
                                </span>
                            )}
                            <div className='flex items-center gap-1 text-yellow-500 text-xs'>
                                <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStar />
                                <span className='text-slate-500 ml-1 font-bold'>(4.9)</span>
                            </div>
                        </div>

                        <h1 className='text-5xl font-black text-white mb-2 leading-tight tracking-tighter'>
                            {car.brand} <span className='text-primary'>{car.name}</span>
                        </h1>
                        <div className='flex items-baseline gap-2 mb-8'>
                            <span className='text-4xl font-black text-white'>₹{car.pricePerDay}</span>
                            <span className='text-slate-500 font-bold uppercase tracking-widest text-sm'>/ Per Day</span>
                        </div>

                        <p className='text-slate-400 leading-relaxed mb-10 text-sm'>
                            {car.description || "Experience unparalleled performance and comfort with this premium vehicle. Perfectly engineered for those who demand excellence on the road."}
                        </p>

                        <div className='grid grid-cols-3 gap-4 mb-10'>
                            <SpecItem icon={FaUsers} label='Seats' value={`${car.seatingCapacity} Persons`} />
                            <SpecItem icon={FaGasPump} label='Fuel' value={car.fuelType} />
                            <SpecItem icon={FaCogs} label='Drive' value={car.transmission} />
                        </div>

                        <div className='mt-auto space-y-6'>
                            <div className='bg-white/5 border border-white/10 rounded-2xl p-6'>
                                <h4 className='text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2'>
                                    <FaCheckCircle className='text-primary' /> Features Included
                                </h4>
                                <div className='grid grid-cols-2 gap-y-2 text-[10px] font-bold text-slate-300 uppercase'>
                                    <span>• Free Cancellation</span>
                                    <span>• 24/7 Road Access</span>
                                    <span>• GPS Navigation</span>
                                    <span>• Full Tank Refilled</span>
                                </div>
                            </div>

                            <Link to={`/booking/${id}`} className='btn-primary w-full text-center block text-lg py-5 shadow-[0_0_50px_rgba(0,243,255,0.2)]'>
                                Reserve Now
                            </Link>

                            <p className='text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest'>
                                Instant availability confirmation
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
