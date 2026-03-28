import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useChatStore } from '../stores';
import Header from '../components/Header';
import ChatArea from '../components/ChatArea';
import InputArea from '../components/InputArea';

export default function ChatPage() {
  const { chatId } = useParams<{ chatId?: string }>();
  const { chats, setCurrentChat, createChat, getCurrentChat } = useChatStore();
  
  const currentChat = getCurrentChat();

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
    <div className="flex flex-col h-screen bg-background text-primary overflow-hidden font-sans selection:bg-zinc-700 selection:text-white">
      <Header />
      <main className="flex-1 overflow-hidden relative flex flex-col">
        <ChatArea />
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#09090b] via-[#09090b] to-transparent pt-10 z-20">
          <InputArea />
        </div>
      </main>
    </div>
  );
}
