import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PitchInput from '../components/PitchInput';
import LoadingScreen from '../components/LoadingScreen';
import ResultsDashboard from '../components/ResultsDashboard';
import { analyzePitch } from '../services/api';

const Home = () => {
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [analysisData, setAnalysisData] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");

    const handleAnalyze = async (pitchText) => {
        setStatus('loading');
        setErrorMsg("");
        
        try {
            const data = await analyzePitch(pitchText);
            // Flatten the nested structure from backend: { analysis: {...}, original_pitch: ... }
            // to match ResultsDashboard expectations
            setAnalysisData({
                ...data.analysis,
                original_pitch: data.original_pitch
            });
            setStatus('success');
        } catch (error) {
            console.error("Analysis Failed", error);
            setStatus('error');
            setErrorMsg("Our scribes faced an interruption. Please try again.");
        }
    };

    const resetAnalysis = () => {
        setStatus('idle');
        setAnalysisData(null);
    };

    return (
        <div className="min-h-screen px-4 py-8 md:py-16 relative z-10">
            {/* Header */}
            <motion.header 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16 space-y-4"
            >
                <h1 className="text-5xl md:text-7xl font-heading text-transparent bg-clip-text bg-gradient-to-r from-accent via-parchment to-accent drop-shadow-sm">
                    VākyaAI
                </h1>
                <p className="text-xl text-parchment/60 font-light max-w-2xl mx-auto">
                    Refine Your Words. Command Your Vision.
                </p>
                <div className="h-1 w-24 bg-accent/30 mx-auto rounded-full mt-6" />
            </motion.header>

            {/* Content Switcher */}
            <main>
                {status === 'idle' && (
                    <PitchInput onSubmit={handleAnalyze} isLoading={false} />
                )}

                {status === 'loading' && (
                    <LoadingScreen />
                )}

                {status === 'success' && (
                    <div className="space-y-8">
                        <button 
                            onClick={resetAnalysis}
                            className="block mx-auto text-sm text-accent/60 hover:text-accent underline transition-colors"
                        >
                            &larr; Analyze Another Pitch
                        </button>
                        <ResultsDashboard analysis={analysisData} />
                    </div>
                )}

                {status === 'error' && (
                    <div className="text-center space-y-6">
                         <div className="text-red-400 font-heading text-xl">
                            {errorMsg}
                         </div>
                         <button 
                            onClick={() => setStatus('idle')}
                            className="bg-primary-light border border-accent/20 px-6 py-2 rounded-full text-parchment hover:bg-primary-light/80"
                        >
                            Try Again
                         </button>
                    </div>
                )}
            </main>

            {/* Simple Footer */}
            <footer className="text-center text-parchment/20 text-sm mt-32 font-mono">
                Running in AGENT_MODE_EXECUTION • VākyaAI System v1.0
            </footer>
        </div>
    );
};

export default Home;
