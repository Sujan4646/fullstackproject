import { FaSignInAlt, FaSignOutAlt, FaUser, FaCar, FaShieldAlt, FaMapMarkerAlt, FaCogs } from 'react-icons/fa'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import { motion } from 'framer-motion'

export default function Header() {
    const navigate = useNavigate()
    const location = useLocation()
    const { user, logout } = useContext(AuthContext)

    const onLogout = () => {
        logout()
        navigate('/')
    }

    const navLinks = [
        { name: 'Fleet', path: '/cars', icon: FaCar },
        { name: 'Concierge', path: '/contact', icon: FaShieldAlt },
    ]

    return (
        <header className='nav-blur fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center border-b border-white/5'>
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='flex items-center gap-3 cursor-pointer group'
                onClick={() => navigate('/')}
            >
                <div className='w-10 h-10 rounded-xl glass border-primary/20 flex items-center justify-center text-primary group-hover:shadow-[0_0_20px_rgba(0,243,255,0.3)] transition-all'>
                    <FaShieldAlt />
                </div>
                <span className='text-2xl font-black uppercase tracking-tighter text-white'>
                    Car<span className='text-primary'>Booker</span>
                </span>
            </motion.div>

            <nav className='flex items-center gap-10'>
                <ul className='hidden lg:flex items-center gap-8'>
                    {navLinks.map((link) => (
                        <li key={link.path}>
                            <Link
                                to={link.path}
                                className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-primary ${location.pathname === link.path ? 'text-primary' : 'text-slate-500'}`}
                            >
                                <link.icon className='text-xs opacity-60' />
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className='flex items-center gap-2 glass p-1 rounded-2xl border-white/5'>
                    {user ? (
                        <>
                            <Link
                                to='/dashboard'
                                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${location.pathname === '/dashboard' ? 'bg-primary text-black shadow-[0_0_15px_rgba(0,243,255,0.3)]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                Profile
                            </Link>
                            {user.role === 'admin' && (
                                <Link
                                    to='/admin'
                                    className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${location.pathname === '/admin' ? 'bg-secondary text-white shadow-[0_0_15px_rgba(188,19,254,0.3)]' : 'text-secondary/60 hover:bg-white/5 hover:text-secondary'}`}
                                >
                                    Control
                                </Link>
                            )}
                            <button
                                onClick={onLogout}
                                className='w-10 h-10 rounded-xl flex items-center justify-center text-red-500/60 hover:text-red-500 hover:bg-red-500/10 transition-all'
                                title='Terminate Session'
                            >
                                <FaSignOutAlt size={16} />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to='/login'
                                className='px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all'
                            >
                                Sign In
                            </Link>
                            <Link
                                to='/register'
                                className='px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest bg-primary text-black hover:shadow-[0_0_25px_rgba(0,243,255,0.4)] transition-all'
                            >
                                Join
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    )
}
