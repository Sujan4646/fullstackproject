import { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import AuthContext from '../context/AuthContext'
import { toast } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTrash, FaCheck, FaTimes, FaCar, FaUsers, FaCalendarCheck, FaMoneyBillWave, FaChartLine, FaCrown, FaHourglassHalf, FaClipboardCheck, FaPlus, FaCloudUploadAlt, FaGem, FaShieldAlt } from 'react-icons/fa'

import { getCarImage } from '../utils/imagePath'

function AdminDashboard() {
    const { user } = useContext(AuthContext)
    const [view, setView] = useState('overview')
    const [bookings, setBookings] = useState([])
    const [cars, setCars] = useState([])
    const [users, setUsers] = useState([])
    const [recentBookings, setRecentBookings] = useState([])
    const [carAnalytics, setCarAnalytics] = useState([])
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCars: 0,
        totalBookings: 0,
        totalRevenue: 0,
        pendingBookings: 0,
        confirmedBookings: 0,
        completedBookings: 0
    })

    const [newCar, setNewCar] = useState({
        name: '',
        brand: '',
        category: 'SUV',
        pricePerDay: '',
        seatingCapacity: '',
        fuelType: 'Petrol',
        transmission: 'Manual',
        location: '',
        images: [],
        description: '',
    })
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        fetchStats()
        if (view === 'bookings') fetchBookings()
        else if (view === 'cars') fetchCars()
        else if (view === 'users') fetchUsers()
        else if (view === 'analytics') fetchCarAnalytics()
        else if (view === 'overview') {
            fetchRecentBookings()
            fetchCarAnalytics()
        }
    }, [view])

    const fetchStats = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } }
            const { data } = await axios.get('/api/admin/stats', config)
            setStats(data)
        } catch (error) {
            console.error('Error fetching stats')
        }
    }

    const fetchBookings = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } }
            const { data } = await axios.get('/api/bookings/all', config)
            setBookings(data)
        } catch (error) {
            toast.error('Error fetching bookings')
        }
    }

    const fetchCars = async () => {
        try {
            const { data } = await axios.get('/api/cars')
            setCars(data)
        } catch (error) {
            toast.error('Error fetching cars')
        }
    }

    const fetchUsers = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } }
            const { data } = await axios.get('/api/admin/users', config)
            setUsers(data)
        } catch (error) {
            toast.error('Error fetching users')
        }
    }

    const fetchRecentBookings = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } }
            const { data } = await axios.get('/api/admin/recent-bookings?limit=5', config)
            setRecentBookings(data)
        } catch (error) {
            console.error('Error fetching recent bookings')
        }
    }

    const fetchCarAnalytics = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } }
            const { data } = await axios.get('/api/admin/car-analytics', config)
            setCarAnalytics(data)
        } catch (error) {
            console.error('Error fetching car analytics')
        }
    }

    const deleteUserHandler = async (id) => {
        if (!window.confirm('Terminate this user account permanently?')) return
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } }
            await axios.delete(`/api/admin/users/${id}`, config)
            toast.success('User profile purged')
            fetchUsers()
            fetchStats()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Purge failed')
        }
    }

    const updateUserRoleHandler = async (id, role) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } }
            await axios.put(`/api/admin/users/${id}/role`, { role }, config)
            toast.success('Clearance level updated')
            fetchUsers()
        } catch (error) {
            toast.error('Update failed')
        }
    }

    const updateBookingStatus = async (id, status) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } }
            await axios.put(`/api/bookings/${id}`, { status }, config)
            toast.success(`Booking ${status} successfully`)
            fetchBookings()
            fetchStats()
        } catch (error) {
            toast.error('Update failed')
        }
    }

    const deleteCar = async (id) => {
        if (!window.confirm('Decommission this vehicle from the fleet?')) return
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } }
            await axios.delete(`/api/cars/${id}`, config)
            toast.success('Vehicle decommissioned')
            fetchCars()
            fetchStats()
        } catch (error) {
            toast.error('Operation failed')
        }
    }

    const uploadFileHandler = async (e) => {
        const files = Array.from(e.target.files || [])
        if (files.length === 0) return

        const formData = new FormData()
        files.forEach((file) => formData.append('images', file))
        setUploading(true)

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`
                },
            }

            const { data } = await axios.post('/api/upload', formData, config)
            const urls = data.urls || (data.url ? [data.url] : [])
            setNewCar(prev => ({ ...prev, images: urls }))
            setUploading(false)
            toast.success('Visual assets uploaded')
        } catch (error) {
            console.error(error)
            setUploading(false)
            toast.error('Asset upload failure')
        }
    }

    const handleCarSubmit = async (e) => {
        e.preventDefault()
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } }
            const carData = { ...newCar, images: newCar.images }
            await axios.post('/api/cars', carData, config)
            toast.success('New vehicle integrated into fleet')
            fetchCars()
            fetchStats()
            setNewCar({ ...newCar, name: '', brand: '', pricePerDay: '', description: '', location: '', images: [] })
        } catch (error) {
            toast.error(error.response?.data?.message || 'Integration failed')
        }
    }

    const SidebarItem = ({ id, icon: Icon, label }) => (
        <button
            onClick={() => setView(id)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 text-sm font-bold uppercase tracking-widest ${view === id ? 'bg-primary text-black shadow-[0_0_20px_rgba(0,243,255,0.3)]' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
        >
            <Icon className={view === id ? 'text-black' : 'text-primary/60'} />
            {label}
        </button>
    )

    const StatCard = ({ icon: Icon, value, label, color }) => (
        <div className='glass-card p-8 group overflow-hidden relative'>
            <div className={`absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 rounded-full opacity-5 group-hover:scale-125 transition-transform duration-700`} style={{ background: color }} />
            <div className='flex items-center justify-between relative z-10'>
                <div>
                    <h3 className='text-3xl font-black text-white mb-1'>{value}</h3>
                    <p className='text-[10px] font-bold text-slate-500 uppercase tracking-widest'>{label}</p>
                </div>
                <div className='w-12 h-12 rounded-2xl glass flex items-center justify-center' style={{ color }}>
                    <Icon size={20} />
                </div>
            </div>
        </div>
    )

    return (
        <div className='max-w-[1600px] mx-auto px-6 py-12'>
            <div className='flex items-center gap-6 mb-12'>
                <div className='w-16 h-16 rounded-2xl glass flex items-center justify-center text-primary text-2xl border-primary/20'>
                    <FaShieldAlt />
                </div>
                <div>
                    <h1 className='text-4xl font-black uppercase tracking-tighter'>Fleet <span className='text-primary'>Control</span></h1>
                    <p className='text-slate-500 text-sm font-bold uppercase tracking-widest'>Centralized Administration System</p>
                </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-12 gap-12'>
                {/* Side Navigation */}
                <aside className='lg:col-span-2 space-y-2'>
                    <SidebarItem id='overview' icon={FaChartLine} label='Overview' />
                    <SidebarItem id='bookings' icon={FaCalendarCheck} label='Bookings' />
                    <SidebarItem id='cars' icon={FaCar} label='Vehicles' />
                    <SidebarItem id='users' icon={FaUsers} label='Citizens' />
                    <SidebarItem id='analytics' icon={FaGem} label='Insights' />
                </aside>

                {/* Main View Area */}
                <main className='lg:col-span-10 space-y-12'>
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={view}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Overview View */}
                            {view === 'overview' && (
                                <div className='space-y-12'>
                                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                                        <StatCard icon={FaUsers} value={stats.totalUsers} label='Total Users' color='#667eea' />
                                        <StatCard icon={FaCar} value={stats.totalCars} label='Active Fleet' color='#f5576c' />
                                        <StatCard icon={FaCalendarCheck} value={stats.totalBookings} label='Total Orders' color='#4facfe' />
                                        <StatCard icon={FaMoneyBillWave} value={`$${stats.totalRevenue.toLocaleString()}`} label='Gross Revenue' color='#43e97b' />
                                    </div>

                                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
                                        <div className='glass-card p-0 overflow-hidden'>
                                            <div className='p-8 border-b border-white/5 flex justify-between items-center'>
                                                <h3 className='text-sm font-black uppercase tracking-widest text-white'>Recent Traffic</h3>
                                                <Link to='#' onClick={() => setView('bookings')} className='text-[10px] text-primary font-bold hover:underline'>View All</Link>
                                            </div>
                                            <div className='overflow-x-auto'>
                                                <table className='w-full text-left'>
                                                    <thead>
                                                        <tr className='text-[10px] uppercase font-black text-slate-500 bg-white/5'>
                                                            <th className='px-8 py-4'>User</th>
                                                            <th className='px-8 py-4'>Vehicle</th>
                                                            <th className='px-8 py-4'>Status</th>
                                                            <th className='px-8 py-4 text-right'>Fee</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className='text-xs font-bold'>
                                                        {recentBookings.map(b => (
                                                            <tr key={b._id} className='border-b border-white/5 hover:bg-white/[0.02] transition-colors'>
                                                                <td className='px-8 py-4 text-slate-300'>{b.user?.name || 'Guest'}</td>
                                                                <td className='px-8 py-4 text-white uppercase'>{b.car?.name || '--'}</td>
                                                                <td className='px-8 py-4'>
                                                                    <span className={`px-3 py-1 rounded-full text-[10px] ${b.status === 'Confirmed' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                                                                        {b.status}
                                                                    </span>
                                                                </td>
                                                                <td className='px-8 py-4 text-right text-emerald-400 font-black'>${b.totalCost}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <div className='glass-card p-8'>
                                            <h3 className='text-sm font-black uppercase tracking-widest text-white mb-8 border-b border-white/5 pb-4'>Top Performers</h3>
                                            <div className='space-y-6'>
                                                {carAnalytics.slice(0, 3).map((car, idx) => (
                                                    <div key={idx} className='flex items-center gap-6'>
                                                        <div className='w-16 h-16 rounded-2xl overflow-hidden glass'>
                                                            <img src={getCarImage(car._id?.images?.[0])} className='w-full h-full object-cover' alt='Car' />
                                                        </div>
                                                        <div className='flex-grow'>
                                                            <h4 className='text-white font-bold'>{car._id?.brand} {car._id?.name}</h4>
                                                            <div className='flex items-center gap-4 mt-1'>
                                                                <span className='text-[10px] font-black text-primary uppercase'>{car.totalBookings} Rents</span>
                                                                <div className='h-1 flex-grow bg-white/5 rounded-full overflow-hidden'>
                                                                    <div className='h-full bg-primary shadow-[0_0_10px_rgba(0,243,255,0.5)]' style={{ width: `${Math.min(car.totalBookings * 10, 100)}%` }} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='text-right'>
                                                            <span className='text-sm font-black text-white'>${car.totalRevenue.toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Bookings View */}
                            {view === 'bookings' && (
                                <div className='glass-card p-0 overflow-hidden'>
                                    <div className='p-8 border-b border-white/5'>
                                        <h3 className='text-sm font-black uppercase tracking-widest text-white'>Comprehensive Order Log</h3>
                                    </div>
                                    <div className='overflow-x-auto'>
                                        <table className='w-full text-left'>
                                            <thead>
                                                <tr className='text-[10px] uppercase font-black text-slate-500 bg-white/5'>
                                                    <th className='px-8 py-4'>Identifier</th>
                                                    <th className='px-8 py-4'>User Profile</th>
                                                    <th className='px-8 py-4'>Vehicle Target</th>
                                                    <th className='px-8 py-4'>Operations Window</th>
                                                    <th className='px-8 py-4'>Status</th>
                                                    <th className='px-8 py-4 text-center'>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className='text-xs font-bold font-mono'>
                                                {bookings.map(b => (
                                                    <tr key={b._id} className='border-b border-white/5 hover:bg-white/[0.02]'>
                                                        <td className='px-8 py-4 text-slate-500'>#{b._id.slice(-8).toUpperCase()}</td>
                                                        <td className='px-8 py-4 text-slate-300'>{b.user?.email || 'OFFLINE'}</td>
                                                        <td className='px-8 py-4 text-white'>{b.car?.name || '--'}</td>
                                                        <td className='px-8 py-4 text-slate-500 text-[10px]'>{new Date(b.pickupDate).toLocaleDateString()} — {new Date(b.returnDate).toLocaleDateString()}</td>
                                                        <td className='px-8 py-4'>
                                                            <span className={`px-4 py-1.5 rounded-full text-[10px] ${b.status === 'Confirmed' ? 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20' : 'text-yellow-500 bg-yellow-500/10 border border-yellow-500/20'}`}>
                                                                {b.status}
                                                            </span>
                                                        </td>
                                                        <td className='px-8 py-4'>
                                                            {b.status === 'Pending' && (
                                                                <div className='flex gap-2 justify-center'>
                                                                    <button onClick={() => updateBookingStatus(b._id, 'Confirmed')} className='w-9 h-9 glass rounded-lg flex items-center justify-center text-emerald-400 hover:bg-emerald-400 hover:text-black transition-all border-emerald-400/20'><FaCheck size={12} /></button>
                                                                    <button onClick={() => updateBookingStatus(b._id, 'Cancelled')} className='w-9 h-9 glass rounded-lg flex items-center justify-center text-red-400 hover:bg-red-400 hover:text-white transition-all border-red-400/20'><FaTimes size={12} /></button>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Cars View */}
                            {view === 'cars' && (
                                <div className='space-y-12'>
                                    <div className='glass-card p-10'>
                                        <h3 className='text-sm font-black uppercase tracking-widest text-white mb-8 border-b border-white/5 pb-4 flex items-center gap-2'>
                                            <FaPlus className='text-primary' /> Integrate New Unit
                                        </h3>
                                        <form onSubmit={handleCarSubmit} className='space-y-8'>
                                            <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
                                                <input className='w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white focus:border-primary outline-none transition-all' placeholder='Vehicle Name' value={newCar.name} onChange={e => setNewCar({ ...newCar, name: e.target.value })} required />
                                                <input className='w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white focus:border-primary outline-none transition-all' placeholder='Brand Manufacturer' value={newCar.brand} onChange={e => setNewCar({ ...newCar, brand: e.target.value })} required />
                                                <input className='w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white focus:border-primary outline-none transition-all' placeholder='Location (e.g., Coimbatore)' value={newCar.location} onChange={e => setNewCar({ ...newCar, location: e.target.value })} required />
                                                <select className='w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white focus:border-primary outline-none transition-all cursor-pointer' value={newCar.category} onChange={e => setNewCar({ ...newCar, category: e.target.value })}>
                                                    <option value='SUV'>SUV</option>
                                                    <option value='Sedan'>Sedan</option>
                                                    <option value='Hatchback'>Hatchback</option>
                                                    <option value='Luxury'>Luxury</option>
                                                </select>
                                                <input type='number' className='w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white focus:border-primary outline-none transition-all' placeholder='Daily Fee ($)' value={newCar.pricePerDay} onChange={e => setNewCar({ ...newCar, pricePerDay: e.target.value })} required />
                                                <input type='number' className='w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white focus:border-primary outline-none transition-all' placeholder='Capacity (Persons)' value={newCar.seatingCapacity} onChange={e => setNewCar({ ...newCar, seatingCapacity: e.target.value })} required />
                                                <select className='w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white focus:border-primary outline-none transition-all cursor-pointer' value={newCar.fuelType} onChange={e => setNewCar({ ...newCar, fuelType: e.target.value })}>
                                                    <option value='Petrol'>Petrol</option>
                                                    <option value='Diesel'>Diesel</option>
                                                    <option value='Electric'>Electric</option>
                                                    <option value='Hybrid'>Hybrid</option>
                                                </select>
                                                <select className='w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white focus:border-primary outline-none transition-all cursor-pointer' value={newCar.transmission} onChange={e => setNewCar({ ...newCar, transmission: e.target.value })}>
                                                    <option value='Manual'>Manual</option>
                                                    <option value='Automatic'>Automatic</option>
                                                </select>
                                                <div className='relative md:col-span-1'>
                                                    <label className='w-full bg-white/5 border border-dashed border-white/20 rounded-2xl p-4 text-xs text-slate-500 hover:border-primary hover:text-primary transition-all cursor-pointer flex items-center justify-center gap-2 h-full'>
                                                        <FaCloudUploadAlt size={20} />
                                                        {uploading ? 'Processing...' : 'Upload Visuals'}
                                                        <input type='file' multiple className='hidden' onChange={uploadFileHandler} />
                                                    </label>
                                                </div>
                                                <textarea className='w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white focus:border-primary outline-none transition-all md:col-span-4 min-h-[100px]' placeholder='Technical Specification & Narrative' value={newCar.description} onChange={e => setNewCar({ ...newCar, description: e.target.value })} required />
                                            </div>

                                            {newCar.images.length > 0 && (
                                                <div className='flex gap-4 flex-wrap mt-4'>
                                                    {newCar.images.map((img, idx) => (
                                                        <div key={idx} className='w-32 h-24 rounded-xl overflow-hidden glass relative group'>
                                                            <img src={img} alt='PREVIEW' className='w-full h-full object-cover' />
                                                            <div className='absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                                                                <span className='text-[8px] font-black uppercase tracking-widest text-white'>Asset Link Ready</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <button type='submit' className='btn-primary px-12 py-5 shadow-[0_0_30px_rgba(0,243,255,0.2)]'>Deploy Platform</button>
                                        </form>
                                    </div>

                                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                                        {cars.map(c => (
                                            <div key={c._id} className='glass-card p-0 overflow-hidden group'>
                                                <div className='relative h-40 overflow-hidden'>
                                                    <img src={getCarImage(c.images?.[0])} className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110' alt='Archive' />
                                                    <div className='absolute top-4 right-4'>
                                                        <button onClick={() => deleteCar(c._id)} className='w-9 h-9 rounded-xl glass bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border-red-500/20'><FaTrash size={12} /></button>
                                                    </div>
                                                </div>
                                                <div className='p-6'>
                                                    <p className='text-[10px] font-black uppercase text-primary tracking-widest mb-1'>{c.brand} {c.location && `• ${c.location}`}</p>
                                                    <h4 className='text-sm font-bold text-white mb-4'>{c.name}</h4>
                                                    <div className='flex justify-between items-center pt-4 border-t border-white/5'>
                                                        <span className='text-xs font-black text-white'>${c.pricePerDay} <span className='text-[8px] text-slate-500 uppercase'>/ DAY</span></span>
                                                        <span className='text-[8px] px-2 py-0.5 rounded bg-white/5 text-slate-400 uppercase font-black'>{c.category}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Users View */}
                            {view === 'users' && (
                                <div className='glass-card p-0 overflow-hidden'>
                                    <div className='p-8 border-b border-white/5'>
                                        <h3 className='text-sm font-black uppercase tracking-widest text-white'>Access Registry</h3>
                                    </div>
                                    <div className='overflow-x-auto'>
                                        <table className='w-full text-left'>
                                            <thead>
                                                <tr className='text-[10px] uppercase font-black text-slate-500 bg-white/5'>
                                                    <th className='px-8 py-4'>Ident Name</th>
                                                    <th className='px-8 py-4'>Email Link</th>
                                                    <th className='px-8 py-4'>Clearance</th>
                                                    <th className='px-8 py-4 text-center'>Management</th>
                                                </tr>
                                            </thead>
                                            <tbody className='text-xs font-bold'>
                                                {users.map(u => (
                                                    <tr key={u._id} className='border-b border-white/5 hover:bg-white/[0.02] transition-colors'>
                                                        <td className='px-8 py-4 text-white uppercase tracking-tighter'>{u.name}</td>
                                                        <td className='px-8 py-4 text-slate-400 font-mono'>{u.email}</td>
                                                        <td className='px-8 py-4'>
                                                            {u.role === 'admin' ? (
                                                                <span className='flex items-center gap-2 text-primary uppercase text-[10px] bg-primary/10 px-3 py-1 rounded-full border border-primary/20'>
                                                                    <FaCrown size={10} /> Tier 1 Admin
                                                                </span>
                                                            ) : (
                                                                <select
                                                                    value={u.role}
                                                                    onChange={(e) => updateUserRoleHandler(u._id, e.target.value)}
                                                                    className='bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[10px] text-white outline-none focus:border-primary transition-all cursor-pointer'
                                                                >
                                                                    <option value='user'>Standard User</option>
                                                                    <option value='admin'>Grant Admin</option>
                                                                </select>
                                                            )}
                                                        </td>
                                                        <td className='px-8 py-4 text-center'>
                                                            {u.role !== 'admin' && (
                                                                <button onClick={() => deleteUserHandler(u._id)} className='w-9 h-9 glass rounded-lg flex items-center justify-center text-red-400 hover:bg-red-400 hover:text-white transition-all border-red-400/20 mx-auto'><FaTrash size={12} /></button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Analytics View */}
                            {view === 'analytics' && (
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                                    {carAnalytics.map((car, idx) => (
                                        <div key={idx} className='glass-card group'>
                                            <div className='flex items-start justify-between mb-8'>
                                                <div className='w-16 h-16 rounded-3xl glass flex items-center justify-center border-primary/20 text-primary'>
                                                    <FaChartLine size={24} />
                                                </div>
                                                <div className='text-right'>
                                                    <p className='text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1'>Utilization</p>
                                                    <span className='text-2xl font-black text-white'>{car.totalBookings}</span>
                                                </div>
                                            </div>

                                            <h4 className='text-lg font-black text-white mb-2 uppercase tracking-tighter'>{car._id?.brand} {car._id?.name}</h4>
                                            <div className='flex gap-2 mb-8'>
                                                <span className='px-2 py-0.5 rounded bg-white/5 text-[8px] font-black text-slate-400 uppercase'>{car._id?.category}</span>
                                                <span className='px-2 py-0.5 rounded bg-white/5 text-[8px] font-black text-slate-400 uppercase'>{car._id?.fuelType}</span>
                                            </div>

                                            <div className='bg-primary/5 border border-primary/20 rounded-2xl p-6 relative overflow-hidden'>
                                                <div className='absolute bottom-0 right-0 w-24 h-24 bg-primary/10 rounded-full -mr-12 -mb-12 blur-2xl transition-transform duration-700 group-hover:scale-150' />
                                                <p className='text-[10px] font-black text-primary uppercase tracking-widest mb-2'>Accrued Revenue</p>
                                                <h3 className='text-4xl font-black text-white relative z-10'>${car.totalRevenue.toLocaleString()}</h3>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    )
}

export default AdminDashboard
