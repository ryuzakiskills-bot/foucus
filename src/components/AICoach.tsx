import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getFocusInsight } from '../lib/gemini';

interface AICoachProps {
  sessions: any[];
}

export default function AICoach({ sessions }: AICoachProps) {
  const [insight, setInsight] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchInsight = async () => {
    setLoading(true);
    const data = await getFocusInsight(sessions);
    setInsight(data);
    setLoading(false);
  };

  useEffect(() => {
    if (sessions.length > 0 && !insight) {
      fetchInsight();
    }
  }, [sessions]);

  return (
    <div className="glass-card p-6 bg-gradient-to-br from-brand-500/10 to-indigo-500/10 border-brand-500/20 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
        <Sparkles className="w-12 h-12 text-brand-400" />
      </div>
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Brain className="w-5 h-5 text-brand-400" />
          AI Focus Coach
        </h3>
        <button 
          onClick={fetchInsight}
          disabled={loading}
          className="p-1.5 hover:bg-white/5 rounded-lg transition-all text-slate-500 hover:text-brand-400 disabled:opacity-50"
        >
          <RefreshCw className={loading ? "w-4 h-4 animate-spin" : "w-4 h-4"} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <div className="h-4 w-3/4 bg-white/5 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-white/5 rounded animate-pulse" />
          </motion.div>
        ) : insight ? (
          <motion.div 
            key="content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 relative z-10"
          >
            <div className="space-y-2">
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                {insight.analysis}
              </p>
              <p className="text-sm text-slate-400 leading-relaxed">
                {insight.advice}
              </p>
            </div>
            <div className="pt-4 border-t border-white/5">
              <p className="text-xs italic text-brand-400/80">
                "{insight.quote}"
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="text-sm text-slate-500 italic">
            Start a focus session to get personalized AI insights.
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
