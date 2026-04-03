import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Timer from './Timer';
import TaskBoard from './TaskBoard';
import ChatRoom from './ChatRoom';
import Analytics from './Analytics';
import Community from './Community';
import AICoach from './AICoach';
import DailyTracker from './DailyTracker';
import WeeklyAnalysis from './WeeklyAnalysis';
import HabitTracker from './HabitTracker';
import AdminDashboard from './AdminDashboard';
import { Task, FocusSession, ChatMessage, DailyLog, Habit, WeeklyStat, UserProfile } from '../types';
import { Zap, Target, TrendingUp, Users, Brain, Plus, Flame, Trophy, Calendar, Share2, Globe, CheckSquare, Clock, BarChart3 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useI18n } from '../lib/I18nContext';

interface DashboardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tasks: Task[];
  sessions: FocusSession[];
  messages: ChatMessage[];
  dailyLogs: DailyLog[];
  habits: Habit[];
  weeklyStats: WeeklyStat[];
  addTask: (title: string, category: Task['category']) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  sendMessage: (text: string, type?: 'text' | 'image' | 'file', url?: string, fileName?: string) => void;
  handleSessionComplete: (type: 'work' | 'break', duration: number, mood?: string, notes?: string) => void;
  addDailyLog: (log: Omit<DailyLog, 'id' | 'userId' | 'createdAt'>) => void;
  addHabit: (name: string, targetDays: number) => void;
  deleteHabit: (id: string) => void;
  updateHabit: (id: string, completedDays: number) => void;
  setIsAddTaskOpen: (open: boolean) => void;
  onInviteFriends: () => void;
  settings: any;
  setSettings: (settings: any) => void;
  user: any;
}

export default function Dashboard({ 
  activeTab, setActiveTab, tasks, sessions, messages, dailyLogs, habits, weeklyStats,
  addTask, toggleTask, deleteTask, updateTask, sendMessage, 
  handleSessionComplete, addDailyLog, addHabit, deleteHabit, updateHabit,
  setIsAddTaskOpen, onInviteFriends, settings, setSettings, user
}: DashboardProps) {
  const { t, language, setLanguage, isRTL } = useI18n();

  const totalFocusTime = sessions.filter(s => s.type === 'work').reduce((acc, s) => acc + s.duration, 0);
  const completedTasksCount = tasks.filter(t => t.completed).length;
  const productivityScore = Math.round((completedTasksCount / (tasks.length || 1)) * 100);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="flex flex-col gap-10">
            {/* Top Bar SaaS Style */}
            <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4", isRTL && "sm:flex-row-reverse")}>
              <div className={cn("flex flex-col gap-1", isRTL && "items-end")}>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                  {t('welcomeBackName', { name: user?.name || 'User' })}
                </h2>
                <p className="text-slate-400 text-sm">{t('streak', { count: 5 })}</p>
              </div>
              <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                <button 
                  onClick={() => setSettings({ ...settings, darkMode: !settings.darkMode })}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all"
                >
                  {settings.darkMode ? <Globe className="w-5 h-5 text-brand-400" /> : <Zap className="w-5 h-5 text-amber-400" />}
                </button>
                <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
                  <button onClick={() => setLanguage('en')} className={cn("px-3 py-1.5 rounded-lg text-[10px] font-bold", language === 'en' ? "bg-brand-500 text-white" : "text-slate-500")}>EN</button>
                  <button onClick={() => setLanguage('darija')} className={cn("px-3 py-1.5 rounded-lg text-[10px] font-bold", language === 'darija' ? "bg-brand-500 text-white" : "text-slate-500")}>DR</button>
                </div>
              </div>
            </div>

            {/* 3 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon: CheckSquare, label: t('totalTasks'), value: tasks.length, sub: `${completedTasksCount} ${t('completed')}`, color: 'text-emerald-400' },
                { icon: Clock, label: t('focusHoursToday'), value: `${(totalFocusTime / 60).toFixed(1)}h`, sub: t('dailyGoal'), color: 'text-brand-400' },
                { icon: TrendingUp, label: t('productivityScore'), value: `${productivityScore}%`, sub: t('performance'), color: 'text-indigo-400' }
              ].map((stat, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-card p-6 flex flex-col gap-4 relative overflow-hidden group"
                >
                  <div className="absolute top-[-20%] right-[-10%] w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all" />
                  <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
                    <stat.icon className={cn("w-4 h-4", stat.color)} />
                  </div>
                  <div className={cn("flex flex-col", isRTL && "items-end")}>
                    <span className="text-3xl font-black text-white tracking-tight">{stat.value}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{stat.sub}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Chart Section */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                <div className="glass-card p-8 flex flex-col gap-8">
                  <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">{t('weeklyFocusChart')}</h3>
                    <BarChart3 className="w-4 h-4 text-slate-500" />
                  </div>
                  <Analytics sessions={sessions} timeframe="weekly" />
                </div>
                <AICoach sessions={sessions} />
              </div>

              {/* Recent Tasks */}
              <div className="glass-card p-6 flex flex-col gap-6">
                <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">{t('recentTasks')}</h3>
                  <button onClick={() => setIsAddTaskOpen(true)} className="p-1.5 hover:bg-white/5 rounded-lg transition-all text-brand-400">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  {tasks.slice(0, 6).map((task) => (
                    <div key={task.id} className={cn("flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all", isRTL && "flex-row-reverse")}>
                      <button 
                        onClick={() => toggleTask(task.id)}
                        className={cn(
                          "w-5 h-5 rounded-md border flex items-center justify-center transition-all",
                          task.completed ? "bg-emerald-500 border-emerald-500 text-white" : "border-white/20 text-transparent"
                        )}
                      >
                        <CheckSquare className="w-3 h-3" />
                      </button>
                      <span className={cn(
                        "text-xs font-medium flex-1 truncate",
                        task.completed ? "text-slate-500 line-through" : "text-slate-200",
                        isRTL && "text-right"
                      )}>
                        {task.title}
                      </span>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setActiveTab('tasks')}
                  className="mt-auto text-[10px] font-bold text-brand-400 uppercase tracking-widest hover:text-brand-300 transition-all text-center"
                >
                  View All Tasks
                </button>
              </div>
            </div>
          </div>
        );
      case 'daily':
        return <DailyTracker onSaveLog={addDailyLog} logs={dailyLogs} />;
      case 'weekly':
        return <WeeklyAnalysis stats={weeklyStats} />;
      case 'habits':
        return <HabitTracker habits={habits} onAddHabit={addHabit} onDeleteHabit={deleteHabit} onUpdateHabit={updateHabit} />;
      case 'admin':
        return user?.role === 'admin' ? <AdminDashboard currentUser={user as UserProfile} /> : <div className="p-8 text-center text-rose-400 font-bold">403 Forbidden</div>;
      case 'tasks':
        return (
          <div className="h-full flex flex-col gap-6">
            <h2 className={cn("text-2xl font-bold", isRTL && "text-right")}>{t('tasks')}</h2>
            <div className="flex-1">
              <TaskBoard 
                tasks={tasks} 
                onAddTask={addTask} 
                onToggleTask={toggleTask} 
                onDeleteTask={deleteTask} 
                onUpdateTask={updateTask}
              />
            </div>
          </div>
        );
      case 'chat':
        return <ChatRoom messages={messages} onSendMessage={sendMessage} currentUserId="user1" />;
      case 'community':
        return <Community />;
      case 'settings':
        return (
          <div className="h-full flex flex-col gap-8 max-w-3xl mx-auto">
            <header className={cn("flex flex-col gap-2", isRTL && "items-end")}>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t('settings')}</h2>
              <p className="text-slate-400">{t('profileSettings')}</p>
            </header>

            <div className="glass-card p-8 flex flex-col gap-10">
              {/* Profile Info */}
              <div className="flex flex-col gap-6">
                <h3 className={cn("text-xs font-bold text-slate-500 uppercase tracking-widest", isRTL && "text-right")}>{t('profileInfo')}</h3>
                <div className={cn("flex items-center gap-6", isRTL && "flex-row-reverse")}>
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-400 to-indigo-500 border-2 border-white/20 shadow-xl flex items-center justify-center text-2xl font-black text-white">
                    {user?.name?.[0] || 'U'}
                  </div>
                  <div className={cn("flex-1 flex flex-col gap-2", isRTL && "items-end")}>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('displayName')}</label>
                    <input 
                      type="text" 
                      defaultValue={user?.name || 'Focus Master'} 
                      className={cn(
                        "bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 w-full",
                        isRTL && "text-right"
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="flex flex-col gap-6 pt-10 border-t border-white/5">
                <h3 className={cn("text-xs font-bold text-slate-500 uppercase tracking-widest", isRTL && "text-right")}>{t('appPreferences')}</h3>
                
                <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
                  <div className={cn("flex flex-col", isRTL && "items-end")}>
                    <span className="text-sm font-bold text-slate-200">{t('language')}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{t('chooseLanguage')}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                    <button onClick={() => setLanguage('en')} className={cn("px-4 py-2 rounded-lg text-xs font-bold transition-all", language === 'en' ? "bg-brand-500 text-white" : "text-slate-500")}>English</button>
                    <button onClick={() => setLanguage('darija')} className={cn("px-4 py-2 rounded-lg text-xs font-bold transition-all", language === 'darija' ? "bg-brand-500 text-white" : "text-slate-500")}>Darija</button>
                  </div>
                </div>

                <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
                  <div className={cn("flex flex-col", isRTL && "items-end")}>
                    <span className="text-sm font-bold text-slate-200">{t('darkMode')}</span>
                    <span className="text-[10px] text-slate-500 font-medium">Always active for better focus</span>
                  </div>
                  <button 
                    onClick={() => setSettings({ ...settings, darkMode: !settings.darkMode })}
                    className={cn(
                      "w-14 h-7 rounded-full flex items-center px-1 transition-all",
                      settings.darkMode ? "bg-brand-500 justify-end" : "bg-white/10 justify-start"
                    )}
                  >
                    <div className="w-5 h-5 bg-white rounded-full shadow-lg" />
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="flex flex-col gap-4 pt-10 border-t border-white/5">
                <button className="text-rose-400 hover:text-rose-300 text-xs font-bold uppercase tracking-widest transition-all text-left">
                  {t('deleteAccount')}
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto z-10 custom-scrollbar">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="min-h-full"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
