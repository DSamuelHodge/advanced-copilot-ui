import React, { useState, useRef, useEffect } from 'react';
import * as Icons from './Icons';
import { useChatStore, useUIStore } from '../stores';
import { GeminiModel, Message } from '../lib/types';
import { streamMessageToGemini } from '../services/geminiService';

interface AttachedFile {
  name: string;
  size: number;
  type: string;
  content?: string;
}

const InputArea: React.FC = () => {
  const [input, setInput] = useState('');
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { 
    selectedModel, 
    setSelectedModel, 
    isLoading, 
    setLoading, 
    getCurrentChat, 
    addMessage, 
    updateMessage,
    createChat
  } = useChatStore();

  const { toggleTemplatesModal } = useUIStore();

  useEffect(() => {
    const handleUseTemplate = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      setInput(customEvent.detail);
      setTimeout(() => textareaRef.current?.focus(), 100);
    };

    window.addEventListener('use-template', handleUseTemplate);
    return () => window.removeEventListener('use-template', handleUseTemplate);
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;
    
    const processedFiles: AttachedFile[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 5MB.`);
        continue;
      }

      const processedFile: AttachedFile = {
        name: file.name,
        size: file.size,
        type: file.type,
      };

      if (file.type.startsWith('text/') || file.name.endsWith('.tsx') || file.name.endsWith('.ts') || file.name.endsWith('.js') || file.name.endsWith('.jsx')) {
        processedFile.content = await file.text();
      }

      processedFiles.push(processedFile);
    }

    setAttachedFiles(prev => [...prev, ...processedFiles]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const extractCode = (text: string): string | null => {
    const match = text.match(/```(?:tsx|jsx|javascript|typescript|react)\n([\s\S]*?)(?:```|$)/);
    return match ? match[1] : null;
  };

  const handleSend = async () => {
    if (input.trim() && !isLoading) {
      const text = input;
      setInput('');
      
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }

      const currentChat = getCurrentChat();
      if (!currentChat) {
        createChat();
      }

      const chatId = getCurrentChat()?.id || '';
      
      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: text,
        timestamp: new Date().toISOString()
      };

      const modelMsgId = crypto.randomUUID();
      const initialModelMsg: Message = {
        id: modelMsgId,
        role: 'model',
        content: '',
        timestamp: new Date().toISOString(),
        modelName: selectedModel
      };

      addMessage(chatId, userMsg);
      addMessage(chatId, initialModelMsg);
      setLoading(true);

      const history = getCurrentChat()?.messages.slice(0, -1).map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      })) || [];

      try {
        let fullContent = '';
        const stream = streamMessageToGemini(text, selectedModel, history);

        for await (const chunk of stream) {
          fullContent += chunk;
          
          const extractedCode = fullContent ? extractCode(fullContent) : null;
          
          updateMessage(chatId, modelMsgId, {
            content: fullContent,
            artifact: extractedCode ? {
              title: 'Generated Component',
              type: 'preview' as const,
              content: extractedCode
            } : undefined
          });
        }
      } catch (error) {
        console.error("Streaming error:", error);
        updateMessage(chatId, modelMsgId, {
          content: 'Sorry, I encountered an error connecting to the AI service.'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
        setIsModelOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-6">
      <div className="relative bg-surface rounded-2xl border border-border shadow-lg transition-all focus-within:ring-1 focus-within:ring-zinc-700">
        <div className="p-4 pb-2">
            <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask for revisions..."
                className="w-full bg-transparent text-primary placeholder-zinc-500 resize-none outline-none max-h-60 overflow-y-auto font-normal text-base"
                rows={1}
                disabled={isLoading}
            />
        </div>

        <div className="flex items-center justify-between px-3 pb-3 pt-2">
            <div className="flex items-center gap-2 flex-wrap">
                <button 
                    onClick={toggleTemplatesModal}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors text-xs font-medium"
                >
                    <Icons.Sparkles size={14} />
                    Templates
                </button>

                <div className="relative" ref={modelDropdownRef}>
                    <button 
                        onClick={() => setIsModelOpen(!isModelOpen)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors text-xs font-medium group"
                    >
                        <Icons.Sparkles size={14} className={selectedModel === GeminiModel.PRO ? "text-purple-400" : "text-yellow-400"} />
                        <span className="hidden sm:inline group-hover:text-white transition-colors">
                            {selectedModel === GeminiModel.PRO ? 'Gemini 3 Pro' : 'Gemini Flash'}
                        </span>
                        <Icons.ChevronDown size={12} className={`transition-transform duration-200 ${isModelOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isModelOpen && (
                        <div className="absolute bottom-full left-0 mb-2 w-56 bg-[#121214] border border-border rounded-xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col p-1 animate-in fade-in zoom-in-95 duration-100 z-50">
                            <div className="px-3 py-2 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                                Select Model
                            </div>
                            
                            <button 
                                onClick={() => {
                                    setSelectedModel(GeminiModel.PRO);
                                    setIsModelOpen(false);
                                }}
                                className={`flex items-start gap-3 px-3 py-2.5 rounded-lg transition-colors text-left group ${selectedModel === GeminiModel.PRO ? 'bg-surface' : 'hover:bg-surface/50'}`}
                            >
                                <div className="mt-0.5 p-1 rounded bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                                    <Icons.Zap size={14} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <span className={`text-sm font-medium ${selectedModel === GeminiModel.PRO ? 'text-primary' : 'text-zinc-300'}`}>Gemini 3 Pro</span>
                                        {selectedModel === GeminiModel.PRO && <Icons.Check size={14} className="text-primary" />}
                                    </div>
                                    <p className="text-[11px] text-zinc-500 mt-0.5">Best for complex coding</p>
                                </div>
                            </button>

                            <button 
                                onClick={() => {
                                    setSelectedModel(GeminiModel.FLASH);
                                    setIsModelOpen(false);
                                }}
                                className={`flex items-start gap-3 px-3 py-2.5 rounded-lg transition-colors text-left group ${selectedModel === GeminiModel.FLASH ? 'bg-surface' : 'hover:bg-surface/50'}`}
                            >
                                <div className="mt-0.5 p-1 rounded bg-yellow-500/10 text-yellow-400 group-hover:bg-yellow-500/20 transition-colors">
                                    <Icons.Zap size={14} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <span className={`text-sm font-medium ${selectedModel === GeminiModel.FLASH ? 'text-primary' : 'text-zinc-300'}`}>Gemini Flash</span>
                                        {selectedModel === GeminiModel.FLASH && <Icons.Check size={14} className="text-primary" />}
                                    </div>
                                    <p className="text-[11px] text-zinc-500 mt-0.5">Fastest response</p>
                                </div>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  multiple
                  accept=".tsx,.ts,.js,.jsx,.txt,.md,.json"
                />
                <button 
                  onClick={handleAttachClick}
                  className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors relative" 
                  title="Attach file"
                >
                    <Icons.Paperclip size={18} strokeWidth={1.5} />
                    {attachedFiles.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                        {attachedFiles.length}
                      </span>
                    )}
                </button>
                
                <div className="w-px h-6 bg-border mx-1"></div>

                <button 
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className={`p-2 rounded-lg transition-all ${
                        input.trim() && !isLoading 
                            ? 'bg-white text-black hover:bg-zinc-200' 
                            : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    }`}
                >
                    <Icons.ArrowUp size={18} />
                </button>
            </div>
        </div>

        {attachedFiles.length > 0 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {attachedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 rounded-lg text-xs"
              >
                <Icons.Paperclip size={12} className="text-zinc-400" />
                <span className="text-zinc-300 max-w-[120px] truncate">{file.name}</span>
                <button
                  onClick={() => removeFile(index)}
                  className="text-zinc-500 hover:text-red-400 transition-colors"
                >
                  <Icons.ChevronDown size={12} className="rotate-90" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-center mt-2 gap-4 text-[10px] text-zinc-600 font-medium">
         <span>AI can make mistakes. Please check important info.</span>
      </div>
    </div>
  );
};

export default InputArea;
