import React, { useState } from 'react';
import { Send, User, Hash, Users, Search, MoreVertical, Paperclip, Smile } from 'lucide-react';
import { ChatMessage } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface ChatRoomProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  currentUserId: string;
}

export default function ChatRoom({ messages, onSendMessage, currentUserId }: ChatRoomProps) {
  const [input, setInput] = useState('');
  const [activeChat, setActiveChat] = useState('general');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const conversations = [
    { id: 'general', name: 'General Focus', type: 'channel', lastMsg: 'Salam! Let\'s crush our goals...', active: true },
    { id: 'amine', name: 'Amine', type: 'user', lastMsg: 'I\'m working on the new UI...', active: false },
    { id: 'yassine', name: 'Yassine', type: 'user', lastMsg: 'Can you help me with...', active: false },
    { id: 'warriors', name: 'Deep Work Warriors', type: 'channel', lastMsg: 'Who is joining the voice...', active: false },
  ];

  return (
    <div className="flex h-full glass-card overflow-hidden border-white/5">
      {/* Conversations Sidebar */}
      <div className="hidden md:flex flex-col w-80 border-r border-white/10 bg-white/5">
        <div className="p-6 border-b border-white/10 flex flex-col gap-4">
          <h2 className="text-xl font-bold tracking-tight">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search chats..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs outline-none focus:border-brand-500/50 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {conversations.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              className={cn(
                "w-full p-4 flex items-center gap-4 transition-all hover:bg-white/5 border-l-2",
                activeChat === chat.id ? "bg-brand-500/10 border-brand-500" : "border-transparent"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                chat.type === 'channel' ? "bg-brand-500/20 text-brand-400" : "bg-slate-800 text-slate-400"
              )}>
                {chat.type === 'channel' ? <Hash className="w-6 h-6" /> : <User className="w-6 h-6" />}
              </div>
              <div className="flex flex-col items-start overflow-hidden">
                <span className="font-bold text-sm truncate w-full">{chat.name}</span>
                <span className="text-xs text-slate-500 truncate w-full">{chat.lastMsg}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-white/2">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center text-brand-400">
              <Hash className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm">General Focus Room</span>
              <span className="text-[10px] text-emerald-400 font-medium">12 Online</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => alert('Viewing members list...')}
              className="p-2 hover:bg-white/10 rounded-lg transition-all text-slate-400 cursor-pointer"
            >
              <Users className="w-5 h-5" />
            </button>
            <button 
              onClick={() => alert('Chat options...')}
              className="p-2 hover:bg-white/10 rounded-lg transition-all text-slate-400 cursor-pointer"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-4 max-w-[85%]",
                  msg.senderId === currentUserId ? "ml-auto flex-row-reverse" : "flex-row"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 font-bold text-xs",
                  msg.senderId === currentUserId ? "bg-brand-500 text-white" : "bg-slate-800 text-slate-400"
                )}>
                  {msg.senderName[0]}
                </div>
                <div className={cn(
                  "flex flex-col gap-1",
                  msg.senderId === currentUserId ? "items-end" : "items-start"
                )} >
                  <div className="flex items-center gap-2 px-2">
                    <span className="text-[10px] font-bold text-slate-400">{msg.senderName}</span>
                    <span className="text-[10px] text-slate-600">12:45 PM</span>
                  </div>
                  <div className={cn(
                    "px-5 py-3 rounded-3xl text-sm leading-relaxed shadow-xl",
                    msg.senderId === currentUserId 
                      ? "bg-brand-500 text-white rounded-tr-none shadow-brand-500/10" 
                      : "bg-white/10 text-slate-200 rounded-tl-none shadow-black/20"
                  )}>
                    {msg.text}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="p-6 bg-white/5 border-t border-white/10">
          <form onSubmit={handleSend} className="flex flex-col gap-4">
            <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus-within:border-brand-500/50 transition-all">
              <button 
                type="button" 
                onClick={() => alert('Attachment feature coming soon!')}
                className="p-1 hover:text-brand-400 transition-all text-slate-500 cursor-pointer"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 bg-transparent border-none outline-none text-sm text-slate-200 placeholder:text-slate-600"
              />
              <button 
                type="button" 
                onClick={() => alert('Emoji picker coming soon!')}
                className="p-1 hover:text-brand-400 transition-all text-slate-500 cursor-pointer"
              >
                <Smile className="w-5 h-5" />
              </button>
              <button type="submit" className="p-2 bg-brand-500 rounded-xl hover:bg-brand-600 transition-all cursor-pointer shadow-lg shadow-brand-500/20">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
