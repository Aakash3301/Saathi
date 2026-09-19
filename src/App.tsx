import React, { useState } from 'react';
import { Header } from './components/Header';
import { PageContainer } from './components/PageContainer';
import { HomeDashboardView } from './components/HomeDashboardView';
import { ExplainThisView } from './components/ExplainThisView';
import { IsThisSafeView } from './components/IsThisSafeView';
import { HelpMeDoThisView } from './components/HelpMeDoThisView';
import { MyDayView } from './components/MyDayView';
import { AudioBar } from './components/AudioBar';
import { TalkToSaathiModal } from './components/TalkToSaathiModal';
import { EmergencyHelpModal } from './components/EmergencyHelpModal';
import { useTextToSpeech } from './hooks/useTextToSpeech';
import { ScreenId, FontSizeMode } from './types';
import { Heart, PhoneCall, ShieldCheck } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [fontSize, setFontSize] = useState<FontSizeMode>('normal');
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);

  const {
    isSpeaking,
    isPaused,
    speed,
    setSpeed,
    currentText,
    speak,
    pause,
    resume,
    stop,
  } = useTextToSpeech();

  const handleNavigate = (screen: ScreenId) => {
    stop();
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSpeed = () => {
    setSpeed(speed === 'slow' ? 'normal' : 'slow');
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'extralarge':
        return 'text-xl sm:text-2xl leading-relaxed';
      case 'large':
        return 'text-lg sm:text-xl leading-relaxed';
      case 'normal':
      default:
        return 'text-base sm:text-lg leading-normal';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-stone-50 text-stone-900 ${getFontSizeClass()}`}>
      {/* Header with Saathi logo, "Your Digital Companion", Emergency & Settings */}
      <Header
        fontSize={fontSize}
        setFontSize={setFontSize}
        speechSpeed={speed}
        setSpeechSpeed={setSpeed}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        onGoHome={() => handleNavigate('home')}
      />

      {/* Main Page Container */}
      <main className="flex-1">
        <PageContainer maxWidth="xl">
          {/* Screen 1: Home Dashboard */}
          {currentScreen === 'home' && (
            <HomeDashboardView
              onNavigate={handleNavigate}
              onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
            />
          )}

          {/* Screen 2: Explain This */}
          {currentScreen === 'explain' && (
            <ExplainThisView
              onBack={() => handleNavigate('home')}
              onSpeak={speak}
              onStopSpeak={stop}
              isSpeaking={isSpeaking}
            />
          )}

          {/* Screen 3: Is This Safe? */}
          {currentScreen === 'safety' && (
            <IsThisSafeView
              onBack={() => handleNavigate('home')}
              onSpeak={speak}
              onStopSpeak={stop}
              isSpeaking={isSpeaking}
              onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
            />
          )}

          {/* Screen 4: Help Me Do This */}
          {currentScreen === 'guide' && (
            <HelpMeDoThisView
              onBack={() => handleNavigate('home')}
              onSpeak={speak}
              onStopSpeak={stop}
              isSpeaking={isSpeaking}
            />
          )}

          {/* Screen 5: My Day */}
          {currentScreen === 'myday' && (
            <MyDayView
              onBack={() => handleNavigate('home')}
              onSpeak={speak}
              onStopSpeak={stop}
              isSpeaking={isSpeaking}
            />
          )}
        </PageContainer>
      </main>

      {/* Floating Audio Bar during active Text-to-Speech */}
      <AudioBar
        isSpeaking={isSpeaking}
        isPaused={isPaused}
        speed={speed}
        onPause={pause}
        onResume={resume}
        onStop={stop}
        onToggleSpeed={handleToggleSpeed}
        textSnippet={currentText}
      />

      {/* Voice Assistant Modal */}
      <TalkToSaathiModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSpeak={speak}
        onStopSpeak={stop}
        isSpeaking={isSpeaking}
      />

      {/* Emergency Fraud Help Modal */}
      <EmergencyHelpModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        onSpeak={speak}
        isSpeaking={isSpeaking}
      />

      {/* Senior-Friendly Footer */}
      <footer className="mt-16 border-t-2 border-stone-200 bg-stone-100/80 py-8 text-stone-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2.5 font-bold text-stone-800 text-base sm:text-lg">
            <Heart className="w-5 h-5 text-rose-500 fill-current" />
            <span>Saathi — Your Patient Digital Companion</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-sm sm:text-base font-semibold">
            <button
              type="button"
              onClick={() => setIsEmergencyModalOpen(true)}
              className="text-rose-700 hover:text-rose-900 font-extrabold underline flex items-center gap-1.5 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Cyber Helpline 1930</span>
            </button>
            <span className="text-stone-300">•</span>
            <span className="flex items-center gap-1 text-emerald-800 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Private & Safe</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
