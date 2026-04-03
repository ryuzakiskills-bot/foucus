import React from 'react';
import { motion } from 'motion/react';
import { BarChart3, TrendingUp, Target, Zap, ChevronUp, ChevronDown } from 'lucide-react';
import { useI18n } from '../lib/I18nContext';
import { cn } from '../lib/utils';
import { WeeklyStat } from '../types';

interface WeeklyAnalysisProps {
  stats: WeeklyStat[];
}

export default function WeeklyAnalysis({ stats }: WeeklyAnalysisProps) {
  const { t, isRTL } = useI18n();
  const latestStat = stats[stats.length - 1] || { totalFocus: 0, completedTasks: 0, performanceScore: 0 };
  const previousStat = stats[stats.length - 2] || { performanceScore: 0 };
  const improvement = latestStat.performanceScore - previousStat.performanceScore;

  // Mock data for charts
  const weeklyData = [
    { day: 'Mon', focus: 4.5, tasks: 8 },
    { day: 'Tue', focus: 6.2, tasks: 12 },
    { day: 'Wed', focus: 3.8, tasks: 6 },
    { day: 'Thu', focus: 5.5, tasks: 10 },
    { day: 'Fri', focus: 7.0, tasks: 15 },
    { day: 'Sat', focus: 2.5, tasks: 4 },
    { day: 'Sun', focus: 1.5, tasks: 2 },
  ];

  const maxFocus = Math.max(...weeklyData.map(d => d.focus));

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      <header className={cn("flex flex-col gap-2", isRTL && "items-end")}>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t('weeklyOverview')}</h2>
        <p className="text-slate-400">{t('weeklyPerformance')}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Circle */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 flex flex-col items-center justify-center gap-6 relative overflow-hidden"
        >
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-500/10 rounded-full blur-[60px] pointer-events-none" />
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('performanceScore')}</h3>
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="12"
                className="text-white/5"
              />
              <motion.circle
                cx="96"
                cy="96"
                r="88"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="12"
                strokeDasharray={2 * Math.PI * 88}
                initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                animate={{ strokeDashoffset: (2 * Math.PI * 88) * (1 - latestStat.performanceScore / 100) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="text-brand-500 shadow-[0_0_20px_rgba(14,165,233,0.5)]"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-black text-white tracking-tighter">{latestStat.performanceScore}%</span>
              <div className={cn("flex items-center gap-1 text-[10px] font-bold", improvement >= 0 ? "text-emerald-400" : "text-rose-400")}>
                {improvement >= 0 ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {Math.abs(improvement)}%
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-sm font-bold text-slate-200">{t('wellDone')}</p>
            <p className="text-[10px] text-slate-500 text-center">{t('weeklySummary', { percent: Math.abs(improvement) })}</p>
          </div>
        </motion.div>

        {/* Bar Chart Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 glass-card p-8 flex flex-col gap-8"
        >
          <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
            <div className={cn("flex flex-col gap-1", isRTL && "items-end")}>
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">{t('weeklyFocusChart')}</h3>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">{t('last7Days')}</p>
            </div>
            <div className={cn("flex items-center gap-4", isRTL && "flex-row-reverse")}>
              <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                <div className="w-3 h-3 bg-brand-500 rounded-sm" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Focus</span>
              </div>
              <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                <div className="w-3 h-3 bg-indigo-500/30 border border-indigo-500/50 rounded-sm" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tasks</span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex items-end justify-between gap-2 md:gap-4 h-64 px-2">
            {weeklyData.map((data, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-3 group">
                <div className="w-full flex flex-col items-center gap-1 relative h-full justify-end">
                  {/* Task Bar (Background) */}
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.tasks / 15) * 100}%` }}
                    className="w-full max-w-[24px] bg-indigo-500/10 border border-indigo-500/20 rounded-t-lg transition-colors group-hover:bg-indigo-500/20"
                  />
                  {/* Focus Bar (Foreground) */}
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.focus / maxFocus) * 100}%` }}
                    className="w-full max-w-[16px] bg-brand-500 rounded-t-lg shadow-lg shadow-brand-500/20 absolute bottom-0 transition-transform group-hover:scale-x-110"
                  />
                  
                  {/* Tooltip */}
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-20">
                    <div className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1 shadow-2xl flex flex-col items-center">
                      <span className="text-[8px] font-bold text-brand-400">{data.focus}h</span>
                      <span className="text-[8px] font-bold text-indigo-400">{data.tasks} tasks</span>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{data.day}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { icon: Zap, label: t('focusTime'), value: `${latestStat.totalFocus}h`, color: 'text-brand-400' },
          { icon: CheckSquare, label: t('tasksDone'), value: latestStat.completedTasks, color: 'text-emerald-400' },
          { icon: Target, label: t('productivityScore'), value: `${latestStat.performanceScore}%`, color: 'text-indigo-400' },
          { icon: TrendingUp, label: t('weeklyPerformance'), value: improvement >= 0 ? `+${improvement}%` : `${improvement}%`, color: improvement >= 0 ? 'text-emerald-400' : 'text-rose-400' }
        ].map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-6 flex flex-col gap-2"
          >
            <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
              <stat.icon className={cn("w-4 h-4", stat.color)} />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
            </div>
            <h4 className={cn("text-xl md:text-2xl font-black text-white tracking-tight", isRTL && "text-right")}>{stat.value}</h4>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const CheckSquare = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 11 12 14 22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);
