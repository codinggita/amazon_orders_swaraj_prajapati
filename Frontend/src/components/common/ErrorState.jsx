import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from './Button';

export default function ErrorState({ error, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4 bg-red-950/10 rounded-xl border border-red-900/20">
      <AlertTriangle className="w-12 h-12 text-red-500/60 mb-4" />
      <h3 className="text-lg font-semibold text-red-400">Something went wrong</h3>
      <p className="text-sm text-red-400/60 mt-2 max-w-md">{typeof error === 'string' ? error : error?.message || 'An unexpected error occurred'}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="mt-6">
          Try Again
        </Button>
      )}
    </div>
  );
}
