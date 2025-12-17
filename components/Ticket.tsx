
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';

interface TicketProps {
  name: string;
}

// Tree Icon Component
const TreeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 md:w-10 md:h-10 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15 8H9L12 2Z" fill="#FBBF24" />
    <path d="M12 4L16 12H8L12 4Z" fill="#10B981" />
    <path d="M12 9L18 17H6L12 9Z" fill="#059669" />
    <path d="M12 14L20 22H4L12 14Z" fill="#047857" />
    <circle cx="12" cy="3" r="1" fill="#FEF3C7" className="animate-pulse" />
    <circle cx="10" cy="10" r="0.8" fill="#EF4444" />
    <circle cx="14" cy="15" r="0.8" fill="#FBBF24" />
    <circle cx="9" cy="19" r="0.8" fill="#3B82F6" />
    <rect x="11" y="21" width="2" height="3" fill="#78350F" />
  </svg>
);

// Flexible Barcode Component
const Barcode: React.FC<{ vertical?: boolean; className?: string; color?: string }> = React.memo(({ vertical, className = "", color = "bg-slate-900" }) => {
  const bars = useMemo(() => {
    return Array.from({ length: 42 }).map((_, i) => ({
      width: Math.random() > 0.6 ? (vertical ? 'h-[3px]' : 'w-[3px]') : (vertical ? 'h-[1px]' : 'w-[1px]'),
    }));
  }, [vertical]);

  return (
    <div className={`flex ${vertical ? 'flex-col items-stretch justify-center gap-[2px] w-full' : 'flex-row items-end justify-start gap-[2px] h-full'} opacity-90 ${className}`}>
      {bars.map((bar, i) => (
        <div key={i} className={`${color} ${bar.width} ${vertical ? 'w-full' : 'h-full'} rounded-[0.5px]`}></div>
      ))}
    </div>
  );
});

const Ticket: React.FC<TicketProps> = ({ name }) => {
  const [isTorn, setIsTorn] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);
  
  const [isDownloading, setIsDownloading] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDownload = async () => {
    if (!captureRef.current || typeof window === 'undefined') return;
    setIsDownloading(true);
    try {
      // @ts-ignore
      const canvas = await window.html2canvas(captureRef.current, {
        backgroundColor: '#020617',
        scale: 2, 
        logging: false, 
        useCORS: true,
        allowTaint: true,
      });
      const link = document.createElement('a');
      link.download = `Christmas_Party_Ticket_${name.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) { console.error(error); } finally { setIsDownloading(false); }
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isTorn) setIsDragging(true);
  };

  const handleDragEnd = () => { 
    setIsDragging(false); 
    if (dragProgress < 95) setDragProgress(0); 
  };
  
  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging || !containerRef.current || isTorn) return;
    if (e.cancelable) e.preventDefault();

    const rect = containerRef.current.getBoundingClientRect();
    let progress = 0;
    
    const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;

    if (isMobile) {
        progress = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    } else {
        progress = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
    }
    setDragProgress(progress);
    
    if (progress >= 98) { 
        setIsDragging(false); 
        setIsTorn(true); 
    }
  }, [isDragging, isMobile, isTorn]);

  useEffect(() => {
    if (isDragging) {
        window.addEventListener('mousemove', handleDragMove); 
        window.addEventListener('touchmove', handleDragMove, { passive: false });
        window.addEventListener('mouseup', handleDragEnd); 
        window.addEventListener('touchend', handleDragEnd);
    } else {
        window.removeEventListener('mousemove', handleDragMove); 
        window.removeEventListener('touchmove', handleDragMove);
        window.removeEventListener('mouseup', handleDragEnd); 
        window.removeEventListener('touchend', handleDragEnd);
    }
    return () => {
        window.removeEventListener('mousemove', handleDragMove); 
        window.removeEventListener('touchmove', handleDragMove);
        window.removeEventListener('mouseup', handleDragEnd); 
        window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, handleDragMove]);

  return (
    <div className="flex flex-col items-center gap-6 md:gap-8 animate-fade-in-up w-full max-w-[95vw] md:max-w-6xl px-2 md:px-0 pb-16">
      
      {/* =======================
          INTERACTIVE TICKET (VISIBLE)
         ======================= */}
      <div 
        className={`relative flex w-full filter drop-shadow-[0_0_30px_rgba(234,179,8,0.3)] transition-all duration-500 ${isMobile ? 'flex-col items-center' : 'flex-row items-stretch'}`}
      >
        
        {/* MAIN TICKET BODY */}
        <div 
            className={`
                relative bg-slate-950/90 backdrop-blur-xl border-2 border-gold-500 overflow-hidden flex-shrink-0
                shadow-[0_0_20px_rgba(234,179,8,0.2),inset_0_0_40px_rgba(0,0,0,0.8)]
                ${isMobile 
                    ? 'w-full rounded-t-2xl border-b-0 min-h-[360px]' 
                    : 'flex-grow rounded-l-3xl border-r-0 pr-8 min-h-[380px]'}
                p-6 md:p-12 flex flex-col justify-between text-left
            `}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(234,179,8,0.15),transparent_70%)] pointer-events-none"></div>
            
            <div className="absolute top-4 right-4 md:top-8 md:right-8 pointer-events-none">
                 <div className="w-14 h-14 md:w-24 md:h-24 border-t-2 border-r-2 border-gold-400 rounded-tr-lg md:rounded-tr-3xl relative">
                    <div className="absolute top-1.5 right-1.5 md:top-4 md:right-4">
                        <TreeIcon />
                    </div>
                 </div>
            </div>

            <div className="relative z-10 flex flex-col h-full text-left">
                <div className="mb-4 md:mb-10">
                    <h2 className="font-script text-2xl md:text-5xl text-gold-400 mb-0.5 md:mb-2 transform -rotate-2 origin-bottom-left drop-shadow-md">
                        Kundasang Gang
                    </h2>
                    <h1 className="font-serif text-2xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-br from-gold-100 via-gold-300 to-gold-600 drop-shadow-sm uppercase tracking-wide">
                        Christmas Party
                    </h1>
                </div>

                <div className="flex flex-col items-start mb-auto w-full max-w-md">
                     <p className="text-[8px] md:text-[10px] text-gold-500/80 uppercase tracking-[0.2em] font-bold mb-1 md:mb-2">Guest Name</p>
                     <div className="font-serif text-3xl md:text-6xl text-white tracking-wide mb-1 md:mb-2 break-words w-full leading-tight">
                        {name || "Guest"}
                     </div>
                     <div className="w-full h-[1px] bg-gradient-to-r from-gold-500 to-transparent mb-2 md:mb-4"></div>
                     <p className="text-gold-400 font-sans text-[9px] md:text-[11px] tracking-[0.4em] uppercase font-bold">
                        Premium Invite
                     </p>
                </div>

                <div className="flex justify-between items-end mt-4 md:mt-8">
                    <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-16 text-xs md:text-sm font-sans w-full max-w-lg">
                        <div className="text-left">
                            <p className="text-gold-600 uppercase text-[7px] md:text-[9px] tracking-widest mb-0.5 font-bold">Date & Time</p>
                            <p className="font-bold text-white text-sm md:text-lg font-serif tracking-wide">DEC 24, 2025</p>
                            <p className="text-slate-400 text-[9px] md:text-xs tracking-wider">7:00 PM - LATE</p>
                        </div>
                        <div className="text-left">
                            <p className="text-gold-600 uppercase text-[7px] md:text-[9px] tracking-widest mb-0.5 font-bold">Location</p>
                            <p className="font-bold text-white text-[11px] md:text-base leading-tight font-serif">
                                KUNDASANG CABIN,<br/>SABAH
                            </p>
                        </div>
                    </div>

                    <div className="absolute right-0 bottom-0 mb-1 mr-[-5px] md:mr-[-10px] opacity-70">
                        <Barcode vertical={false} color="bg-slate-400" className="h-4 w-12 md:h-8 md:w-24" />
                        <p className="text-[5px] text-slate-500 font-mono text-right mt-0.5">ID: 8824-XMAS</p>
                    </div>
                </div>
            </div>
        </div>

        {/* CUTTING LINE & TOOLS */}
        <div 
            ref={containerRef}
            className={`
                relative z-30 flex items-center justify-center
                ${isMobile ? 'w-full h-10' : 'h-auto w-8'}
            `}
        >
            <div className={`absolute border-dashed border-white/30 ${isMobile ? 'w-full border-t-2 top-1/2 left-0' : 'h-full border-l-2 left-1/2 top-0'}`}></div>

            <div className={`absolute bg-slate-900 border border-gold-500/50 rounded-full z-10 w-4 h-4 md:w-5 md:h-5 ${isMobile ? '-left-2 top-1/2 -translate-y-1/2' : '-top-2.5 left-1/2 -translate-x-1/2'}`}></div>
            <div className={`absolute bg-slate-900 border border-gold-500/50 rounded-full z-10 w-4 h-4 md:w-5 md:h-5 ${isMobile ? '-right-2 top-1/2 -translate-y-1/2' : '-bottom-2.5 left-1/2 -translate-x-1/2'}`}></div>
            
            {!isTorn && (
                <div 
                    onMouseDown={handleDragStart} onTouchStart={handleDragStart}
                    className={`
                        absolute z-40 bg-gold-500 text-slate-900 rounded-full 
                        flex items-center justify-center font-bold text-lg shadow-[0_0_15px_rgba(234,179,8,0.8)]
                        cursor-grab active:cursor-grabbing hover:scale-110 hover:bg-white 
                        ${isMobile ? 'h-9 w-9 -translate-y-1/2 top-1/2' : 'w-9 h-9 -translate-x-1/2 left-1/2'}
                    `}
                    style={{ [isMobile ? 'left' : 'top']: `${dragProgress}%` }}
                >
                    <span className={`transform ${isMobile ? '-rotate-90' : 'rotate-180'} select-none`}>✂</span>
                </div>
            )}
        </div>

        {/* STUB SECTION */}
        <div 
            className={`
                relative bg-gold-500 flex-shrink-0
                flex items-center justify-center overflow-hidden shadow-xl
                transition-all duration-1000 ease-in-out border-2 border-gold-600
                ${isMobile 
                    ? `w-full h-24 rounded-b-2xl border-t-0 ${isTorn ? 'animate-tear-off-vertical' : ''}` 
                    : `w-44 rounded-r-3xl border-l-0 ${isTorn ? 'animate-tear-off-horizontal' : ''}`
                }
            `}
        >
            {!isTorn && !isDragging && !isMobile && (
                <div className="absolute top-1/2 -translate-y-1/2 -right-12 h-64 flex items-center justify-center pointer-events-none">
                     <span className="text-white/60 font-bold text-[10px] tracking-[0.3em] animate-pulse whitespace-nowrap" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                         SLIDE DOWN TO CUT
                     </span>
                </div>
            )}

            {!isTorn && !isDragging && isMobile && (
                 <div className="absolute left-1/2 -translate-x-1/2 top-1 w-full flex items-center justify-center pointer-events-none">
                    <span className="text-slate-900/40 font-bold text-[7px] tracking-[0.3em] animate-pulse">
                        SLIDE RIGHT TO CUT
                    </span>
                 </div>
            )}

            <div className={`relative z-10 flex ${isMobile ? 'flex-row' : 'flex-col'} h-full w-full p-4 md:p-6 justify-between items-center gap-4`}>
                <div className="flex-grow w-full flex items-center justify-center">
                     {/* For Mobile: Horizontal barcode fits better in the wide/short stub */}
                     <Barcode vertical={!isMobile} color="bg-slate-900" className={isMobile ? "h-12 w-32" : "w-full h-full"} />
                </div>
                <div className={`${isMobile ? 'w-auto' : 'mt-1 w-full'} text-center`}>
                    <span className="font-mono text-slate-900 font-bold text-[10px] md:text-sm tracking-[0.2em] whitespace-nowrap">
                        NO. 082492
                    </span>
                </div>
            </div>
        </div>
      </div>

      {/* =======================
          HIDDEN CAPTURE TICKET (STATIC & UNTORN)
         ======================= */}
      <div 
        ref={captureRef}
        style={{
             position: 'fixed',
             left: '-9999px', 
             top: 0,
             width: '900px', 
             display: 'flex',
             flexDirection: 'row',
             alignItems: 'stretch',
             padding: '40px',
             background: '#020617',
             zIndex: -100,
             opacity: 1
        }}
      >
        <div 
            style={{
                background: '#020617',
                border: '2px solid #EAB308',
                borderRadius: '24px 0 0 24px',
                borderRight: '0',
                padding: '48px',
                minHeight: '400px',
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <div style={{ position: 'absolute', top: '32px', right: '32px' }}>
                 <div style={{ width: '96px', height: '96px', borderTop: '2px solid #FACC15', borderRight: '2px solid #FACC15', borderRadius: '0 24px 0 0' }}>
                    <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                        <TreeIcon />
                    </div>
                 </div>
            </div>
            <div>
                <h2 style={{ fontFamily: 'Great Vibes', fontSize: '48px', color: '#FACC15', marginBottom: '8px', transform: 'rotate(-2deg)' }}>Kundasang Gang</h2>
                <h1 style={{ fontFamily: 'Cinzel', fontSize: '64px', color: '#FACC15', textTransform: 'uppercase', letterSpacing: '2px' }}>Christmas Party</h1>
            </div>
            <div style={{ marginTop: '20px' }}>
                 <p style={{ fontSize: '12px', color: '#CA8A04', textTransform: 'uppercase', letterSpacing: '4px', fontWeight: 'bold' }}>Guest Name</p>
                 <div style={{ fontFamily: 'Cinzel', fontSize: '64px', color: 'white', marginBottom: '8px' }}>{name || "Guest"}</div>
                 <div style={{ width: '100%', height: '2px', background: 'linear-gradient(to right, #EAB308, transparent)', marginBottom: '16px' }}></div>
                 <p style={{ fontSize: '14px', color: '#FACC15', letterSpacing: '6px', textTransform: 'uppercase', fontWeight: 'bold' }}>Premium Invite</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '32px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px' }}>
                    <div>
                        <p style={{ color: '#A16207', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>Date & Time</p>
                        <p style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>DEC 24, 2025</p>
                        <p style={{ color: '#94a3b8', fontSize: '12px' }}>7:00 PM - LATE</p>
                    </div>
                    <div>
                        <p style={{ color: '#A16207', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>Location</p>
                        <p style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>KUNDASANG CABIN, SABAH</p>
                    </div>
                </div>
                <div style={{ opacity: 0.7 }}>
                    <Barcode vertical={false} color="bg-slate-400" className="h-8 w-24" />
                    <p style={{ fontSize: '8px', color: '#64748b', textAlign: 'right', marginTop: '4px' }}>ID: 8824-XMAS</p>
                </div>
            </div>
        </div>

        <div style={{ width: '32px', borderLeft: '2px dashed rgba(255,255,255,0.3)', position: 'relative' }}>
             <div style={{ position: 'absolute', top: '-10px', left: '-10px', width: '20px', height: '20px', background: '#020617', border: '1px solid rgba(234,179,8,0.5)', borderRadius: '50%' }}></div>
             <div style={{ position: 'absolute', bottom: '-10px', left: '-10px', width: '20px', height: '20px', background: '#020617', border: '1px solid rgba(234,179,8,0.5)', borderRadius: '50%' }}></div>
        </div>

        <div style={{ width: '180px', background: '#EAB308', borderRadius: '0 24px 24px 0', border: '2px solid #CA8A04', borderLeft: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '32px' }}>
            <div style={{ flexGrow: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <Barcode vertical={true} color="bg-slate-900" className="w-full h-full" />
            </div>
            <div style={{ marginTop: '8px', textAlign: 'center' }}>
                 <span style={{ fontFamily: 'monospace', fontSize: '16px', fontWeight: 'bold', color: '#0f172a' }}>NO. 082492</span>
            </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className={`flex flex-col items-center gap-4 transition-all duration-700 ease-in-out z-50 w-full max-w-sm md:max-w-none ${isTorn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="
            group flex items-center gap-3 px-8 py-3.5 md:px-10 md:py-4
            bg-gold-500 rounded-full shadow-[0_0_30px_rgba(234,179,8,0.4)]
            text-slate-900 font-serif tracking-widest text-[11px] md:text-sm font-bold
            hover:bg-white hover:scale-105 transition-all active:scale-95
            w-full md:w-auto justify-center
          "
        >
          {isDownloading ? (
            <span>SAVING...</span>
          ) : (
            <>
              <span>SAVE TICKET</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </>
          )}
        </button>

        <a 
          href="https://forms.gle/YKKLTfqsj9sWJXbcA"
          target="_blank"
          rel="noopener noreferrer"
          className="
            group flex items-center gap-3 px-8 py-3.5 md:px-10 md:py-4
            bg-emerald-600 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.4)]
            text-white font-serif tracking-widest text-[11px] md:text-sm font-bold
            hover:bg-emerald-500 hover:scale-105 transition-all active:scale-95
            border border-emerald-400/30
            w-full md:w-auto justify-center
          "
        >
          <span>GOOGLE FORM WITH FRIENDS</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
        </a>
      </div>
    </div>
  );
};

export default Ticket;
