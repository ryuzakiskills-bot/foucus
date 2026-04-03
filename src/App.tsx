import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Sidebar from './components/Sidebar';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import AdminDashboard from './components/AdminDashboard';
import Logo from './components/Logo';
import { Task, FocusSession, ChatMessage, DailyLog, Habit, WeeklyStat, UserProfile } from './types';
import { Zap, Plus, AlertCircle, RefreshCcw } from 'lucide-react';
import { cn } from './lib/utils';
import { I18nProvider, useI18n } from './lib/I18nContext';

function AppContent() {
  const { t, language, setLanguage, isRTL } = useI18n();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  
  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('focusflow_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
    }
  }, [user]);

  const handleLogin = (userData: any) => {
    setUser(userData);
    setIsLoggedIn(true);
    setIsAuthOpen(false);
    localStorage.setItem('focusflow_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('focusflow_user');
  };

  const handleInviteFriends = () => {
    navigator.clipboard.writeText('https://focusflow.app/join/room123');
    showNotification(t('inviteCopied'));
    setActiveTab('community');
  };

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('focusflow_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [sessions, setSessions] = useState<FocusSession[]>(() => {
    const saved = localStorage.getItem('focusflow_sessions');
    return saved ? JSON.parse(saved) : [];
  });
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>(() => {
    const saved = localStorage.getItem('focusflow_daily_logs');
    return saved ? JSON.parse(saved) : [];
  });
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('focusflow_habits');
    return saved ? JSON.parse(saved) : [];
  });
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStat[]>(() => {
    const saved = localStorage.getItem('focusflow_weekly_stats');
    return saved ? JSON.parse(saved) : [
      { id: '1', userId: 'user1', weekNumber: 13, totalFocus: 24, completedTasks: 45, performanceScore: 82 },
      { id: '2', userId: 'user1', weekNumber: 14, totalFocus: 28, completedTasks: 52, performanceScore: 88 }
    ];
  });
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('focusflow_settings');
    return saved ? JSON.parse(saved) : { darkMode: true, soundEnabled: false };
  });
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', text: 'Salam! Let\'s crush our goals today! 🚀', senderId: 'system', senderName: 'FocusBot', timestamp: Date.now(), roomId: 'general' },
    { id: '2', text: 'I\'m working on the new UI design.', senderId: 'user2', senderName: 'Amine', timestamp: Date.now() - 100000, roomId: 'general' },
  ]);

  useEffect(() => {
    localStorage.setItem('focusflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('focusflow_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('focusflow_daily_logs', JSON.stringify(dailyLogs));
  }, [dailyLogs]);

  useEffect(() => {
    localStorage.setItem('focusflow_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('focusflow_weekly_stats', JSON.stringify(weeklyStats));
  }, [weeklyStats]);

  useEffect(() => {
    localStorage.setItem('focusflow_settings', JSON.stringify(settings));
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  const addTask = (title: string, category: Task['category']) => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      completed: false,
      createdAt: Date.now(),
      userId: 'user1',
      category
    };
    setTasks([newTask, ...tasks]);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const handleSessionComplete = (type: 'work' | 'break', duration: number) => {
    const newSession: FocusSession = {
      id: Math.random().toString(36).substr(2, 9),
      duration,
      timestamp: Date.now(),
      userId: 'user1',
      type
    };
    setSessions([newSession, ...sessions]);
  };

  const addDailyLog = (logData: Omit<DailyLog, 'id' | 'userId' | 'createdAt'>) => {
    const newLog: DailyLog = {
      ...logData,
      id: Math.random().toString(36).substr(2, 9),
      userId: 'user1',
      createdAt: Date.now()
    };
    setDailyLogs([newLog, ...dailyLogs]);
    showNotification(t('saved'));
  };

  const addHabit = (name: string, targetDays: number) => {
    const newHabit: Habit = {
      id: Math.random().toString(36).substr(2, 9),
      userId: 'user1',
      name,
      targetDays,
      completedDays: 0,
      createdAt: Date.now()
    };
    setHabits([newHabit, ...habits]);
    showNotification(t('addHabit'));
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const updateHabit = (id: string, completedDays: number) => {
    setHabits(habits.map(h => h.id === id ? { ...h, completedDays } : h));
  };

  const sendMessage = (text: string, type: 'text' | 'image' | 'file' = 'text', url?: string, fileName?: string) => {
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      senderId: 'user1',
      senderName: 'You',
      timestamp: Date.now(),
      roomId: 'general',
      type,
      url,
      fileName
    };
    setMessages([...messages, newMessage]);
  };

  if (!isLoggedIn) {
    return (
      <>
        <LandingPage onStart={() => setIsAuthOpen(true)} />
        <AnimatePresence>
          {isAuthOpen && (
            <Auth onLogin={handleLogin} onClose={() => setIsAuthOpen(false)} />
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <div className={cn(
      "flex flex-col md:flex-row h-screen w-full overflow-hidden bg-slate-950 font-sans text-slate-200",
      isRTL && "font-arabic"
    )}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'tasks') setIsAddTaskOpen(true);
        }} 
        onLogout={handleLogout}
        onInviteFriends={handleInviteFriends}
        user={user}
      />
      
      <main className="flex-1 relative overflow-hidden flex flex-col pb-16 md:pb-0">
        {/* Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <header className="h-16 md:h-20 border-b border-white/5 flex items-center justify-between px-6 md:px-12 z-10 shrink-0 bg-slate-950/50 backdrop-blur-xl">
          <div className={cn("flex items-center gap-4", isRTL && "flex-row-reverse")}>
            <Logo size="sm" iconOnly className="md:hidden" />
            <div className={cn("flex flex-col", isRTL && "items-end")}>
              <h1 className="text-sm md:text-base font-bold text-slate-200 capitalize tracking-tight">
                {t(activeTab as any)}
              </h1>
              <p className="hidden md:block text-[10px] text-slate-500 font-medium uppercase tracking-widest">FocusFlow Workspace</p>
            </div>
          </div>
          <div className={cn("flex items-center gap-3 md:gap-6", isRTL && "flex-row-reverse")}>
            <div className="hidden lg:flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
              <button 
                onClick={() => setLanguage('en')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer",
                  language === 'en' ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20" : "text-slate-500 hover:text-slate-300"
                )}
              >
                EN
              </button>
              <button 
                onClick={() => setLanguage('darija')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer",
                  language === 'darija' ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20" : "text-slate-500 hover:text-slate-300"
                )}
              >
                DR
              </button>
            </div>
            <button 
              onClick={() => setIsAddTaskOpen(true)}
              className="flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl md:rounded-2xl font-bold text-xs md:text-sm transition-all shadow-xl shadow-brand-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">{t('newTask')}</span>
            </button>
            <button 
              onClick={() => setActiveTab('focus')}
              className="hidden sm:flex items-center gap-3 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all cursor-pointer group"
            >
              <div className="w-2 h-2 bg-brand-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(14,165,233,0.5)] group-hover:scale-125 transition-transform" />
              <span className="text-xs font-bold text-slate-300 tracking-wide">{t('liveSession')}</span>
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-brand-400 to-indigo-500 border-2 border-white/20 hover:scale-110 transition-transform shadow-lg flex items-center justify-center text-white font-bold text-xs md:text-sm" 
            >
              {user?.name?.[0] || 'Y'}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 lg:p-12">
          <div className="max-w-7xl mx-auto h-full">
            <Dashboard 
              activeTab={activeTab} 
              setActiveTab={setActiveTab}
              tasks={tasks}
              sessions={sessions}
              messages={messages}
              dailyLogs={dailyLogs}
              habits={habits}
              weeklyStats={weeklyStats}
              addTask={addTask}
              toggleTask={toggleTask}
              deleteTask={deleteTask}
              updateTask={updateTask}
              sendMessage={sendMessage}
              handleSessionComplete={handleSessionComplete}
              addDailyLog={addDailyLog}
              addHabit={addHabit}
              deleteHabit={deleteHabit}
              updateHabit={updateHabit}
              setIsAddTaskOpen={setIsAddTaskOpen}
              onInviteFriends={handleInviteFriends}
              settings={settings}
              setSettings={setSettings}
              user={user}
            />
          </div>
        </div>

        {/* Global Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div 
              initial={{ opacity: 0, y: 20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 20, x: '-50%' }}
              className="fixed bottom-20 md:bottom-8 left-1/2 z-[200] bg-brand-500 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold flex items-center gap-3 border border-white/20 backdrop-blur-xl"
            >
              <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
              {notification}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Add Task Modal */}
        <AnimatePresence>
          {isAddTaskOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAddTaskOpen(false)}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-md glass-card p-8 flex flex-col gap-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">{t('addTask')}</h3>
                  <button onClick={() => setIsAddTaskOpen(false)} className="text-slate-500 hover:text-white">
                    <Zap className="w-5 h-5 rotate-45" />
                  </button>
                </div>
                
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const input = form.elements.namedItem('taskTitle') as HTMLInputElement;
                    const category = form.elements.namedItem('taskCategory') as HTMLSelectElement;
                    if (input.value.trim()) {
                      addTask(input.value.trim(), category.value as any);
                      setIsAddTaskOpen(false);
                    }
                  }}
                  className="flex flex-col gap-4"
                >
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('taskTitle')}</label>
                    <input 
                      name="taskTitle"
                      autoFocus
                      placeholder="What needs to be done?"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('category')}</label>
                    <select 
                      name="taskCategory"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50"
                    >
                      <option value="work">{t('work')}</option>
                      <option value="personal">{t('personal')}</option>
                      <option value="urgent">{t('urgent')}</option>
                    </select>
                  </div>
                  <button 
                    type="submit"
                    className="mt-4 w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-brand-500/20 transition-all"
                  >
                    {t('createTask')}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}
