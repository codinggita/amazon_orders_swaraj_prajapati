import React from 'react';
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

export default function BarChart({ data, dataKey, xKey = 'name', title, color = '#dc2626', height = 300 }) {
  return (
    <div className="w-full">
      {title && <h4 className="text-sm font-semibold text-white mb-4">{title}</h4>}
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d1515" vertical={false} />
            <XAxis dataKey={xKey} stroke="#dc262680" tick={{ fill: '#dc262680', fontSize: 12 }} axisLine={{ stroke: '#2d1515' }} tickLine={false} />
            <YAxis stroke="#dc262680" tick={{ fill: '#dc262680', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip 
              cursor={{ fill: '#2d1515', opacity: 0.4 }}
              contentStyle={{ backgroundColor: '#1c1112', borderColor: '#4b2020', borderRadius: '8px', color: '#fff' }}
            />
            <Bar dataKey={dataKey} radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || color} />
              ))}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
