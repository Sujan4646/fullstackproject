import { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import AuthContext from '../context/AuthContext'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { FaCalendarAlt, FaCreditCard, FaCar, FaChevronRight, FaArrowLeft, FaShieldAlt } from 'react-icons/fa'

export default function Booking() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useContext(AuthContext)

    const [car, setCar] = useState(null)
    const [pickupDate, setPickupDate] = useState('')
    const [returnDate, setReturnDate] = useState('')
    const [totalCost, setTotalCost] = useState(0)
    const [days, setDays] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState('online')

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const { data } = await axios.get(`/api/cars/${id}`)
                setCar(data)
            } catch (error) {
                toast.error('Could not fetch car details')
            }
        }
        fetchCar()
    }, [id])

    useEffect(() => {
        if (pickupDate && returnDate && car) {
            const start = new Date(pickupDate)
            const end = new Date(returnDate)
            const diffTime = end - start
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

            if (diffDays > 0) {
                setDays(diffDays)
                setTotalCost(diffDays * car.pricePerDay)
            } else {
                setDays(0)
                setTotalCost(0)
            }
        }
    }, [pickupDate, returnDate, car])

    const onSubmit = async (e) => {
        e.preventDefault()

        if (totalCost <= 0) {
            toast.error('Please select valid pickup and return dates')
            return
        }

        setIsSubmitting(true)
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }

            const paymentId = paymentMethod === 'cod'
                ? 'cod_' + Math.floor(Math.random() * 1000000)
                : 'pay_' + Math.floor(Math.random() * 1000000)

            await axios.post('/api/bookings', {
                carId: id,
                pickupDate,
                returnDate,
                paymentId,
                paymentMethod,
            }, config)

            toast.success(paymentMethod === 'cod'
                ? 'Booking confirmed! Pay cash on delivery.'
                : 'Congratulations! Your booking is confirmed.')
            navigate('/dashboard')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Booking failed')
            setIsSubmitting(false)
        }
    }

    if (!car) return (
        <div className='flex flex-col items-center justify-center min-h-[60vh]'>
            <div className='spinner' />
            <p className='text-primary font-bold animate-pulse mt-4'>Configuring Reservation...</p>
        </div>
    )

    return (
        <div className='max-w-6xl mx-auto px-6 py-12'>
            <Link to={`/cars/${id}`} className='flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-12 text-sm font-bold uppercase tracking-widest'>
                <FaArrowLeft /> Back to Details
            </Link>

            <div className='grid grid-cols-1 lg:grid-cols-12 gap-12'>
                {/* Left: Form */}
                <div className='lg:col-span-7'>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className='space-y-12'
                    >
                        <div>
                            <h1 className='text-4xl font-black mb-4 uppercase tracking-tighter'>Confirm <span className='text-primary'>Booking</span></h1>
                            <div className='flex gap-4'>
                                <div className='flex items-center gap-2 text-primary font-bold text-xs uppercase'>
                                    <span className='w-6 h-6 rounded-full bg-primary text-black flex items-center justify-center text-[10px]'>1</span>
                                    Schedule
                                </div>
                                <div className='w-12 h-[1px] bg-white/10 self-center' />
                                <div className='flex items-center gap-2 text-slate-600 font-bold text-xs uppercase'>
                                    <span className='w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[10px]'>2</span>
                                    Checkout
                                </div>
                            </div>
                        </div>

                        <form onSubmit={onSubmit} className='space-y-8'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div className='space-y-3'>
                                    <label className='text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2'>
                                        <FaCalendarAlt className='text-primary' /> Pickup Date
                                    </label>
                                    <input
                                        type='date'
                                        className='w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-primary outline-none transition-all'
                                        value={pickupDate}
                                        min={new Date().toISOString().split('T')[0]}
                                        onChange={(e) => setPickupDate(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className='space-y-3'>
                                    <label className='text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2'>
                                        <FaCalendarAlt className='text-primary' /> Return Date
                                    </label>
                                    <input
                                        type='date'
                                        className='w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-primary outline-none transition-all'
                                        value={returnDate}
                                        min={pickupDate || new Date().toISOString().split('T')[0]}
                                        onChange={(e) => setReturnDate(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Payment Method Selection */}
                            <div className='space-y-3'>
                                <label className='text-[10px] font-bold text-slate-500 uppercase tracking-widest'>Payment Method</label>
                                <div className='grid grid-cols-2 gap-4'>
                                    <button
                                        type='button'
                                        onClick={() => setPaymentMethod('online')}
                                        className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all ${paymentMethod === 'online' ? 'border-primary bg-primary/10' : 'border-white/10 bg-white/5 hover:border-white/30'}`}
                                    >
                                        <FaCreditCard className={`text-2xl ${paymentMethod === 'online' ? 'text-primary' : 'text-slate-400'}`} />
                                        <div>
                                            <p className={`text-xs font-black uppercase tracking-widest ${paymentMethod === 'online' ? 'text-primary' : 'text-white'}`}>Online Pay</p>
                                            <p className='text-[10px] text-slate-500 mt-1'>Internal Wallet</p>
                                        </div>
                                        {paymentMethod === 'online' && (
                                            <span className='text-[9px] font-black text-black bg-primary px-2 py-0.5 rounded-full uppercase'>Selected</span>
                                        )}
                                    </button>

                                    <button
                                        type='button'
                                        onClick={() => setPaymentMethod('cod')}
                                        className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all ${paymentMethod === 'cod' ? 'border-emerald-400 bg-emerald-400/10' : 'border-white/10 bg-white/5 hover:border-white/30'}`}
                                    >
                                        <span className={`text-2xl ${paymentMethod === 'cod' ? 'text-emerald-400' : 'text-slate-400'}`}>💵</span>
                                        <div>
                                            <p className={`text-xs font-black uppercase tracking-widest ${paymentMethod === 'cod' ? 'text-emerald-400' : 'text-white'}`}>Cash on Delivery</p>
                                            <p className='text-[10px] text-slate-500 mt-1'>Pay at pickup</p>
                                        </div>
                                        {paymentMethod === 'cod' && (
                                            <span className='text-[9px] font-black text-black bg-emerald-400 px-2 py-0.5 rounded-full uppercase'>Selected</span>
                                        )}
                                    </button>
                                </div>

                                {paymentMethod === 'cod' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className='flex items-start gap-3 p-4 rounded-xl bg-emerald-400/5 border border-emerald-400/20 text-xs text-slate-400'
                                    >
                                        <span className='text-emerald-400 text-base mt-0.5'>ℹ️</span>
                                        <span>You'll pay <strong className='text-emerald-400'>₹{totalCost.toLocaleString()}</strong> in cash at the time of vehicle pickup. Please carry exact change.</span>
                                    </motion.div>
                                )}
                            </div>

                            <div className='glass-card border-primary/20 bg-primary/5'>
                                <div className='flex items-start gap-4'>
                                    <FaShieldAlt className='text-primary text-xl mt-1' />
                                    <div>
                                        <h4 className='text-white font-bold mb-1'>Premium Protection Included</h4>
                                        <p className='text-xs text-slate-400 leading-relaxed'>You're fully covered with our collision damage waiver and theft protection. Zero deductible for total peace of mind.</p>
                                    </div>
                                </div>
                            </div>

                            <div className='pt-6 border-t border-white/5'>
                                <button
                                    type='submit'
                                    disabled={isSubmitting || totalCost <= 0}
                                    className='btn-primary w-full flex items-center justify-center gap-2 py-5 disabled:opacity-50 disabled:cursor-not-allowed group'
                                >
                                    {isSubmitting ? 'Securing Fleet...' : (
                                        <>
                                            {paymentMethod === 'cod' ? 'Book & Pay on Delivery' : 'Complete Reservation'} <FaChevronRight className='group-hover:translate-x-1 transition-transform' />
                                        </>
                                    )}
                                </button>
                                <p className='text-center mt-4 text-[10px] text-slate-500 font-bold uppercase tracking-tighter'>
                                    {paymentMethod === 'cod' ? 'No payment required now · Pay at pickup' : 'Secure 256-bit encrypted transaction'}
                                </p>
                            </div>
                        </form>
                    </motion.div>
                </div>

                {/* Right: Summary */}
                <div className='lg:col-span-5'>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='glass-card sticky top-24 space-y-8 p-8'
                    >
                        <h3 className='font-bold text-white uppercase tracking-widest text-xs flex items-center gap-2 border-b border-white/5 pb-4'>
                            <FaCar className='text-primary' /> Booking Summary
                        </h3>

                        <div className='flex gap-4'>
                            <div className='w-24 h-16 rounded-xl overflow-hidden glass'>
                                <img
                                    src={car.images && car.images.length > 0 ? car.images[0] : 'https://via.placeholder.com/200'}
                                    className='w-full h-full object-cover'
                                    alt={car.name}
                                />
                            </div>
                            <div>
                                <h4 className='text-lg font-bold text-white'>{car.brand} {car.name}</h4>
                                <p className='text-[10px] text-primary font-black uppercase tracking-widest'>{car.category}</p>
                            </div>
                        </div>

                        <div className='space-y-4 pt-4 border-t border-white/5'>
                            <div className='flex justify-between items-center text-sm'>
                                <span className='text-slate-400'>Rental Fee ({days} days)</span>
                                <span className='text-white font-bold'>₹{totalCost.toLocaleString()}</span>
                            </div>
                            <div className='flex justify-between items-center text-sm'>
                                <span className='text-slate-400'>Insurance & Tax</span>
                                <span className='text-emerald-400 font-bold uppercase text-[10px] tracking-widest'>Included</span>
                            </div>
                        </div>

                        <div className='pt-6 border-t border-white/10 flex justify-between items-baseline'>
                            <span className='text-white font-black uppercase tracking-tighter text-2xl'>Total</span>
                            <div className='text-right'>
                                <span className='text-4xl font-black text-primary'>₹{totalCost.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${paymentMethod === 'cod' ? 'bg-emerald-400/5 border-emerald-400/20' : 'bg-white/5 border-white/5'}`}>
                            {paymentMethod === 'cod' ? (
                                <span className='text-xl'>💵</span>
                            ) : (
                                <FaCreditCard className='text-slate-500 text-xl' />
                            )}
                            <div className='text-[10px] font-bold text-slate-500 uppercase tracking-widest'>
                                Payment Method: <span className={paymentMethod === 'cod' ? 'text-emerald-400' : 'text-white'}>
                                    {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Internal Wallet'}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
