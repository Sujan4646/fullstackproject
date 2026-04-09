import { motion } from 'framer-motion'

export default function Spinner() {
    return (
        <div className='flex flex-col items-center justify-center min-h-[200px] gap-6'>
            <div className='relative w-16 h-16'>
                {/* Outer Ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className='absolute inset-0 border-2 border-primary/20 border-t-primary rounded-full'
                />

                {/* Inner Glow */}
                <motion.div
                    animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className='absolute inset-0 bg-primary/20 rounded-full blur-md'
                />

                {/* Center Core */}
                <div className='absolute inset-4 glass rounded-full flex items-center justify-center border-primary/40'>
                    <div className='w-1 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(0,243,255,1)]' />
                </div>
            </div>
            <div className='flex flex-col items-center'>
                <p className='text-[10px] font-black uppercase tracking-[0.3em] text-primary animate-pulse'>System Syncing</p>
                <div className='flex gap-1 mt-2'>
                    {[0, 1, 2].map(i => (
                        <motion.div
                            key={i}
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                            className='w-1 h-1 rounded-full bg-primary/40'
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

