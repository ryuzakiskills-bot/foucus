import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface TimerProps {
  onSessionComplete?: (type: 'work' | 'break', duration: number) => void;
}

export default function Timer({ onSessionComplete }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  }, [mode]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      onSessionComplete?.(mode, mode === 'work' ? 25 : 5);
      // Auto switch mode
      const nextMode = mode === 'work' ? 'break' : 'work';
      setMode(nextMode);
      setTimeLeft(nextMode === 'work' ? 25 * 60 : 5 * 60);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, onSessionComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / (mode === 'work' ? 25 * 60 : 5 * 60)) * 100;

  return (
    <div className="glass-card p-8 flex flex-col items-center justify-center gap-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 h-1 bg-brand-500 transition-all duration-1000" style={{ width: `${100 - progress}%` }} />
      
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => { setMode('work'); resetTimer(); }}
          className={cn(
            "glass-button",
            mode === 'work' && "bg-brand-500/20 border-brand-500/50 text-brand-400"
          )}
        >
          <Brain className="w-4 h-4" />
          Focus
        </button>
        <button
          onClick={() => { setMode('break'); resetTimer(); }}
          className={cn(
            "glass-button",
            mode === 'break' && "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
          )}
        >
          <Coffee className="w-4 h-4" />
          Break
        </button>
      </div>

      <motion.div 
        key={timeLeft}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-6xl md:text-8xl font-mono font-bold tracking-tighter"
      >
        {formatTime(timeLeft)}
      </motion.div>

      <div className="flex gap-4">
        <button
          onClick={toggleTimer}
          className="w-16 h-16 rounded-full bg-brand-500 hover:bg-brand-600 flex items-center justify-center transition-all shadow-lg shadow-brand-500/20"
        >
          {isActive ? <Pause className="fill-white" /> : <Play className="fill-white ml-1" />}
        </button>
        <button
          onClick={resetTimer}
          className="w-16 h-16 rounded-full glass-button flex items-center justify-center"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>

      <p className="text-slate-400 text-sm font-medium">
        {mode === 'work' ? "Time to focus on your goals" : "Take a well-deserved break"}
      </p>
    </div>
  );
}
