import React, { useState } from 'react';
import { Plus, CheckCircle2, Circle, Trash2, ChevronDown, Edit2, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task } from '../types';
import { cn } from '../lib/utils';

interface TaskBoardProps {
  tasks: Task[];
  onAddTask: (title: string, category: Task['category']) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
}

export default function TaskBoard({ tasks, onAddTask, onToggleTask, onDeleteTask, onUpdateTask }: TaskBoardProps) {
  const [newTask, setNewTask] = useState('');
  const [category, setCategory] = useState<Task['category']>('work');
  const [showSuccess, setShowSuccess] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState<Task['category']>('work');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      onAddTask(newTask.trim(), category);
      setNewTask('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditCategory(task.category);
  };

  const saveEdit = (id: string) => {
    if (editTitle.trim()) {
      onUpdateTask(id, { title: editTitle.trim(), category: editCategory });
      setEditingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <form onSubmit={handleSubmit} className="bg-slate-900/40 border border-white/5 rounded-2xl p-2 flex items-center gap-2 focus-within:border-brand-500/30 transition-all shadow-inner relative">
        <AnimatePresence>
          {showSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute -top-8 left-4 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20"
            >
              Task Added!
            </motion.div>
          )}
        </AnimatePresence>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 min-w-0"
        />
        <div className="flex items-center gap-2 pr-1">
          <div className="relative group">
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value as Task['category'])}
              className="appearance-none bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2 pr-8 text-xs text-slate-300 outline-none cursor-pointer transition-all"
            >
              <option value="work" className="bg-slate-900">Work</option>
              <option value="personal" className="bg-slate-900">Personal</option>
              <option value="urgent" className="bg-slate-900">Urgent</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none group-hover:text-brand-400 transition-colors" />
          </div>
          <button 
            type="submit" 
            className="w-10 h-10 bg-brand-500 rounded-xl hover:bg-brand-600 active:scale-95 transition-all shadow-lg shadow-brand-500/20 shrink-0 flex items-center justify-center cursor-pointer group"
          >
            <Plus className="w-5 h-5 text-white group-hover:rotate-90 transition-transform" />
          </button>
        </div>
      </form>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {tasks.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10 text-slate-500 text-sm italic"
            >
              No tasks found. Add one to get started!
            </motion.div>
          ) : (
            tasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={cn(
                  "glass-card p-4 flex items-center justify-between group transition-all",
                  task.completed && "opacity-50"
                )}
              >
                {editingId === task.id ? (
                  <div className="flex-1 flex items-center gap-3 min-w-0">
                    <div className="w-5 h-5 shrink-0" /> {/* Placeholder for the checkbox to maintain alignment */}
                    <input 
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-brand-500/50 min-w-0"
                      autoFocus
                    />
                    <div className="relative shrink-0">
                      <select 
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value as Task['category'])}
                        className="appearance-none bg-white/5 border border-white/10 rounded-xl px-3 py-2 pr-8 text-[10px] uppercase tracking-widest outline-none cursor-pointer hover:bg-white/10 transition-all"
                      >
                        <option value="work" className="bg-slate-900">Work</option>
                        <option value="personal" className="bg-slate-900">Personal</option>
                        <option value="urgent" className="bg-slate-900">Urgent</option>
                      </select>
                      <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => saveEdit(task.id)} className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-all cursor-pointer">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditingId(null)} className="p-2 bg-white/5 text-slate-400 rounded-lg hover:bg-white/10 transition-all cursor-pointer">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <button onClick={() => onToggleTask(task.id)} className="cursor-pointer">
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-brand-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-500 hover:text-brand-400" />
                        )}
                      </button>
                      <span className={cn(
                        "text-sm font-medium",
                        task.completed && "line-through text-slate-500"
                      )}>
                        {task.title}
                      </span>
                      <span className={cn(
                        "text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full border",
                        task.category === 'urgent' ? "border-rose-500/50 text-rose-400 bg-rose-500/10" :
                        task.category === 'work' ? "border-brand-500/50 text-brand-400 bg-brand-500/10" :
                        "border-emerald-500/50 text-emerald-400 bg-emerald-500/10"
                      )}>
                        {task.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => startEditing(task)}
                        className="p-2 hover:text-brand-400 transition-all cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDeleteTask(task.id)}
                        className="p-2 hover:text-rose-400 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
