import React from 'react';
import AppLogo from '../common/AppLogo';
import { BarChart3, Shield, Zap } from 'lucide-react';

const FEATURES = [
  { icon: BarChart3, title: 'Real-time Analytics', desc: 'Live revenue & order metrics' },
  { icon: Shield, title: 'Secure & Reliable', desc: 'Enterprise-grade data protection' },
  { icon: Zap, title: 'Lightning Fast', desc: 'Optimized for Amazon sellers' },
];

export default function AuthLayout({ children, headline, subline }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col lg:flex-row relative overflow-hidden">
      {/* Breathing crimson ambient lights */}
      <div className="breathing-crimson breathing-crimson-1 pointer-events-none" aria-hidden />
      <div className="breathing-crimson breathing-crimson-2 pointer-events-none" aria-hidden />

      <div className="auth-brand-panel hidden lg:flex lg:w-[48%] xl:w-[52%] flex-col justify-between p-12 xl:p-16 relative overflow-hidden z-[1]">
        <div className="relative z-10">
          <AppLogo size="lg" showTagline />
        </div>

        <div className="relative z-10 space-y-8 my-12">
          <div>
            <p className="font-label text-red-500/80 tracking-extreme text-[10px] mb-4">
              THE HEARTBEAT OF YOUR BUSINESS
            </p>
            <h1 className="font-hero text-3xl xl:text-[2.75rem] text-white leading-[1.15] tracking-display font-medium">
              {headline || (
                <>
                  Manage orders with
                  <br />
                  <span className="text-gradient-brand font-semibold">precision & clarity</span>
                </>
              )}
            </h1>
            <p className="font-body text-red-300/40 mt-4 max-w-md text-[14px]">
              {subline ||
                'OrderPulse gives Amazon sellers a premium command center for orders, analytics, and fulfillment.'}
            </p>
          </div>

          <ul className="space-y-4">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <li key={title} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-red-950/60 border border-red-900/40 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="font-subheading text-sm text-white">{title}</p>
                  <p className="font-body-sm text-red-300/40 mt-0.5">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="font-body-xs text-red-800/60 relative z-10">
          © {new Date().getFullYear()} OrderPulse. All rights reserved.
        </p>
      </div>

      <div className="auth-form-panel flex-1 flex flex-col min-h-screen relative z-[1]">
        <div className="lg:hidden p-6 flex justify-center border-b border-[#2d1515]">
          <AppLogo size="md" showTagline />
        </div>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md animate-slide-up">{children}</div>
        </div>
      </div>
    </div>
  );
}
