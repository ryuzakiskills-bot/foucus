import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain, Settings, Plus, Minus, X, Smile, Meh, Frown, Save, CheckCircle2, History, Zap, TrendingUp, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useI18n } from '../lib/I18nContext';

interface SessionLog {
  id: string;
  type: 'work' | 'break';
  duration: number;
  mood: 'happy' | 'neutral' | 'tired';
  timestamp: number;
  notes: string;
}

interface TimerProps {
  onSessionComplete?: (type: 'work' | 'break', duration: number, mood: string, notes: string) => void;
}

export default function Timer({ onSessionComplete }: TimerProps) {
  const { t, isRTL } = useI18n();
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(workDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [showSettings, setShowSettings] = useState(false);
  const [sessionCount, setSessionCount] = useState(1);
  
  // New States for Tracking
  const [showSummary, setShowSummary] = useState(false);
  const [currentMood, setCurrentMood] = useState<'happy' | 'neutral' | 'tired'>('happy');
  const [sessionNotes, setSessionNotes] = useState('');
  const [history, setHistory] = useState<SessionLog[]>(() => {
    const saved = localStorage.getItem('focusflow_timer_history');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleTimer = () => setIsActive(!isActive);

  const handleModeChange = (newMode: 'work' | 'break') => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'work' ? workDuration * 60 : breakDuration * 60);
    setShowSummary(false);
  };

  const saveSession = () => {
    const newLog: SessionLog = {
      id: Math.random().toString(36).substr(2, 9),
      type: mode,
      duration: mode === 'work' ? workDuration : breakDuration,
      mood: currentMood,
      timestamp: Date.now(),
      notes: sessionNotes
    };

    const newHistory = [newLog, ...history].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('focusflow_timer_history', JSON.stringify(newHistory));
    
    onSessionComplete?.(mode, newLog.duration, currentMood, sessionNotes);
    
    setShowSummary(false);
    setSessionNotes('');
    
    // Auto switch mode
    const nextMode = mode === 'work' ? 'break' : 'work';
    setMode(nextMode);
    setTimeLeft(nextMode === 'work' ? workDuration * 60 : breakDuration * 60);
    if (mode === 'work') setSessionCount(prev => prev + 1);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (mode === 'work') {
        setShowSummary(true);
      } else {
        // Breaks auto-complete without summary
        const nextMode = 'work';
        setMode(nextMode);
        setTimeLeft(workDuration * 60);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, workDuration, breakDuration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / (mode === 'work' ? workDuration * 60 : breakDuration * 60)) * 100;
  const radius = 120;
  const strokeDasharray = 2 * Math.PI * radius;
  const strokeDashoffset = strokeDasharray * (1 - progress / 100);

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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Timer Card */}
      <div className={cn(
        "lg:col-span-2 glass-card p-10 md:p-16 flex flex-col items-center justify-center gap-10 relative group min-h-[600px] transition-all duration-700 overflow-hidden",
        mode === 'work' ? "border-brand-500/20 shadow-[0_0_50px_-12px_rgba(14,165,233,0.15)]" : "border-emerald-500/20 shadow-[0_0_50px_-12px_rgba(16,185,129,0.15)]"
      )}>
        {/* Background Glow */}
        <div className={cn(
          "absolute inset-0 opacity-10 transition-all duration-1000 rounded-[inherit] overflow-hidden pointer-events-none",
          mode === 'work' ? "bg-gradient-to-br from-brand-500/20 to-indigo-500/20" : "bg-gradient-to-br from-emerald-500/20 to-teal-500/20"
        )} />
        
        {/* Session Counter */}
        <div className={cn(
          "absolute top-6 flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 z-20",
          isRTL ? "left-8 flex-row-reverse" : "right-8"
        )}>
          <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", mode === 'work' ? "bg-brand-400" : "bg-emerald-400")} />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('session')} {sessionCount}</span>
        </div>

        {/* Mode Switcher */}
        <div className={cn("flex gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10 relative z-10 shadow-inner", isRTL && "flex-row-reverse")}>
          <button
            onClick={() => handleModeChange('work')}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
              mode === 'work' ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30 scale-105" : "text-slate-400 hover:text-white hover:bg-white/5",
              isRTL && "flex-row-reverse"
            )}
          >
            <Brain className="w-4 h-4" />
            {t('focus')}
          </button>
          <button
            onClick={() => handleModeChange('break')}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
              mode === 'break' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-105" : "text-slate-400 hover:text-white hover:bg-white/5",
              isRTL && "flex-row-reverse"
            )}
          >
            <Coffee className="w-4 h-4" />
            {t('break')}
          </button>
        </div>

        {/* Circular Progress & Timer */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
          <svg 
            viewBox="0 0 280 280"
            className={cn(
              "w-full h-full -rotate-90 transform transition-all duration-700",
              mode === 'work' ? "drop-shadow-[0_0_15px_rgba(14,165,233,0.1)]" : "drop-shadow-[0_0_15px_rgba(16,185,129,0.1)]"
            )}
          >
            <circle cx="140" cy="140" r={radius} className="stroke-white/5 fill-none" strokeWidth="6" />
            <motion.circle
              cx="140" cy="140" r={radius}
              className={cn("fill-none transition-colors duration-1000", mode === 'work' ? "stroke-brand-500" : "stroke-emerald-400")}
              strokeWidth="8" strokeLinecap="round"
              initial={{ strokeDashoffset: strokeDasharray }}
              animate={{ strokeDashoffset: strokeDashoffset }}
              strokeDasharray={strokeDasharray}
              transition={{ duration: 0.5, ease: "easeOut" }}
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
            <span className={cn(
              "text-[10px] font-black uppercase tracking-[0.4em] mt-2 transition-colors duration-700",
              mode === 'work' ? "text-brand-400" : "text-emerald-400"
            )}>
              {mode === 'work' ? t('deepWork') : t('resting')}
            </span>
          </div>
        </div>

        {/* Duration Controls */}
        <div className="flex flex-col items-center gap-4 relative z-10 w-full max-w-[280px]">
          <div className="flex items-center justify-between w-full bg-white/5 p-3 rounded-2xl border border-white/10">
            <button onClick={() => adjustDuration(mode, -1)} className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all">
              <Minus className="w-4 h-4" />
            </button>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('duration')}</span>
              <span className={cn("text-lg font-bold transition-colors duration-700", mode === 'work' ? "text-brand-400" : "text-emerald-400")}>
                {mode === 'work' ? workDuration : breakDuration}m
              </span>
            </div>
            <button onClick={() => adjustDuration(mode, 1)} className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center gap-6 relative z-10">
          <button
            onClick={() => handleModeChange(mode)}
            className="w-14 h-14 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all group/reset shadow-lg"
          >
            <RotateCcw className="w-5 h-5 text-slate-400 group-hover/reset:rotate-[-90deg] transition-transform duration-500" />
          </button>
          
          <button
            onClick={toggleTimer}
            className={cn(
              "w-20 h-20 rounded-3xl flex items-center justify-center transition-all shadow-2xl group/play",
              mode === 'work' ? "bg-brand-500 hover:bg-brand-600 shadow-brand-500/40" : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/40"
            )}
          >
            {isActive ? <Pause className="w-8 h-8 fill-white text-white" /> : <Play className="w-8 h-8 fill-white text-white ml-1 group-hover/play:scale-110 transition-transform" />}
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

        {/* Summary Overlay */}
        <AnimatePresence>
          {showSummary && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute inset-0 z-30 bg-slate-950/98 backdrop-blur-2xl p-10 flex flex-col items-center justify-center gap-8 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 mb-2">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-2xl font-bold tracking-tight mb-2">Session Complete!</h3>
                <p className="text-slate-400 text-sm">How was your focus during this session?</p>
              </div>

              <div className="flex gap-4 w-full max-w-sm">
                {[
                  { id: 'happy', icon: Smile, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                  { id: 'neutral', icon: Meh, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                  { id: 'tired', icon: Frown, color: 'text-rose-400', bg: 'bg-rose-500/10' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentMood(item.id as any)}
                    className={cn(
                      "flex-1 flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all",
                      currentMood === item.id ? cn(item.bg, "border-brand-500/50 scale-110") : "bg-white/5 border-white/5 hover:bg-white/10"
                    )}
                  >
                    <item.icon className={cn("w-8 h-8", currentMood === item.id ? item.color : "text-slate-500")} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.id}</span>
                  </button>
                ))}
              </div>

              <textarea 
                placeholder="What did you achieve? (Optional)"
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-brand-500/50 transition-all resize-none"
                rows={3}
              />

              <button 
                onClick={saveSession}
                className="w-full max-w-sm py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl font-bold transition-all shadow-xl shadow-brand-500/20 flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save & Continue
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings Overlay */}
        <AnimatePresence>
          {showSettings && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 z-20 bg-slate-950/95 backdrop-blur-xl p-8 flex flex-col gap-8"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold tracking-tight">{t('timerConfig')}</h3>
                <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('focusSession')}</label>
                    <span className="text-brand-400 font-bold">{workDuration} min</span>
                  </div>
                  <input 
                    type="range" min="1" max="120" value={workDuration} 
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setWorkDuration(val);
                      if (mode === 'work' && !isActive) setTimeLeft(val * 60);
                    }}
                    className="w-full accent-brand-500 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('breakSession')}</label>
                    <span className="text-emerald-400 font-bold">{breakDuration} min</span>
                  </div>
                  <input 
                    type="range" min="1" max="60" value={breakDuration} 
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setBreakDuration(val);
                      if (mode === 'break' && !isActive) setTimeLeft(val * 60);
                    }}
                    className="w-full accent-emerald-500 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
                  />
                </div>
                <button onClick={() => setShowSettings(false)} className="w-full py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl font-bold transition-all shadow-xl shadow-brand-500/20">
                  {t('applyConfig')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sidebar: History & Stats */}
      <div className="flex flex-col gap-6">
        <div className="glass-card p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <History className="w-4 h-4" />
              Recent Activity
            </h3>
            <Zap className="w-4 h-4 text-brand-400" />
          </div>

          <div className="flex flex-col gap-4">
            {history.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-white/5 rounded-2xl">
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">No sessions yet</p>
              </div>
            ) : (
              history.map((log) => (
                <div key={log.id} className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-brand-500/30 transition-all group">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                    log.mood === 'happy' ? "bg-emerald-500/10 text-emerald-400" : 
                    log.mood === 'neutral' ? "bg-amber-500/10 text-amber-400" : "bg-rose-500/10 text-rose-400"
                  )}>
                    {log.mood === 'happy' ? <Smile className="w-5 h-5" /> : 
                     log.mood === 'neutral' ? <Meh className="w-5 h-5" /> : <Frown className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-200">{log.duration}m Focus</span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-1 italic">
                      {log.notes || "No notes added"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Stats Bento */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-5 flex flex-col gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Focus</p>
            <p className="text-xl font-bold text-white">
              {history.reduce((acc, curr) => acc + (curr.type === 'work' ? curr.duration : 0), 0)}m
            </p>
          </div>
          <div className="glass-card p-5 flex flex-col gap-2">
            <Activity className="w-4 h-4 text-brand-400" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Efficiency</p>
            <p className="text-xl font-bold text-white">84%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
