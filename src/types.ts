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
}

export interface UserProfile {
  uid: string;
  displayName: string;
  photoURL: string;
  status: 'online' | 'busy' | 'offline';
  lastActive: number;
}
