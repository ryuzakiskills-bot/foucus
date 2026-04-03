import React from 'react';
import Logo from './Logo';
import { 
  LayoutDashboard, Timer as TimerIcon, CheckSquare, 
  BarChart3, MessageSquare, Settings, LogOut, Zap, Users, Share2, ShieldAlert
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useI18n, TranslationKey } from '../lib/I18nContext';
import { UserProfile } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  onInviteFriends: () => void;
  user: UserProfile | null;
}

export default function Sidebar({ activeTab, setActiveTab, onLogout, onInviteFriends, user }: SidebarProps) {
  const { t, isRTL } = useI18n();
  const menuItems: { id: string; icon: any; labelKey: TranslationKey }[] = [
    { id: 'dashboard', icon: LayoutDashboard, labelKey: 'dashboard' },
    { id: 'daily', icon: TimerIcon, labelKey: 'dailyTracker' },
    { id: 'weekly', icon: BarChart3, labelKey: 'weeklyAnalysis' },
    { id: 'habits', icon: Zap, labelKey: 'habitTracker' },
    { id: 'tasks', icon: CheckSquare, labelKey: 'tasks' },
    { id: 'community', icon: Users, labelKey: 'community' },
    { id: 'chat', icon: MessageSquare, labelKey: 'messages' },
    { id: 'settings', icon: Settings, labelKey: 'settings' },
  ];

  if (user?.role === 'admin') {
    menuItems.splice(menuItems.length - 1, 0, { id: 'admin', icon: ShieldAlert, labelKey: 'admin' as any });
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden md:flex w-64 h-full bg-slate-950 border-white/5 flex-col p-4 gap-8",
        isRTL ? "border-l" : "border-r"
      )}>
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
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200",
                isRTL && "flex-row-reverse"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-transform group-hover:scale-110",
                activeTab === item.id ? "text-brand-400" : "text-slate-500"
              )} />
              <span className="font-medium">{t(item.labelKey)}</span>
            </button>
          ))}
        </nav>

        <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
          <button 
            onClick={onInviteFriends}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 transition-all cursor-pointer group mb-2",
              isRTL && "flex-row-reverse"
            )}
          >
            <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-sm">{t('inviteFriends')}</span>
          </button>
          <button 
            onClick={onLogout}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer",
              isRTL && "flex-row-reverse"
            )}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">{t('logout')}</span>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 glass-card rounded-none border-x-0 border-b-0 z-50 flex items-center justify-around px-1">
        {menuItems.slice(0, user?.role === 'admin' ? 6 : 5).map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex flex-col items-center gap-1 p-1.5 rounded-lg transition-all cursor-pointer min-w-[60px]",
              activeTab === item.id ? "text-brand-400" : "text-slate-500"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[9px] font-medium truncate w-full text-center">{t(item.labelKey)}</span>
          </button>
        ))}
        <button
          onClick={() => setActiveTab('settings')}
          className={cn(
            "flex flex-col items-center gap-1 p-1.5 rounded-lg transition-all cursor-pointer min-w-[60px]",
            activeTab === 'settings' ? "text-brand-400" : "text-slate-500"
          )}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[9px] font-medium">{t('settings')}</span>
        </button>
      </div>
    </>
  );
}
