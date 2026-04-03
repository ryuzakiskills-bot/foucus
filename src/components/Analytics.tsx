import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { FocusSession } from '../types';
import { 
  format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, 
  startOfDay, endOfDay, eachHourOfInterval, isSameHour,
  startOfMonth, endOfMonth, isSameMonth, subDays
} from 'date-fns';
import { Zap, Clock, Target, TrendingUp } from 'lucide-react';

interface AnalyticsProps {
  sessions: FocusSession[];
  timeframe?: 'daily' | 'weekly' | 'monthly';
}

export default function Analytics({ sessions, timeframe = 'weekly' }: AnalyticsProps) {
  // Process data based on timeframe
  const getChartData = () => {
    const now = new Date();
    
    if (timeframe === 'daily') {
      return eachHourOfInterval({
        start: startOfDay(now),
        end: endOfDay(now)
      }).map(hour => {
        const hourSessions = sessions.filter(s => isSameHour(new Date(s.timestamp), hour));
        const totalMinutes = hourSessions.reduce((acc, s) => acc + s.duration, 0);
        return {
          name: format(hour, 'HH:mm'),
          minutes: totalMinutes
        };
      });
    }
    
    if (timeframe === 'monthly') {
      // Last 30 days
      const days = [];
      for (let i = 29; i >= 0; i--) {
        days.push(subDays(now, i));
      }
      return days.map(day => {
        const daySessions = sessions.filter(s => isSameDay(new Date(s.timestamp), day));
        const totalMinutes = daySessions.reduce((acc, s) => acc + s.duration, 0);
        return {
          name: format(day, 'MMM d'),
          minutes: totalMinutes
        };
      });
    }

    // Default: Weekly (Last 7 days)
    const days = [];
    for (let i = 6; i >= 0; i--) {
      days.push(subDays(now, i));
    }
    return days.map(day => {
      const daySessions = sessions.filter(s => isSameDay(new Date(s.timestamp), day));
      const totalMinutes = daySessions.reduce((acc, s) => acc + s.duration, 0);
      return {
        name: format(day, 'EEE'),
        minutes: totalMinutes
      };
    });
  };

  const chartData = getChartData();

  const totalFocusTime = sessions.reduce((acc, s) => acc + s.duration, 0);
  const totalSessions = sessions.length;
  const avgSession = totalSessions > 0 ? Math.round(totalFocusTime / totalSessions) : 0;

  const stats = [
    { label: 'Total Focus', value: `${Math.round(totalFocusTime / 60)}h ${totalFocusTime % 60}m`, icon: Clock, color: 'text-brand-400' },
    { label: 'Sessions', value: totalSessions, icon: Zap, color: 'text-amber-400' },
    { label: 'Avg Session', value: `${avgSession}m`, icon: Target, color: 'text-emerald-400' },
    { label: 'Growth', value: '+12%', icon: TrendingUp, color: 'text-indigo-400' },
  ];

  return (
    <div className="flex flex-col gap-8 h-full overflow-y-auto custom-scrollbar pr-2">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-card p-6 flex flex-col gap-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500" />
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
            <span className="text-2xl font-bold tracking-tight">{stat.value}</span>
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="glass-card p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold tracking-tight capitalize">{timeframe} Progress</h3>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-brand-500" />
              <span className="text-xs text-slate-400">Focus Minutes</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#475569" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10} 
                  interval={timeframe === 'monthly' ? 4 : 0}
                />
                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#0ea5e9', fontWeight: 'bold' }}
                  cursor={{ stroke: '#0ea5e9', strokeWidth: 1 }}
                />
                <Area type="monotone" dataKey="minutes" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorMin)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold tracking-tight capitalize">{timeframe} Distribution</h3>
            <span className="text-xs text-slate-500">
              {timeframe === 'daily' ? 'Today' : timeframe === 'weekly' ? 'Last 7 Days' : 'Last 30 Days'}
            </span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#475569" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10} 
                  interval={timeframe === 'monthly' ? 4 : 0}
                />
                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  cursor={{ fill: '#ffffff05' }}
                />
                <Bar dataKey="minutes" fill="#0ea5e9" radius={[6, 6, 0, 0]} barSize={timeframe === 'monthly' ? 10 : 40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
