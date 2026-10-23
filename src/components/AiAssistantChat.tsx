import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  ShieldCheck,
  User,
  Sparkles,
  AlertOctagon,
  Copy,
  Check,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { ChatMessage } from '../types';

interface AiAssistantChatProps {
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

export const AiAssistantChat: React.FC<AiAssistantChatProps> = ({
  initialPrompt,
  onClearInitialPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I am **ScamShield AI Assistant**, your personal cybersecurity & fraud prevention guide.

I can help you:
- **Dissect suspicious texts, emails, or DMs** in plain, simple English
- **Identify phishing links, fake job offers, or payment scams**
- **Formulate an emergency action plan** if you clicked a suspicious link or sent money
- **Safeguard your banking, passwords, and 2FA codes**

What suspicious message or cybersecurity question can I help you with today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const starterQuestions = [
    'I clicked a suspicious link. What should I do right now?',
    'Can a bank representative ever ask for my one-time OTP?',
    'How do I spot a fake job offer on WhatsApp or Telegram?',
    'Someone sent money to my Zelle by "mistake" and wants it back. Is this a scam?',
    'What should I do if I shared my Social Security or card number?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Handle external prompt passed from Message Scanner
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSend(initialPrompt);
      if (onClearInitialPrompt) {
        onClearInitialPrompt();
      }
    }
  }, [initialPrompt]);

  const handleSend = async (textToSend?: string) => {
    const prompt = (textToSend || input).trim();
    if (!prompt || loading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      // Format history for backend
      const apiMessages = newHistory.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to get an answer from ScamShield AI.');
      }

      const botMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'I am having trouble answering right now. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Unable to connect to AI Assistant**: ${err.message || 'Please verify your network connection and that GEMINI_API_KEY is configured in AI Studio Secrets.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: 'Chat refreshed. How can ScamShield AI help you protect yourself today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Simple Markdown parser for bold and lists
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Bullet list item
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const bulletText = line.trim().slice(2);
        return (
          <li key={idx} className="ml-4 list-disc my-1 leading-relaxed text-slate-200">
            {formatInlineText(bulletText)}
          </li>
        );
      }

      // Numbered list item
      const numMatch = line.trim().match(/^(\d+)\.\s+(.*)$/);
      if (numMatch) {
        return (
          <li key={idx} className="ml-4 list-decimal my-1 leading-relaxed text-slate-200">
            {formatInlineText(numMatch[2])}
          </li>
        );
      }

      // Empty line / paragraph separator
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }

      // Normal paragraph
      return (
        <p key={idx} className="my-1 leading-relaxed text-slate-200">
          {formatInlineText(line)}
        </p>
      );
    });
  };

  const formatInlineText = (text: string) => {
    // Basic bold **text** replacement
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <section id="assistant" className="py-12 md:py-16 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-3 py-1 rounded-md mb-3">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Interactive Cybersecurity Advisor</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            ScamShield AI Assistant
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300">
            Ask any question about suspicious communications, emergency containment, fake recruiters, or scam defense protocols.
          </p>
        </div>

        {/* Emergency Triage Quick Button Bar */}
        <div className="max-w-4xl mx-auto mb-4 p-3 rounded-xl border border-rose-900/50 bg-rose-950/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-rose-300">
            <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-semibold">Clicked a suspicious link or transferred money?</span>
            <span className="text-rose-400/80 hidden md:inline">Follow our rapid emergency containment triage.</span>
          </div>
          <button
            onClick={() => setShowEmergencyModal(true)}
            className="px-3 py-1.5 font-semibold text-rose-200 bg-rose-900/40 hover:bg-rose-900/70 border border-rose-700/60 rounded-md transition-colors whitespace-nowrap shrink-0"
          >
            Emergency 4-Step Action Plan
          </button>
        </div>

        {/* Main Chat Box Container */}
        <div className="max-w-4xl mx-auto bg-slate-900/90 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[650px] backdrop-blur-sm">
          {/* Chat Header Bar */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>ScamShield AI Assistant</span>
                  <span className="text-[10px] text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800/60 font-mono">
                    Online
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Empathetic fraud detection & incident containment
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetChat}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                title="Restart conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((message) => {
              const isAssistant = message.role === 'assistant';
              return (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Shield className="w-4 h-4 text-cyan-400" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm shadow-sm relative group ${
                      isAssistant
                        ? 'bg-slate-950/80 border border-slate-800 text-slate-200'
                        : 'bg-cyan-500/15 border border-cyan-500/30 text-white ml-auto'
                    }`}
                  >
                    <div className="text-xs text-slate-400 mb-1 flex items-center justify-between gap-4 font-mono">
                      <span>{isAssistant ? 'ScamShield Assistant' : 'You'}</span>
                      <span>{message.timestamp}</span>
                    </div>

                    <div className="text-sm leading-relaxed">
                      {renderFormattedContent(message.content)}
                    </div>

                    {/* Copy Button */}
                    {isAssistant && (
                      <button
                        onClick={() => handleCopyMessage(message.id, message.content)}
                        className="absolute bottom-2 right-2 p-1 text-slate-500 hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Copy answer"
                      >
                        {copiedId === message.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>

                  {!isAssistant && (
                    <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center shrink-0 mt-0.5 text-cyan-300">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Shield className="w-4 h-4 text-cyan-400 animate-pulse" />
                </div>
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-sm text-slate-400 flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <span>ScamShield Assistant is formulating advice...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Starter Questions Horizontal Strip */}
          <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
            <div className="text-[11px] font-medium text-slate-400 mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Suggested quick questions:</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {starterQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  disabled={loading}
                  className="px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-750 border border-slate-750 rounded-lg whitespace-nowrap shrink-0 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Control Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/70"
          >
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about a suspicious email, phone call, fake check, or scam recovery..."
                disabled={loading}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className={`p-3 rounded-xl font-semibold transition-all ${
                  loading || !input.trim()
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                    : 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-md shadow-cyan-500/20'
                }`}
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="text-[11px] text-slate-400 text-center mt-2">
              ScamShield AI Assistant never asks for passwords, PINs, or card details. Verify financial alerts directly with your bank.
            </div>
          </form>
        </div>

        {/* Emergency Triage Modal */}
        {showEmergencyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="max-w-xl w-full bg-slate-900 border border-rose-800/80 rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-base">
                  <AlertOctagon className="w-5 h-5 text-rose-400" />
                  <span>Immediate 4-Step Incident Triage</span>
                </div>
                <button
                  onClick={() => setShowEmergencyModal(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-md"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-300">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <strong className="text-white block mb-0.5">1. Lock Your Payment Cards / Notify Bank</strong>
                  Call the phone number printed directly on the physical back of your debit/credit card. Request an immediate card freeze and notify their fraud department.
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <strong className="text-white block mb-0.5">2. Reset Passwords on a Clean Device</strong>
                  If you entered login credentials on a suspicious link, immediately change your password and revoke all active sessions from a separate phone or computer.
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <strong className="text-white block mb-0.5">3. Place a Free Credit Freeze / Fraud Alert</strong>
                  Contact Experian, Equifax, and TransUnion to place a free fraud alert or security freeze on your credit files to prevent unauthorized accounts.
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <strong className="text-white block mb-0.5">4. Report the Crime to Authorities</strong>
                  File an official fraud report at <a href="https://reportfraud.ftc.gov" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">ReportFraud.ftc.gov</a> and <a href="https://www.ic3.gov" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">IC3.gov</a> (FBI).
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    setShowEmergencyModal(false);
                    handleSend('I just clicked a suspicious link or sent money. Can you guide me through my emergency next steps in detail?');
                  }}
                  className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors"
                >
                  Ask Assistant For Step-By-Step Guidance
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
