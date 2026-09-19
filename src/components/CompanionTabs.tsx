import React from 'react';
import { MailOpen, ShieldCheck, Compass, HelpCircle } from 'lucide-react';
import { CompanionTab } from '../types';

interface CompanionTabsProps {
  activeTab: CompanionTab;
  setActiveTab: (tab: CompanionTab) => void;
}

export const CompanionTabs: React.FC<CompanionTabsProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const tabs = [
    {
      id: 'explain' as CompanionTab,
      label: 'Understand Message',
      subtitle: 'Simplify confusing SMS or notice',
      icon: MailOpen,
      badge: 'Jargon Buster',
      activeClasses: 'bg-amber-600 text-white border-amber-600 shadow-md',
      inactiveClasses: 'bg-white text-stone-700 hover:bg-stone-100/80 border-stone-200',
    },
    {
      id: 'safety' as CompanionTab,
      label: 'Safety & Scam Check',
      subtitle: 'Check if suspicious or fake',
      icon: ShieldCheck,
      badge: 'Fraud Shield',
      activeClasses: 'bg-rose-700 text-white border-rose-700 shadow-md',
      inactiveClasses: 'bg-white text-stone-700 hover:bg-stone-100/80 border-stone-200',
    },
    {
      id: 'guide' as CompanionTab,
      label: 'Step-by-Step Task Guide',
      subtitle: 'Easy instructions for digital tasks',
      icon: Compass,
      badge: 'Walkthrough',
      activeClasses: 'bg-emerald-700 text-white border-emerald-700 shadow-md',
      inactiveClasses: 'bg-white text-stone-700 hover:bg-stone-100/80 border-stone-200',
    },
    {
      id: 'ask' as CompanionTab,
      label: 'Ask a Question',
      subtitle: 'Clear answers to senior doubts',
      icon: HelpCircle,
      badge: 'Ask Anything',
      activeClasses: 'bg-sky-700 text-white border-sky-700 shadow-md',
      inactiveClasses: 'bg-white text-stone-700 hover:bg-stone-100/80 border-stone-200',
    },
  ];

  return (
    <nav aria-label="Main companion navigation" className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}-btn`}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer select-none ${
                isActive ? tab.activeClasses : tab.inactiveClasses
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                    isActive ? 'bg-white/25 text-white' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {tab.badge}
                </span>
              </div>
              <span className="font-bold text-sm sm:text-base leading-snug line-clamp-1">
                {tab.label}
              </span>
              <span
                className={`text-xs mt-0.5 line-clamp-1 ${
                  isActive ? 'text-white/80' : 'text-stone-600'
                }`}
              >
                {tab.subtitle}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
