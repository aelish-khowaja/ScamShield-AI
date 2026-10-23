import React, { useState } from 'react';
import { ShieldCheck, CheckSquare, Square, AlertCircle, ExternalLink, Lock } from 'lucide-react';
import { SAFETY_CHECKLIST } from '../data/scamCategories';

export const SafetyTips: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <section id="safety-tips" className="py-12 md:py-16 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-3 py-1 rounded-md mb-3">
            <Lock className="w-3.5 h-3.5" />
            <span>Essential Cyber Hygiene</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Online Safety Rules & Audit
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300">
            Adopt these 6 foundational security defenses to eliminate over 90% of opportunistic phishing and social engineering traps.
          </p>
        </div>

        {/* Interactive Hygiene Audit Bar */}
        <div className="max-w-4xl mx-auto mb-8 p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 font-mono font-bold text-sm">
              {completedCount}/{SAFETY_CHECKLIST.length}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Personal Scam Immunity Score</h4>
              <p className="text-xs text-slate-400">Check off the security rules you consistently practice in daily life.</p>
            </div>
          </div>

          <div className="hidden sm:block w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-400 transition-all duration-300"
              style={{ width: `${(completedCount / SAFETY_CHECKLIST.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Tips Grid */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {SAFETY_CHECKLIST.map((item, idx) => {
            const isChecked = Boolean(checkedItems[idx]);
            return (
              <div
                key={idx}
                onClick={() => toggleCheck(idx)}
                className={`p-5 rounded-xl border cursor-pointer transition-all ${
                  isChecked
                    ? 'bg-slate-900 border-cyan-500/70 shadow-md shadow-cyan-950/20'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="text-cyan-400 font-mono text-xs">0{idx + 1}.</span>
                    <span>{item.title}</span>
                  </h3>
                  <button
                    type="button"
                    className="text-slate-400 hover:text-cyan-400 shrink-0"
                    aria-label={`Toggle ${item.title}`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-5 h-5 text-cyan-400" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-600" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {item.tip}
                </p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Security Benefit:</span>
                  <span className="font-semibold text-emerald-400">{item.impact}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Golden Rule Banner */}
        <div className="max-w-4xl mx-auto mt-8 p-5 rounded-2xl border border-amber-900/40 bg-amber-950/20 text-xs sm:text-sm text-slate-300 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-white block">The Golden Out-of-Band Rule</span>
            <p className="leading-relaxed">
              Whenever an inbound communication demands money, gift cards, wire transfers, passwords, or OTP codes under threat of arrest, account suspension, or missed deliveries: <strong>hang up or close the message</strong>. Independently look up the official company or agency telephone number and call them directly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
