import React, { useState, useRef, useEffect } from 'react';
import { 
  Users, Volume2, Mic, MicOff, PhoneOff, 
  Trophy, Flame, Search, Plus, Globe, Lock, CheckCircle2,
  Monitor, Share2, X, MoreVertical, Settings, UserPlus
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface Room {
  id: string;
  name: string;
  type: 'public' | 'private';
  participants: number;
  creator: string;
}

export default function Community() {
  const [isInVoice, setIsInVoice] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [joinedGroups, setJoinedGroups] = useState<number[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  
  // Room State
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [roomName, setRoomName] = useState('');
  const [roomType, setRoomType] = useState<'public' | 'private'>('public');

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
      <div className="h-full flex flex-col gap-6">
        {/* Room Header */}
        <div className="flex items-center justify-between glass-card p-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center">
              <Monitor className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h2 className="font-bold text-lg">{activeRoom.name}</h2>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest text-slate-500">{activeRoom.type} Room</span>
                <div className="w-1 h-1 rounded-full bg-slate-700" />
                <span className="text-xs text-emerald-400">{activeRoom.participants} participant</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleInvite}
              className="p-2 hover:bg-white/5 rounded-lg transition-all text-slate-400 hover:text-white"
              title="Invite Friends"
            >
              <UserPlus className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-white/5 rounded-lg transition-all text-slate-400 hover:text-white">
              <Settings className="w-5 h-5" />
            </button>
            <button 
              onClick={() => {
                if (screenStream) screenStream.getTracks().forEach(t => t.stop());
                setActiveRoom(null);
                setIsSharingScreen(false);
              }}
              className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
            >
              <PhoneOff className="w-4 h-4" />
              Leave Room
            </button>
          </div>
        </div>

        {/* Room Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
          {/* Main Stage */}
          <div className="lg:col-span-3 flex flex-col gap-4 min-h-0">
            <div className="flex-1 glass-card bg-slate-950/50 relative overflow-hidden flex items-center justify-center border-brand-500/10">
              {isSharingScreen ? (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-4 text-center p-8">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <Monitor className="w-10 h-10 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">No one is sharing</h3>
                    <p className="text-slate-500 text-sm mt-1">Start sharing your screen to collaborate with others.</p>
                  </div>
                  <button 
                    onClick={toggleScreenShare}
                    className="mt-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-brand-500/20"
                  >
                    Share Screen
                  </button>
                </div>
              )}

              {/* Overlay Controls */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-900/80 backdrop-blur-xl p-2 rounded-2xl border border-white/10 shadow-2xl">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className={cn(
                    "p-3 rounded-xl transition-all",
                    isMuted ? "bg-rose-500 text-white" : "hover:bg-white/10 text-slate-300"
                  )}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <button 
                  onClick={toggleScreenShare}
                  className={cn(
                    "p-3 rounded-xl transition-all",
                    isSharingScreen ? "bg-brand-500 text-white" : "hover:bg-white/10 text-slate-300"
                  )}
                >
                  <Monitor className="w-5 h-5" />
                </button>
                <div className="w-px h-6 bg-white/10 mx-1" />
                <button className="p-3 hover:bg-white/10 rounded-xl transition-all text-slate-300">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Participants Sidebar */}
          <div className="glass-card p-6 flex flex-col gap-6">
            <h3 className="font-bold flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-400" />
              Participants
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center font-bold text-sm">
                    Y
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">You</span>
                    <span className="text-[10px] text-emerald-400 font-medium">Host</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isMuted ? <MicOff className="w-3 h-3 text-rose-500" /> : <Mic className="w-3 h-3 text-emerald-500" />}
                </div>
              </div>
              
              {/* Simulated Participants */}
              {[1, 2].map(i => (
                <div key={i} className="flex items-center justify-between opacity-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-sm text-slate-500">
                      {String.fromCharCode(64 + i + 1)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">User_{i}</span>
                      <span className="text-[10px] text-slate-500 font-medium">Waiting...</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-6 border-t border-white/5">
              <button 
                onClick={handleInvite}
                className="w-full py-3 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Invite Friends
              </button>
            </div>
          </div>
        </div>
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
              <h2 className="text-3xl font-bold tracking-tight">Focus Voice Hub</h2>
              <p className="text-slate-400 max-w-md">Join a live voice session to work alongside others. No distractions, just pure focus and occasional motivation.</p>
              
              <div className="flex items-center gap-4 mt-4 justify-center md:justify-start">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-xs font-bold">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-slate-950 bg-brand-500 flex items-center justify-center text-xs font-bold">
                    +8
                  </div>
                </div>
                <span className="text-sm text-emerald-400 font-medium">12 people focusing now</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
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
                    className="w-24 h-24 rounded-full bg-brand-500 hover:bg-brand-600 flex items-center justify-center shadow-xl shadow-brand-500/40 group/btn transition-all cursor-pointer"
                  >
                    <Volume2 className="w-10 h-10 text-white group-hover/btn:scale-110 transition-transform" />
                  </motion.button>
                ) : (
                  <div className="flex flex-col items-center gap-6">
                    <div className="flex items-center gap-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsMuted(!isMuted)}
                        className={cn(
                          "w-16 h-16 rounded-full flex items-center justify-center transition-all cursor-pointer",
                          isMuted ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        )}
                      >
                        {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsInVoice(false)}
                        className="w-16 h-16 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/20 cursor-pointer"
                      >
                        <PhoneOff className="w-6 h-6" />
                      </motion.button>
                    </div>
                    {/* Visualizer */}
                    {!isMuted && (
                      <div className="flex items-center gap-1 h-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                          <motion.div
                            key={i}
                            animate={{ height: [8, 24, 12, 32, 8] }}
                            transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                            className="w-1 bg-brand-400 rounded-full"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </AnimatePresence>
              <span className="text-sm font-bold tracking-widest uppercase text-slate-500">
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
                    <span className="text-xs text-emerald-400 font-medium">{group.active} online</span>
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
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30" 
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
