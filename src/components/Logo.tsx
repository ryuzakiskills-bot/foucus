import React from 'react';
import { cn } from '../lib/utils';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className, iconOnly = false, size = 'md' }: LogoProps) {
  const sizes = {
    sm: { container: 'h-8', icon: 'w-6 h-6', text: 'text-lg' },
    md: { container: 'h-10', icon: 'w-8 h-8', text: 'text-2xl' },
    lg: { container: 'h-14', icon: 'w-12 h-12', text: 'text-4xl' },
  };

  const currentSize = sizes[size];

  return (
    <div className={cn("flex items-center gap-2 group cursor-pointer", currentSize.container, className)}>
      <div className={cn("relative flex items-center justify-center", currentSize.icon)}>
        {/* The Logo Icon (Recreating the uploaded image) */}
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          
          {/* Outer Circle Segments */}
          <circle 
            cx="50" cy="50" r="45" 
            stroke="url(#logo-gradient)" 
            strokeWidth="8" 
            strokeDasharray="210 70"
            strokeDashoffset="20"
            strokeLinecap="round"
            className="opacity-40"
          />
          
          {/* Main Circle */}
          <circle 
            cx="50" cy="50" r="45" 
            stroke="url(#logo-gradient)" 
            strokeWidth="4" 
            className="opacity-80"
          />

          {/* Lightning Bolt */}
          <path 
            d="M55 15L30 55H45L40 85L65 45H50L55 15Z" 
            fill="url(#logo-gradient)"
            className="drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]"
          />
        </svg>
      </div>
      
      {!iconOnly && (
        <div className="flex items-baseline">
          <span className={cn("font-black tracking-tighter text-white", currentSize.text)}>
            F
          </span>
          <span className={cn("font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-500", currentSize.text)}>
            ocus
          </span>
        </div>
      )}
    </div>
  );
}
