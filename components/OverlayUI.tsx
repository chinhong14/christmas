import React, { useState } from 'react';
import { AppState } from '../types';
import Ticket from './Ticket';

interface OverlayUIProps {
  appState: AppState;
  onJoin: () => void;
  onSubmitName: (name: string) => void;
  userName: string;
}

const OverlayUI: React.FC<OverlayUIProps> = ({ appState, onJoin, onSubmitName, userName }) => {
  const [inputValue, setInputValue] = useState('');

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim().length > 0) {
      onSubmitName(inputValue);
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-center items-center z-10 p-4">
      {/* Background Gradient Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.8)_100%)]"></div>

      {/* Main Container - Adjusted width for Ticket state */}
      <div className={`relative z-20 w-full text-center pointer-events-auto transition-all duration-500 ${appState === 'TICKET' ? 'max-w-5xl h-full flex flex-col justify-center' : 'max-w-2xl'}`}>
        
        {/* INITIAL STATE: Titles and Button */}
        {appState === 'SCATTERED' && (
          <div className="flex flex-col items-center gap-8 animate-fade-in">
            <div className="space-y-2">
              <h2 className="font-serif text-gold-400 text-xl md:text-2xl tracking-[0.3em] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Kundasang Gang
              </h2>
              <h1 className="font-script text-6xl md:text-8xl text-white drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                Christmas Party
              </h1>
            </div>

            <button
              onClick={onJoin}
              className="
                group relative px-12 py-4 mt-8
                bg-transparent overflow-hidden rounded-full
                border border-gold-500 text-gold-400
                font-serif tracking-widest font-bold text-lg
                transition-all duration-500 ease-out
                hover:text-white hover:border-white hover:shadow-[0_0_30px_rgba(234,179,8,0.6)]
              "
            >
              <span className="relative z-10">JOIN</span>
              <div className="absolute inset-0 h-full w-full scale-0 rounded-full transition-all duration-300 group-hover:scale-100 group-hover:bg-gold-500/20"></div>
            </button>
          </div>
        )}

        {/* INPUT STATE: Name Entry */}
        {appState === 'INPUT' && (
          <div className="animate-fade-in-up backdrop-blur-sm bg-slate-900/60 p-8 rounded-2xl border border-white/10 shadow-2xl mx-auto max-w-lg">
            <h2 className="font-serif text-white text-2xl mb-6 tracking-wide">Enter Your Name</h2>
            <form onSubmit={handleNameSubmit} className="flex flex-col gap-4">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Santa's Favorite..."
                autoFocus
                className="
                  w-full bg-slate-800/50 border-b-2 border-gold-500/50 
                  text-center text-2xl text-white font-sans py-3 focus:outline-none focus:border-gold-400
                  placeholder:text-slate-500
                "
              />
              <button 
                type="submit"
                disabled={!inputValue.trim()}
                className="
                  mt-4 bg-emerald-700 hover:bg-emerald-600 
                  text-white font-serif tracking-widest py-3 px-8 rounded 
                  transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                  shadow-[0_0_15px_rgba(6,78,59,0.5)]
                "
              >
                CONFIRM
              </button>
            </form>
          </div>
        )}

        {/* TICKET STATE: Final Result */}
        {appState === 'TICKET' && (
          <div className="flex justify-center w-full h-full items-center overflow-hidden">
            <Ticket name={userName} />
          </div>
        )}
      </div>

      {/* Footer Branding - Always visible unless Ticket */}
      {appState !== 'TICKET' && (
        <div className="absolute bottom-8 text-slate-500 font-serif text-xs tracking-[0.2em] opacity-60">
          DECEMBER 24 • 2025
        </div>
      )}
    </div>
  );
};

export default OverlayUI;