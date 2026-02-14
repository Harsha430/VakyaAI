import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScoreChart from './ScoreChart';
import AnalysisCard from './AnalysisCard';
import ChecklistSection from './ChecklistSection';
import PresentationSection from './PresentationSection';
import GrowthSection from './GrowthSection';
import SummariesSection from './SummariesSection';
import { 
    CheckCircle, AlertTriangle, Lightbulb, FileText, Star, 
    TrendingUp, Sparkles, Layout, BarChart3, Rocket
} from 'lucide-react';

const ResultsDashboard = ({ analysis }) => {
    const [activeTab, setActiveTab] = useState('insights');

    if (!analysis) return null;

    const { 
        scores, overall_score, strengths, weaknesses, suggestions, 
        improved_pitch, original_pitch, improvement_metrics,
        checklist, slides, summaries, confidence_score,
        filler_words, suggested_resources, practice_questions,
        personalized_roadmap
    } = analysis;

    const tabs = [
        { id: 'insights', label: 'Artifact Insights', icon: BarChart3 },
        { id: 'refinement', label: 'Command Refinement', icon: Sparkles },
        { id: 'deck', label: 'Deck Architect', icon: Layout },
        { id: 'growth', label: 'Growth Lab', icon: Rocket },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-32">
            
            {/* Header Score & Improvement Delta */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
            >
                <div className="space-y-2">
                    <h2 className="text-4xl font-heading text-parchment tracking-tight">Manuscript Deciphered</h2>
                    <p className="text-parchment/40 text-sm font-medium">The AI has analyzed your command with deep scrutiny.</p>
                </div>
                
                <div className="flex flex-wrap justify-center items-center gap-6">
                    {/* Main Score */}
                    <div className="inline-flex items-center gap-5 bg-white/5 backdrop-blur-md px-8 py-4 rounded-2xl border border-accent/20 shadow-[0_0_40px_rgba(234,179,8,0.08)]">
                        <div className="p-2.5 bg-accent/10 rounded-xl">
                            <Star className="text-accent fill-accent/10" size={24} />
                        </div>
                        <div className="text-left">
                            <p className="text-accent/60 text-[9px] font-bold uppercase tracking-[0.2em]">Overall Scrutiny</p>
                            <span className="text-3xl font-heading text-parchment">
                                {overall_score} <span className="text-lg text-parchment/20">/ 10</span>
                            </span>
                        </div>
                    </div>

                    {/* Improvement Metric (Agentic Feature) */}
                    {improvement_metrics && (
                        <div className="inline-flex items-center gap-5 bg-green-400/5 backdrop-blur-md px-8 py-4 rounded-2xl border border-green-400/20">
                            <div className="p-2.5 bg-green-400/10 rounded-xl">
                                <TrendingUp className="text-green-400" size={24} />
                            </div>
                            <div className="text-left">
                                <p className="text-green-400/60 text-[9px] font-bold uppercase tracking-[0.2em]">AI Optimization</p>
                                <span className="text-2xl font-heading text-green-400">
                                    +{improvement_metrics.overall_delta}% <span className="text-xs text-green-400/40 font-body uppercase">Elevated</span>
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Navigation Tabs */}
            <div className="flex justify-center border-b border-white/5 pb-px mb-8">
                <div className="flex gap-8 relative">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex items-center gap-2 pb-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative
                                ${activeTab === tab.id ? 'text-accent' : 'text-parchment/20 hover:text-parchment/40'}
                            `}
                        >
                            <tab.icon size={14} />
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div 
                                    layoutId="tab-underline"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent shadow-[0_0_10px_rgba(245,158,11,0.5)]" 
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === 'insights' && (
                            <div className="space-y-12">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                    <div className="manuscript-container">
                                        <div className="flex items-center justify-between mb-8 border-b border-accent/10 pb-4">
                                            <h3 className="text-2xl font-heading text-accent tracking-tight">Performance Radar</h3>
                                            <div className="text-[10px] font-bold text-accent/40 uppercase tracking-widest bg-accent/5 px-2 py-1 rounded">Visual Matrix</div>
                                        </div>
                                        <ScoreChart scores={scores} />
                                    </div>
                                    <div className="space-y-6">
                                        <AnalysisCard title="Core Strengths" items={strengths} icon={CheckCircle} colorClass="green-400" delay={0.1} />
                                        <AnalysisCard title="Critical Gaps" items={weaknesses} icon={AlertTriangle} colorClass="red-400" delay={0.2} />
                                    </div>
                                </div>
                                <ChecklistSection items={checklist} />
                            </div>
                        )}

                        {activeTab === 'refinement' && (
                            <div className="space-y-12">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                    <div className="manuscript-container bg-white/5 border-white/5 opacity-60 hover:opacity-100 transition-opacity">
                                        <div className="flex items-center gap-3 mb-4 text-parchment/50">
                                            <FileText size={18} />
                                            <h3 className="font-heading text-[10px] tracking-[0.15em] uppercase">Original Scroll</h3>
                                        </div>
                                        <p className="whitespace-pre-wrap font-body text-sm leading-relaxed italic text-parchment/60">"{original_pitch}"</p>
                                    </div>
                                    <div className="manuscript-container border-accent/30 bg-accent/5 relative shadow-[0_0_40px_rgba(234,179,8,0.05)]">
                                        <div className="absolute top-0 right-0 px-3 py-1.5 bg-accent/10 text-accent text-[9px] font-bold uppercase tracking-[0.2em] rounded-bl-xl border-l border-b border-accent/10">AI Optimized</div>
                                        <div className="flex items-center gap-3 mb-4 text-accent">
                                            <Star size={18} />
                                            <h3 className="font-heading text-base tracking-tight">Refined Command</h3>
                                        </div>
                                        <p className="whitespace-pre-wrap font-body text-base leading-relaxed text-parchment/90 drop-shadow-sm">{improved_pitch}</p>
                                    </div>
                                </div>
                                <SummariesSection summaries={summaries} />
                            </div>
                        )}

                        {activeTab === 'deck' && (
                            <PresentationSection slides={slides} />
                        )}

                        {activeTab === 'growth' && (
                            <GrowthSection 
                                confidence={confidence_score}
                                fillerWords={filler_words}
                                questions={practice_questions}
                                resources={suggested_resources}
                                roadmap={personalized_roadmap}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ResultsDashboard;
