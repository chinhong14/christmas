import React, { useState, useCallback } from 'react';
import Experience from './components/Experience';
import OverlayUI from './components/OverlayUI';
import { AppState } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('SCATTERED');
  const [userName, setUserName] = useState('');

  const handleJoin = useCallback(() => {
    setAppState('FORMING');
    // The 3D component will trigger the next state once animation completes
  }, []);

  const handleTreeFormed = useCallback(() => {
    // Slight delay after tree forms before showing input for dramatic effect
    setTimeout(() => {
      setAppState('INPUT');
    }, 1000);
  }, []);

  const handleSubmitName = useCallback((name: string) => {
    setUserName(name);
    setAppState('TICKET');
  }, []);

  return (
    <div className="relative w-full h-full bg-slate-950">
      {/* 3D Canvas Layer */}
      <div className="absolute inset-0 z-0">
        <Experience 
          appState={appState} 
          onTreeFormed={handleTreeFormed} 
        />
      </div>

      {/* HTML UI Layer */}
      <OverlayUI 
        appState={appState} 
        onJoin={handleJoin} 
        onSubmitName={handleSubmitName}
        userName={userName}
      />
    </div>
  );
};

export default App;
