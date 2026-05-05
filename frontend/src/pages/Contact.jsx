import { motion } from 'framer-motion'
import { FaPaperPlane, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'

export default function Contact() {
    return (
        <div className="min-h-screen py-24 px-6 md:px-12 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute blur-blob w-96 h-96 bg-primary/10 top-20 -left-20" />
            <div className="absolute blur-blob w-96 h-96 bg-secondary/10 bottom-40 -right-20" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="inline-block px-4 py-1.5 rounded-full glass border-primary/20 text-primary text-xs font-bold tracking-[0.2em] uppercase mb-4"
                    >
                        Get In Touch
                    </motion.span>
                    <h1 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter">
                        Contact <span className="text-primary">Concierge</span>
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Have questions about our exclusive fleet? Our concierge team is available 24/7 to assist you.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Contact Info Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="glass-card p-8 flex items-start gap-6 group"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                                <FaPhoneAlt size={20} />
                            </div>
                            <div>
                                <h3 className="text-white font-bold mb-1 uppercase tracking-widest text-sm">Direct Line</h3>
                                <p className="text-slate-400 text-sm">+1 (800) LUX-RIDE</p>
                                <p className="text-slate-500 text-xs mt-1">Available 24/7</p>
                            </div>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5 }}
                            className="glass-card p-8 flex items-start gap-6 group"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                                <FaEnvelope size={20} />
                            </div>
                            <div>
                                <h3 className="text-white font-bold mb-1 uppercase tracking-widest text-sm">Email Access</h3>
                                <p className="text-slate-400 text-sm">concierge@carbooker.com</p>
                                <p className="text-slate-500 text-xs mt-1">Response within 1 hour</p>
                            </div>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5 }}
                            className="glass-card p-8 flex items-start gap-6 group"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                                <FaMapMarkerAlt size={20} />
                            </div>
                            <div>
                                <h3 className="text-white font-bold mb-1 uppercase tracking-widest text-sm">Headquarters</h3>
                                <p className="text-slate-400 text-sm">100 Luxury Avenue<br />Silicon Valley, CA 94025</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-8">
                        <div className="glass-card p-10 md:p-12">
                            <h3 className="text-xl font-bold mb-8 text-white uppercase tracking-widest border-b border-white/5 pb-4">
                                Send a Secure Transmission
                            </h3>
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
                                        <input 
                                            type="text" 
                                            placeholder="John Doe"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-primary outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                                        <input 
                                            type="email" 
                                            placeholder="john@example.com"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-primary outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Subject</label>
                                    <input 
                                        type="text" 
                                        placeholder="How can we help?"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-primary outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Message</label>
                                    <textarea 
                                        placeholder="Provide details about your inquiry..."
                                        rows="6"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-primary outline-none transition-all resize-none"
                                    ></textarea>
                                </div>
                                <button type="button" className="btn-primary w-full md:w-auto px-12 py-4 flex items-center justify-center gap-3">
                                    <FaPaperPlane /> Dispatch Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}