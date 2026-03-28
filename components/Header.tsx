import React, { useState, useEffect, useRef } from 'react';
import * as Icons from './Icons';

const Header: React.FC = () => {
  const [isChatsOpen, setIsChatsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsChatsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-4 sticky top-0 bg-background/80 backdrop-blur-md z-30">
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-secondary hover:text-primary hover:bg-surface transition-colors">
          <Icons.ChevronLeft size={14} />
          Back
        </button>
      </div>

      {/* Center: Chats & Pages Navigation */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 flex items-center gap-2">
         {/* Chats Dropdown */}
         <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsChatsOpen(!isChatsOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-secondary hover:text-primary hover:bg-surface transition-colors bg-surface/50 border border-transparent hover:border-border"
            >
              <span>Chats</span>
              <Icons.ChevronDown size={12} className={`transition-transform duration-200 ${isChatsOpen ? 'rotate-180' : ''}`} />
            </button>

             {isChatsOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-[#121214] border border-border rounded-xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col p-1 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                    Recent
                  </div>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-zinc-300 hover:bg-surface hover:text-white transition-colors text-left">
                      <Icons.Bot size={14} className="text-zinc-500" />
                      AstraMind Landing
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-zinc-300 hover:bg-surface hover:text-white transition-colors text-left">
                      <Icons.Bot size={14} className="text-zinc-500" />
                      Dashboard Analytics
                  </button>
              </div>
            )}
         </div>

         <div className="w-px h-4 bg-border mx-1"></div>

         <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-secondary hover:text-primary hover:bg-surface transition-colors bg-surface/50 border border-transparent hover:border-border">
            <Icons.Folder size={14} />
            <span className="hidden lg:inline">Pages - home</span>
            <Icons.ChevronDown size={12} />
         </button>
      </div>

      <div className="flex items-center gap-2">
         <button className="p-2 text-secondary hover:text-primary hover:bg-surface rounded-lg transition-colors">
            <Icons.Sidebar size={18} />
         </button>
      </div>
    </header>
  );
};

export default Header;