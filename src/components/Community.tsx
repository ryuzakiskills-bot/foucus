import React, { useState, useRef, useEffect } from 'react';
import { 
  Users, Volume2, Mic, MicOff, PhoneOff, 
  Trophy, Flame, Search, Plus, Globe, Lock, CheckCircle2,
  Monitor, Share2, X, MoreVertical, Settings, UserPlus,
  Send, Image as ImageIcon, Paperclip, MessageSquare,
  User, Shield, Mail, ExternalLink, ChevronRight, Smile
} from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface Room {
  id: string;
  name: string;
  type: 'public' | 'private';
  participants: number;
  creator: string;
}

interface Message {
  id: string;
  sender: string;
  senderAvatar?: string;
  text: string;
  timestamp: number;
  type: 'text' | 'image' | 'file';
  url?: string;
}

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  bio: string;
  joinedDate: string;
  focusHours: number;
  rank: string;
}

export default function Community() {
  const [isInVoice, setIsInVoice] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [joinedGroups, setJoinedGroups] = useState<number[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  // Room State
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [roomName, setRoomName] = useState('');
  const [roomType, setRoomType] = useState<'public' | 'private'>('public');
  const [activeTab, setActiveTab] = useState<'stage' | 'chat' | 'members'>('stage');

  // Chat State
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'Amine', text: 'Salam everyone! Ready for deep work?', timestamp: Date.now() - 10000, type: 'text' },
    { id: '2', sender: 'Sara', text: 'Yes! Let\'s crush it.', timestamp: Date.now() - 5000, type: 'text' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // User/Private Chat State
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isPrivateChatOpen, setIsPrivateChatOpen] = useState(false);
  const [privateMessages, setPrivateMessages] = useState<Record<string, Message[]>>({});

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'You',
      text: newMessage,
      timestamp: Date.now(),
      type: 'text'
    };

    setMessages(prev => [...prev, msg]);
    setNewMessage('');
    setShowEmojiPicker(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const msg: Message = {
        id: Math.random().toString(36).substr(2, 9),
        sender: 'You',
        text: type === 'image' ? 'Sent an image' : `Sent a file: ${file.name}`,
        timestamp: Date.now(),
        type: type,
        url: url
      };
      setMessages(prev => [...prev, msg]);
      showNotification(`${type === 'image' ? 'Image' : 'File'} uploaded!`);
    }
  };

  const onEmojiClick = (emojiData: any) => {
    setNewMessage(prev => prev + emojiData.emoji);
  };

  const users: UserProfile[] = [
    { id: '1', name: 'Amine', avatar: 'A', status: 'online', bio: 'Focusing on SaaS development.', joinedDate: 'Jan 2024', focusHours: 124, rank: 'Elite' },
    { id: '2', name: 'Sara', avatar: 'S', status: 'idle', bio: 'Student & Designer.', joinedDate: 'Feb 2024', focusHours: 89, rank: 'Master' },
    { id: '3', name: 'Yassine', avatar: 'Y', status: 'online', bio: 'Deep work enthusiast.', joinedDate: 'Mar 2024', focusHours: 256, rank: 'Grandmaster' },
  ];

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const groups = [
    { id: 1, name: 'Deep Work Warriors', members: 124, active: 12, type: 'public', tags: ['Coding', 'Design'] },
    { id: 2, name: 'Morning Focus Club', members: 89, active: 5, type: 'public', tags: ['Study', 'Reading'] },
    { id: 3, name: 'Productivity Masters', members: 256, active: 42, type: 'private', tags: ['Business'] },
  ];

  const handleJoinGroup = (id: number) => {
    setJoinedGroups(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
  };

  const leaderboard = [
    { name: 'Amine', hours: 42, rank: 1, avatar: 'A' },
    { name: 'Yassine', hours: 38, rank: 2, avatar: 'Y' },
    { name: 'Sara', hours: 35, rank: 3, avatar: 'S' },
  ];

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) return;
    
    const newRoom: Room = {
      id: Math.random().toString(36).substr(2, 9),
      name: roomName,
      type: roomType,
      participants: 1,
      creator: 'You'
    };
    
    setActiveRoom(newRoom);
    setIsCreatingRoom(false);
    setRoomName('');
    showNotification(`Room "${newRoom.name}" created!`);
  };

  const toggleScreenShare = async () => {
    if (isSharingScreen) {
      if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
      }
      setScreenStream(null);
      setIsSharingScreen(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setScreenStream(stream);
        setIsSharingScreen(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        stream.getVideoTracks()[0].onended = () => {
          setIsSharingScreen(false);
          setScreenStream(null);
        };
      } catch (err) {
        console.error("Error sharing screen:", err);
        showNotification("Screen sharing cancelled or failed.");
      }
    }
  };

  useEffect(() => {
    if (isSharingScreen && videoRef.current && screenStream) {
      videoRef.current.srcObject = screenStream;
    }
  }, [isSharingScreen, screenStream]);

  const handleInvite = () => {
    const link = `https://focusflow.app/join/${activeRoom?.id}`;
    navigator.clipboard.writeText(link);
    showNotification("Invite link copied to clipboard!");
  };

  if (activeRoom) {
    return (
      <div className="h-full flex flex-col gap-4 md:gap-6">
        {/* Room Header */}
        <div className="flex flex-row items-center justify-between glass-card p-3 md:p-4 gap-2 md:gap-4">
          <div className="flex items-center gap-2 md:gap-4 min-w-0">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-brand-500/20 flex items-center justify-center shrink-0">
              <Monitor className="w-4 h-4 md:w-5 md:h-5 text-brand-400" />
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-sm md:text-lg truncate">{activeRoom.name}</h2>
              <div className="flex items-center gap-1.5 md:gap-2">
                <span className="text-[7px] md:text-[10px] uppercase tracking-widest text-slate-500 truncate">{activeRoom.type}</span>
                <div className="w-0.5 h-0.5 rounded-full bg-slate-700 shrink-0" />
                <span className="text-[9px] md:text-xs text-brand-400 truncate">{activeRoom.participants} online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 md:gap-4 shrink-0">
            <div className="hidden xs:flex items-center gap-1 md:gap-2">
              <button 
                onClick={handleInvite}
                className="p-1.5 md:p-2 hover:bg-white/5 rounded-lg transition-all text-slate-400 hover:text-white"
                title="Invite Friends"
              >
                <UserPlus className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
            <button 
              onClick={() => {
                if (screenStream) screenStream.getTracks().forEach(t => t.stop());
                setActiveRoom(null);
                setIsSharingScreen(false);
              }}
              className="bg-rose-500 hover:bg-rose-600 text-white px-2.5 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[10px] md:text-sm font-bold transition-all flex items-center gap-1.5 md:gap-2"
            >
              <PhoneOff className="w-3 h-3 md:w-4 md:h-4" />
              <span>Leave</span>
            </button>
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="lg:hidden flex p-1 bg-white/5 rounded-xl border border-white/10">
          <button 
            onClick={() => setActiveTab('stage')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-bold rounded-lg transition-all",
              activeTab === 'stage' ? "bg-brand-500 text-white shadow-lg" : "text-slate-400 hover:text-white"
            )}
          >
            <Monitor className="w-3 h-3" />
            Stage
          </button>
          <button 
            onClick={() => setActiveTab('chat')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-bold rounded-lg transition-all",
              activeTab === 'chat' ? "bg-brand-500 text-white shadow-lg" : "text-slate-400 hover:text-white"
            )}
          >
            <MessageSquare className="w-3 h-3" />
            Chat
          </button>
          <button 
            onClick={() => setActiveTab('members')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-bold rounded-lg transition-all",
              activeTab === 'members' ? "bg-brand-500 text-white shadow-lg" : "text-slate-400 hover:text-white"
            )}
          >
            <Users className="w-3 h-3" />
            Members
          </button>
        </div>

        {/* Room Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 min-h-0 overflow-hidden">
          {/* Main Stage */}
          <div className={cn(
            "lg:col-span-6 flex flex-col gap-10 min-h-0",
            activeTab !== 'stage' && "hidden lg:flex"
          )}>
            <div className="flex-1 glass-card bg-slate-950/50 relative overflow-hidden flex items-center justify-center border-brand-500/10 min-h-[500px] md:min-h-0">
              {isSharingScreen ? (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-4 md:gap-6 text-center p-8 md:p-12 pb-24 md:pb-32">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <Monitor className="w-8 h-8 md:w-10 md:h-10 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold">No one is sharing</h3>
                    <p className="text-slate-500 text-xs md:text-sm mt-2 max-w-xs">Start sharing your screen to collaborate with others in real-time.</p>
                  </div>
                  <button 
                    onClick={toggleScreenShare}
                    className="mt-4 bg-brand-500 hover:bg-brand-600 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-brand-500/20 text-sm"
                  >
                    Share Screen
                  </button>
                </div>
              )}

              {/* Overlay Controls */}
              <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-3 bg-slate-900/80 backdrop-blur-xl p-1.5 md:p-2 rounded-xl md:rounded-2xl border border-white/10 shadow-2xl">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className={cn(
                    "p-2 md:p-3 rounded-lg md:rounded-xl transition-all",
                    isMuted ? "bg-rose-500 text-white" : "hover:bg-white/10 text-slate-300"
                  )}
                >
                  {isMuted ? <MicOff className="w-4 h-4 md:w-5 md:h-5" /> : <Mic className="w-4 h-4 md:w-5 md:h-5" />}
                </button>
                <button 
                  onClick={toggleScreenShare}
                  className={cn(
                    "p-2 md:p-3 rounded-lg md:rounded-xl transition-all",
                    isSharingScreen ? "bg-brand-500 text-white" : "hover:bg-white/10 text-slate-300"
                  )}
                >
                  <Monitor className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <div className="w-px h-5 md:h-6 bg-white/10 mx-0.5 md:mx-1" />
                <button className="p-2 md:p-3 hover:bg-white/10 rounded-lg md:rounded-xl transition-all text-slate-300">
                  <MoreVertical className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Chat Sidebar */}
          <div className={cn(
            "lg:col-span-3 glass-card flex flex-col min-h-0 bg-slate-900/30 overflow-hidden",
            activeTab !== 'chat' && "hidden lg:flex"
          )}>
            <div className="p-4 md:p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2 text-sm md:text-base">
                <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-brand-400" />
                Room Chat
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4 md:gap-6 custom-scrollbar">
              {messages.map((msg) => (
                <div key={msg.id} className={cn(
                  "flex flex-col gap-1 max-w-[90%] md:max-w-[85%]",
                  msg.sender === 'You' ? "ml-auto items-end" : "items-start"
                )}>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] md:text-[10px] font-bold text-slate-500">{msg.sender}</span>
                    <span className="text-[8px] md:text-[10px] text-slate-600">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className={cn(
                    "px-2.5 md:px-3 py-1.5 md:py-2 rounded-xl md:rounded-2xl text-xs md:text-sm",
                    msg.sender === 'You' ? "bg-brand-500 text-white rounded-tr-none" : "bg-white/5 text-slate-200 rounded-tl-none border border-white/5"
                  )}>
                    {msg.type === 'text' && msg.text}
                    {msg.type === 'image' && (
                      <div className="flex flex-col gap-2">
                        <img src={msg.url} alt="Shared" className="rounded-lg w-full h-auto" referrerPolicy="no-referrer" />
                        <span className="text-[8px] md:text-[10px] opacity-70">{msg.text}</span>
                      </div>
                    )}
                    {msg.type === 'file' && (
                      <div className="flex items-center gap-2 bg-black/20 p-2 rounded-lg">
                        <Paperclip className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="text-[10px] md:text-xs truncate max-w-[80px] md:max-w-[100px]">{msg.text}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-3 md:p-4 border-t border-white/5 flex flex-col gap-2 w-full relative">
              <div className="flex items-center gap-2 w-full min-w-0">
                <input 
                  type="file" 
                  ref={imageInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={(e) => handleFileChange(e, 'image')} 
                />
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={(e) => handleFileChange(e, 'file')} 
                />
                <button 
                  type="button" 
                  onClick={() => imageInputRef.current?.click()}
                  className="p-1.5 md:p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-brand-400 transition-all"
                  title="Send Image"
                >
                  <ImageIcon className="w-3 h-3 md:w-4 md:h-4" />
                </button>
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 md:p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-brand-400 transition-all"
                  title="Send File"
                >
                  <Paperclip className="w-3 h-3 md:w-4 md:h-4" />
                </button>
                <input 
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-lg md:rounded-xl px-2.5 md:px-3 py-1.5 md:py-2 text-[10px] md:text-xs outline-none focus:border-brand-500/50 transition-all"
                />
                <button 
                  type="button" 
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-1.5 md:p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-brand-400 transition-all"
                >
                  <Smile className="w-3 h-3 md:w-4 md:h-4" />
                </button>
                <button 
                  type="submit"
                  className="p-1.5 md:p-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-all"
                >
                  <Send className="w-3 h-3 md:w-4 md:h-4" />
                </button>
              </div>
              {showEmojiPicker && (
                <div className="absolute bottom-16 right-0 z-[100] shadow-2xl rounded-2xl overflow-hidden border border-white/10">
                  <EmojiPicker onEmojiClick={onEmojiClick} theme={'dark' as any} />
                </div>
              )}
            </form>
          </div>

          {/* Participants Sidebar */}
          <div className={cn(
            "lg:col-span-3 glass-card p-6 md:p-8 flex flex-col gap-6 md:gap-8 bg-slate-900/30",
            activeTab !== 'members' && "hidden lg:flex"
          )}>
            <h3 className="font-bold flex items-center gap-2 text-sm md:text-base">
              <Users className="w-4 h-4 md:w-5 md:h-5 text-brand-400" />
              Members
            </h3>
            <div className="space-y-4 md:space-y-6 overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between group cursor-pointer" onClick={() => setSelectedUser(users[2])}>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-brand-500 flex items-center justify-center font-bold text-xs md:text-sm">
                      Y
                    </div>
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-brand-500 border-2 border-slate-900 rounded-full" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs md:text-sm font-bold">You</span>
                    <span className="text-[8px] md:text-[10px] text-brand-400 font-medium">Host</span>
                  </div>
                </div>
              </div>
              
              {/* Real-ish Participants */}
              {users.filter(u => u.name !== 'Yassine').map(user => (
                <div 
                  key={user.id} 
                  className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2 -mx-2 rounded-xl transition-all"
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs md:text-sm text-slate-400 border border-white/5">
                        {user.avatar}
                      </div>
                      <div className={cn(
                        "absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 border-2 border-slate-900 rounded-full",
                        user.status === 'online' ? "bg-brand-500" : 
                        user.status === 'idle' ? "bg-amber-500" : "bg-slate-500"
                      )} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs md:text-sm font-bold">{user.name}</span>
                      <span className="text-[8px] md:text-[10px] text-slate-500 font-medium capitalize">{user.status}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-slate-600 opacity-0 group-hover:opacity-100 transition-all" />
                </div>
              ))}
            </div>

            <div className="mt-auto pt-4 md:pt-6 border-t border-white/5">
              <button 
                onClick={handleInvite}
                className="w-full py-2.5 md:py-3 rounded-lg md:rounded-xl bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 text-[10px] md:text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-3 h-3 md:w-4 md:h-4" />
                Invite Friends
              </button>
            </div>
          </div>
        </div>

        {/* User Profile Modal */}
        <AnimatePresence>
          {selectedUser && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedUser(null)}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-sm glass-card overflow-hidden shadow-2xl border-brand-500/20"
              >
                {/* Profile Header */}
                <div className="h-24 bg-gradient-to-r from-brand-600 to-indigo-600 relative">
                  <button 
                    onClick={() => setSelectedUser(null)}
                    className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full transition-all text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="px-6 pb-6 relative">
                  <div className="absolute -top-12 left-6">
                    <div className="w-24 h-24 rounded-3xl bg-slate-900 p-1">
                      <div className="w-full h-full rounded-2xl bg-brand-500 flex items-center justify-center text-3xl font-bold border-4 border-slate-900">
                        {selectedUser.avatar}
                      </div>
                    </div>
                    <div className={cn(
                      "absolute bottom-2 right-2 w-6 h-6 border-4 border-slate-900 rounded-full",
                      selectedUser.status === 'online' ? "bg-emerald-500" : "bg-amber-500"
                    )} />
                  </div>

                  <div className="mt-14 flex flex-col gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-2xl font-bold">{selectedUser.name}</h3>
                        <span className="px-2 py-0.5 rounded-md bg-brand-500/10 text-brand-400 text-[10px] font-bold uppercase tracking-widest">
                          {selectedUser.rank}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm mt-1">{selectedUser.bio}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Focus Hours</span>
                        <span className="text-lg font-bold text-brand-400">{selectedUser.focusHours}h</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Member Since</span>
                        <span className="text-lg font-bold text-slate-200">{selectedUser.joinedDate}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => {
                          setIsPrivateChatOpen(true);
                          setSelectedUser(null);
                        }}
                        className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Send Message
                      </button>
                      <div className="grid grid-cols-2 gap-2">
                        <button className="py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
                          <UserPlus className="w-3 h-3" />
                          Add Friend
                        </button>
                        <button className="py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
                          <Shield className="w-3 h-3" />
                          Report
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Private Chat Modal */}
        <AnimatePresence>
          {isPrivateChatOpen && (
            <div className="fixed bottom-8 right-8 z-[120] w-80 h-96 glass-card flex flex-col shadow-2xl border-brand-500/30 overflow-hidden">
              <div className="p-4 bg-brand-500 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                    S
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold">Sara</span>
                    <span className="text-[8px] opacity-80">Private Message</span>
                  </div>
                </div>
                <button onClick={() => setIsPrivateChatOpen(false)}>
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 custom-scrollbar bg-slate-900/50">
                <div className="text-[10px] text-center text-slate-500 my-2">This is the start of your private conversation.</div>
                <div className="bg-white/5 p-2 rounded-xl rounded-tl-none text-xs text-slate-300 max-w-[80%] border border-white/5">
                  Hey! How is your focus session going?
                </div>
                <div className="bg-brand-500 p-2 rounded-xl rounded-tr-none text-xs text-white max-w-[80%] ml-auto">
                  It's going great! Just finished a 25min block.
                </div>
              </div>

              <div className="p-3 border-t border-white/5 bg-slate-900">
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    placeholder="Type a message..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[10px] outline-none focus:border-brand-500/50 transition-all"
                  />
                  <button className="p-2 bg-brand-500 rounded-lg text-white">
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 h-full overflow-y-auto custom-scrollbar pr-2">
      {/* Main Community Content */}
      <div className="xl:col-span-2 flex flex-col gap-8">
        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 right-8 z-50 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg font-bold flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              {notification}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create Room Modal */}
        <AnimatePresence>
          {isCreatingRoom && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsCreatingRoom(false)}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-md glass-card p-8 shadow-2xl border-brand-500/20"
              >
                <button 
                  onClick={() => setIsCreatingRoom(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>

                <div className="flex flex-col gap-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold">Create New Room</h3>
                    <p className="text-slate-400 text-sm mt-1">Start a focus room and invite your team.</p>
                  </div>

                  <form onSubmit={handleCreateRoom} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Room Name</label>
                      <input 
                        type="text" 
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        placeholder="e.g. Deep Work Session"
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500/50 transition-all"
                        autoFocus
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Privacy</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          type="button"
                          onClick={() => setRoomType('public')}
                          className={cn(
                            "flex items-center gap-2 px-4 py-3 rounded-xl border transition-all text-sm font-medium",
                            roomType === 'public' ? "bg-brand-500/20 border-brand-500 text-brand-400" : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                          )}
                        >
                          <Globe className="w-4 h-4" />
                          Public
                        </button>
                        <button 
                          type="button"
                          onClick={() => setRoomType('private')}
                          className={cn(
                            "flex items-center gap-2 px-4 py-3 rounded-xl border transition-all text-sm font-medium",
                            roomType === 'private' ? "bg-brand-500/20 border-brand-500 text-brand-400" : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                          )}
                        >
                          <Lock className="w-4 h-4" />
                          Private
                        </button>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="mt-4 w-full py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-brand-500/20"
                    >
                      Create Room
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search groups, friends, or topics..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm outline-none focus:border-brand-500/50 transition-all"
            />
          </div>
          <button 
            onClick={() => setIsCreatingRoom(true)}
            className="glass-button bg-brand-500 hover:bg-brand-600 text-white border-none w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            Create Room
          </button>
        </div>

        {/* Voice Hub */}
        <div className="glass-card p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-[80px] -mr-32 -mt-32 group-hover:bg-brand-500/20 transition-all duration-500" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col gap-2 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Focus Voice Hub</h2>
              <p className="text-slate-400 text-sm max-w-md">Join a live voice session to work alongside others. No distractions, just pure focus.</p>
              
              <div className="flex items-center gap-4 mt-2 md:mt-4 justify-center md:justify-start">
                <div className="flex -space-x-2 md:-space-x-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-[10px] md:text-xs font-bold">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-slate-950 bg-brand-500 flex items-center justify-center text-[10px] md:text-xs font-bold">
                    +8
                  </div>
                </div>
                <span className="text-xs md:text-sm text-brand-400 font-medium">12 people focusing now</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 md:gap-4">
              <AnimatePresence mode="wait">
                {!isInVoice ? (
                  <motion.button
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={() => {
                      setIsInVoice(true);
                      showNotification('Connected to Voice Hub!');
                    }}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-brand-500 hover:bg-brand-600 flex items-center justify-center shadow-xl shadow-brand-500/40 group/btn transition-all cursor-pointer"
                  >
                    <Volume2 className="w-8 h-8 md:w-10 md:h-10 text-white group-hover/btn:scale-110 transition-transform" />
                  </motion.button>
                ) : (
                  <div className="flex flex-col items-center gap-4 md:gap-6">
                    <div className="flex items-center gap-3 md:gap-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsMuted(!isMuted)}
                        className={cn(
                          "w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all cursor-pointer",
                          isMuted ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" : "bg-brand-500/20 text-brand-400 border border-brand-500/30"
                        )}
                      >
                        {isMuted ? <MicOff className="w-5 h-5 md:w-6 md:h-6" /> : <Mic className="w-5 h-5 md:w-6 md:h-6" />}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsInVoice(false)}
                        className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/20 cursor-pointer"
                      >
                        <PhoneOff className="w-5 h-5 md:w-6 md:h-6" />
                      </motion.button>
                    </div>
                    {/* Visualizer */}
                    {!isMuted && (
                      <div className="flex items-center gap-1 h-6 md:h-8">
                        {[1, 2, 3, 4, 5].map(i => (
                          <motion.div
                            key={i}
                            animate={{ height: [6, 18, 10, 24, 6] }}
                            transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                            className="w-1 bg-brand-400 rounded-full"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </AnimatePresence>
              <span className="text-[10px] md:text-sm font-bold tracking-widest uppercase text-slate-500">
                {isInVoice ? (isMuted ? 'Muted' : 'Speaking...') : 'Join Voice'}
              </span>
            </div>
          </div>
        </div>

        {/* Groups Grid */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Globe className="w-5 h-5 text-brand-400" />
              Trending Groups
            </h3>
            <button className="text-sm text-brand-400 hover:underline">View All</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.map(group => (
              <motion.div 
                key={group.id}
                whileHover={{ y: -4 }}
                className="glass-card p-6 flex flex-col gap-4 hover:border-brand-500/30 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                    <Users className="w-6 h-6 text-brand-400" />
                  </div>
                  {group.type === 'private' ? <Lock className="w-4 h-4 text-slate-500" /> : <Globe className="w-4 h-4 text-slate-500" />}
                </div>
                
                <div>
                  <h4 className="font-bold text-lg">{group.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500">{group.members} members</span>
                    <div className="w-1 h-1 rounded-full bg-slate-700" />
                    <span className="text-xs text-brand-400 font-medium">{group.active} online</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {group.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-1 rounded-md bg-white/5 text-slate-400 border border-white/5">
                      #{tag}
                    </span>
                  ))}
                </div>

                <button 
                  onClick={() => handleJoinGroup(group.id)}
                  className={cn(
                    "w-full py-2 rounded-xl transition-all text-sm font-bold border",
                    joinedGroups.includes(group.id) 
                      ? "bg-brand-500/20 text-brand-400 border-brand-500/30 hover:bg-brand-500/30" 
                      : "bg-white/5 hover:bg-brand-500 hover:text-white border-white/10"
                  )}
                >
                  {joinedGroups.includes(group.id) ? 'Joined' : 'Join Group'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar Content */}
      <div className="flex flex-col gap-8">
        {/* Leaderboard */}
        <div className="glass-card p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              Top Focusers
            </h3>
            <span className="text-xs text-slate-500">This Week</span>
          </div>

          <div className="space-y-4">
            {leaderboard.map((user, idx) => (
              <div key={idx} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold border-2",
                    idx === 0 ? "bg-amber-500/10 border-amber-500 text-amber-500" :
                    idx === 1 ? "bg-slate-400/10 border-slate-400 text-slate-400" :
                    "bg-orange-500/10 border-orange-500 text-orange-500"
                  )}>
                    {user.avatar}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">{user.name}</span>
                    <span className="text-xs text-slate-500">{user.hours}h focused</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Flame className={cn(
                    "w-4 h-4",
                    idx === 0 ? "text-amber-500" : "text-slate-500"
                  )} />
                  <span className="text-xs font-bold">#{user.rank}</span>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-xs font-bold border border-white/10">
            View Full Leaderboard
          </button>
        </div>

        {/* Activity Feed */}
        <div className="glass-card p-6 flex flex-col gap-6">
          <h3 className="text-lg font-bold">Live Activity</h3>
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4 relative">
                {i !== 3 && <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-white/5" />}
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 shrink-0" />
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-slate-300">
                    <span className="font-bold text-white">User_{i}</span> started a focus session in <span className="text-brand-400">Deep Work Warriors</span>
                  </p>
                  <span className="text-[10px] text-slate-500">2 minutes ago</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
