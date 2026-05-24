import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export default function DonutChart({ data, colors, title, height = 300, centerText, centerSubtext }) {
  const defaultColors = ['#dc2626', '#ea580c', '#d97706', '#ca8a04', '#65a30d', '#16a34a', '#0891b2', '#2563eb', '#4f46e5', '#9333ea'];
  const pieColors = colors || defaultColors;

  return (
    <div className="w-full flex flex-col items-center relative">
      {title && <h4 className="text-sm font-semibold text-white mb-2 self-start">{title}</h4>}
      
      {centerText && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-4">
          <span className="text-2xl font-bold text-white">{centerText}</span>
          {centerSubtext && <span className="text-xs text-red-300/60">{centerSubtext}</span>}
        </div>
      )}

      <div style={{ height, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="80%"
              fill="#8884d8"
              dataKey="value"
              stroke="#0a0a0a"
              strokeWidth={3}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#1c1112', borderColor: '#4b2020', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', color: '#dc262680' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
