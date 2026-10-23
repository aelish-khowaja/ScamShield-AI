export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface SuspiciousPhrase {
  phrase: string;
  reason: string;
  severity: 'critical' | 'warning' | 'suspicious';
}

export interface ScanResult {
  riskLevel: RiskLevel;
  riskScore: number;
  scamType: string;
  verdictSummary: string;
  indicatorsFound: boolean;
  redFlags: string[];
  safeSignals: string[];
  suspiciousPhrases: SuspiciousPhrase[];
  recommendedActions: string[];
  whatNotToDo: string[];
  confidenceAssessment: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ScamSample {
  id: string;
  title: string;
  type: string;
  expectedRisk: RiskLevel;
  snippet: string;
  fullText: string;
}

export interface ScamCategory {
  id: string;
  title: string;
  shortDesc: string;
  iconName: string;
  frequency: string;
  primaryVector: string;
  typicalHook: string;
  redFlags: string[];
  safeProtocol: string;
  realWorldExample: string;
}
