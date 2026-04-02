import React from 'react';
import Logo from './Logo';
import { 
  LayoutDashboard, Timer as TimerIcon, CheckSquare, 
  BarChart3, MessageSquare, Settings, LogOut, Zap, Users
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'focus', icon: TimerIcon, label: 'Focus' },
    { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
    { id: 'community', icon: Users, label: 'Community' },
    { id: 'chat', icon: MessageSquare, label: 'Messages' },
    { id: 'analytics', icon: BarChart3, label: 'Stats' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 h-full bg-slate-950 border-r border-white/5 flex-col p-4 gap-8">
        <Logo size="sm" className="px-2" />

        <nav className="flex-1 flex flex-col gap-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer",
                activeTab === item.id 
                  ? "bg-brand-500/10 text-brand-400 border border-brand-500/20" 
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-transform group-hover:scale-110",
                activeTab === item.id ? "text-brand-400" : "text-slate-500"
              )} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 glass-card rounded-none border-x-0 border-b-0 z-50 flex items-center justify-around px-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg transition-all cursor-pointer",
              activeTab === item.id ? "text-brand-400" : "text-slate-500"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </>
  );
}
