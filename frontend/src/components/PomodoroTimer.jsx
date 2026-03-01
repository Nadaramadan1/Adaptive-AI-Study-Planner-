import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import { storage } from '../utils/storage';

const PomodoroTimer = () => {
  const [session, setSession] = useState(() => storage.getPomodoro() || {
    startTime: null,
    duration: 25 * 60,
    mode: 'focus',
    isActive: false,
    id: Date.now()
  });

  const [timeLeft, setTimeLeft] = useState(session?.duration || 25 * 60);
  const [isActive, setIsActive] = useState(session?.isActive || false);
  const [mode, setMode] = useState(session?.mode || 'focus');
  const [customDuration, setCustomDuration] = useState({ focus: 25, break: 5 });

  const tips = [
    "Take a deep breath and relax your shoulders.",
    "Drink some water, hydration boosts focus!",
    "Success is the sum of small efforts repeated daily.",
    "Blink your eyes and look away from the screen.",
    "You're doing great, keep that momentum!"
  ];
  const [currentTip, setCurrentTip] = useState(tips[0]);

  useEffect(() => {
    if (session) {
        storage.setPomodoro({ ...session, isActive, mode, duration: timeLeft });
    }
  }, [isActive, mode, timeLeft]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      handleComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const speak = (text) => {
    const msg = new SpeechSynthesisUtterance(text);
    msg.pitch = 1.1;
    msg.rate = 1;
    window.speechSynthesis.speak(msg);
  };

  const handleComplete = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play();
    
    if (mode === 'focus') {
        speak("Great job. Take a 5 minute mindful break.");
        setMode('break');
        setTimeLeft(customDuration.break * 60);
    } else {
        speak("Welcome back. Let's continue building your future.");
        setMode('focus');
        setTimeLeft(customDuration.focus * 60);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? 25*60 : 5*60);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '1rem' }}>
        <button 
          className={`btn ${mode === 'focus' ? 'btn-primary' : 'btn-ghost'}`} 
          onClick={() => { setMode('focus'); setTimeLeft(25*60); setIsActive(false); }}
        >
          <Brain size={16} /> Focus
        </button>
        <button 
          className={`btn ${mode === 'break' ? 'btn-primary' : 'btn-ghost'}`} 
          onClick={() => { setMode('break'); setTimeLeft(5*60); setIsActive(false); }}
        >
          <Coffee size={16} /> Break
        </button>
      </div>

      <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto 2rem' }}>
        <svg width="200" height="200" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="var(--border)" strokeWidth="5" />
            <circle 
                cx="50" cy="50" r="45" fill="none" 
                stroke="var(--primary)" strokeWidth="5" 
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * timeLeft) / (mode === 'focus' ? customDuration.focus * 60 : customDuration.break * 60)}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
        </svg>
        <div style={{ 
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            fontSize: '3rem', fontWeight: '800'
        }}>
            {formatTime(timeLeft)}
        </div>
      </div>
      
      <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '1.5rem', minHeight: '3rem' }}>
        "{currentTip}"
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
        <button className="btn btn-primary" onClick={toggleTimer} style={{ padding: '12px 30px' }}>
          {isActive ? <Pause size={20} /> : <Play size={20} />} {isActive ? 'Pause' : 'Start'}
        </button>
        <button className="btn btn-ghost" onClick={resetTimer}>
          <RotateCcw size={20} />
        </button>
      </div>
    </div>
  );
};

export default PomodoroTimer;
