import React from 'react';
import SEO from '../../components/common/SEO';

export default function SettingsPage() {
  return (
    <>
      <SEO
        title="Settings"
        description="Configure application settings and parameters."
        url="/settings"
        noIndex={true}
      />
      <div className="min-h-screen bg-[#0a0a0a] p-6">
        <div className="mb-8">
          <p className="font-label text-[10px] tracking-[0.25em] text-red-500 uppercase mb-2">
            APP PREFERENCES
          </p>
          <h1 className="font-hero text-[42px] text-white tracking-[-0.03em] leading-none">
            Settings
          </h1>
          <p className="font-body text-[13px] text-red-300/40 mt-2">
            Manage application preferences and appearance
          </p>
        </div>

        <div className="themed-card rounded-2xl p-6 max-w-3xl flex flex-col items-center justify-center text-center py-12">
          <div className="w-16 h-16 rounded-full bg-red-950/30 flex items-center justify-center border border-red-900/40 mb-4">
            <span className="text-2xl">🎨</span>
          </div>
          <h2 className="font-hero text-xl text-white mb-2">Crimson Dark Theme</h2>
          <p className="font-body text-[13px] text-red-300/60 max-w-md">
            OrderPulse is designed and optimized with a premium dark crimson aesthetic to reduce eye strain and provide an immersive seller central interface. Theme toggle is currently disabled.
          </p>
        </div>
      </div>
    </>
  );
}
