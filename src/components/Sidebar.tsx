import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from './Icons';
import { useChatStore, useUIStore } from '../stores';

export default function Sidebar() {
  const navigate = useNavigate();
  const { chats, currentChatId, setCurrentChat, createChat, deleteChat } = useChatStore();
  const { isSidebarOpen, toggleSidebar } = useUIStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);

  const handleNewChat = () => {
    const newId = createChat();
    navigate(`/chat/${newId}`);
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChat(chatId);
    navigate(`/chat/${chatId}`);
  };

  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isSidebarOpen) {
    return (
      <button
        onClick={toggleSidebar}
        className="fixed left-4 top-4 z-50 p-2 bg-surface border border-border rounded-lg hover:bg-zinc-800 transition-colors"
        aria-label="Open sidebar"
      >
        <Icons.Sidebar size={20} />
      </button>
    );
  }

  return (
    <aside className="w-72 bg-surface border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-primary">Chats</h1>
          <button
            onClick={toggleSidebar}
            className="p-1.5 text-secondary hover:text-primary hover:bg-zinc-800 rounded transition-colors"
            aria-label="Close sidebar"
          >
            <Icons.ChevronLeft size={18} />
          </button>
        </div>
        
        <button
          onClick={handleNewChat}
          className="w-full flex items-center gap-3 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-primary rounded-lg transition-colors font-medium text-sm"
        >
          <Icons.Plus size={18} />
          New Chat
        </button>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Icons.Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chats..."
            className="w-full bg-zinc-900 border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-primary placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-2">
        {filteredChats.length === 0 ? (
          <div className="text-center text-zinc-500 text-sm py-8">
            {searchQuery ? 'No chats found' : 'No chats yet'}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                  chat.id === currentChatId 
                    ? 'bg-zinc-800 text-primary' 
                    : 'text-secondary hover:bg-zinc-800/50 hover:text-primary'
                }`}
                onClick={() => handleSelectChat(chat.id)}
                onMouseEnter={() => setHoveredChatId(chat.id)}
                onMouseLeave={() => setHoveredChatId(null)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleSelectChat(chat.id)}
              >
                <Icons.Bot size={16} className="flex-shrink-0" />
                <span className="flex-1 truncate text-sm">{chat.title}</span>
                {(hoveredChatId === chat.id || chat.id === currentChatId) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(chat.id);
                      if (chat.id === currentChatId && chats.length > 1) {
                        const remaining = chats.filter(c => c.id !== chat.id);
                        if (remaining.length > 0) {
                          setCurrentChat(remaining[0].id);
                          navigate(`/chat/${remaining[0].id}`);
                        }
                      }
                    }}
                    className="p-1 text-zinc-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="Delete chat"
                  >
                    <Icons.Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-500">
          <Icons.Sparkles size={12} />
          <span>{chats.length} chat{chats.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </aside>
  );
}
