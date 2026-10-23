import React, { useState } from 'react';
import {
  ShieldAlert,
  MailWarning,
  PackageCheck,
  Briefcase,
  CreditCard,
  Laptop,
  UserX,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { SCAM_CATEGORIES } from '../data/scamCategories';

interface CommonScamsProps {
  onTestScam: (exampleText: string) => void;
}

export const CommonScams: React.FC<CommonScamsProps> = ({ onTestScam }) => {
  const [selectedId, setSelectedId] = useState<string>(SCAM_CATEGORIES[0].id);

  const selectedCategory =
    SCAM_CATEGORIES.find((c) => c.id === selectedId) || SCAM_CATEGORIES[0];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'MailWarning':
        return <MailWarning className="w-5 h-5 text-cyan-400" />;
      case 'PackageCheck':
        return <PackageCheck className="w-5 h-5 text-cyan-400" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-cyan-400" />;
      case 'CreditCard':
        return <CreditCard className="w-5 h-5 text-cyan-400" />;
      case 'Laptop':
        return <Laptop className="w-5 h-5 text-cyan-400" />;
      case 'UserX':
      default:
        return <UserX className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <section id="common-scams" className="py-12 md:py-16 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-3 py-1 rounded-md mb-3">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Fraud Vector Library</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Common Scam Types & Anatomy
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300">
            Learn the psychological triggers and deceptive technical tricks used by modern fraudsters to steal funds and identities.
          </p>
        </div>

        {/* Master-Detail Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Category Tabs (Left / 4 cols) */}
          <div className="lg:col-span-4 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-2 mb-1">
              Select Scam Category
            </span>
            {SCAM_CATEGORIES.map((cat) => {
              const isSelected = cat.id === selectedId;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedId(cat.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500/80 shadow-lg shadow-cyan-950/30'
                      : 'bg-slate-950/70 border-slate-800/80 hover:bg-slate-900/50 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700/80 flex items-center justify-center shrink-0">
                      {getIcon(cat.iconName)}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        {cat.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-1">
                        {cat.primaryVector}
                      </p>
                    </div>
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 transition-transform ${
                      isSelected ? 'text-cyan-400 translate-x-1' : 'text-slate-600'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Category Detail Panel (Right / 8 cols) */}
          <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-sm">
            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
                <span className="font-semibold text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-800/60">
                  {selectedCategory.frequency}
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-400">
                  Vector: <span className="text-slate-300 font-medium">{selectedCategory.primaryVector}</span>
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                {selectedCategory.title}
              </h3>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                {selectedCategory.shortDesc}
              </p>
            </div>

            {/* Typical Hook */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                The Typical Fraudster Hook:
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-mono">
                "{selectedCategory.typicalHook}"
              </p>
            </div>

            {/* Red Flags List */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Dead Giveaway Red Flags
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                {selectedCategory.redFlags.map((flag, idx) => (
                  <li key={idx} className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/80 flex items-start gap-2">
                    <span className="text-rose-400 font-bold shrink-0 mt-0.5">!</span>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Safe Protocol */}
            <div className="p-4 rounded-xl border border-emerald-900/40 bg-emerald-950/20 space-y-1 text-xs">
              <span className="font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Standard Defensive Protocol:
              </span>
              <p className="text-slate-200 leading-relaxed">
                {selectedCategory.safeProtocol}
              </p>
            </div>

            {/* Live Test Example Button */}
            <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                Realistic sample: <span className="text-slate-300 italic truncate max-w-xs inline-block align-bottom">{selectedCategory.realWorldExample}</span>
              </div>
              <button
                onClick={() => onTestScam(selectedCategory.realWorldExample)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap shrink-0"
              >
                <span>Test in Scanner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
