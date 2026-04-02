import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain, Settings, Plus, Minus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface TimerProps {
  onSessionComplete?: (type: 'work' | 'break', duration: number) => void;
}

export default function Timer({ onSessionComplete }: TimerProps) {
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(workDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [showSettings, setShowSettings] = useState(false);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? workDuration * 60 : breakDuration * 60);
  }, [mode, workDuration, breakDuration]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      onSessionComplete?.(mode, mode === 'work' ? workDuration : breakDuration);
      // Auto switch mode
      const nextMode = mode === 'work' ? 'break' : 'work';
      setMode(nextMode);
      setTimeLeft(nextMode === 'work' ? workDuration * 60 : breakDuration * 60);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, onSessionComplete, workDuration, breakDuration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / (mode === 'work' ? workDuration * 60 : breakDuration * 60)) * 100;
  const strokeDasharray = 2 * Math.PI * 120;
  const strokeDashoffset = strokeDasharray * (progress / 100);

  const adjustDuration = (type: 'work' | 'break', amount: number) => {
    if (type === 'work') {
      const newVal = Math.max(1, Math.min(120, workDuration + amount));
      setWorkDuration(newVal);
      if (mode === 'work' && !isActive) setTimeLeft(newVal * 60);
    } else {
      const newVal = Math.max(1, Math.min(60, breakDuration + amount));
      setBreakDuration(newVal);
      if (mode === 'break' && !isActive) setTimeLeft(newVal * 60);
    }
  };

  return (
    <div className="glass-card p-8 md:p-12 flex flex-col items-center justify-center gap-8 relative overflow-hidden group min-h-[550px] border-white/5">
      {/* Background Glow - Subtle Brand Glow Only */}
      <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-brand-500/20 to-indigo-500/20 transition-all duration-1000" />
      
      {/* Mode Switcher */}
      <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10 relative z-10 shadow-inner">
        <button
          onClick={() => { setMode('work'); resetTimer(); }}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
            mode === 'work' ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30 scale-105" : "text-slate-400 hover:text-white hover:bg-white/5"
          )}
        >
          <Brain className="w-4 h-4" />
          Focus
        </button>
        <button
          onClick={() => { setMode('break'); resetTimer(); }}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
            mode === 'break' ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 scale-105" : "text-slate-400 hover:text-white hover:bg-white/5"
          )}
        >
          <Coffee className="w-4 h-4" />
          Break
        </button>
      </div>

      {/* Circular Progress & Timer */}
      <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90 transform drop-shadow-[0_0_15px_rgba(14,165,233,0.1)]">
          {/* Background Circle */}
          <circle
            cx="50%"
            cy="50%"
            r="120"
            className="stroke-white/5 fill-none"
            strokeWidth="6"
          />
          {/* Progress Circle */}
          <motion.circle
            cx="50%"
            cy="50%"
            r="120"
            className={cn(
              "fill-none transition-colors duration-1000",
              mode === 'work' ? "stroke-brand-500" : "stroke-indigo-400"
            )}
            strokeWidth="8"
            strokeLinecap="round"
            initial={{ strokeDashoffset: strokeDasharray }}
            animate={{ strokeDashoffset: strokeDashoffset }}
            strokeDasharray={strokeDasharray}
            transition={{ duration: 1, ease: "linear" }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <motion.div 
            key={timeLeft}
            initial={{ scale: 0.95, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-6xl md:text-7xl font-mono font-bold tracking-tighter text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
          >
            {formatTime(timeLeft)}
          </motion.div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mt-2">
            {mode === 'work' ? 'Deep Work' : 'Resting'}
          </span>
        </div>
      </div>

      {/* Duration Controls - Integrated */}
      <div className="flex flex-col items-center gap-4 relative z-10 w-full max-w-[280px]">
        <div className="flex items-center justify-between w-full bg-white/5 p-3 rounded-2xl border border-white/10">
          <button 
            onClick={() => adjustDuration(mode, -5)}
            className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all"
          >
            <Minus className="w-4 h-4" />
          </button>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Duration</span>
            <span className="text-lg font-bold text-white">{mode === 'work' ? workDuration : breakDuration}m</span>
          </div>
          <button 
            onClick={() => adjustDuration(mode, 5)}
            className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex items-center gap-6 relative z-10">
        <button
          onClick={resetTimer}
          className="w-14 h-14 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all group/reset shadow-lg"
        >
          <RotateCcw className="w-5 h-5 text-slate-400 group-hover/reset:rotate-[-90deg] transition-transform duration-500" />
        </button>
        
        <button
          onClick={toggleTimer}
          className={cn(
            "w-20 h-20 rounded-3xl flex items-center justify-center transition-all shadow-2xl group/play",
            mode === 'work' ? "bg-brand-500 hover:bg-brand-600 shadow-brand-500/40" : "bg-indigo-500 hover:bg-indigo-600 shadow-indigo-500/40"
          )}
        >
          {isActive ? (
            <Pause className="w-8 h-8 fill-white text-white" />
          ) : (
            <Play className="w-8 h-8 fill-white text-white ml-1 group-hover/play:scale-110 transition-transform" />
          )}
        </button>

        <button 
          onClick={() => setShowSettings(!showSettings)}
          className={cn(
            "w-14 h-14 rounded-2xl border flex items-center justify-center transition-all shadow-lg",
            showSettings ? "bg-brand-500/20 border-brand-500 text-brand-400" : "bg-white/5 hover:bg-white/10 border-white/10 text-slate-400"
          )}
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Advanced Settings Overlay */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 z-20 bg-slate-950/95 backdrop-blur-xl p-8 flex flex-col gap-8"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold tracking-tight">Timer Configuration</h3>
              <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Focus Session</label>
                  <span className="text-brand-400 font-bold">{workDuration} min</span>
                </div>
                <input 
                  type="range" min="1" max="120" 
                  value={workDuration} 
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setWorkDuration(val);
                    if (mode === 'work' && !isActive) setTimeLeft(val * 60);
                  }}
                  className="w-full accent-brand-500 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
                />
                <div className="flex gap-2">
                  {[15, 25, 45, 60].map(t => (
                    <button 
                      key={t}
                      onClick={() => {
                        setWorkDuration(t);
                        if (mode === 'work' && !isActive) setTimeLeft(t * 60);
                      }}
                      className={cn(
                        "flex-1 py-1.5 rounded-lg text-[10px] font-bold border transition-all",
                        workDuration === t ? "bg-brand-500/20 border-brand-500 text-brand-400" : "bg-white/5 border-white/10 text-slate-500 hover:bg-white/10"
                      )}
                    >
                      {t}m
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Break Session</label>
                  <span className="text-indigo-400 font-bold">{breakDuration} min</span>
                </div>
                <input 
                  type="range" min="1" max="60" 
                  value={breakDuration} 
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setBreakDuration(val);
                    if (mode === 'break' && !isActive) setTimeLeft(val * 60);
                  }}
                  className="w-full accent-indigo-500 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
                />
                <div className="flex gap-2">
                  {[5, 10, 15, 20].map(t => (
                    <button 
                      key={t}
                      onClick={() => {
                        setBreakDuration(t);
                        if (mode === 'break' && !isActive) setTimeLeft(t * 60);
                      }}
                      className={cn(
                        "flex-1 py-1.5 rounded-lg text-[10px] font-bold border transition-all",
                        breakDuration === t ? "bg-indigo-500/20 border-indigo-500 text-indigo-400" : "bg-white/5 border-white/10 text-slate-500 hover:bg-white/10"
                      )}
                    >
                      {t}m
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setShowSettings(false)}
                className="w-full py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl font-bold transition-all shadow-xl shadow-brand-500/20"
              >
                Apply Configuration
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col items-center gap-3 text-center mt-auto">
        <p className="text-slate-300 text-sm font-medium tracking-tight">
          {mode === 'work' ? "Stay focused, you're doing great." : "Relax and recharge."}
        </p>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map(i => (
            <motion.div 
              key={i} 
              initial={false}
              animate={{ 
                scale: i <= 2 ? 1.2 : 1,
                backgroundColor: i <= 2 ? "#0ea5e9" : "rgba(255,255,255,0.1)"
              }}
              className="w-2 h-2 rounded-full" 
            />
          ))}
          <span className="text-[10px] text-slate-500 font-black ml-2 uppercase tracking-[0.2em]">Session 2/4</span>
        </div>
      </div>
    </div>
  );
}
