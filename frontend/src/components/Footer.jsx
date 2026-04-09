import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaShieldAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className='bg-bg-deep border-t border-white/5 pt-20 pb-10 px-6'>
            <div className='max-w-7xl mx-auto'>
                <div className='grid grid-cols-1 md:grid-cols-4 gap-12 mb-16'>
                    {/* Brand Section */}
                    <div className='col-span-1 md:col-span-1'>
                        <div className='flex items-center gap-3 mb-6'>
                            <div className='w-10 h-10 rounded-xl glass flex items-center justify-center text-primary text-xl border-primary/20'>
                                <FaShieldAlt />
                            </div>
                            <span className='text-xl font-black uppercase tracking-tighter text-white'>Car<span className='text-primary'>Booker</span></span>
                        </div>
                        <p className='text-slate-500 text-sm leading-relaxed mb-6 font-medium'>
                            Experience the pinnacle of luxury mobility. Our fleet of concept-grade vehicles awaits your command across the global network.
                        </p>
                        <div className='flex gap-4'>
                            {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
                                <a key={i} href='#' className='w-10 h-10 rounded-xl glass border-white/5 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/40 transition-all'>
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links - Fleet */}
                    <div>
                        <h4 className='text-xs font-black uppercase tracking-[0.2em] text-white mb-6'>The Fleet</h4>
                        <ul className='space-y-4'>
                            {['Hypercars', 'Luxury SUVs', 'Electric Core', 'Classic Legacy'].map(item => (
                                <li key={item}><Link to='/cars' className='text-slate-500 hover:text-primary text-sm font-bold transition-colors uppercase tracking-widest text-[10px]'>{item}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* Links - Ecosystem */}
                    <div>
                        <h4 className='text-xs font-black uppercase tracking-[0.2em] text-white mb-6'>Ecosystem</h4>
                        <ul className='space-y-4'>
                            {['Member Portal', 'Fleet Rewards', 'Affiliate Network', 'Security Protocol'].map(item => (
                                <li key={item}><Link to='/dashboard' className='text-slate-500 hover:text-primary text-sm font-bold transition-colors uppercase tracking-widest text-[10px]'>{item}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* Links - Legal */}
                    <div>
                        <h4 className='text-xs font-black uppercase tracking-[0.2em] text-white mb-6'>Governance</h4>
                        <ul className='space-y-4'>
                            {['Privacy Directive', 'Usage Terms', 'Neural Security', 'Ethical Standards'].map(item => (
                                <li key={item}><a href='#' className='text-slate-500 hover:text-primary text-sm font-bold transition-colors uppercase tracking-widest text-[10px]'>{item}</a></li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className='pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6'>
                    <p className='text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]'>
                        &copy; 2026 CarBooker Registry. All protocols secured.
                    </p>
                    <div className='flex items-center gap-8'>
                        <div className='flex items-center gap-2'>
                            <div className='w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' />
                            <span className='text-[10px] font-black uppercase tracking-widest text-slate-500'>Network Live</span>
                        </div>
                        <span className='text-[10px] font-black uppercase tracking-widest text-slate-500'>System Version 4.0.2</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
