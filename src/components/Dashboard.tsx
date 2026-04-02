import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Timer from './Timer';
import TaskBoard from './TaskBoard';
import ChatRoom from './ChatRoom';
import Analytics from './Analytics';
import Community from './Community';
import AICoach from './AICoach';
import { Task, FocusSession, ChatMessage } from '../types';
import { Zap, Target, TrendingUp, Users, Brain, Plus, Flame, Trophy, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';

interface DashboardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tasks: Task[];
  sessions: FocusSession[];
  messages: ChatMessage[];
  addTask: (title: string, category: Task['category']) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  sendMessage: (text: string) => void;
  handleSessionComplete: (type: 'work' | 'break', duration: number) => void;
  setIsAddTaskOpen: (open: boolean) => void;
  settings: any;
  setSettings: (settings: any) => void;
}

export default function Dashboard({ 
  activeTab, setActiveTab, tasks, sessions, messages, 
  addTask, toggleTask, deleteTask, sendMessage, 
  handleSessionComplete, setIsAddTaskOpen, settings, setSettings 
}: DashboardProps) {

  const totalFocusTime = sessions.filter(s => s.type === 'work').reduce((acc, s) => acc + s.duration, 0);
  const dailyGoal = 240; // 4 hours in minutes
  const progress = Math.min((totalFocusTime / dailyGoal) * 100, 100);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Welcome & Progress */}
              <div className="glass-card p-8 bg-gradient-to-br from-slate-900/50 to-brand-500/5 border-brand-500/10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-1">Welcome back, Focus Master! 🚀</h2>
                    <p className="text-slate-400 text-sm">You're on a <span className="text-brand-400 font-bold">5 day streak</span>. Keep it up!</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Daily Goal</span>
                      <span className="text-sm font-bold text-brand-400">{totalFocusTime} / {dailyGoal} min</span>
                    </div>
                    <div className="w-12 h-12 rounded-full border-4 border-white/5 flex items-center justify-center relative">
                      <svg className="w-full h-full -rotate-90">
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          fill="transparent"
                          stroke="currentColor"
                          strokeWidth="4"
                          strokeDasharray={125.6}
                          strokeDashoffset={125.6 - (125.6 * progress) / 100}
                          className="text-brand-500 transition-all duration-1000"
                        />
                      </svg>
                      <span className="absolute text-[10px] font-bold">{Math.round(progress)}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-brand-500 to-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                  />
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button 
                  onClick={() => setActiveTab('analytics')}
                  className="glass-card p-6 flex flex-col gap-2 hover:bg-white/10 transition-all cursor-pointer text-left group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm font-medium">Total Focus</span>
                    <Zap className="w-4 h-4 text-brand-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-3xl font-bold">{totalFocusTime}m</span>
                  <span className="text-xs text-brand-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +12.5% <span className="text-slate-500 font-normal">vs last week</span>
                  </span>
                </button>
                <button 
                  onClick={() => setActiveTab('tasks')}
                  className="glass-card p-6 flex flex-col gap-2 hover:bg-white/10 transition-all cursor-pointer text-left group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm font-medium">Tasks Done</span>
                    <Target className="w-4 h-4 text-brand-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-3xl font-bold">{tasks.filter(t => t.completed).length}</span>
                  <span className="text-xs text-slate-500">Out of {tasks.length} total</span>
                </button>
                <button 
                  onClick={() => setActiveTab('community')}
                  className="glass-card p-6 flex flex-col gap-2 hover:bg-white/10 transition-all cursor-pointer text-left group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm font-medium">Community</span>
                    <Users className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-3xl font-bold">12</span>
                  <span className="text-xs text-brand-400">Active now</span>
                </button>
              </div>

              {/* AI Coach Insight */}
              <AICoach sessions={sessions} />

              <div className="flex-1 glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Weekly Performance</h3>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last 7 Days</span>
                  </div>
                </div>
                <Analytics sessions={sessions} />
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {/* Quick Tasks */}
              <div className="glass-card p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Quick Tasks</h3>
                  <button 
                    onClick={() => setIsAddTaskOpen(true)}
                    className="p-1.5 hover:bg-white/5 rounded-lg transition-all text-slate-500 hover:text-brand-400"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <TaskBoard 
                  tasks={tasks.slice(0, 5)} 
                  onAddTask={addTask} 
                  onToggleTask={toggleTask} 
                  onDeleteTask={deleteTask} 
                />
              </div>

              {/* Achievements */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  Achievements
                </h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    { icon: Flame, color: "text-orange-500", label: "5 Day Streak" },
                    { icon: Zap, color: "text-brand-400", label: "Deep Diver" },
                    { icon: Target, color: "text-brand-400", label: "Goal Crusher" }
                  ].map((badge, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 group cursor-help">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-all",
                        badge.color
                      )}>
                        <badge.icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{badge.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'focus':
        return (
          <div className="flex items-center justify-center h-full">
            <div className="w-full max-w-2xl">
              <Timer onSessionComplete={handleSessionComplete} />
            </div>
          </div>
        );
      case 'tasks':
        return (
          <div className="h-full flex flex-col gap-6">
            <h2 className="text-2xl font-bold">Your Tasks</h2>
            <div className="flex-1">
              <TaskBoard 
                tasks={tasks} 
                onAddTask={addTask} 
                onToggleTask={toggleTask} 
                onDeleteTask={deleteTask} 
              />
            </div>
          </div>
        );
      case 'chat':
        return (
          <div className="h-full">
            <ChatRoom messages={messages} onSendMessage={sendMessage} currentUserId="user1" />
          </div>
        );
      case 'community':
        return (
          <div className="h-full">
            <Community />
          </div>
        );
      case 'analytics':
        return (
          <div className="h-full flex flex-col gap-6">
            <h2 className="text-2xl font-bold">Performance Analytics</h2>
            <div className="flex-1">
              <Analytics sessions={sessions} />
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="h-full flex flex-col gap-6">
            <h2 className="text-2xl font-bold">Settings</h2>
            <div className="glass-card p-8 max-w-2xl flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold">Profile Settings</h3>
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-400 to-indigo-500 border-2 border-white/20" />
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-sm text-slate-400">Display Name</label>
                    <input 
                      type="text" 
                      defaultValue="Focus Master" 
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-brand-500/50"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-4 pt-8 border-t border-white/10">
                <h3 className="text-lg font-semibold">App Preferences</h3>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Dark Mode</span>
                    <span className="text-xs text-slate-500">Always active for better focus</span>
                  </div>
                  <button 
                    onClick={() => setSettings({ ...settings, darkMode: !settings.darkMode })}
                    className={cn(
                      "w-12 h-6 rounded-full flex items-center px-1 transition-all cursor-pointer",
                      settings.darkMode ? "bg-brand-500 justify-end" : "bg-white/10 justify-start"
                    )}
                  >
                    <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Sound Notifications</span>
                    <span className="text-xs text-slate-500">Play sound when timer ends</span>
                  </div>
                  <button 
                    onClick={() => setSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
                    className={cn(
                      "w-12 h-6 rounded-full flex items-center px-1 transition-all cursor-pointer",
                      settings.soundEnabled ? "bg-brand-500 justify-end" : "bg-white/10 justify-start"
                    )}
                  >
                    <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                  </button>
                </div>
              </div>

              <button 
                onClick={() => {
                  const btn = document.activeElement as HTMLButtonElement;
                  if (btn) {
                    const originalText = btn.innerText;
                    btn.innerText = 'Saved!';
                    btn.disabled = true;
                    setTimeout(() => {
                      btn.innerText = originalText;
                      btn.disabled = false;
                    }, 2000);
                  }
                }}
                className="bg-brand-500 hover:bg-brand-600 disabled:bg-brand-500 text-white font-semibold py-3 rounded-xl transition-all"
              >
                Save Changes
              </button>
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
          className="h-full"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
