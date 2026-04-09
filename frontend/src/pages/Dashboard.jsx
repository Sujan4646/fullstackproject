import { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import AuthContext from '../context/AuthContext'
import { toast } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTrash, FaCheckCircle, FaClock, FaCar, FaCalendarAlt, FaHistory, FaUserCircle } from 'react-icons/fa'
import { Link } from 'react-router-dom'

import { getCarImage } from '../utils/imagePath'

function Dashboard() {
    const { user } = useContext(AuthContext)
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
                const { data } = await axios.get('/api/bookings', config)
                setBookings(data)
                setLoading(false)
            } catch (error) {
                toast.error('Could not retrieve your journey history')
                setLoading(false)
            }
        }

        if (user) {
            fetchBookings()
        }
    }, [user])

    const deleteBooking = async (id) => {
        if (window.confirm('Are you sure you want to terminate this reservation? This cannot be undone.')) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
                await axios.delete(`/api/bookings/${id}`, config)
                setBookings(bookings.filter((booking) => booking._id !== id))
                toast.success('Reservation terminated successfully')
            } catch (error) {
                toast.error(error.response?.data?.message || 'Operation failed')
            }
        }
    }

    if (loading) return (
        <div className='flex flex-col items-center justify-center min-h-[60vh]'>
            <div className='spinner' />
            <p className='text-primary font-bold animate-pulse mt-4'>Synchronizing Your Activity...</p>
        </div>
    )

    return (
        <div className='max-w-7xl mx-auto px-6 py-12'>
            <div className='flex flex-col md:flex-row justify-between items-center mb-12 gap-6'>
                <div className='flex items-center gap-6'>
                    <div className='w-20 h-20 rounded-3xl glass flex items-center justify-center text-primary text-4xl border-primary/20 shadow-[0_0_30px_rgba(0,243,255,0.1)]'>
                        <FaUserCircle />
                    </div>
                    <div>
                        <h1 className='text-4xl font-black uppercase tracking-tighter'>Personal <span className='text-primary'>Dashboard</span></h1>
                        <p className='text-slate-500 text-sm font-bold uppercase tracking-widest'>Welcome back, {user?.name}</p>
                    </div>
                </div>

                <div className='flex gap-4'>
                    <div className='glass px-6 py-4 rounded-2xl flex flex-col items-center min-w-[120px]'>
                        <span className='text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1'>Activity</span>
                        <span className='text-2xl font-black text-white'>{bookings.length}</span>
                    </div>
                    <div className='glass px-6 py-4 rounded-2xl flex flex-col items-center min-w-[120px]'>
                        <span className='text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1'>Points</span>
                        <span className='text-2xl font-black text-primary'>1,250</span>
                    </div>
                </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-4 gap-12'>
                {/* Side Stats/Info */}
                <div className='lg:col-span-1 space-y-6'>
                    <div className='glass-card p-8'>
                        <h3 className='text-sm font-black uppercase tracking-widest text-white mb-6 border-b border-white/5 pb-4 flex items-center gap-2'>
                            <FaHistory className='text-primary' /> Quick Stats
                        </h3>
                        <div className='space-y-4 text-xs font-bold uppercase'>
                            <div className='flex justify-between'>
                                <span className='text-slate-500'>Completed</span>
                                <span className='text-white'>{bookings.filter(b => b.status === 'Confirmed').length}</span>
                            </div>
                            <div className='flex justify-between'>
                                <span className='text-slate-500'>In Queue</span>
                                <span className='text-white'>{bookings.filter(b => b.status === 'Pending').length}</span>
                            </div>
                            <div className='flex justify-between'>
                                <span className='text-slate-500'>Total Spend</span>
                                <span className='text-primary'>${bookings.reduce((acc, b) => acc + b.totalCost, 0).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bookings Feed */}
                <div className='lg:col-span-3 space-y-6'>
                    <div className='flex items-center justify-between'>
                        <h2 className='text-xl font-bold uppercase tracking-widest flex items-center gap-3'>
                            Recent <span className='text-primary'>Journeys</span>
                        </h2>
                    </div>

                    <AnimatePresence mode='popLayout'>
                        {bookings.length > 0 ? (
                            <div className='space-y-4'>
                                {bookings.map((booking, idx) => (
                                    <motion.div
                                        key={booking._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className='glass-card group hover:border-primary/20 transition-all p-0 overflow-hidden'
                                    >
                                        <div className='flex flex-col md:flex-row'>
                                            <div className='w-full md:w-48 h-32 overflow-hidden bg-bg-dark'>
                                                <img
                                                    src={getCarImage(booking.car?.images?.[0])}
                                                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
                                                    alt='Vehicle'
                                                />
                                            </div>
                                            <div className='flex-grow p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
                                                <div>
                                                    <div className='flex items-baseline gap-2 mb-1'>
                                                        <h3 className='text-lg font-bold text-white'>{booking.car ? `${booking.car.brand} ${booking.car.name}` : 'Archive Vehicle'}</h3>
                                                        <span className='text-[10px] text-slate-500 font-mono'>#{booking._id.slice(-6).toUpperCase()}</span>
                                                    </div>
                                                    <div className='flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest'>
                                                        <span className='flex items-center gap-1.5'><FaCalendarAlt className='text-primary/60' /> {new Date(booking.pickupDate).toLocaleDateString()} — {new Date(booking.returnDate).toLocaleDateString()}</span>
                                                        <span className='text-white'>${booking.totalCost} TOTAL</span>
                                                    </div>
                                                </div>

                                                <div className='flex items-center gap-4 w-full md:w-auto mt-2 md:mt-0'>
                                                    {booking.status === 'Pending' ? (
                                                        <span className='flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 text-yellow-500 text-[10px] font-black uppercase tracking-widest border border-yellow-500/20'>
                                                            <FaClock className='animate-pulse' /> Queued
                                                        </span>
                                                    ) : (
                                                        <span className='flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20'>
                                                            <FaCheckCircle /> Confirmed
                                                        </span>
                                                    )}

                                                    {booking.status === 'Pending' && (
                                                        <button
                                                            onClick={() => deleteBooking(booking._id)}
                                                            className='w-10 h-10 rounded-xl bg-red-500/5 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border border-red-500/20'
                                                        >
                                                            <FaTrash size={12} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className='glass-card py-24 flex flex-col items-center justify-center text-center'>
                                <div className='w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6'>
                                    <FaCar className='text-slate-600 text-3xl' />
                                </div>
                                <h3 className='text-xl font-bold mb-2'>No Activity Recorded</h3>
                                <p className='text-slate-500 text-sm max-w-xs mb-8'>Your fleet journeys will appear here once you've secured your first reservation.</p>
                                <Link to='/cars' className='btn-outline text-xs'>Explore Our Fleet</Link>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
