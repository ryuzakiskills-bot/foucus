import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Smile, Meh, Frown, Save, Clock, FileText } from 'lucide-react';
import { useI18n } from '../lib/I18nContext';
import { cn } from '../lib/utils';
import { DailyLog } from '../types';

interface DailyTrackerProps {
  onSaveLog: (log: Omit<DailyLog, 'id' | 'userId' | 'createdAt'>) => void;
  logs: DailyLog[];
}

export default function DailyTracker({ onSaveLog, logs }: DailyTrackerProps) {
  const { t, isRTL } = useI18n();
  const [focusHours, setFocusHours] = useState(0);
  const [mood, setMood] = useState<'happy' | 'neutral' | 'tired'>('neutral');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveLog({
      date: new Date().toISOString().split('T')[0],
      focusHours,
      productivityScore: Math.min(100, (focusHours / 8) * 100), // Simple score logic
      mood,
      notes
    });
    // Reset form
    setFocusHours(0);
    setMood('neutral');
    setNotes('');
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <header className={cn("flex flex-col gap-2", isRTL && "items-end")}>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t('dailyTracker')}</h2>
        <p className="text-slate-400">{t('stayFocused')}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form Section */}
        <motion.div 
          initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-2 glass-card p-6 md:p-8"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className={cn("text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2", isRTL && "flex-row-reverse")}>
                <Clock className="w-4 h-4" />
                {t('addFocusHours')}
              </label>
              <input 
                type="number" 
                step="0.5"
                min="0"
                max="24"
                value={focusHours}
                onChange={(e) => setFocusHours(parseFloat(e.target.value))}
                className={cn(
                  "bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-lg outline-none focus:border-brand-500/50 transition-all",
                  isRTL && "text-right"
                )}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className={cn("text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2", isRTL && "flex-row-reverse")}>
                <Smile className="w-4 h-4" />
                {t('mood')}
              </label>
              <div className={cn("flex gap-4", isRTL && "flex-row-reverse")}>
                {[
                  { id: 'happy', icon: Smile, label: t('happy'), color: 'text-emerald-400' },
                  { id: 'neutral', icon: Meh, label: t('neutral'), color: 'text-amber-400' },
                  { id: 'tired', icon: Frown, label: t('tired'), color: 'text-rose-400' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMood(item.id as any)}
                    className={cn(
                      "flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all cursor-pointer",
                      mood === item.id 
                        ? "bg-white/10 border-brand-500/50 scale-105" 
                        : "bg-white/5 border-white/5 hover:bg-white/10"
                    )}
                  >
                    <item.icon className={cn("w-8 h-8", mood === item.id ? item.color : "text-slate-500")} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className={cn("text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2", isRTL && "flex-row-reverse")}>
                <FileText className="w-4 h-4" />
                {t('notes')}
              </label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className={cn(
                  "bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 transition-all resize-none",
                  isRTL && "text-right"
                )}
                placeholder="..."
              />
            </div>

            <button 
              type="submit"
              className="bg-brand-500 hover:bg-brand-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 group"
            >
              <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {t('save')}
            </button>
          </form>
        </motion.div>

        {/* Timeline Section */}
        <motion.div 
          initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6 flex flex-col gap-6"
        >
          <h3 className={cn("text-sm font-bold text-slate-200 uppercase tracking-widest", isRTL && "text-right")}>
            {t('timeline')}
          </h3>
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
            {logs.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs italic">
                No logs yet for today.
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className={cn("flex gap-4 p-3 bg-white/5 rounded-xl border border-white/5", isRTL && "flex-row-reverse")}>
                  <div className="w-1 h-full bg-brand-500 rounded-full shrink-0" />
                  <div className={cn("flex flex-col gap-1", isRTL && "items-end")}>
                    <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                      <span className="text-[10px] font-bold text-brand-400">{log.focusHours}h</span>
                      <span className="text-[10px] text-slate-500">•</span>
                      <span className="text-[10px] text-slate-500">{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className={cn("text-xs text-slate-300 line-clamp-2", isRTL && "text-right")}>{log.notes}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
