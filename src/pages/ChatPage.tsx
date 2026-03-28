import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useChatStore, useUIStore } from '../stores';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ChatArea from '../components/ChatArea';
import InputArea from '../components/InputArea';
import TemplatesModal from '../components/TemplatesModal';
import { ErrorBoundary } from '../components/ErrorBoundary';

export default function ChatPage() {
  const { chatId } = useParams<{ chatId?: string }>();
  const { chats, setCurrentChat, createChat } = useChatStore();
  const { isSidebarOpen } = useUIStore();

  useEffect(() => {
    if (chatId) {
      setCurrentChat(chatId);
    } else if (chats.length > 0) {
      setCurrentChat(chats[0].id);
    } else {
      createChat();
    }
  }, [chatId, chats, setCurrentChat, createChat]);

  return (
    <div className="flex h-screen bg-background text-primary overflow-hidden font-sans selection:bg-zinc-700 selection:text-white">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-72' : 'w-0'} flex-shrink-0 transition-all duration-300`}>
        <ErrorBoundary>
          <Sidebar />
        </ErrorBoundary>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-hidden relative flex flex-col">
          <ErrorBoundary>
            <ChatArea />
          </ErrorBoundary>
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#09090b] via-[#09090b] to-transparent pt-10 z-20">
            <ErrorBoundary>
              <InputArea />
            </ErrorBoundary>
          </div>
        </main>
      </div>

      {/* Modals */}
      <TemplatesModal />
    </div>
  );
}
