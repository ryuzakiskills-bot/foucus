import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Check, X, Flame, Target, Trophy } from 'lucide-react';
import { useI18n } from '../lib/I18nContext';
import { cn } from '../lib/utils';
import { Habit } from '../types';

interface HabitTrackerProps {
  habits: Habit[];
  onAddHabit: (name: string, targetDays: number) => void;
  onDeleteHabit: (id: string) => void;
  onUpdateHabit: (id: string, completedDays: number) => void;
}

export default function HabitTracker({ habits, onAddHabit, onDeleteHabit, onUpdateHabit }: HabitTrackerProps) {
  const { t, isRTL } = useI18n();
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTarget, setNewTarget] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onAddHabit(newName.trim(), newTarget);
      setNewName('');
      setNewTarget(5);
      setIsAdding(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      <header className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4", isRTL && "sm:flex-row-reverse")}>
        <div className={cn("flex flex-col gap-2", isRTL && "items-end")}>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t('habitTracker')}</h2>
          <p className="text-slate-400">{t('achievements')}</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold text-sm transition-all shadow-xl shadow-brand-500/20 cursor-pointer group"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
          {t('addHabit')}
        </button>
      </header>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-6 md:p-8 relative overflow-hidden"
          >
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-500/10 rounded-full blur-[60px] pointer-events-none" />
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-end gap-6 relative z-10">
              <div className="flex-1 flex flex-col gap-2 w-full">
                <label className={cn("text-[10px] font-bold text-slate-500 uppercase tracking-widest", isRTL && "text-right")}>
                  {t('habitName')}
                </label>
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className={cn(
                    "bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 transition-all",
                    isRTL && "text-right"
                  )}
                  placeholder="e.g. Gym, Reading..."
                  autoFocus
                />
              </div>
              <div className="w-full md:w-48 flex flex-col gap-2">
                <label className={cn("text-[10px] font-bold text-slate-500 uppercase tracking-widest", isRTL && "text-right")}>
                  {t('targetDays')}
                </label>
                <input 
                  type="number" 
                  min="1"
                  max="7"
                  value={newTarget}
                  onChange={(e) => setNewTarget(parseInt(e.target.value))}
                  className={cn(
                    "bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 transition-all",
                    isRTL && "text-right"
                  )}
                />
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <button 
                  type="submit"
                  className="flex-1 md:flex-none bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                >
                  {t('save')}
                </button>
                <button 
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="p-3 bg-white/5 text-slate-400 rounded-xl hover:bg-white/10 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {habits.length === 0 ? (
          <div className="col-span-full text-center py-20 text-slate-500 text-sm italic">
            No habits added yet. Start small, win big!
          </div>
        ) : (
          habits.map((habit) => (
            <HabitCard 
              key={habit.id} 
              habit={habit} 
              onDelete={() => onDeleteHabit(habit.id)}
              onUpdate={(val) => onUpdateHabit(habit.id, val)}
              isRTL={isRTL}
              t={t}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface HabitCardProps {
  habit: Habit;
  onDelete: () => void;
  onUpdate: (val: number) => void;
  isRTL: boolean;
  t: any;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onDelete, onUpdate, isRTL, t }) => {
  const progress = (habit.completedDays / habit.targetDays) * 100;
  const isCompleted = habit.completedDays >= habit.targetDays;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 flex flex-col gap-6 group relative overflow-hidden"
    >
      <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
        <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
          <div className={cn(
            "p-2 rounded-xl border transition-colors",
            isCompleted ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-brand-500/10 text-brand-400 border-brand-500/20"
          )}>
            {isCompleted ? <Trophy className="w-5 h-5" /> : <Flame className="w-5 h-5" />}
          </div>
          <div className={isRTL ? "text-right" : "text-left"}>
            <h4 className="text-sm font-bold text-slate-200 tracking-tight">{habit.name}</h4>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              {habit.completedDays}/{habit.targetDays} {t('today')}
            </p>
          </div>
        </div>
        <button 
          onClick={onDelete}
          className="p-2 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <div className={cn("flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest", isRTL && "flex-row-reverse")}>
          <span>{t('progress')}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className={cn(
              "h-full transition-all duration-500",
              isCompleted ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]" : "bg-brand-500 shadow-[0_0_12px_rgba(14,165,233,0.4)]"
            )}
          />
        </div>
      </div>

      <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
        <button 
          onClick={() => onUpdate(Math.max(0, habit.completedDays - 1))}
          className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-slate-400 rounded-lg text-xs font-bold transition-all cursor-pointer"
        >
          -1
        </button>
        <button 
          onClick={() => onUpdate(Math.min(habit.targetDays, habit.completedDays + 1))}
          className={cn(
            "flex-1 py-2 text-white rounded-lg text-xs font-bold transition-all cursor-pointer",
            isCompleted ? "bg-emerald-500/50 cursor-default" : "bg-brand-500 hover:bg-brand-600 shadow-lg shadow-brand-500/10"
          )}
          disabled={isCompleted}
        >
          +1
        </button>
      </div>
    </motion.div>
  );
}
