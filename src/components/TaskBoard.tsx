import React, { useState } from 'react';
import { Plus, CheckCircle2, Circle, Trash2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task } from '../types';
import { cn } from '../lib/utils';

interface TaskBoardProps {
  tasks: Task[];
  onAddTask: (title: string, category: Task['category']) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export default function TaskBoard({ tasks, onAddTask, onToggleTask, onDeleteTask }: TaskBoardProps) {
  const [newTask, setNewTask] = useState('');
  const [category, setCategory] = useState<Task['category']>('work');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      onAddTask(newTask.trim(), category);
      setNewTask('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
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
                <button 
                  onClick={() => onDeleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 hover:text-rose-400 transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
