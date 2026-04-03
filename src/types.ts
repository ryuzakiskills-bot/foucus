export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
  userId: string;
  category: 'work' | 'personal' | 'urgent';
}

export interface Goal {
  id: string;
  title: string;
  targetDate: string;
  progress: number;
  userId: string;
}

export interface FocusSession {
  id: string;
  duration: number; // in minutes
  timestamp: number;
  userId: string;
  type: 'work' | 'break';
}

export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: number;
  roomId: string;
  type?: 'text' | 'image' | 'file';
  url?: string;
  fileName?: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  status: 'online' | 'busy' | 'offline';
  lastActive: number;
  role: 'user' | 'admin';
  is_approved: boolean;
  language?: 'en' | 'darija';
  theme?: 'light' | 'dark';
  created_at: string;
}

export interface Invitation {
  id: string;
  email: string;
  token: string;
  role: 'user' | 'admin';
  expires_at: string;
  used: boolean;
  created_at: string;
}

export interface DailyLog {
  id: string;
  userId: string;
  date: string; // ISO date string
  focusHours: number;
  productivityScore: number; // 0-100
  mood: 'happy' | 'neutral' | 'tired';
  notes: string;
  createdAt: number;
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  targetDays: number;
  completedDays: number;
  createdAt: number;
}

export interface WeeklyStat {
  id: string;
  userId: string;
  weekNumber: number;
  totalFocus: number;
  completedTasks: number;
  performanceScore: number;
}
