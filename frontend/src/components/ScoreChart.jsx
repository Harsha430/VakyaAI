import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

const ScoreChart = ({ scores }) => {
    if (!scores) return null;

    // Transform scores object to array for Recharts
    // Expected keys: clarity, problem_definition, etc.
    const data = Object.keys(scores).map(key => ({
        subject: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        A: scores[key],
        fullMark: 10,
    }));

    return (
        <div className="w-full h-[400px] flex items-center justify-center p-4 bg-primary-light/30 rounded-lg border border-accent/10">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid stroke="#F5F5DC" strokeOpacity={0.2} />
                    <PolarAngleAxis 
                        dataKey="subject" 
                        tick={{ fill: '#F59E0B', fontSize: 12, fontWeight: 'bold' }} 
                    />
                    <PolarRadiusAxis 
                        angle={30} 
                        domain={[0, 10]} 
                        tick={false} 
                        axisLine={false}
                    />
                    <Radar
                        name="Pitch Score"
                        dataKey="A"
                        stroke="#2DD4BF"
                        strokeWidth={2}
                        fill="#2DD4BF"
                        fillOpacity={0.4}
                    />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1E293B', borderColor: '#F59E0B', color: '#F5F5DC' }}
                        itemStyle={{ color: '#2DD4BF' }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ScoreChart;
