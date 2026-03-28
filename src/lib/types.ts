export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  modelName?: string;
  artifact?: ArtifactData;
}

export interface ArtifactData {
  title: string;
  type: 'preview' | 'code';
  content: string;
}

export enum GeminiModel {
  FLASH = 'gemini-2.5-flash',
  PRO = 'gemini-3-pro-preview'
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatState {
  chats: Chat[];
  currentChatId: string | null;
  isLoading: boolean;
  selectedModel: GeminiModel;
  error: string | null;
}

export interface UIState {
  isSidebarOpen: boolean;
  isModelSelectorOpen: boolean;
  isTemplatesModalOpen: boolean;
  theme: 'dark' | 'light';
}
