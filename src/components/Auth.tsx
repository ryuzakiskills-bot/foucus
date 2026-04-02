import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Logo from './Logo';
import { Zap, Mail, Lock, ArrowRight, Github, Chrome, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

interface AuthProps {
  onLogin: (user: any) => void;
  onClose: () => void;
}

export default function Auth({ onLogin, onClose }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate auth
    setTimeout(() => {
      onLogin({ id: 'user1', name: 'Focus Master', email: 'user@example.com' });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-md glass-card p-10 flex flex-col gap-8 bg-slate-900/50 border-white/10 shadow-2xl"
      >
        <div className="flex flex-col items-center text-center gap-2">
          <Logo size="md" iconOnly className="mb-2" />
          <h2 className="text-2xl font-bold tracking-tight">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-slate-400 text-sm">
            {isLogin ? 'Enter your details to continue your focus journey.' : 'Start your 7-day free trial today.'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-sm font-bold">
            <Chrome className="w-4 h-4" />
            Google
          </button>
          <button className="flex items-center justify-center gap-2 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-sm font-bold">
            <Github className="w-4 h-4" />
            GitHub
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
            <span className="bg-slate-900 px-4 text-slate-500">Or continue with</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                required
                type="email"
                placeholder="name@company.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-sm outline-none focus:border-brand-500/50 transition-all"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                required
                type="password"
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-sm outline-none focus:border-brand-500/50 transition-all"
              />
            </div>
          </div>

          {isLogin && (
            <button type="button" className="text-xs text-brand-400 hover:underline text-right font-bold">
              Forgot password?
            </button>
          )}

          <button 
            disabled={loading}
            className="mt-4 w-full bg-brand-500 hover:bg-brand-600 disabled:bg-brand-500/50 text-white font-bold py-4 rounded-xl shadow-xl shadow-brand-500/20 transition-all flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-slate-400 hover:text-white transition-colors font-medium"
          >
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span className="text-brand-400 font-bold underline underline-offset-4">
              {isLogin ? 'Sign up free' : 'Log in'}
            </span>
          </button>
        </div>

        <div className="pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
          <ShieldCheck className="w-3 h-3" />
          Secure 256-bit SSL encryption
        </div>
      </motion.div>
    </div>
  );
}
