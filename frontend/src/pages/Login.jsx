import { useState, useContext, useEffect } from 'react'
import { FaSignInAlt, FaEnvelope, FaLock, FaUserShield } from 'react-icons/fa'
import AuthContext from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const { email, password } = formData

    const navigate = useNavigate()
    const { login, user, loading } = useContext(AuthContext)

    useEffect(() => {
        if (user) {
            navigate('/dashboard')
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
        try {
            await login(email, password)
            toast.success('System access granted. Welcome.')
            navigate('/dashboard')
        } catch (error) {
            toast.error(error || 'Invalid credentials. Access denied.')
        }
    }

    if (loading) {
        return (
            <div className='flex flex-col items-center justify-center min-h-[60vh]'>
                <div className='spinner' />
                <p className='text-primary font-bold animate-pulse mt-4'>Authenticating Terminal...</p>
            </div>
        )
    }

    return (
        <div className='min-h-[80vh] flex items-center justify-center px-6 py-12'>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className='glass-card max-w-md w-full p-10 relative overflow-hidden'
            >
                {/* Decorative Elements */}
                <div className='absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl' />
                <div className='absolute bottom-0 left-0 w-32 h-32 bg-secondary/5 rounded-full -ml-16 -mb-16 blur-2xl' />

                <div className='relative z-10'>
                    <div className='flex justify-center mb-8'>
                        <div className='w-16 h-16 rounded-2xl glass flex items-center justify-center text-primary text-2xl border-primary/20 shadow-[0_0_30px_rgba(0,243,255,0.2)]'>
                            <FaUserShield />
                        </div>
                    </div>

                    <div className='text-center mb-10'>
                        <h1 className='text-3xl font-black uppercase tracking-tighter mb-2'>Portal <span className='text-primary'>Access</span></h1>
                        <p className='text-slate-500 text-[10px] font-bold uppercase tracking-widest'>Initialize your secure session</p>
                    </div>

                    <form onSubmit={onSubmit} className='space-y-6'>
                        <div className='space-y-2'>
                            <label className='text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1'>Email Index</label>
                            <div className='relative'>
                                <FaEnvelope className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500' />
                                <input
                                    type='email'
                                    id='email'
                                    name='email'
                                    value={email}
                                    placeholder='Enter identifier'
                                    className='w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:border-primary outline-none transition-all'
                                    onChange={onChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className='space-y-2'>
                            <label className='text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1'>Secret Phase</label>
                            <div className='relative'>
                                <FaLock className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500' />
                                <input
                                    type='password'
                                    id='password'
                                    name='password'
                                    value={password}
                                    placeholder='Enter credentials'
                                    className='w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:border-primary outline-none transition-all'
                                    onChange={onChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className='pt-4'>
                            <button type='submit' className='btn-primary w-full flex items-center justify-center gap-2 py-5 shadow-[0_0_40px_rgba(0,243,255,0.15)]'>
                                <FaSignInAlt /> Authenticate
                            </button>
                        </div>
                    </form>

                    <div className='mt-10 text-center border-t border-white/5 pt-8'>
                        <p className='text-slate-500 text-[10px] font-bold uppercase tracking-tighter'>
                            No clearance level? <Link to='/register' className='text-primary hover:underline ml-1'>Apply for access</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default Login
