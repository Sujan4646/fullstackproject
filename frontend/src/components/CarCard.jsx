import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaGasPump, FaCogs, FaArrowRight, FaMapMarkerAlt } from 'react-icons/fa'
import { getCarImage } from '../utils/imagePath'

export default function CarCard({ car }) {
    return (
        <motion.div
            whileHover={{ y: -10 }}
            className='glass-card flex flex-col p-0 overflow-hidden group border-white/5'
        >
            <div className='relative h-48 overflow-hidden'>
                <img
                    src={getCarImage(car.images?.[0])}
                    alt={car.name}
                    className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                />
                <div className='absolute top-4 left-4 px-3 py-1 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-primary text-[10px] font-black uppercase tracking-widest'>
                    {car.brand}
                </div>
            </div>

            <div className='p-6 flex flex-col flex-grow'>
                <h3 className='text-xl font-bold text-white mb-2'>{car.name}</h3>

                <div className='flex items-center gap-4 text-slate-400 text-xs mb-6 flex-wrap'>
                    <div className='flex items-center gap-1.5'>
                        <FaGasPump className='text-primary/60' />
                        <span>{car.fuelType}</span>
                    </div>
                    <div className='flex items-center gap-1.5'>
                        <FaCogs className='text-primary/60' />
                        <span>{car.transmission}</span>
                    </div>
                    {car.location && (
                        <div className='flex items-center gap-1.5'>
                            <FaMapMarkerAlt className='text-primary/60' />
                            <span>{car.location}</span>
                        </div>
                    )}
                </div>

                <div className='mt-auto flex justify-between items-center pt-4 border-t border-white/5'>
                    <div>
                        <span className='text-2xl font-black text-primary'>₹{car.pricePerDay}</span>
                        <span className='text-[10px] text-slate-500 font-bold uppercase ml-1 tracking-tighter'>/ day</span>
                    </div>
                    <Link
                        to={`/cars/${car._id}`}
                        className='w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary border border-white/10 hover:bg-primary hover:text-black transition-all group/btn'
                    >
                        <FaArrowRight className='group-hover/btn:translate-x-1 transition-transform' />
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}
