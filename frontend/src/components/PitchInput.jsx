import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Feather, Send, Mic, MicOff, BookOpen } from 'lucide-react';

const PitchInput = ({ onSubmit, isLoading }) => {
    const [text, setText] = useState("");
    const [audience, setAudience] = useState("General Investor");
    const [isListening, setIsListening] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false);
    const MAX_LENGTH = 5000; 

    const audiences = [
        "Investor", "Technical Jury", "Professor", "Startup Accelerator", "Non-Technical Audience"
    ];

    const templates = [
        { id: 'hackathon', name: 'Hackathon', text: "Problem: [X] is hard. Our solution: [Y] using [Tech]. We are the best because [Z]. Our goal today is [Result]." },
        { id: 'seed', name: 'Seed Funding', text: "Targeting the $[X] market. We solve [Problem] with [Solution]. Current traction: [Metric]. Seeking $[Amount] for [Usage]." },
        { id: 'demoday', name: 'Demo Day', text: "[Hook Sentence]. [Product Name] helps [User] do [Task] without [Pain]. Look at this: [Key Feature]. Join us at [Goal]." },
        { id: 'viva', name: 'Academic Viva', text: "Research Objective: [Quest]. Methodology: [Approach]. Key Findings: [Discovery]. This contributes to [Field] by [Impact]." }
    ];

    // Speech Recognition
    const startSpeech = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Voice archives not supported in this vessel (browser).");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join("");
            setText(prev => prev + " " + transcript);
        };

        if (isListening) {
            recognition.stop();
        } else {
            recognition.start();
        }
    };

    const applyTemplate = (templateText) => {
        setText(templateText);
        setShowTemplates(false);
    };

    const handleSubmit = () => {
        if (!text.trim() || isLoading) return;
        onSubmit(text, audience);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl mx-auto space-y-8"
        >
            {/* Audience Selector */}
            <div className="flex flex-wrap justify-center gap-3">
                {audiences.map((aud) => (
                    <button
                        key={aud}
                        onClick={() => setAudience(aud)}
                        className={`
                            px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] transition-all border
                            ${audience === aud 
                                ? 'bg-accent text-primary border-accent shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                                : 'bg-white/5 text-parchment/40 border-white/10 hover:border-accent/30'}
                        `}
                    >
                        {aud}
                    </button>
                ))}
            </div>

            {/* Template & Voice Actions */}
            <div className="flex justify-center gap-4">
                <button
                    onClick={() => setShowTemplates(!showTemplates)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-wider text-parchment/60 hover:border-accent/40 transition-all"
                >
                    <BookOpen size={14} /> Template Library
                </button>
                <button
                    onClick={startSpeech}
                    className={`
                        flex items-center gap-2 px-4 py-2 border rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all
                        ${isListening 
                            ? 'bg-red-400/20 border-red-400 text-red-400 animate-pulse' 
                            : 'bg-white/5 border-white/10 text-parchment/60 hover:border-accent/40'}
                    `}
                >
                    {isListening ? <MicOff size={14} /> : <Mic size={14} />} 
                    {isListening ? "Listening..." : "Voice Command"}
                </button>
            </div>

            <AnimatePresence>
                {showTemplates && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-4 overflow-hidden"
                    >
                        {templates.map(tmp => (
                            <button
                                key={tmp.id}
                                onClick={() => applyTemplate(tmp.text)}
                                className="p-4 bg-white/5 border border-white/10 rounded-2xl text-left hover:border-accent/30 transition-all group"
                            >
                                <div className="text-[10px] font-bold text-accent mb-2 uppercase tracking-widest">{tmp.name}</div>
                                <p className="text-[10px] text-parchment/40 line-clamp-2 italic">"{tmp.text}"</p>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative manuscript-container group border-accent/10 hover:border-accent/30 transition-all duration-700">
                <div className="absolute top-6 right-8 text-accent/10 pointer-events-none group-focus-within:text-accent/20 transition-colors">
                    <Feather size={64} className="rotate-45" />
                </div>
                
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Whisper your idea to the archives... What problem are you solving? What is your magic?"
                    className="w-full h-80 bg-transparent border-none outline-none text-parchment text-xl resize-none placeholder-parchment/20 font-body leading-relaxed z-10 relative scrollbar-hide select-none md:select-text"
                    maxLength={MAX_LENGTH}
                    spellCheck="false"
                />
                
                <div className="absolute bottom-6 right-8 text-xs text-accent/30 font-bold tracking-widest uppercase">
                    {text.length} / {MAX_LENGTH} SYMBOLS
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
