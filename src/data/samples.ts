import { SampleItem } from '../types';

export const EXPLAIN_SAMPLES: SampleItem[] = [
  {
    id: 'exp-1',
    label: 'Official Bank Notice (Re-KYC)',
    description: 'Confusing banking jargon about "Re-KYC" & "PMLA"',
    badge: 'Confusing Jargon',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    content: 'Dear Valued Customer, pursuant to RBI regulatory directive RBI/2023-24/18, your savings account ending in 4821 requires periodic Re-KYC compliance. Debits and ECS mandates may be restricted under PMLA provisions if documentation is not furnished at branch portal within 30 days.'
  },
  {
    id: 'exp-2',
    label: 'Medical Lab Report SMS',
    description: 'Notice about lab test results and medical terms',
    badge: 'Medical Terms',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    content: 'Your Comprehensive Metabolic & Lipid Profile report for Sample #49281 is generated. Password is your 8-digit DOB. High triglyceride-HDL quotient flagged for clinical correlation by your primary consulting physician.'
  },
  {
    id: 'exp-3',
    label: 'Digital Water / Utility Bill',
    description: 'Complex utility adjustment & surcharge notice',
    badge: 'Utility Bill',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    content: 'Water Supply Board: Bill for Consumer #084920 generated for INR 1,240. Includes INR 180 sewerage maintenance surcharge and arrears adjustment. Due date 28-OCT. 5% delayed penalty surcharge applicable post grace interval.'
  }
];

export const SAFETY_SAMPLES: SampleItem[] = [
  {
    id: 'scam-1',
    label: 'Electricity Cut-off Scam',
    description: 'Threatens power disconnection tonight',
    badge: 'High Risk Scam',
    badgeColor: 'bg-red-100 text-red-800 border-red-200',
    content: 'URGENT NOTICE: Dear consumer, your electricity power connection will be permanently disconnected tonight at 9:30 PM from the power grid because previous month bill was not updated. Immediately call Electricity Officer Mr. Sharma on 9812345678 or pay INR 10 via bit.ly/elec-update-now to avoid disconnection.'
  },
  {
    id: 'scam-2',
    label: 'Fake Lottery / Lucky Draw',
    description: 'Promises huge cash prize but asks for fee',
    badge: 'Prize Fraud',
    badgeColor: 'bg-red-100 text-red-800 border-red-200',
    content: 'CONGRATULATIONS! Your mobile SIM card has won INR 25,00,000 in Kaun Banega Crorepati WhatsApp Lucky Draw 2026. File #KBC-9018. To claim your cheque, send your Aadhaar copy and transfer government clearance fee INR 2,500 to account officer on WhatsApp.'
  },
  {
    id: 'scam-3',
    label: 'Bank Account Blocked (Fake APK)',
    description: 'Urges clicking link or downloading app',
    badge: 'Malicious Link',
    badgeColor: 'bg-red-100 text-red-800 border-red-200',
    content: 'Dear SBI Customer, your YONO NetBanking account has been blocked due to pending PAN card verification. Please click here http://sbi-pan-update.online/app.apk to update PAN and unblock your account within 2 hours.'
  },
  {
    id: 'safe-1',
    label: 'Genuine Safe Bank OTP',
    description: 'Authentic automated security message',
    badge: 'Genuine Safe SMS',
    badgeColor: 'bg-green-100 text-green-800 border-green-200',
    content: '739201 is your secret OTP for login to your HDFC Bank NetBanking. Valid for 10 minutes. NEVER share this OTP with anyone, including bank staff or callers. HDFC Bank will never ask for your OTP.'
  }
];

export const TASK_SAMPLES = [
  {
    id: 'task-1',
    title: 'Video call my family on WhatsApp',
    description: 'See your grandchildren and kids face-to-face',
    iconName: 'Video',
    category: 'Communication'
  },
  {
    id: 'task-2',
    title: 'Pay my electricity or water bill online',
    description: 'Pay safely from home without standing in queues',
    iconName: 'Receipt',
    category: 'Bills & Payments'
  },
  {
    id: 'task-3',
    title: 'Share my live location with my daughter',
    description: 'So loved ones know you are safe while travelling',
    iconName: 'MapPin',
    category: 'Safety'
  },
  {
    id: 'task-4',
    title: 'Order prescription medicines online',
    description: 'Get doorstep delivery from trusted pharmacy apps',
    iconName: 'Pill',
    category: 'Health'
  },
  {
    id: 'task-5',
    title: 'Block and report an annoying spam caller',
    description: 'Stop nuisance telecallers from ringing your phone',
    iconName: 'PhoneOff',
    category: 'Protection'
  },
  {
    id: 'task-6',
    title: 'Increase text and button size on phone',
    description: 'Make everything on screen bigger and easier to read',
    iconName: 'ZoomIn',
    category: 'Comfort'
  }
];
