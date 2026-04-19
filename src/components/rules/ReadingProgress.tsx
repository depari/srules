'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export default function ReadingProgress() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            className="fixed top-0 left-0 right-0 h-[3px] bg-white/5 z-50 pointer-events-none origin-left"
        >
            <motion.div
                className="h-full bg-gradient-to-r from-violet-500 via-cyan-500 to-violet-500"
                style={{ scaleX }}
            />
            {/* Glow effect */}
            <motion.div 
                className="absolute top-0 right-0 h-full w-[20px] bg-violet-400 blur-[8px] opacity-50"
                style={{ 
                    left: `${scaleX.get() * 100}%`,
                    display: isVisible ? 'block' : 'none'
                }}
            />
        </motion.div>
    );
}
