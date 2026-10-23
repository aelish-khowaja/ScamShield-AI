import React from 'react';
import { ShieldCheck, ArrowRight, MessageSquare, AlertTriangle, Lock, Search } from 'lucide-react';

interface HeroSectionProps {
  onScanClick: () => void;
  onChatClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onScanClick, onChatClick }) => {
  return (
    <section id="hero" className="relative pt-12 pb-16 md:pt-16 md:pb-24 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 cyber-radial-glow pointer-events-none opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 px-3 py-1 rounded-md">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Real-Time Phishing & Fraud Intelligence</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15]" style={{ textWrap: 'balance' }}>
              Stay Safe from <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">Online Scams</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Don’t let cybercriminals trick you. Paste any suspicious text message, email, fake job offer, or payment demand. Our AI dissects deceptive links, psychological pressure tactics, and credential harvesting traps in seconds.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={onScanClick}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
              >
                <Search className="w-4 h-4" />
                <span>Check a Suspicious Message</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={onChatClick}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
              >
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>Ask AI Cybersecurity Assistant</span>
              </button>
            </div>

            {/* Trust and Privacy Strip */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-y-3 gap-x-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400" />
                <span>Zero Message Storage / 100% Confidential</span>
              </div>
              <span className="text-slate-700 hidden sm:inline" aria-hidden="true">·</span>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Linguistic & Link Analysis</span>
              </div>
              <span className="text-slate-700 hidden sm:inline" aria-hidden="true">·</span>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Gemini AI Engine</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Hero Asset */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl shadow-cyan-950/40 group">
              <div className="aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] w-full overflow-hidden bg-slate-950">
                <img
                  src="/src/assets/images/hero_scamshield_cyber_1792749735163.jpg"
                  alt="ScamShield AI cybersecurity operations threat defense center"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  loading="eager"
                />
              </div>

              {/* Glass Threat Ticker Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent backdrop-blur-sm border-t border-slate-800/60">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-cyan-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                    Threat Detection Engine Active
                  </span>
                  <span className="text-slate-400 font-mono">v3.8 Flash</span>
                </div>
                <p className="text-xs text-slate-300 leading-snug">
                  Analyzing semantic patterns, artificial urgency triggers, typosquatting domains, and unauthorized payment demands.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
