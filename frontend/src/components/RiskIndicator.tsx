'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';

interface RiskIndicatorProps {
  riskLevel: string;
  score?: number;
}

const getRiskConfig = (level: string) => {
  switch (level.toLowerCase()) {
    case 'critical': return { color: '#ef4444', value: 100, label: 'CRITICAL' };
    case 'high': return { color: '#f97316', value: 75, label: 'HIGH' };
    case 'moderate': return { color: '#eab308', value: 50, label: 'MODERATE' };
    case 'low': return { color: '#22c55e', value: 25, label: 'LOW' };
    default: return { color: '#3b82f6', value: 0, label: 'SCANNING' };
  }
};

export default function RiskIndicator({ riskLevel, score }: RiskIndicatorProps) {
  const config = getRiskConfig(riskLevel);
  const data = [
    { name: 'Risk', value: score || config.value },
    { name: 'Remaining', value: 100 - (score || config.value) },
  ];

  return (
    <div className="relative w-full h-[250px] flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            startAngle={180}
            endAngle={0}
            paddingAngle={0}
            dataKey="value"
          >
            <Cell fill={config.color} />
            <Cell fill="rgba(255, 255, 255, 0.05)" />
            <Label 
               value={config.label} 
               position="centerBottom" 
               className="fill-white text-xl font-bold" 
            />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-[60%] text-center">
        <p className="text-sm text-gray-400">Confidence Score</p>
        <p className="text-3xl font-black text-white">{score || config.value}%</p>
      </div>
    </div>
  );
}
