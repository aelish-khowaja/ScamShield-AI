import { ScamSample } from '../types';

export const SAMPLE_MESSAGES: ScamSample[] = [
  {
    id: 'bank-alert',
    title: 'Bank Fraud Alert SMS',
    type: 'Smishing / Credential Theft',
    expectedRisk: 'High',
    snippet: 'URGENT: Your debit card was charged $849.20 at Walmart. If this was not you...',
    fullText: `[CHASE SECURITY ALERT] Your debit card was temporarily suspended due to an unrecognized charge of $849.20 at Walmart Online. If this wasn't you, verify your identity immediately to prevent permanent account lock: https://chase-security-verify-auth72.com/unlock. Do not share your 6-digit OTP code with anyone.`,
  },
  {
    id: 'package-delivery',
    title: 'Unclaimed Package / Toll Fee',
    type: 'Delivery Smishing',
    expectedRisk: 'High',
    snippet: 'USPS: Your package #US940291 could not be delivered due to missing house number...',
    fullText: `USPS Notice: Your package US98210344 cannot be delivered due to an incomplete street address. Please update your address and settle the $1.95 redelivery clearance fee within 12 hours or your parcel will be returned to sender: https://usps-post-redelivery-portal.info/track`,
  },
  {
    id: 'job-offer',
    title: 'Remote Job / Fake Check Offer',
    type: 'Employment Scam',
    expectedRisk: 'High',
    snippet: 'Hi! I saw your resume on LinkedIn. We have an immediate remote data entry role paying $45/hr...',
    fullText: `Hello! I am Sarah Miller, HR Director at Apex Health Solutions. We reviewed your resume and are delighted to offer you our Remote Data Operations Specialist role at $48/hour. No prior experience is needed. We will wire you a cashier's check of $2,500 to purchase your MacBook and encrypted office software from our authorized vendor on Telegram (@ApexVendorHub). Please confirm your full name and bank routing number to receive your sign-on bonus check.`,
  },
  {
    id: 'crypto-investment',
    title: 'Crypto "Guaranteed Return" DM',
    type: 'Investment Fraud',
    expectedRisk: 'High',
    snippet: 'Exclusive invite to our AI Trading Signal VIP channel. Guaranteed 250% ROI in 5 days...',
    fullText: `Hey mate, congrats! You have been randomly selected for the Falcon Quantum Wealth Pool. Our proprietary AI bot trades BTC/ETH arbitrage with zero drawdown. Deposit a minimum of $500 USDT to start earning $1,800 daily guaranteed passive income. Connect your wallet now: https://falcon-ai-yield.vip/connect. Act fast, only 3 spots remaining before this round closes!`,
  },
  {
    id: 'legit-flight',
    title: 'Legitimate Flight Itinerary',
    type: 'Benign Communication',
    expectedRisk: 'Low',
    snippet: 'Your upcoming United Airlines flight confirmation (Confirmation: KJ92LM)...',
    fullText: `United Airlines Confirmation: Your flight UA 1842 from Chicago (ORD) to San Francisco (SFO) is confirmed for Nov 14, 2026. Departure: 08:30 AM. Confirmation Code: KJ92LM. You can manage your seat selection or check bags by signing into your MileagePlus account directly on united.com or using the official United mobile app. Thank you for flying with United.`,
  },
  {
    id: 'grandchild-emergency',
    title: 'Grandparent / Family Emergency',
    type: 'Impersonation Scam',
    expectedRisk: 'High',
    snippet: 'Grandma please do not tell Mom and Dad. I was in a terrible car accident and need bail...',
    fullText: `Grandma, please don't tell mom and dad yet, I'm so embarrassed. I was in a car accident while on a trip and the police are holding me. My public defender says I can be released today if I post $1,200 bond immediately. The courthouse clerk says wire transfer is down and requested Apple gift cards to clear the fee right now. Please buy three $400 Apple gift cards and text me the codes on the back. I will pay you back tomorrow I promise!`,
  },
];
