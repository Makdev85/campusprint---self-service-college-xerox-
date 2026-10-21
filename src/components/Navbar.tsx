import React from 'react';
import { usePrintKiosk } from '../context/PrintKioskContext';
import {
  Volume2,
  VolumeX,
  MapPin,
  Printer,
  RotateCcw,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentStep,
    goToStep,
    soundOn,
    toggleSound,
    selectedCollege,
    selectedKiosk,
    resetToStart,
  } = usePrintKiosk();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => goToStep(1)}
              className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 cursor-pointer flex items-center gap-1.5"
            >
              <span>Campus</span>
              <span className="text-[#c84815]">Xerox</span>
            </button>

            {/* Current Active Location tag */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
              <MapPin className="w-3.5 h-3.5 text-[#c84815] shrink-0" />
              <span className="font-bold truncate max-w-[130px]">{selectedCollege.shortCode}</span>
              <span>·</span>
              <span className="truncate max-w-[120px]">{selectedKiosk.name.split(' - ')[0]}</span>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2">
            {currentStep > 1 && (
              <button
                onClick={resetToStart}
                className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-950 px-2.5 py-1.5 rounded-md hover:bg-slate-100 border border-slate-200 cursor-pointer transition-colors"
                title="Start from Step 1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Start Over</span>
              </button>
            )}

            <button
              onClick={toggleSound}
              title={soundOn ? 'Sound On' : 'Sound Muted'}
              aria-label="Toggle Sound"
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md border border-slate-200 cursor-pointer"
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-[#c84815]" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
