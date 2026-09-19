import React from 'react';
import { ShieldAlert, X, PhoneCall, Lock, FileText, HeartHandshake, Volume2 } from 'lucide-react';

interface EmergencyHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSpeak: (text: string) => void;
  isSpeaking: boolean;
}

export const EmergencyHelpModal: React.FC<EmergencyHelpModalProps> = ({
  isOpen,
  onClose,
  onSpeak,
  isSpeaking,
}) => {
  if (!isOpen) return null;

  const emergencySteps = [
    {
      icon: PhoneCall,
      title: '1. Call Your Bank Immediately to Freeze Transactions',
      detail: 'Dial your official bank helpline (printed on the back of your ATM card) or open your official mobile banking app to temporarily freeze your debit card and UPI access.',
      color: 'text-rose-600 bg-rose-50 border-rose-200'
    },
    {
      icon: ShieldAlert,
      title: '2. Call the Cyber Crime Helpline: 1930',
      detail: 'In India, dial 1930 immediately (National Cyber Crime Reporting Helpline). If reported within the first 1–2 hours ("Golden Hours"), banks can often block fraudulent fund transfers.',
      color: 'text-amber-600 bg-amber-50 border-amber-200'
    },
    {
      icon: Lock,
      title: '3. Change Your UPI PIN and Bank Passwords',
      detail: 'If you entered your PIN or downloaded any app recommended by the caller, change your UPI PIN immediately through Google Pay, PhonePe, or Paytm.',
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    {
      icon: FileText,
      title: '4. Do NOT Delete the Messages or Chats',
      detail: 'Keep all SMS, WhatsApp messages, phone numbers, and transaction screenshots. The police and bank need these as formal evidence to retrieve your funds.',
      color: 'text-purple-600 bg-purple-50 border-purple-200'
    },
    {
      icon: HeartHandshake,
      title: '5. Tell a Trusted Family Member Without Fear',
      detail: 'Please remember: Scammers use high-pressure emotional tricks to manipulate people of all ages. You did nothing wrong. Tell your son, daughter, or neighbor right away so they can support you.',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    }
  ];

  const handleReadAloud = () => {
    const text = `Emergency Fraud Help steps. Step 1: Call your bank immediately to freeze transactions. Dial the number on the back of your ATM card. Step 2: Call the Cyber Crime Helpline at 1930 immediately. Step 3: Change your UPI PIN and bank passwords. Step 4: Do not delete messages or chats as they are evidence. Step 5: Tell a trusted family member without fear or shame. You are safe and can take action.`;
    onSpeak(text);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-dialog-title"
      className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-rose-200 shadow-2xl space-y-5 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <h3 id="emergency-dialog-title" className="text-xl sm:text-2xl font-extrabold text-stone-900">
                Emergency Scam / Fraud Help
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 font-medium">
                Immediate actions if you suspect money was deducted or a scam occurred
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close emergency help modal"
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Read aloud button */}
        <div className="flex items-center justify-between bg-rose-50 p-3.5 rounded-2xl border border-rose-200">
          <span className="text-xs sm:text-sm font-bold text-rose-900">
            Need this read out aloud?
          </span>
          <button
            type="button"
            onClick={handleReadAloud}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-xs transition"
          >
            <Volume2 className="w-4 h-4" />
            <span>{isSpeaking ? 'Reading...' : 'Read Aloud'}</span>
          </button>
        </div>

        {/* Steps */}
        <div className="space-y-3.5 max-h-[55vh] overflow-y-auto pr-1">
          {emergencySteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className={`p-4 rounded-2xl border ${step.color} space-y-1`}>
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5 shrink-0" />
                  <h4 className="font-extrabold text-stone-900 text-base">
                    {step.title}
                  </h4>
                </div>
                <p className="text-sm text-stone-700 font-medium leading-relaxed pl-7">
                  {step.detail}
                </p>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-stone-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm shadow-xs transition cursor-pointer"
          >
            I Understand, Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
