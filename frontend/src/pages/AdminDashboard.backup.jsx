import { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import AuthContext from '../context/AuthContext'
import { toast } from 'react-toastify'
import { FaTrash, FaCheck, FaTimes, FaCar, FaUsers, FaCalendarCheck, FaMoneyBillWave, FaChartLine, FaCrown } from 'react-icons/fa'

function AdminDashboard() {
    const { user } = useContext(AuthContext)
    const [view, setView] = useState('overview') // 'overview', 'bookings', 'cars', 'users', 'analytics'
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

    // Car Form State
    const [newCar, setNewCar] = useState({
        name: '',
        brand: '',
        category: 'SUV',
        pricePerDay: '',
        seatingCapacity: '',
        fuelType: 'Petrol',
        transmission: 'Manual',
        images: '',
        description: '',
    })
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        fetchStats()
        if (view === 'bookings') fetchBookings()
        else if (view === 'cars') fetchCars()
        else if (view === 'users') fetchUsers()
        else if (view === 'analytics') fetchAnalytics()
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

    const fetchAnalytics = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } }
            const { data } = await axios.get('/api/admin/car-analytics', config)
            setCarAnalytics(data)
        } catch (error) {
            toast.error('Error fetching analytics')
        }
    }

    const deleteUserHandler = async (id) => {
        if (!window.confirm('Delete this user?')) return
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } }
            await axios.delete(`/api/admin/users/${id}`, config)
            toast.success('User deleted')
            fetchUsers()
            fetchStats()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Delete failed')
        }
    }

    const updateUserRoleHandler = async (id, role) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } }
            await axios.put(`/api/admin/users/${id}/role`, { role }, config)
            toast.success('Role updated')
            fetchUsers()
        } catch (error) {
            toast.error('Update failed')
        }
    }

    const updateBookingStatus = async (id, status) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } }
            await axios.put(`/api/bookings/${id}`, { status }, config)
            toast.success(`Booking ${status}`)
            fetchBookings()
            fetchStats()
        } catch (error) {
            toast.error('Update failed')
        }
    }

    const deleteCar = async (id) => {
        if (!window.confirm('Delete this car?')) return
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } }
            await axios.delete(`/api/cars/${id}`, config)
            toast.success('Car deleted')
            fetchCars()
            fetchStats()
        } catch (error) {
            toast.error('Delete failed')
        }
    }

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('image', file)
        setUploading(true)

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`
                },
            }

            const { data } = await axios.post('/api/upload', formData, config)

            setNewCar(prev => ({ ...prev, images: data.url }))
            setUploading(false)
            toast.success('Image uploaded!')
        } catch (error) {
            console.error(error)
            setUploading(false)
            toast.error('Image upload failed')
        }
    }

    const handleCarSubmit = async (e) => {
        e.preventDefault()
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } }
            const carData = { ...newCar, images: [newCar.images] } // Wrap URL in array
            await axios.post('/api/cars', carData, config)
            toast.success('Car added')
            fetchCars()
            fetchStats()
            setNewCar({ ...newCar, name: '', brand: '', pricePerDay: '', description: '', images: '' })
        } catch (error) {
            toast.error(error.response?.data?.message || 'Add car failed')
        }
    }

    return (
        <div className='container' style={{ padding: '20px' }}>
            <h1>Admin Dashboard</h1>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <div className='card' style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <FaUsers size={30} color='#e94560' />
                    <div>
                        <h3>{stats.totalUsers}</h3>
                        <p>Total Users</p>
                    </div>
                </div>
                <div className='card' style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <FaCar size={30} color='#e94560' />
                    <div>
                        <h3>{stats.totalCars}</h3>
                        <p>Total Cars</p>
                    </div>
                </div>
                <div className='card' style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <FaCalendarCheck size={30} color='#e94560' />
                    <div>
                        <h3>{stats.totalBookings}</h3>
                        <p>Total Bookings</p>
                    </div>
                </div>
                <div className='card' style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <FaMoneyBillWave size={30} color='#e94560' />
                    <div>
                        <h3>${stats.totalRevenue}</h3>
                        <p>Revenue</p>
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <button className={`btn ${view === 'bookings' ? 'active' : ''}`} onClick={() => setView('bookings')} style={{ marginRight: '10px' }}>Bookings</button>
                <button className={`btn ${view === 'cars' ? 'active' : ''}`} onClick={() => setView('cars')}>Cars</button>
            </div>

            {view === 'bookings' ? (
                <div>
                    <h2>All Bookings</h2>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#2a2a40', color: '#fff' }}>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>ID</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>User</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Car</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Dates</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map(b => (
                                    <tr key={b._id} style={{ borderBottom: '1px solid #444' }}>
                                        <td style={{ padding: '10px' }}>{b._id.substring(0, 10)}...</td>
                                        <td style={{ padding: '10px' }}>{b.user?.email || 'Unknown'}</td>
                                        <td style={{ padding: '10px' }}>{b.car?.name || 'Deleted'}</td>
                                        <td style={{ padding: '10px' }}>{new Date(b.pickupDate).toLocaleDateString()} - {new Date(b.returnDate).toLocaleDateString()}</td>
                                        <td style={{ padding: '10px' }}><span style={{ color: b.status === 'Confirmed' ? 'green' : b.status === 'Cancelled' ? 'red' : 'orange' }}>{b.status}</span></td>
                                        <td style={{ padding: '10px' }}>
                                            {b.status === 'Pending' && (
                                                <>
                                                    <button onClick={() => updateBookingStatus(b._id, 'Confirmed')} style={{ color: 'green', marginRight: '10px', background: 'none', border: 'none', cursor: 'pointer' }} title='Confirm'><FaCheck size={18} /></button>
                                                    <button onClick={() => updateBookingStatus(b._id, 'Cancelled')} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }} title='Reject'><FaTimes size={18} /></button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div>
                    <h2>Manage Cars</h2>
                    {/* Add Car Form */}
                    <form onSubmit={handleCarSubmit} style={{ backgroundColor: '#2a2a40', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
                        <h3>Add New Car</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                            <input className='form-control' placeholder='Name' value={newCar.name} onChange={e => setNewCar({ ...newCar, name: e.target.value })} required />
                            <input className='form-control' placeholder='Brand' value={newCar.brand} onChange={e => setNewCar({ ...newCar, brand: e.target.value })} required />
                            <select className='form-control' value={newCar.category} onChange={e => setNewCar({ ...newCar, category: e.target.value })}>
                                <option value='SUV'>SUV</option>
                                <option value='Sedan'>Sedan</option>
                                <option value='Hatchback'>Hatchback</option>
                                <option value='Luxury'>Luxury</option>
                            </select>
                            <input type='number' className='form-control' placeholder='Price/Day' value={newCar.pricePerDay} onChange={e => setNewCar({ ...newCar, pricePerDay: e.target.value })} required />
                            <input type='number' className='form-control' placeholder='Seating' value={newCar.seatingCapacity} onChange={e => setNewCar({ ...newCar, seatingCapacity: e.target.value })} required />
                            <select className='form-control' value={newCar.fuelType} onChange={e => setNewCar({ ...newCar, fuelType: e.target.value })}>
                                <option value='Petrol'>Petrol</option>
                                <option value='Diesel'>Diesel</option>
                                <option value='Electric'>Electric</option>
                                <option value='Hybrid'>Hybrid</option>
                            </select>
                            <select className='form-control' value={newCar.transmission} onChange={e => setNewCar({ ...newCar, transmission: e.target.value })}>
                                <option value='Manual'>Manual</option>
                                <option value='Automatic'>Automatic</option>
                            </select>

                            {/* File Upload */}
                            <div style={{ gridColumn: 'span 2' }}>
                                <label>Image Upload</label>
                                <input className='form-control' type='file' onChange={uploadFileHandler} />
                                {uploading && <p>Uploading...</p>}
                                <input className='form-control' placeholder='Or Image URL' value={newCar.images} onChange={e => setNewCar({ ...newCar, images: e.target.value })} style={{ marginTop: '10px' }} />
                            </div>

                            <textarea className='form-control' placeholder='Description' value={newCar.description} onChange={e => setNewCar({ ...newCar, description: e.target.value })} required style={{ gridColumn: 'span 2' }} />
                        </div>
                        <button type='submit' className='btn' style={{ marginTop: '20px' }}>Add Car</button>
                    </form>

                    <div className='card-grid'>
                        {cars.map(c => (
                            <div key={c._id} className='card'>
                                <img src={c.images && c.images.length > 0 ? c.images[0] : 'https://via.placeholder.com/300'} alt={c.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                                <div className='card-content'>
                                    <h4>{c.brand} {c.name}</h4>
                                    <button className='btn' onClick={() => deleteCar(c._id)} style={{ backgroundColor: 'red', marginTop: '10px' }}><FaTrash /> Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminDashboard
