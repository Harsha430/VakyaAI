import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Feather, Send } from 'lucide-react';

const PitchInput = ({ onSubmit, isLoading }) => {
    const [text, setText] = useState("");
    const MAX_LENGTH = 5000; // Characters

    const handleSubmit = () => {
        if (!text.trim() || isLoading) return;
        onSubmit(text);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl mx-auto space-y-6"
        >
            <div className="relative manuscript-container group">
                <div className="absolute top-4 right-4 text-accent/40 pointer-events-none">
                    <Feather size={48} className="rotate-45" />
                </div>
                
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter your startup pitch here... (What is the problem? What is your solution?)"
                    className="w-full h-80 bg-transparent border-none outline-none text-parchment text-lg resize-none placeholder-parchment/30 font-body leading-relaxed z-10 relative"
                    maxLength={MAX_LENGTH}
                    spellCheck="false"
                />
                
                <div className="absolute bottom-4 right-6 text-sm text-accent/60 font-mono">
                    {text.length} / {MAX_LENGTH}
                </div>
            </div>

            <div className="flex justify-center">
                <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(245, 158, 11, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit}
                    disabled={isLoading || text.length === 0}
                    className={`
                        px-12 py-4 rounded-full font-heading text-xl tracking-widest uppercase transition-all
                        flex items-center gap-3
                        ${isLoading || text.length === 0 
                            ? 'bg-primary-light text-parchment/20 cursor-not-allowed border border-parchment/10' 
                            : 'bg-accent text-primary font-bold shadow-lg border border-accent-glow'}
                    `}
                >
                    {isLoading ? 'Analyzing...' : <>Analyze Pitch <Send size={20} /></>}
                </motion.button>
            </div>
        </motion.div>
    );
};

export default PitchInput;
