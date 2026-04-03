import React, { useState, useRef } from 'react';
import { Send, User, Hash, Users, Search, MoreVertical, Paperclip, Smile, Image as ImageIcon, File as FileIcon, X } from 'lucide-react';
import { ChatMessage } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface ChatRoomProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, type?: 'text' | 'image' | 'file', url?: string, fileName?: string) => void;
  currentUserId: string;
}

export default function ChatRoom({ messages, onSendMessage, currentUserId }: ChatRoomProps) {
  const [input, setInput] = useState('');
  const [activeChat, setActiveChat] = useState('general');
  const [selectedFile, setSelectedFile] = useState<{ file: File, type: 'image' | 'file', preview?: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      onSendMessage(
        input.trim() || (selectedFile.type === 'image' ? 'Sent an image' : `Sent a file: ${selectedFile.file.name}`),
        selectedFile.type,
        selectedFile.preview,
        selectedFile.file.name
      );
      setSelectedFile(null);
      setInput('');
    } else if (input.trim()) {
      onSendMessage(input.trim(), 'text');
      setInput('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = type === 'image' ? URL.createObjectURL(file) : undefined;
      setSelectedFile({ file, type, preview });
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
        <div className="p-8 border-b border-white/10 flex flex-col gap-6">
          <h2 className="text-2xl font-bold tracking-tight">Messages</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search chats..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-sm outline-none focus:border-brand-500/50 transition-all"
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
                    {msg.type === 'image' && msg.url && (
                      <div className="flex flex-col gap-2 mb-2">
                        <img src={msg.url} alt="Shared" className="rounded-xl w-full max-w-sm h-auto border border-white/10" referrerPolicy="no-referrer" />
                      </div>
                    )}
                    {msg.type === 'file' && (
                      <div className="flex items-center gap-3 bg-black/20 p-3 rounded-xl mb-2 border border-white/5">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                          <FileIcon className="w-5 h-5 text-brand-400" />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-xs font-bold truncate">{msg.fileName}</span>
                          <span className="text-[10px] opacity-50 uppercase tracking-widest">File Attachment</span>
                        </div>
                      </div>
                    )}
                    {msg.text}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="p-6 bg-white/5 border-t border-white/10 w-full">
          <form onSubmit={handleSend} className="flex flex-col gap-4 w-full">
            {selectedFile && (
              <div className="flex items-center gap-4 p-3 bg-brand-500/10 border border-brand-500/20 rounded-2xl animate-in fade-in slide-in-from-bottom-2">
                {selectedFile.type === 'image' ? (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/10">
                    <img src={selectedFile.preview} className="w-full h-full object-cover" alt="Preview" referrerPolicy="no-referrer" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                    <FileIcon className="w-8 h-8 text-brand-400" />
                  </div>
                )}
                <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                  <span className="text-sm font-bold truncate">{selectedFile.file.name}</span>
                  <span className="text-[10px] text-brand-400 uppercase tracking-widest font-bold">Ready to send</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => setSelectedFile(null)}
                  className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-rose-400 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus-within:border-brand-500/50 transition-all w-full min-w-0">
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
                className="p-1 hover:text-brand-400 transition-all text-slate-500 cursor-pointer"
                title="Send Image"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="p-1 hover:text-brand-400 transition-all text-slate-500 cursor-pointer"
                title="Send File"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={selectedFile ? "Add a caption..." : "Type your message here..."}
                className="flex-1 min-w-0 bg-transparent border-none outline-none text-sm text-slate-200 placeholder:text-slate-600"
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
