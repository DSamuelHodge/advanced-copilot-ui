import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from './Icons';
import { useChatStore, useUIStore } from '../stores';

const Header: React.FC = () => {
  const [isChatsOpen, setIsChatsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { chats, currentChatId, setCurrentChat, createChat, deleteChat } = useChatStore();
  const { toggleSidebar } = useUIStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsChatsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNewChat = () => {
    const newId = createChat();
    navigate(`/chat/${newId}`);
    setIsChatsOpen(false);
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChat(chatId);
    navigate(`/chat/${chatId}`);
    setIsChatsOpen(false);
  };

  const currentChat = chats.find(c => c.id === currentChatId);

  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-4 sticky top-0 bg-background/80 backdrop-blur-md z-30">
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleSidebar}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-secondary hover:text-primary hover:bg-surface transition-colors"
        >
          <Icons.Sidebar size={14} />
          Toggle
        </button>
      </div>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 flex items-center gap-2">
          <div className="relative" ref={dropdownRef}>
             <button 
               onClick={() => setIsChatsOpen(!isChatsOpen)}
               className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-secondary hover:text-primary hover:bg-surface transition-colors bg-surface/50 border border-transparent hover:border-border"
             >
               <span>{currentChat?.title || 'New Chat'}</span>
               <Icons.ChevronDown size={12} className={`transition-transform duration-200 ${isChatsOpen ? 'rotate-180' : ''}`} />
             </button>

              {isChatsOpen && (
               <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-[#121214] border border-border rounded-xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col p-1 animate-in fade-in zoom-in-95 duration-100">
                   <button 
                    onClick={handleNewChat}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-zinc-300 hover:bg-surface hover:text-white transition-colors text-left mb-1"
                   >
                       <Icons.Plus size={14} className="text-green-400" />
                       New Chat
                   </button>
                   
                   <div className="px-3 py-2 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider border-b border-border mb-1">
                     Recent
                   </div>
                   
                   <div className="max-h-48 overflow-y-auto">
                     {chats.slice(0, 10).map((chat) => (
                       <div key={chat.id} className="flex items-center group">
                           <button 
                             onClick={() => handleSelectChat(chat.id)}
                             className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-zinc-300 hover:bg-surface hover:text-white transition-colors text-left ${chat.id === currentChatId ? 'bg-surface' : ''}`}
                           >
                               <Icons.Bot size={14} className="text-zinc-500" />
                               <span className="truncate">{chat.title}</span>
                           </button>
                           <button 
                            onClick={() => deleteChat(chat.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-red-400 transition-all"
                           >
                               <Icons.Trash2 size={12} />
                           </button>
                       </div>
                     ))}
                   </div>
               </div>
             )}
          </div>
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
