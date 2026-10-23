import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Search,
  Sparkles,
  RotateCcw,
  Copy,
  Check,
  ExternalLink,
  Info,
  CheckCircle2,
  XCircle,
  HelpCircle,
  CornerDownRight,
  ClipboardPaste,
  SlidersHorizontal,
} from 'lucide-react';
import { ScanResult, RiskLevel, SuspiciousPhrase } from '../types';
import { SAMPLE_MESSAGES } from '../data/samples';

interface MessageScannerProps {
  onAskFollowUp?: (contextMessage: string) => void;
}

export const MessageScanner: React.FC<MessageScannerProps> = ({ onAskFollowUp }) => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMissingKey, setIsMissingKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activePhrase, setActivePhrase] = useState<SuspiciousPhrase | null>(null);

  const handleSelectSample = (sampleText: string) => {
    setInputText(sampleText);
    setError(null);
    setResult(null);
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputText(text);
        setError(null);
      }
    } catch {
      // Clipboard access denied or unsupported, silently fail
    }
  };

  const handleClear = () => {
    setInputText('');
    setResult(null);
    setError(null);
    setActivePhrase(null);
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      setError('Please paste or type a suspicious message, email, or offer first.');
      return;
    }

    setLoading(true);
    setError(null);
    setIsMissingKey(false);
    setActivePhrase(null);

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageText: inputText }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.missingApiKey) {
          setIsMissingKey(true);
        }
        throw new Error(data.error || 'Failed to analyze message. Please try again.');
      }

      setResult(data as ScanResult);
    } catch (err: any) {
      console.error('Scan error:', err);
      setError(err.message || 'An error occurred while analyzing the message.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReport = () => {
    if (!result) return;
    const textToCopy = `[ScamShield AI Analysis Report]
Risk Level: ${result.riskLevel} (${result.riskScore}/100)
Category: ${result.scamType}
Summary: ${result.verdictSummary}

Key Red Flags:
${result.redFlags.map((rf) => `- ${rf}`).join('\n')}

Immediate Safe Steps:
${result.recommendedActions.map((ra) => `1. ${ra}`).join('\n')}

What NOT to do:
${result.whatNotToDo.map((wn) => `! ${wn}`).join('\n')}

Analyzed with ScamShield AI`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper for risk color coding
  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case 'High':
        return {
          bg: 'bg-rose-950/40',
          border: 'border-rose-700/60',
          text: 'text-rose-400',
          badge: 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
          bar: 'bg-rose-500',
        };
      case 'Medium':
        return {
          bg: 'bg-amber-950/40',
          border: 'border-amber-700/60',
          text: 'text-amber-400',
          badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
          bar: 'bg-amber-500',
        };
      case 'Low':
      default:
        return {
          bg: 'bg-emerald-950/40',
          border: 'border-emerald-700/60',
          text: 'text-emerald-400',
          badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
          bar: 'bg-emerald-500',
        };
    }
  };

  return (
    <section id="scanner" className="py-12 md:py-16 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-3 py-1 rounded-md mb-3">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>AI Message Scanner</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Analyze Any Suspicious Message
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300">
            Paste phishing emails, smishing SMS, job offers, or payment demands. Our AI extracts hidden red flags, pinpoints deceptive links, and delivers a threat evaluation.
          </p>
        </div>

        {/* Missing API Key Banner */}
        {isMissingKey && (
          <div className="max-w-4xl mx-auto mb-6 p-4 rounded-xl border border-amber-500/50 bg-amber-950/40 text-amber-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm space-y-1">
                <p className="font-semibold text-white">Gemini API Key Required</p>
                <p>
                  To enable real-time AI scam detection, make sure your <code className="bg-amber-900/60 px-1 py-0.5 rounded font-mono text-amber-300">GEMINI_API_KEY</code> is configured in the AI Studio <strong>Settings &gt; Secrets</strong> panel.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Scanner Workspace Box */}
        <div className="max-w-4xl mx-auto bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden backdrop-blur-sm">
          {/* Quick Presets Bar */}
          <div className="p-4 sm:px-6 border-b border-slate-800 bg-slate-950/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                Quick test samples:
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {SAMPLE_MESSAGES.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSample(sample.fullText)}
                    className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60 truncate max-w-[170px]"
                    title={sample.title}
                  >
                    {sample.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Textarea Input Container */}
          <div className="p-4 sm:p-6 space-y-4">
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste the suspicious SMS, email, WhatsApp message, remote job pitch, or payment request here...&#10;&#10;e.g. 'URGENT: Your bank account will be suspended in 24 hours. Verify your credentials immediately: http://...'"
                rows={6}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 resize-y transition-all leading-relaxed"
              />

              {/* Floating controls in textarea bottom */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 px-1">
                <span className="font-mono">
                  {inputText.length.toLocaleString()} characters
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePasteClipboard}
                    type="button"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60"
                  >
                    <ClipboardPaste className="w-3 h-3 text-cyan-400" />
                    <span>Paste</span>
                  </button>
                  {inputText && (
                    <button
                      onClick={handleClear}
                      type="button"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3.5 rounded-lg border border-rose-500/40 bg-rose-950/30 text-rose-300 text-xs sm:text-sm flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Your text is analyzed securely in-memory and never logged or stored.</span>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={loading || !inputText.trim()}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all shadow-lg ${
                  loading || !inputText.trim()
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                    : 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing Indicators with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Check Message Now</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Display Container */}
          {result && (
            <div className="border-t border-slate-800 bg-slate-950/70 p-4 sm:p-6 lg:p-8 space-y-6">
              {/* Header: Risk Level & Score */}
              {(() => {
                const colors = getRiskColor(result.riskLevel);
                return (
                  <div className={`p-5 rounded-xl border ${colors.border} ${colors.bg} space-y-4`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2.5 mb-1">
                          <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${colors.badge}`}>
                            {result.riskLevel} Risk Detected
                          </span>
                          <span className="text-xs text-slate-400">·</span>
                          <span className="text-xs text-slate-300 font-medium">
                            Category: <span className="text-white font-semibold">{result.scamType}</span>
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-white">
                          Threat Evaluation: {result.riskLevel === 'High' ? 'Probable Scam or Threat' : result.riskLevel === 'Medium' ? 'Suspicious Indicators Found' : 'Low Probability of Fraud'}
                        </h3>
                      </div>

                      {/* Risk Score Meter */}
                      <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-3 rounded-xl border border-slate-800 shrink-0">
                        <div className="text-right">
                          <div className="text-2xl font-extrabold font-mono text-white tabular-nums">
                            {result.riskScore}<span className="text-xs text-slate-400 font-sans">/100</span>
                          </div>
                          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                            Risk Index
                          </div>
                        </div>
                        {/* Visual mini gauge bar */}
                        <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${colors.bar} transition-all duration-700`}
                            style={{ width: `${Math.max(5, result.riskScore)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Verdict Summary */}
                    <p className="text-sm text-slate-200 leading-relaxed font-normal">
                      {result.verdictSummary}
                    </p>
                  </div>
                );
              })()}

              {/* Suspicious Phrases Breakdown */}
              {result.suspiciousPhrases && result.suspiciousPhrases.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      Risky & Deceptive Phrases Detected ({result.suspiciousPhrases.length})
                    </h4>
                    <span className="text-xs text-slate-400">Click a phrase to view threat rationale</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {result.suspiciousPhrases.map((item, idx) => {
                      const isSelected = activePhrase?.phrase === item.phrase;
                      const severityColor =
                        item.severity === 'critical'
                          ? 'border-rose-800/80 bg-rose-950/30 text-rose-200'
                          : item.severity === 'warning'
                          ? 'border-amber-800/80 bg-amber-950/30 text-amber-200'
                          : 'border-slate-700 bg-slate-900/60 text-slate-300';

                      return (
                        <div
                          key={idx}
                          onClick={() => setActivePhrase(isSelected ? null : item)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${severityColor} hover:border-cyan-500`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <span className="font-mono text-xs font-semibold text-white break-words">
                              "{item.phrase}"
                            </span>
                            <span
                              className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0 ${
                                item.severity === 'critical'
                                  ? 'bg-rose-500/20 text-rose-300'
                                  : item.severity === 'warning'
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-slate-700 text-slate-300'
                              }`}
                            >
                              {item.severity}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 mt-1 leading-normal">
                            {item.reason}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Red Flags & Safe Signals Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Red Flags */}
                <div className="p-4 rounded-xl border border-rose-900/40 bg-slate-900/60 space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-rose-400" />
                    Specific Warning Signs
                  </h4>
                  {result.redFlags && result.redFlags.length > 0 ? (
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {result.redFlags.map((flag, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-rose-500 mt-0.5 font-bold">•</span>
                          <span>{flag}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No prominent red flags identified.</p>
                  )}
                </div>

                {/* Safe Signals / Mitigations */}
                <div className="p-4 rounded-xl border border-emerald-900/40 bg-slate-900/60 space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Mitigating or Benign Signals
                  </h4>
                  {result.safeSignals && result.safeSignals.length > 0 ? (
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {result.safeSignals.map((signal, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-0.5 font-bold">•</span>
                          <span>{signal}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No standard legitimate markers confirmed.</p>
                  )}
                </div>
              </div>

              {/* Actionable Defense Steps: What To Do & What NOT To Do */}
              <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    Recommended Action Protocol
                  </h4>
                  <button
                    onClick={handleCopyReport}
                    className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Report Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Full Report</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* What to do right now */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                      What to do right now:
                    </span>
                    <ol className="space-y-1.5 text-xs text-slate-300 list-decimal list-inside">
                      {result.recommendedActions.map((action, idx) => (
                        <li key={idx} className="leading-relaxed">
                          <span className="text-slate-200">{action}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* What NOT to do */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                      What NOT to do:
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {result.whatNotToDo.map((warning, idx) => (
                        <li key={idx} className="flex items-start gap-2 leading-relaxed">
                          <span className="text-rose-500 font-bold shrink-0">✕</span>
                          <span className="text-slate-200">{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Ask AI Assistant Follow up */}
                {onAskFollowUp && (
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      Have questions about this scan or what to do next?
                    </span>
                    <button
                      onClick={() =>
                        onAskFollowUp(
                          `I scanned a message categorized as "${result.scamType}" with risk score ${result.riskScore}/100. The message said: "${inputText.slice(0, 150)}...". How should I handle this?`
                        )
                      }
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:underline"
                    >
                      <span>Ask AI Assistant for Advice</span>
                      <CornerDownRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* AI Safety Transparency & Uncertainty Disclaimer */}
              <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/40 text-slate-400 text-xs flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium text-slate-300">AI Safety & Verification Advisory</p>
                  <p className="leading-relaxed">
                    {result.confidenceAssessment ||
                      'AI threat analysis is probabilistic and cannot guarantee 100% certainty. Never enter passwords, credentials, or 2FA codes on unverified pages. If an organization claims your account is locked, independently verify by calling the official phone number on the back of your payment card or visiting their bookmarked website directly.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
