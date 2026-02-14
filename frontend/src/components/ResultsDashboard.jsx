import React from 'react';
import { motion } from 'framer-motion';
import ScoreChart from './ScoreChart';
import AnalysisCard from './AnalysisCard';
import { CheckCircle, AlertTriangle, Lightbulb, FileText, Star } from 'lucide-react';

const ResultsDashboard = ({ analysis }) => {
    if (!analysis) return null;

    const { scores, overall_score, strengths, weaknesses, suggestions, improved_pitch, original_pitch } = analysis;

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20">
            
            {/* Header Score */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4"
            >
                <h2 className="text-4xl font-heading text-parchment">Analysis Complete</h2>
                <div className="inline-flex items-center gap-4 bg-primary-light px-8 py-3 rounded-full border border-accent/50 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                    <Star className="text-accent fill-accent" size={32} />
                    <span className="text-3xl font-bold text-parchment">
                        {overall_score} <span className="text-lg text-parchment/50">/ 10</span>
                    </span>
                </div>
            </motion.div>

            {/* Split View: Charts & Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Left: Score Visualization */}
                <motion.div 
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="manuscript-container"
                >
                    <h3 className="text-2xl font-heading text-accent mb-6 border-b border-accent/20 pb-2">
                        Performance Radar
                    </h3>
                    <ScoreChart scores={scores} />
                </motion.div>

                {/* Right: Key Insights */}
                <div className="space-y-6">
                    <AnalysisCard 
                        title="Core Strengths" 
                        items={strengths} 
                        icon={CheckCircle} 
                        colorClass="text-green-400" 
                        delay={0.3}
                    />
                    <AnalysisCard 
                        title="Critical Weaknesses" 
                        items={weaknesses} 
                        icon={AlertTriangle} 
                        colorClass="text-red-400" 
                        delay={0.4}
                    />
                    <AnalysisCard 
                        title="Strategic Suggestions" 
                        items={suggestions} 
                        icon={Lightbulb} 
                        colorClass="text-blue-400" 
                        delay={0.5}
                    />
                </div>
            </div>

            {/* Improved Pitch Section */}
            <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
                {/* Original */}
                <div className="manuscript-container opacity-70">
                   <div className="flex items-center gap-3 mb-4 text-parchment/60">
                        <FileText size={24} />
                        <h3 className="font-heading text-xl">Original Draft</h3>
                    </div>
                    <p className="whitespace-pre-wrap font-body text-sm leading-relaxed">
                        {original_pitch}
                    </p>
                </div>

                {/* Improved */}
                <div className="manuscript-container border-ai-glow/40 shadow-[0_0_40px_rgba(45,212,191,0.1)] relative">
                    <div className="absolute top-0 right-0 p-2 bg-ai-glow/10 text-ai-glow text-xs font-bold uppercase tracking-wider rounded-bl-lg">
                        AI Optimized
                    </div>
                    <div className="flex items-center gap-3 mb-4 text-ai-glow">
                        <Sparkles size={24} />
                        <h3 className="font-heading text-xl">Refined Pitch</h3>
                    </div>
                    <p className="whitespace-pre-wrap font-body text-base leading-relaxed text-parchment">
                        {improved_pitch}
                    </p>
                </div>
            </motion.div>

        </div>
    );
};

// Simple Sparkles icon stand-in if lucide is missing specific icon, but lucide has Sparkles
import { Sparkles } from 'lucide-react';

export default ResultsDashboard;
