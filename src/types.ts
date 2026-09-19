export type ScreenId = 'home' | 'explain' | 'safety' | 'guide' | 'myday';

export type FontSizeMode = 'normal' | 'large' | 'extralarge';

export type SpeechSpeed = 'slow' | 'normal';

export interface KeyTerm {
  term: string;
  explanation: string;
}

export interface ExplanationResult {
  summary: string;
  simpleExplanation: string;
  senderType?: string;
  keyTerms: KeyTerm[];
  actionAdvice: string[];
}

export interface SafetyCheckResult {
  safetyLevel: 'SAFE' | 'CAUTION' | 'DANGER';
  verdictTitle: string;
  safetyScore: number;
  plainWarning: string;
  redFlags: string[];
  safeActions: string[];
  goldenRule: string;
}

export interface TaskStep {
  stepNumber: number;
  title: string;
  instruction: string;
  visualTip: string;
  warning?: string | null;
}

export interface TaskGuideResult {
  taskTitle: string;
  overview: string;
  steps: TaskStep[];
  comfortingTip: string;
}

export interface DailyTaskItem {
  id: string;
  time: string;
  title: string;
  category: 'medicine' | 'call' | 'routine' | 'alert';
  completed: boolean;
  notes?: string;
}

export interface SamplePreset {
  id: string;
  label: string;
  tag: string;
  text: string;
}

export type CompanionTab = 'explain' | 'safety' | 'guide' | 'ask';

export interface SampleItem {
  id: string;
  label: string;
  description: string;
  badge?: string;
  badgeColor?: string;
  content: string;
}
