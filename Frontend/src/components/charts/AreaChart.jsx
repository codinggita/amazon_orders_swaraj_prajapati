import React from 'react';
import { ResponsiveContainer, AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function AreaChart({ data, dataKey, xKey = 'name', title, color = '#dc2626', height = 300 }) {
  return (
    <div className="w-full">
      {title && <h4 className="text-sm font-semibold text-white mb-4">{title}</h4>}
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsAreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`color-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d1515" vertical={false} />
            <XAxis dataKey={xKey} stroke="#dc262680" tick={{ fill: '#dc262680', fontSize: 12 }} axisLine={{ stroke: '#2d1515' }} tickLine={false} />
            <YAxis stroke="#dc262680" tick={{ fill: '#dc262680', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1c1112', borderColor: '#4b2020', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fillOpacity={1} fill={`url(#color-${dataKey})`} />
          </RechartsAreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
