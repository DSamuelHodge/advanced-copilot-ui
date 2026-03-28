import { describe, it, expect, beforeEach } from 'vitest';
import { useChatStore } from './useChatStore';
import { GeminiModel, Message } from '../lib/types';

describe('useChatStore', () => {
  beforeEach(() => {
    useChatStore.setState({
      chats: [],
      currentChatId: null,
      isLoading: false,
      selectedModel: GeminiModel.PRO,
      error: null,
    });
  });

  describe('createChat', () => {
    it('should create a new chat and return its id', () => {
      const chatId = useChatStore.getState().createChat();
      
      const chats = useChatStore.getState().chats;
      expect(chats).toHaveLength(1);
      expect(chats[0].id).toBe(chatId);
      expect(chats[0].title).toBe('New Chat');
      expect(chats[0].messages).toEqual([]);
    });

    it('should set the new chat as current chat', () => {
      const chatId = useChatStore.getState().createChat();
      expect(useChatStore.getState().currentChatId).toBe(chatId);
    });

    it('should add new chat at the beginning of the list', () => {
      useChatStore.getState().createChat();
      const firstChatId = useChatStore.getState().createChat();
      
      const chats = useChatStore.getState().chats;
      expect(chats[0].id).toBe(firstChatId);
    });
  });

  describe('setCurrentChat', () => {
    it('should set the current chat id', () => {
      const chatId = useChatStore.getState().createChat();
      useChatStore.getState().setCurrentChat(chatId);
      expect(useChatStore.getState().currentChatId).toBe(chatId);
    });
  });

  describe('deleteChat', () => {
    it('should delete a chat by id', () => {
      const chatId = useChatStore.getState().createChat();
      useChatStore.getState().deleteChat(chatId);
      
      expect(useChatStore.getState().chats).toHaveLength(0);
    });

    it('should switch to another chat when deleting current', () => {
      const chatId1 = useChatStore.getState().createChat();
      const chatId2 = useChatStore.getState().createChat();
      useChatStore.getState().setCurrentChat(chatId1);
      
      useChatStore.getState().deleteChat(chatId1);
      
      expect(useChatStore.getState().currentChatId).toBe(chatId2);
    });

    it('should set currentChatId to null when deleting last chat', () => {
      const chatId = useChatStore.getState().createChat();
      useChatStore.getState().deleteChat(chatId);
      
      expect(useChatStore.getState().currentChatId).toBeNull();
    });
  });

  describe('updateChatTitle', () => {
    it('should update chat title', () => {
      const chatId = useChatStore.getState().createChat();
      useChatStore.getState().updateChatTitle(chatId, 'Updated Title');
      
      const chat = useChatStore.getState().chats.find(c => c.id === chatId);
      expect(chat?.title).toBe('Updated Title');
    });
  });

  describe('addMessage', () => {
    it('should add a message to a specific chat', () => {
      const chatId = useChatStore.getState().createChat();
      const message: Message = {
        id: 'msg-1',
        role: 'user',
        content: 'Hello',
        timestamp: new Date().toISOString(),
      };
      
      useChatStore.getState().addMessage(chatId, message);
      
      const chat = useChatStore.getState().chats.find(c => c.id === chatId);
      expect(chat?.messages).toHaveLength(1);
      expect(chat?.messages[0].content).toBe('Hello');
    });
  });

  describe('updateMessage', () => {
    it('should update a specific message', () => {
      const chatId = useChatStore.getState().createChat();
      const message: Message = {
        id: 'msg-1',
        role: 'user',
        content: 'Hello',
        timestamp: new Date().toISOString(),
      };
      useChatStore.getState().addMessage(chatId, message);
      
      useChatStore.getState().updateMessage(chatId, 'msg-1', { content: 'Updated' });
      
      const chat = useChatStore.getState().chats.find(c => c.id === chatId);
      expect(chat?.messages[0].content).toBe('Updated');
    });
  });

  describe('setLoading', () => {
    it('should set loading state', () => {
      useChatStore.getState().setLoading(true);
      expect(useChatStore.getState().isLoading).toBe(true);
      
      useChatStore.getState().setLoading(false);
      expect(useChatStore.getState().isLoading).toBe(false);
    });
  });

  describe('setError', () => {
    it('should set error message', () => {
      useChatStore.getState().setError('Something went wrong');
      expect(useChatStore.getState().error).toBe('Something went wrong');
    });
  });

  describe('setSelectedModel', () => {
    it('should set selected model', () => {
      useChatStore.getState().setSelectedModel(GeminiModel.FLASH);
      expect(useChatStore.getState().selectedModel).toBe(GeminiModel.FLASH);
    });
  });

  describe('getCurrentChat', () => {
    it('should return current chat when set', () => {
      const chatId = useChatStore.getState().createChat();
      useChatStore.getState().setCurrentChat(chatId);
      
      const currentChat = useChatStore.getState().getCurrentChat();
      expect(currentChat?.id).toBe(chatId);
    });

    it('should return first chat when current not set', () => {
      useChatStore.getState().createChat();
      
      const currentChat = useChatStore.getState().getCurrentChat();
      expect(currentChat).toBeDefined();
    });
  });

  describe('updateArtifact', () => {
    it('should update artifact for a message', () => {
      const chatId = useChatStore.getState().createChat();
      const message: Message = {
        id: 'msg-1',
        role: 'model',
        content: 'Here is code',
        timestamp: new Date().toISOString(),
      };
      useChatStore.getState().addMessage(chatId, message);
      
      const artifact = {
        title: 'Test',
        type: 'preview' as const,
        content: 'const x = 1',
      };
      
      useChatStore.getState().updateArtifact(chatId, 'msg-1', artifact);
      
      const chat = useChatStore.getState().chats.find(c => c.id === chatId);
      expect(chat?.messages[0].artifact).toEqual(artifact);
    });
  });
});
