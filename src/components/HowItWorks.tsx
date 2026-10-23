import React from 'react';
import { ShieldCheck, Search, Cpu, CheckCircle, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onScanClick: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onScanClick }) => {
  const steps = [
    {
      step: '01',
      title: 'Zero-Trace Ingestion',
      desc: 'Paste any text, email header, job offer, or payment demand. Your content is processed strictly in-memory with zero persistence or telemetry logging to protect your personal privacy.',
      tag: 'Zero Logging Architecture',
    },
    {
      step: '02',
      title: 'Semantic & Threat Intelligence',
      desc: 'Our Gemini AI model scrutinizes linguistic patterns for artificial urgency, impersonation tactics, deceptive typosquatting domains, advance-fee checks, and requests for one-time passcodes.',
      tag: 'Heuristics & LLM Intelligence',
    },
    {
      step: '03',
      title: 'Actionable Defense Blueprint',
      desc: 'Receive an instant risk score (0–100), highlighted deceptive phrases, and a concrete counter-action plan telling you precisely what to do and what pitfalls to avoid.',
      tag: 'Clear Protection Protocol',
    },
  ];

  return (
    <section id="how-it-works" className="py-12 md:py-16 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-3 py-1 rounded-md mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>Detection Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            How ScamShield AI Protects You
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300">
            A three-stage defense pipeline built to reveal psychological manipulation and deceptive technical traps before damage occurs.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-extrabold text-cyan-400">
                    {item.step}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    {item.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800/60 flex items-center text-xs font-semibold text-cyan-400">
                <span>Phase {item.step} Protocol</span>
              </div>
            </div>
          ))}
        </div>

        {/* Callout Strip */}
        <div className="mt-12 p-6 rounded-2xl border border-cyan-900/40 bg-gradient-to-r from-slate-900 via-cyan-950/20 to-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-bold text-white">
              Ready to verify a message you received?
            </h4>
            <p className="text-xs text-slate-400">
              It takes less than 3 seconds to scan any suspicious text or email.
            </p>
          </div>
          <button
            onClick={onScanClick}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap shrink-0"
          >
            <span>Scan Message Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
