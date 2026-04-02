import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, Brain, Target, Users, TrendingUp, Shield, 
  CheckCircle2, ArrowRight, Play, Star, Globe, Lock
} from 'lucide-react';
import { cn } from '../lib/utils';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-brand-500/30 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:rotate-12 transition-transform">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">FocusFlow</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={onStart}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Log in
            </button>
            <button 
              onClick={onStart}
              className="bg-white text-slate-950 px-5 py-2.5 rounded-full text-sm font-bold hover:bg-slate-200 transition-all active:scale-95"
            >
              Start Free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        {/* Animated Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-500/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse delay-1000" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-brand-400 mb-8">
              <Star className="w-3 h-3 fill-brand-400" />
              Trusted by 10,000+ high-performers
            </span>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-[0.9]">
              Master Your Focus.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-indigo-400">
                Win Your Day.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              The all-in-one productivity platform designed for students and entrepreneurs to eliminate distractions, track deep work, and achieve peak performance.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={onStart}
                className="w-full sm:w-auto px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2 group"
              >
                Start Free Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={onStart}
                className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold text-lg transition-all border border-white/10 flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 fill-white" />
                Join Live Room
              </button>
            </div>
          </motion.div>

          {/* App Preview Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
            <div className="glass-card p-2 rounded-[2.5rem] border-white/10 shadow-2xl overflow-hidden">
              <img 
                src="https://picsum.photos/seed/dashboard/1600/900" 
                alt="FocusFlow Dashboard" 
                className="w-full rounded-[2rem] shadow-inner"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 px-6 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Why FocusFlow?</h2>
            <p className="text-slate-400">The world is designed to distract you. We're designed to help you focus.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Globe, title: "Digital Noise", desc: "Endless notifications and social media loops killing your flow." },
              { icon: Brain, title: "Mental Fatigue", desc: "Struggling to maintain deep focus for more than 15 minutes." },
              { icon: TrendingUp, title: "Lack of Clarity", desc: "Working hard but not seeing the progress you actually want." }
            ].map((item, i) => (
              <div key={i} className="glass-card p-8 flex flex-col gap-4 hover:border-brand-500/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-brand-400" />
                </div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">Everything you need to <span className="text-brand-400">crush your goals.</span></h2>
              <p className="text-slate-400 text-lg">Powerful tools built for high-performance deep work sessions.</p>
            </div>
            <button className="text-brand-400 font-bold flex items-center gap-2 hover:underline">
              See all features <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Smart Focus Mode", desc: "Adaptive Pomodoro timers that learn your peak performance hours.", icon: Zap },
              { title: "AI Focus Coach", desc: "Get personalized insights and motivation based on your focus data.", icon: Brain },
              { title: "Distraction Tracker", desc: "Identify what pulls you away and eliminate it for good.", icon: Target },
              { title: "Live Community Rooms", desc: "Work alongside thousands of others in real-time silent rooms.", icon: Users },
              { title: "Focus Score System", desc: "Gamify your productivity with our proprietary scoring algorithm.", icon: TrendingUp },
              { title: "Streak System", desc: "Build lasting habits with visual streaks and achievement badges.", icon: Star }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -8 }}
                className="glass-card p-8 flex flex-col gap-6 group cursor-default"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-brand-500 transition-colors">
                  <feature.icon className="w-7 h-7 text-brand-400 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 bg-slate-900/30">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-20">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2" />
            
            {[
              { step: "01", title: "Set Your Goal", desc: "Choose what you want to achieve and set your focus duration." },
              { step: "02", title: "Start Session", desc: "Enter deep focus mode with immersive sounds and no distractions." },
              { step: "03", title: "Track Progress", desc: "Analyze your performance and get AI-powered improvement tips." }
            ].map((item, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-slate-950 border-2 border-brand-500 flex items-center justify-center text-2xl font-black text-brand-500 shadow-lg shadow-brand-500/20">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold">{item.title}</h3>
                <p className="text-slate-400 max-w-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-slate-400">Choose the plan that fits your productivity needs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="glass-card p-10 flex flex-col gap-8 relative overflow-hidden">
              <div>
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-slate-500">/month</span>
                </div>
              </div>
              <ul className="flex flex-col gap-4">
                {["3 sessions per day", "Basic analytics", "Community access", "Task management"].map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-brand-400" />
                    {feat}
                  </li>
                ))}
              </ul>
              <button 
                onClick={onStart}
                className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all border border-white/10"
              >
                Get Started
              </button>
            </div>

            {/* Pro Plan */}
            <div className="glass-card p-10 flex flex-col gap-8 relative overflow-hidden border-brand-500/50 shadow-2xl shadow-brand-500/10">
              <div className="absolute top-0 right-0 bg-brand-500 text-white px-4 py-1 text-[10px] font-black uppercase tracking-widest rounded-bl-xl">
                Most Popular
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">$12</span>
                  <span className="text-slate-500">/month</span>
                </div>
              </div>
              <ul className="flex flex-col gap-4">
                {[
                  "Unlimited sessions",
                  "Advanced analytics",
                  "AI Focus Coach",
                  "Website blocker",
                  "Priority support",
                  "Custom sounds"
                ].map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-brand-400" />
                    {feat}
                  </li>
                ))}
              </ul>
              <button 
                onClick={onStart}
                className="w-full py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold transition-all shadow-lg shadow-brand-500/25"
              >
                Go Pro Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-brand-500 fill-brand-500" />
              <span className="text-xl font-bold">FocusFlow</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Master your focus and win your day with the world's most advanced productivity platform.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-6">Product</h4>
            <ul className="flex flex-col gap-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">AI Coach</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Live Rooms</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Company</h4>
            <ul className="flex flex-col gap-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Legal</h4>
            <ul className="flex flex-col gap-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-xs">
          <p>© 2024 FocusFlow Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
