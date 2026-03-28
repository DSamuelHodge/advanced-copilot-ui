import React from 'react';
import { useChatStore, useUIStore } from '../stores';
import * as Icons from './Icons';

const Header: React.FC = () => {
  const { chats, currentChatId } = useChatStore();
  const { toggleSidebar } = useUIStore();

  const currentChat = chats.find(c => c.id === currentChatId);

  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-4 sticky top-0 bg-background/80 backdrop-blur-md z-30">
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleSidebar}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-secondary hover:text-primary hover:bg-surface transition-colors"
        >
          <Icons.Sidebar size={14} />
          <span className="hidden sm:inline">Chats</span>
        </button>
      </div>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 flex items-center gap-2">
        <span className="text-sm font-medium text-primary truncate max-w-xs">
          {currentChat?.title || 'New Chat'}
        </span>
      </div>

      <div className="flex items-center gap-2">
         <button className="p-2 text-secondary hover:text-primary hover:bg-surface rounded-lg transition-colors" title="Settings">
            <Icons.Settings size={18} />
         </button>
      </div>
    </header>
  );
};

export default Header;
