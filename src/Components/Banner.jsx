import React from 'react'
import { motion } from 'framer-motion'
import bannerImage from '../assets/banner.jpg'

const Banner = () => {
    return (
        <section className="w-full min-h-[70vh] relative flex items-center justify-center overflow-hidden">
            {/* Banner Image */}
            <img
                src={bannerImage}
                alt="Banner"
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Light Overlay (only a slight dark tint) */}
            <div className="absolute inset-0 bg-black/30"></div>

            {/* Content */}
            <motion.div
                className="relative z-10 text-center px-4 max-w-2xl w-full"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <motion.h1
                    className="text-4xl md:text-5xl font-bold text-white mb-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    Discuss. Learn. Grow Together.
                </motion.h1>

                <motion.p
                    className="text-lg text-white/90 mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    Join a friendly community of learners and creators sharing knowledge daily.
                </motion.p>

                <motion.div
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                >
                    <input
                        type="text"
                        placeholder="Search topics..."
                        className="w-full sm:w-2/3 px-5 py-3 rounded-full text-black outline-none shadow-lg border border-gray-200 bg-white placeholder-gray-500"
                    />
                    <button className="bg-black text-white px-6 py-3 rounded-full cursor-pointer hover:bg-white hover:text-black transition-colors duration-300 font-semibold shadow-md">
                        Search Now
                    </button>
                </motion.div>
            </motion.div>
        </section>
    )
}

export default Banner
