import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import InputArea from './components/InputArea';
import ArtifactView from './components/ArtifactView';
import * as Icons from './components/Icons';
import { streamMessageToGemini } from './services/geminiService';
import { ChatState, GeminiModel, Message, ArtifactData } from './types';
import ReactMarkdown from 'react-markdown';

// Initial Mock Artifact for the demo state
const INITIAL_CODE = `import React from 'react';
import { ArrowUp, Sparkles } from 'lucide-react';

export default function AstraMindLanding() {
  return (
    <div className="bg-white min-h-screen font-sans text-slate-900">
      <nav className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">A</div>
          <span className="font-bold text-xl tracking-tight">AstraMind</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#" className="hover:text-indigo-600">Features</a>
          <a href="#" className="hover:text-indigo-600">Pricing</a>
        </div>
        <button className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center gap-2">
          Get Started <ArrowUp className="rotate-90 w-3.5 h-3.5" />
        </button>
      </nav>
      <main className="flex flex-col items-center justify-center pt-20 pb-12 px-6 text-center">
        <h1 className="text-5xl font-bold mb-6 tracking-tight">
          Custom AI workflows <br/> built for <span className="text-indigo-600">teams</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mb-10">
          Automate your product development lifecycle with intelligent agents.
        </p>
      </main>
    </div>
  );
}`;

const INITIAL_ARTIFACT: ArtifactData = {
  title: 'AstraMind Landing Page',
  type: 'preview',
  content: INITIAL_CODE
};

function App() {
  const [state, setState] = useState<ChatState>({
    messages: [
      {
        id: '1',
        role: 'model',
        content: 'I\'ve created the initial landing page structure for AstraMind. You can see the hero section, navigation, and primary call-to-actions based on the "Modern SaaS" theme.',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        modelName: GeminiModel.PRO,
        artifact: INITIAL_ARTIFACT
      }
    ],
    isLoading: false,
    selectedModel: GeminiModel.PRO
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.messages]);

  // Helper to extract code from markdown block
  const extractCode = (text: string): string | null => {
    // Look for ```tsx or ```jsx blocks
    const match = text.match(/```(?:tsx|jsx|javascript|typescript|react)\n([\s\S]*?)(?:```|$)/);
    return match ? match[1] : null;
  };

  const handleSend = async (text: string) => {
    // 1. Add User Message immediately
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    // 2. Add placeholder Model Message immediately
    const modelMsgId = (Date.now() + 1).toString();
    const initialModelMsg: Message = {
      id: modelMsgId,
      role: 'model',
      content: '', // Starts empty for streaming
      timestamp: new Date().toISOString(),
      modelName: state.selectedModel
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMsg, initialModelMsg],
      isLoading: true
    }));

    // Prepare history for API (excluding the new empty model message)
    const history = state.messages.map(m => ({
      role: m.role,
      parts: [{ text: m.content }]
    }));

    try {
      let fullContent = '';
      const stream = streamMessageToGemini(text, state.selectedModel, history);

      for await (const chunk of stream) {
        fullContent += chunk;
        
        // Check if there is code in the content
        const extractedCode = extractCode(fullContent);
        
        setState(prev => ({
          ...prev,
          messages: prev.messages.map(msg => {
             if (msg.id === modelMsgId) {
                // If we found code, create or update the artifact on this message
                const updatedArtifact = extractedCode ? {
                    title: 'Generated Component',
                    type: 'preview' as const,
                    content: extractedCode
                } : msg.artifact;

                return { 
                    ...msg, 
                    content: fullContent,
                    artifact: updatedArtifact
                };
             }
             return msg;
          })
        }));
      }
    } catch (error) {
      console.error("Streaming error:", error);
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleModelChange = (model: GeminiModel) => {
    setState(prev => ({ ...prev, selectedModel: model }));
  };

  return (
    <div className="flex flex-col h-screen bg-background text-primary overflow-hidden font-sans selection:bg-zinc-700 selection:text-white">
      <Header />

      {/* Main Chat Area */}
      <main className="flex-1 overflow-hidden relative flex flex-col">
        <div ref={scrollRef} className="flex-1 overflow-y-auto w-full">
            <div className="max-w-4xl mx-auto w-full px-4 pt-8 pb-32 space-y-8">
                
                {state.messages.map((msg, index) => (
                    <div key={msg.id} className={`flex flex-col gap-3 group ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        
                        {/* Artifact Display (Only for specific model messages or initial one) */}
                        {msg.artifact && (
                            <div className="w-full mb-2">
                                <ArtifactView data={msg.artifact} />
                            </div>
                        )}

                        {/* Message Bubble */}
                        {msg.role === 'model' ? (
                           <div className="w-full">
                               {/* Model text content */}
                               <div className="text-base text-zinc-300 leading-relaxed mb-3">
                                   {msg.content ? (
                                     <ReactMarkdown 
                                      components={{
                                          p: ({node, ...props}) => <p className="mb-3 last:mb-0" {...props} />,
                                          a: ({node, ...props}) => <a className="text-blue-400 hover:underline" {...props} />,
                                          ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-3 space-y-1" {...props} />,
                                          ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-3 space-y-1" {...props} />,
                                          li: ({node, ...props}) => <li className="mb-1" {...props} />,
                                          // Hide code blocks in the chat bubble if they are displayed in the ArtifactView
                                          code: ({node, className, children, ...props}) => {
                                              const match = /language-(\w+)/.exec(className || '');
                                              const isInline = !match && !String(children).includes('\n');
                                              
                                              // If it's a large code block and we have an artifact, we might hide it to avoid duplication
                                              // But for transparency let's keep it collapsed or small, or just show it. 
                                              // For this UI, we will render it normally.
                                              return isInline ? (
                                                  <code className="bg-zinc-800 text-zinc-200 px-1 py-0.5 rounded text-sm font-mono" {...props}>{children}</code>
                                              ) : (
                                                  <div className="my-3 rounded-lg overflow-hidden border border-zinc-800 bg-[#0d1117]">
                                                      <div className="px-3 py-1.5 bg-zinc-900 border-b border-zinc-800 text-xs text-zinc-500 font-mono flex items-center justify-between">
                                                          <span>{match?.[1] || 'code'}</span>
                                                      </div>
                                                      <pre className="p-3 overflow-x-auto text-sm font-mono text-zinc-300">
                                                          <code className={className} {...props}>{children}</code>
                                                      </pre>
                                                  </div>
                                              )
                                          }
                                      }}
                                     >
                                         {msg.content}
                                     </ReactMarkdown>
                                   ) : (
                                     <span className="animate-pulse">...</span>
                                   )}
                               </div>
                               
                               {/* Metadata Footer */}
                               <div className="flex items-center gap-3 mt-3 text-[11px] text-zinc-600 font-medium select-none">
                                    <div className="flex items-center gap-1.5">
                                        <Icons.Bot size={12} />
                                        <span>{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </div>
                                    <div className="w-0.5 h-0.5 bg-zinc-700 rounded-full"></div>
                                    <span className="text-zinc-500 uppercase tracking-wider">{msg.modelName || state.selectedModel}</span>
                               </div>
                           </div>
                        ) : (
                           /* User Message */
                           <div className="bg-zinc-800/50 px-4 py-2.5 rounded-2xl rounded-tr-sm text-base text-zinc-200 max-w-[80%]">
                               <ReactMarkdown components={{
                                   p: ({node, ...props}) => <p className="mb-0" {...props} />
                               }}>{msg.content}</ReactMarkdown>
                           </div>
                        )}
                    </div>
                ))}

                {state.isLoading && state.messages[state.messages.length - 1].role === 'user' && (
                    <div className="flex items-center gap-2 text-zinc-500 text-sm animate-pulse">
                        <Icons.Sparkles size={14} className="animate-spin" />
                        Thinking...
                    </div>
                )}
            </div>
        </div>

        {/* Floating Input Area (Positioned absolute bottom) */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#09090b] via-[#09090b] to-transparent pt-10 z-20">
            <InputArea 
                onSend={handleSend} 
                isLoading={state.isLoading}
                selectedModel={state.selectedModel}
                onModelChange={handleModelChange}
            />
        </div>
      </main>
    </div>
  );
}

export default App;