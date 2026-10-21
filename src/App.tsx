import React from 'react';
import { PrintKioskProvider } from './context/PrintKioskContext';
import { Navbar } from './components/Navbar';
import { LinearXeroxWorkflow } from './components/LinearXeroxWorkflow';

export default function App() {
  return (
    <PrintKioskProvider>
      <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
        <Navbar />

        <main className="flex-1">
          <LinearXeroxWorkflow />
        </main>

        <footer className="border-t border-slate-200 bg-slate-50 py-6 text-xs text-slate-600 mt-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-900">Campus Xerox</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>Direct Self-Service College Printing</span>
            </div>
            <div className="flex items-center gap-4 font-bold text-slate-700">
              <span>Up to 8 Files</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>₹1.50/Page</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-[#c84815]">Instant UPI</span>
            </div>
          </div>
        </footer>
      </div>
    </PrintKioskProvider>
  );
}
