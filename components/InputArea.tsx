import React, { useState, useRef, useEffect } from 'react';
import * as Icons from './Icons';
import { GeminiModel } from '../types';

interface InputAreaProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  selectedModel: GeminiModel;
  onModelChange: (model: GeminiModel) => void;
}

const InputArea: React.FC<InputAreaProps> = ({ onSend, isLoading, selectedModel, onModelChange }) => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'default' | 'edits'>('default');
  const [isModelOpen, setIsModelOpen] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput('');
      // Reset height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // Click outside listener for model dropdown
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
        
        {/* Text Area */}
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

        {/* Toolbar */}
        <div className="flex items-center justify-between px-3 pb-3 pt-2">
            
            {/* Left Controls: Mode, Prompt Builder, Model */}
            <div className="flex items-center gap-2 flex-wrap">
                {/* Mode Toggle */}
                <div className="flex bg-black/40 rounded-lg p-0.5 border border-border">
                    <button 
                        onClick={() => setMode('default')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${mode === 'default' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-300'}`}
                    >
                        Default
                    </button>
                    <button 
                        onClick={() => setMode('edits')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${mode === 'edits' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-300'}`}
                    >
                        Edits
                    </button>
                </div>

                <div className="w-px h-4 bg-border mx-1"></div>

                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors text-xs font-medium">
                    <Icons.Sparkles size={14} />
                    Prompt Builder
                </button>

                {/* Model Selector in Input Toolbar */}
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
                                    onModelChange(GeminiModel.PRO);
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
                                    onModelChange(GeminiModel.FLASH);
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

            {/* Right Controls */}
            <div className="flex items-center gap-1">
                <button className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors" title="Mention">
                    <Icons.AtSign size={18} strokeWidth={1.5} />
                </button>
                <button className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors" title="Attach file">
                    <Icons.Paperclip size={18} strokeWidth={1.5} />
                </button>
                <button className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors" title="Templates">
                    <Icons.LayoutGrid size={18} strokeWidth={1.5} />
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
      </div>
      <div className="flex justify-center mt-2 gap-4 text-[10px] text-zinc-600 font-medium">
         <span>AI can make mistakes. Please check important info.</span>
      </div>
    </div>
  );
};

export default InputArea;