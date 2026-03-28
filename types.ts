export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  modelName?: string;
  artifact?: ArtifactData; // Optional simulated UI artifact
}

export interface ArtifactData {
  title: string;
  type: 'preview' | 'code';
  content: string; // HTML or Code content
}

export enum GeminiModel {
  FLASH = 'gemini-2.5-flash',
  PRO = 'gemini-3-pro-preview'
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  selectedModel: GeminiModel;
}
