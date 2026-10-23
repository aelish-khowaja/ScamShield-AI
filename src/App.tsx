import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MessageScanner } from './components/MessageScanner';
import { AiAssistantChat } from './components/AiAssistantChat';
import { HowItWorks } from './components/HowItWorks';
import { CommonScams } from './components/CommonScams';
import { SafetyTips } from './components/SafetyTips';
import { Footer } from './components/Footer';
import { MessageSquare, ArrowUp } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [chatPrompt, setChatPrompt] = useState<string>('');

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAskFollowUpFromScanner = (contextPrompt: string) => {
    setChatPrompt(contextPrompt);
    scrollToSection('assistant');
  };

  const handleTestScamFromLibrary = (exampleText: string) => {
    scrollToSection('scanner');
    // Allow window scroll to trigger first, then find textarea
    setTimeout(() => {
      const textarea = document.querySelector('textarea');
      if (textarea) {
        // Trigger React state change if possible
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype,
          'value'
        )?.set;
        if (nativeInputValueSetter) {
          nativeInputValueSetter.call(textarea, exampleText);
          textarea.dispatchEvent(new Event('input', { bubbles: true }));
        }
        textarea.focus();
      }
    }, 150);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Navigation */}
      <Navbar onNavigate={scrollToSection} activeSection={activeSection} />

      {/* Main Content Sections */}
      <main className="flex-1">
        <HeroSection
          onScanClick={() => scrollToSection('scanner')}
          onChatClick={() => scrollToSection('assistant')}
        />

        <MessageScanner onAskFollowUp={handleAskFollowUpFromScanner} />

        <AiAssistantChat
          initialPrompt={chatPrompt}
          onClearInitialPrompt={() => setChatPrompt('')}
        />

        <HowItWorks onScanClick={() => scrollToSection('scanner')} />

        <CommonScams onTestScam={handleTestScamFromLibrary} />

        <SafetyTips />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Quick Action Widget */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
        <button
          onClick={() => scrollToSection('assistant')}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 rounded-full shadow-xl shadow-cyan-950/60 transition-all hover:scale-105 active:scale-95 border border-cyan-300/40"
          title="Chat with ScamShield AI"
        >
          <MessageSquare className="w-4 h-4 fill-slate-950" />
          <span>Ask AI Assistant</span>
        </button>
      </div>
    </div>
  );
}
