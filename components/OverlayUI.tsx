
import React, { useState } from 'react';
import { AppState } from '../types';
import Ticket from './Ticket';
import { MEMORY_LANE } from '../constants';

interface OverlayUIProps {
  appState: AppState;
  onJoin: () => void;
  onSubmitName: (name: string) => void;
  onShowGiftExchange: () => void;
  onGrabTicket: () => void;
  onRegister?: () => void;
  userName: string;
  currentSlideIndex?: number;
}

const ItineraryItem = ({ time, title, desc, icon }: { time: string, title: string, desc: string, icon: React.ReactNode }) => (
  <div className="flex gap-4 items-start relative pb-6 last:pb-0">
    {/* Time Column */}
    <div className="min-w-[70px] text-right pt-0.5">
      <span className="text-gold-500 font-serif text-[10px] md:text-xs font-bold tracking-wider block">{time}</span>
    </div>

    {/* Timeline Line & Dot */}
    <div className="relative flex flex-col items-center">
        <div className="w-3 h-3 rounded-full bg-slate-900 border border-gold-500 shadow-[0_0_8px_rgba(234,179,8,0.5)] z-10"></div>
        <div className="absolute top-3 w-[1px] h-full bg-gradient-to-b from-gold-500/50 to-transparent -z-0"></div>
    </div>

    {/* Content Column */}
    <div className="flex-1 pt-0">
       <h3 className="text-white font-bold text-sm tracking-wide flex items-center gap-2">
         {title}
       </h3>
       <p className="text-slate-400 text-xs mt-1 leading-relaxed opacity-80 font-light">{desc}</p>
    </div>
  </div>
);

const OverlayUI: React.FC<OverlayUIProps> = ({ appState, onJoin, onSubmitName, onShowGiftExchange, onGrabTicket, onRegister, userName, currentSlideIndex = -1 }) => {
  const [inputValue, setInputValue] = useState('');

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim().length > 0) {
      onSubmitName(inputValue);
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-center items-center z-10 p-0 md:p-4">
      {/* Background Gradient Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.8)_100%)]"></div>

      {/* SEQUENCE OVERLAY (CAPTION ONLY) */}
      {appState === 'SEQUENCE' && currentSlideIndex !== -1 && (
        <div key={currentSlideIndex} className="absolute bottom-16 md:bottom-24 z-50 flex flex-col items-center justify-center w-full px-6 animate-fade-in-up">
             <p className="text-gold-300 font-serif text-xl md:text-3xl text-center italic tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,1)] text-shadow-lg max-w-4xl leading-relaxed">
                "{MEMORY_LANE[currentSlideIndex].text}"
             </p>
        </div>
      )}

      {/* Main Container - Adjusted width for different states */}
      <div className={`relative z-20 w-full text-center pointer-events-auto transition-all duration-500 
        ${appState === 'TICKET' ? 'max-w-6xl h-full flex flex-col' : ''}
        ${appState === 'ITINERARY' ? 'max-w-xl' : ''}
        ${appState === 'GIFT_EXCHANGE' ? 'max-w-xl' : 'max-w-2xl'}
      `}>
        
        {/* INITIAL STATE: Titles and Button */}
        {appState === 'SCATTERED' && (
          <div className="flex flex-col items-center gap-8 animate-fade-in px-4">
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

        {/* REGISTER STATE: Final message after formation */}
        {appState === 'REGISTER' && (
             <div className="flex flex-col items-center gap-4 animate-fade-in-up max-w-4xl px-6 text-center mt-20">
                
                <p className="font-serif text-gold-500 text-[10px] md:text-sm tracking-[0.4em] uppercase font-bold mb-2 z-10">
                    Welcome to
                </p>

                <h2 className="font-serif text-white text-3xl md:text-5xl tracking-widest uppercase drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] z-10">
                    Kundasang Gang
                </h2>

                <h1 className="font-script text-5xl md:text-8xl text-gold-400 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)] -mt-4 py-4 leading-normal z-20">
                    Christmas Party
                </h1>

                <button
                    onClick={onRegister}
                    className="
                        group relative px-12 py-3 md:px-16 md:py-4 mt-6
                        bg-gold-500 text-slate-900 rounded-lg
                        font-serif tracking-[0.2em] font-bold text-xs md:text-sm
                        hover:bg-white hover:scale-105 transition-all duration-300
                        shadow-[0_0_40px_rgba(234,179,8,0.4)] z-30
                    "
                >
                    REGISTER NOW
                </button>
             </div>
        )}

        {/* INPUT STATE: Name Entry */}
        {appState === 'INPUT' && (
          <div className="animate-fade-in-up backdrop-blur-sm bg-slate-900/60 p-8 rounded-2xl border border-white/10 shadow-2xl mx-auto max-w-lg mx-4">
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

        {/* ITINERARY STATE */}
        {appState === 'ITINERARY' && (
          <div className="animate-fade-in-up backdrop-blur-md bg-slate-950/80 p-6 md:p-8 rounded-2xl border border-gold-500/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] mx-4 md:mx-auto w-auto md:w-full text-left relative overflow-hidden max-h-[85vh] overflow-y-auto no-scrollbar">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col h-full">
                <div className="text-center mb-6">
                    <h2 className="font-serif text-gold-400 text-[10px] tracking-[0.3em] uppercase mb-1">24th - 25th December</h2>
                    <h1 className="font-script text-4xl text-white drop-shadow-md">
                      The Gathering Plan
                    </h1>
                </div>

                <div className="space-y-1 mb-8">
                    <ItineraryItem time="12:00 PM" title="Arrival & Lunch" desc="Meet up and enjoy a hearty lunch together." icon={null} />
                    <ItineraryItem time="02:00 PM" title="Check-In" desc="Head to the Kundasang Airbnb & settle in." icon={null} />
                    <ItineraryItem time="04:00 PM" title="Setup & Decor" desc="Decorate the cabin, prep dinner, & set up the gift area." icon={null} />
                    <ItineraryItem time="07:00 PM" title="The Feast" desc="BBQ or Steamboat dinner under the cool mountain air." icon={null} />
                    <ItineraryItem time="09:00 PM" title="Gift Exchange" desc="Unwrap surprises! Who is your Secret Santa?" icon={null} />
                    <ItineraryItem time="10:00 PM" title="Games & Social" desc="Group games, chit-chat, and good vibes." icon={null} />
                    <ItineraryItem time="Late" title="Cheers & Chill" desc="End the night with soda, drinks, and cozy conversations." icon={null} />
                </div>

                <div className="flex justify-center mt-auto pb-2">
                    <button 
                        onClick={onShowGiftExchange}
                        className="
                            group relative px-8 py-3 w-full md:w-auto
                            bg-gold-500 text-slate-900 rounded-full
                            font-serif tracking-[0.2em] font-bold text-xs
                            hover:bg-white hover:scale-105 transition-all duration-300
                            shadow-[0_0_20px_rgba(234,179,8,0.4)]
                            flex items-center justify-center gap-2
                        "
                    >
                        <span>NEXT: GIFT EXCHANGE</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </button>
                </div>
            </div>
          </div>
        )}

        {/* GIFT EXCHANGE STATE */}
        {appState === 'GIFT_EXCHANGE' && (
             <div className="animate-fade-in-up backdrop-blur-xl bg-slate-950/70 p-6 md:p-10 rounded-3xl border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] mx-4 md:mx-auto w-auto md:w-full max-w-lg text-center relative overflow-hidden">
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-gold-500/10 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-[60px] pointer-events-none"></div>

                <div className="relative z-10 flex flex-col h-full items-center">
                    <div className="text-center mb-6 md:mb-8">
                        <h2 className="font-serif text-gold-500 text-[10px] tracking-[0.4em] uppercase font-bold mb-2">Secret Santa</h2>
                        <h1 className="font-serif text-3xl md:text-4xl text-white tracking-widest uppercase drop-shadow-xl border-b pb-4 border-white/10">
                            The Rules
                        </h1>
                    </div>

                    <div className="w-full space-y-3 md:y-4 mb-6 md:mb-8">
                        <div className="group bg-gradient-to-br from-slate-900/80 to-slate-800/50 p-4 md:p-5 rounded-xl border border-white/10 hover:border-gold-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(234,179,8,0.1)] flex items-center gap-4">
                            <div className="h-9 w-9 md:h-10 md:w-10 min-w-[2.25rem] rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400 group-hover:bg-gold-500 group-hover:text-slate-900 transition-colors duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <h3 className="text-slate-400 font-serif text-[9px] md:text-[10px] tracking-widest uppercase mb-0.5">Gift Value</h3>
                                <p className="text-white font-medium text-xs md:text-base">Around <span className="text-gold-400 font-bold">RM30 - RM40</span></p>
                            </div>
                        </div>

                         <div className="group bg-gradient-to-br from-slate-900/80 to-slate-800/50 p-4 md:p-5 rounded-xl border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)] flex items-center gap-4">
                            <div className="h-9 w-9 md:h-10 md:w-10 min-w-[2.25rem] rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <h3 className="text-slate-400 font-serif text-[9px] md:text-[10px] tracking-widest uppercase mb-0.5">The Tease</h3>
                                <p className="text-white font-medium text-xs md:text-base leading-tight">Describe your gift to the group. <span className="italic text-purple-200">Let them guess!</span></p>
                            </div>
                        </div>

                        <div className="group bg-gradient-to-br from-slate-900/80 to-slate-800/50 p-4 md:p-5 rounded-xl border border-white/10 hover:border-emerald-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] flex items-center gap-4">
                            <div className="h-9 w-9 md:h-10 md:w-10 min-w-[2.25rem] rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <h3 className="text-slate-400 font-serif text-[9px] md:text-[10px] tracking-widest uppercase mb-0.5">The Exchange</h3>
                                <p className="text-white font-medium text-xs md:text-base">Draw a number. Reveal your gift.</p>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={onGrabTicket}
                        className="
                            group relative px-10 py-4 w-full md:w-auto
                            bg-white text-slate-950 rounded-full
                            font-serif tracking-[0.2em] font-bold text-xs
                            hover:bg-gold-500 hover:scale-105 transition-all duration-500
                            shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)]
                            flex items-center justify-center gap-3
                        "
                    >
                        <span>GET YOUR TICKET</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
                    </button>
                </div>
             </div>
        )}

        {/* TICKET STATE: Final Result */}
        {appState === 'TICKET' && (
          <div className="flex justify-center w-full h-full items-start md:items-center overflow-y-auto no-scrollbar py-12 md:py-8">
            <Ticket name={userName} />
          </div>
        )}
      </div>

      {/* Footer Branding */}
      {appState !== 'TICKET' && appState !== 'ITINERARY' && appState !== 'SEQUENCE' && appState !== 'GIFT_EXCHANGE' && (
        <div className="absolute bottom-8 text-slate-500 font-serif text-xs tracking-[0.2em] opacity-60">
          DECEMBER 24 • 2025
        </div>
      )}
    </div>
  );
};

export default OverlayUI;
