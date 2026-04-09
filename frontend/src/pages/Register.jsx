import { useState, useContext, useEffect } from 'react'
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaCheckCircle } from 'react-icons/fa'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import AuthContext from '../context/AuthContext'
import { motion } from 'framer-motion'

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    })

    const { name, email, password, confirmPassword } = formData
    const navigate = useNavigate()
    const { register, user, loading } = useContext(AuthContext)

    useEffect(() => {
        if (user) {
            navigate('/')
        }
    }, [user, navigate])

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast.error('Cryptographic sync failure: Passwords do not match')
        } else {
            try {
                await register(name, email, password)
                toast.success('Identity verified. Profile initialized.')
                navigate('/dashboard')
            } catch (error) {
                toast.error(error || 'System rejection: Registration failed')
            }
        }
    }

    if (loading) {
        return (
            <div className='flex flex-col items-center justify-center min-h-[60vh]'>
                <div className='spinner' />
                <p className='text-primary font-bold animate-pulse mt-4'>Syncing with Global Network...</p>
            </div>
        )
    }

    return (
        <div className='min-h-[90vh] flex items-center justify-center px-6 py-12'>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='glass-card max-w-lg w-full p-10 relative overflow-hidden'
            >
                {/* Decorative Elements */}
                <div className='absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full -ml-16 -mt-16 blur-2xl' />
                <div className='absolute bottom-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -mr-16 -mb-16 blur-2xl' />

                <div className='relative z-10'>
                    <div className='flex justify-center mb-8'>
                        <div className='w-16 h-16 rounded-2xl glass flex items-center justify-center text-primary text-2xl border-primary/20 shadow-[0_0_30px_rgba(0,243,255,0.2)]'>
                            <FaUserPlus />
                        </div>
                    </div>

                    <div className='text-center mb-10'>
                        <h1 className='text-3xl font-black uppercase tracking-tighter mb-2'>Create <span className='text-primary'>Identity</span></h1>
                        <p className='text-slate-500 text-[10px] font-bold uppercase tracking-widest'>Register your neural profile</p>
                    </div>

                    <form onSubmit={onSubmit} className='space-y-6'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div className='space-y-2'>
                                <label className='text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1'>Full Name</label>
                                <div className='relative'>
                                    <FaUser className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500' />
                                    <input
                                        type='text'
                                        name='name'
                                        value={name}
                                        placeholder='Full Name'
                                        className='w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:border-primary outline-none transition-all'
                                        onChange={onChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <label className='text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1'>Email Index</label>
                                <div className='relative'>
                                    <FaEnvelope className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500' />
                                    <input
                                        type='email'
                                        name='email'
                                        value={email}
                                        placeholder='Email Address'
                                        className='w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:border-primary outline-none transition-all'
                                        onChange={onChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div className='space-y-2'>
                                <label className='text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1'>Password</label>
                                <div className='relative'>
                                    <FaLock className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500' />
                                    <input
                                        type='password'
                                        name='password'
                                        value={password}
                                        placeholder='••••••••'
                                        className='w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:border-primary outline-none transition-all'
                                        onChange={onChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <label className='text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1'>Confirm</label>
                                <div className='relative'>
                                    <FaCheckCircle className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500' />
                                    <input
                                        type='password'
                                        name='confirmPassword'
                                        value={confirmPassword}
                                        placeholder='••••••••'
                                        className='w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:border-primary outline-none transition-all'
                                        onChange={onChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='pt-4'>
                            <button type='submit' className='btn-primary w-full flex items-center justify-center gap-2 py-5 shadow-[0_0_40px_rgba(0,243,255,0.15)]'>
                                <FaUserPlus /> Initialize Profile
                            </button>
                        </div>
                    </form>

                    <div className='mt-10 text-center border-t border-white/5 pt-8'>
                        <p className='text-slate-500 text-[10px] font-bold uppercase tracking-tighter'>
                            Already have clearance? <Link to='/login' className='text-primary hover:underline ml-1'>Login here</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default Register
