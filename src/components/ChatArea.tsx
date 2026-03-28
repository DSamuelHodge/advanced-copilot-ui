import { useRef, useEffect } from 'react';
import { useChatStore } from '../stores';
import ArtifactView from './ArtifactView';
import * as Icons from './Icons';
import ReactMarkdown from 'react-markdown';

export default function ChatArea() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { getCurrentChat, isLoading } = useChatStore();
  
  const currentChat = getCurrentChat();
  const messages = currentChat?.messages || [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const extractCode = (text: string): string | null => {
    const match = text.match(/```(?:tsx|jsx|javascript|typescript|react)\n([\s\S]*?)(?:```|$)/);
    return match ? match[1] : null;
  };

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto w-full">
      <div className="max-w-4xl mx-auto w-full px-4 pt-8 pb-32 space-y-8">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center pt-20 text-center">
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
              <Icons.Sparkles size={32} className="text-zinc-400" />
            </div>
            <h2 className="text-xl font-semibold text-zinc-300 mb-2">Start a conversation</h2>
            <p className="text-zinc-500 text-sm max-w-md">
              Describe what you want to build and I'll generate React components for you.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col gap-3 group ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            {msg.artifact && (
              <div className="w-full mb-2">
                <ArtifactView data={msg.artifact} />
              </div>
            )}

            {msg.role === 'model' ? (
              <div className="w-full">
                <div className="text-base text-zinc-300 leading-relaxed mb-3">
                  {msg.content ? (
                    <ReactMarkdown 
                      components={{
                        p: ({node, ...props}) => <p className="mb-3 last:mb-0" {...props} />,
                        a: ({node, ...props}) => <a className="text-blue-400 hover:underline" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-3 space-y-1" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-3 space-y-1" {...props} />,
                        li: ({node, ...props}) => <li className="mb-1" {...props} />,
                        code: ({node, className, children, ...props}) => {
                          const match = /language-(\w+)/.exec(className || '');
                          const isInline = !match && !String(children).includes('\n');
                          
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
                          );
                        }
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    <span className="animate-pulse">...</span>
                  )}
                </div>
                
                <div className="flex items-center gap-3 mt-3 text-[11px] text-zinc-600 font-medium select-none">
                  <div className="flex items-center gap-1.5">
                    <Icons.Bot size={12} />
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <div className="w-0.5 h-0.5 bg-zinc-700 rounded-full"></div>
                  <span className="text-zinc-500 uppercase tracking-wider">{msg.modelName}</span>
                </div>
              </div>
            ) : (
              <div className="bg-zinc-800/50 px-4 py-2.5 rounded-2xl rounded-tr-sm text-base text-zinc-200 max-w-[80%]">
                <ReactMarkdown components={{
                  p: ({node, ...props}) => <p className="mb-0" {...props} />
                }}>{msg.content}</ReactMarkdown>
              </div>
            )}
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex items-center gap-2 text-zinc-500 text-sm animate-pulse">
            <Icons.Sparkles size={14} className="animate-spin" />
            Thinking...
          </div>
        )}
      </div>
    </div>
  );
}
