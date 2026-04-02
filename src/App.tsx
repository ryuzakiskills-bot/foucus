import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Sidebar from './components/Sidebar';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import Logo from './components/Logo';
import { Task, FocusSession, ChatMessage } from './types';
import { Zap, Plus } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  
  const [user, setUser] = useState<any>(() => {
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

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('focusflow_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [sessions, setSessions] = useState<FocusSession[]>(() => {
    const saved = localStorage.getItem('focusflow_sessions');
    return saved ? JSON.parse(saved) : [];
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

  const sendMessage = (text: string) => {
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      senderId: 'user1',
      senderName: 'You',
      timestamp: Date.now(),
      roomId: 'general'
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
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden bg-slate-950 font-sans text-slate-200">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'tasks') setIsAddTaskOpen(true);
        }} 
        onLogout={handleLogout}
      />
      
      <main className="flex-1 relative overflow-hidden flex flex-col pb-16 md:pb-0">
        {/* Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

        <header className="h-16 border-b border-white/5 flex items-center justify-between px-4 md:px-8 z-10 shrink-0 bg-slate-950/50 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <Logo size="sm" iconOnly className="md:hidden" />
            <div className="flex flex-col">
              <h1 className="text-sm font-medium text-slate-400 capitalize">{activeTab}</h1>
              <p className="text-xs text-slate-500">Welcome back, Focus Master</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => setIsAddTaskOpen(true)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold text-[10px] sm:text-xs transition-all shadow-lg shadow-brand-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden xs:inline">Quick Task</span>
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
              <div className="w-2 h-2 bg-brand-400 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-slate-300">Live Session</span>
            </div>
            <button 
              onClick={() => setActiveTab('settings')}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-indigo-500 border border-white/20 hover:scale-110 transition-transform" 
            />
          </div>
        </header>

        <Dashboard 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tasks={tasks}
          sessions={sessions}
          messages={messages}
          addTask={addTask}
          toggleTask={toggleTask}
          deleteTask={deleteTask}
          sendMessage={sendMessage}
          handleSessionComplete={handleSessionComplete}
          setIsAddTaskOpen={setIsAddTaskOpen}
          settings={settings}
          setSettings={setSettings}
        />

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
                  <h3 className="text-xl font-bold">Add New Task</h3>
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
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Task Title</label>
                    <input 
                      name="taskTitle"
                      autoFocus
                      placeholder="What needs to be done?"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Category</label>
                    <select 
                      name="taskCategory"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50"
                    >
                      <option value="work">Work</option>
                      <option value="personal">Personal</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <button 
                    type="submit"
                    className="mt-4 w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-brand-500/20 transition-all"
                  >
                    Create Task
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
