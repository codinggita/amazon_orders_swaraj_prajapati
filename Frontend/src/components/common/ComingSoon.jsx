import React from 'react';
import { Construction } from 'lucide-react';

export default function ComingSoon({ title = 'Coming Soon' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
      <div className="w-16 h-16 rounded-2xl glass-panel flex items-center justify-center mb-6">
        <Construction className="w-8 h-8 text-red-500/70" />
      </div>
      <h2 className="font-section text-2xl text-white tracking-[-0.025em] mb-2">{title}</h2>
      <p className="font-body text-red-300/40 max-w-sm">
        This module is under development and will be available in a future release.
      </p>
    </div>
  );
}
