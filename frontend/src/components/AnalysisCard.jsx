import React from 'react';
import { motion } from 'framer-motion';

const AnalysisCard = ({ title, items, icon: Icon, colorClass, delay = 0 }) => {
    if (!items || items.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay }}
            className={`p-6 rounded-lg bg-primary-light/50 border border-${colorClass}/30 backdrop-blur-sm`}
        >
            <div className={`flex items-center gap-3 mb-4 text-${colorClass}`}>
                {Icon && <Icon size={24} />}
                <h3 className="font-heading text-lg font-bold tracking-wide">{title}</h3>
            </div>
            <ul className="space-y-3">
                {items.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-parchment/90 font-light">
                        <span className={`mt-1.5 w-1.5 h-1.5 rounded-full bg-${colorClass} flex-shrink-0`} />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </motion.div>
    );
};

export default AnalysisCard;
