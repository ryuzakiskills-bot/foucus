import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain, Settings } from 'lucide-react';
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
  const strokeDasharray = 2 * Math.PI * 120;
  const strokeDashoffset = strokeDasharray * (progress / 100);

  return (
    <div className="glass-card p-12 flex flex-col items-center justify-center gap-8 relative overflow-hidden group min-h-[500px]">
      {/* Background Glow */}
      <div className={cn(
        "absolute inset-0 opacity-10 transition-colors duration-1000",
        mode === 'work' ? "bg-brand-500" : "bg-emerald-500"
      )} />
      
      <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/10 relative z-10">
        <button
          onClick={() => { setMode('work'); resetTimer(); }}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
            mode === 'work' ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20" : "text-slate-400 hover:text-white"
          )}
        >
          <Brain className="w-4 h-4" />
          Focus
        </button>
        <button
          onClick={() => { setMode('break'); resetTimer(); }}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
            mode === 'break' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-slate-400 hover:text-white"
          )}
        >
          <Coffee className="w-4 h-4" />
          Break
        </button>
      </div>

      {/* Circular Progress */}
      <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90 transform">
          {/* Background Circle */}
          <circle
            cx="50%"
            cy="50%"
            r="120"
            className="stroke-white/5 fill-none"
            strokeWidth="8"
          />
          {/* Progress Circle */}
          <motion.circle
            cx="50%"
            cy="50%"
            r="120"
            className={cn(
              "fill-none transition-colors duration-1000",
              mode === 'work' ? "stroke-brand-500" : "stroke-emerald-500"
            )}
            strokeWidth="8"
            strokeLinecap="round"
            initial={{ strokeDashoffset: strokeDasharray }}
            animate={{ strokeDashoffset: strokeDashoffset }}
            strokeDasharray={strokeDasharray}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <motion.div 
            key={timeLeft}
            initial={{ scale: 0.95, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-6xl md:text-7xl font-mono font-bold tracking-tighter text-white drop-shadow-2xl"
          >
            {formatTime(timeLeft)}
          </motion.div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
            {mode === 'work' ? 'Deep Work' : 'Resting'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6 relative z-10">
        <button
          onClick={resetTimer}
          className="w-14 h-14 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all group/reset"
        >
          <RotateCcw className="w-5 h-5 text-slate-400 group-hover/reset:rotate-[-45deg] transition-transform" />
        </button>
        
        <button
          onClick={toggleTimer}
          className={cn(
            "w-20 h-20 rounded-3xl flex items-center justify-center transition-all shadow-2xl group/play",
            mode === 'work' ? "bg-brand-500 hover:bg-brand-600 shadow-brand-500/40" : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/40"
          )}
        >
          {isActive ? (
            <Pause className="w-8 h-8 fill-white text-white" />
          ) : (
            <Play className="w-8 h-8 fill-white text-white ml-1 group-hover/play:scale-110 transition-transform" />
          )}
        </button>

        <button className="w-14 h-14 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all">
          <Settings className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-slate-200 text-sm font-bold tracking-tight">
          {mode === 'work' ? "Stay focused, you're doing great." : "Relax and recharge."}
        </p>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={cn(
              "w-1.5 h-1.5 rounded-full",
              i <= 2 ? "bg-brand-500" : "bg-white/10"
            )} />
          ))}
          <span className="text-[10px] text-slate-500 font-bold ml-2 uppercase tracking-widest">Session 2/4</span>
        </div>
      </div>
    </div>
  );
}
