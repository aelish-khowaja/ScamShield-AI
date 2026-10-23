import React from 'react';
import { Shield, Lock, ExternalLink, AlertTriangle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 text-xs py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Privacy Pledge */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                ScamShield <span className="text-cyan-400">AI</span>
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed max-w-md">
              Democratizing enterprise-grade phishing & fraud intelligence to protect everyday citizens from malicious SMS, fake recruiters, deceptive links, and social engineering scams.
            </p>
            <div className="flex items-center gap-2 text-cyan-400 font-medium">
              <Lock className="w-3.5 h-3.5" />
              <span>Zero Message Storage Guarantee — We never persist your text.</span>
            </div>
          </div>

          {/* Official Fraud Reporting Hotlines */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Official Reporting Portals
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <a
                  href="https://reportfraud.ftc.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                >
                  <span>US FTC Fraud Reporting</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.ic3.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                >
                  <span>FBI IC3 Cybercrime Center</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://apwg.org/reportphishing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                >
                  <span>Anti-Phishing Working Group</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://safebrowsing.google.com/safebrowsing/report_phish"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                >
                  <span>Google Safe Browsing Report</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <a href="#scanner" className="hover:text-cyan-400 transition-colors">
                  Message Scanner
                </a>
              </li>
              <li>
                <a href="#assistant" className="hover:text-cyan-400 transition-colors">
                  AI Assistant Chat
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">
                  Detection Pipeline
                </a>
              </li>
              <li>
                <a href="#common-scams" className="hover:text-cyan-400 transition-colors">
                  Scam Anatomy Library
                </a>
              </li>
              <li>
                <a href="#safety-tips" className="hover:text-cyan-400 transition-colors">
                  Safety Audit & Checklist
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* AI Disclaimer & Limitations Note */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2">
          <div className="flex items-center gap-2 text-slate-300 font-semibold">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>AI Safety & Advisory Disclaimer</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            ScamShield AI utilizes Google Gemini to provide probabilistic risk evaluations based on recognized social engineering patterns, linguistic pressure tactics, and credential harvesting indicators. ScamShield AI does not replace professional legal, financial, or cyber incident response counsel. Never enter sensitive passwords, financial credentials, or OTP codes on unverified links. Always confirm unexpected urgent requests by contacting the institution via their official, independently verified telephone number.
          </p>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <div>
            © {new Date().getFullYear()} ScamShield AI. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Client-side Privacy Protected</span>
            <span aria-hidden="true">·</span>
            <span>Zero Data Logging</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
