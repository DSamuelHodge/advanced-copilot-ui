import React, { useState, useRef, useEffect } from 'react';
import * as Icons from './Icons';
import { ArtifactData } from '../lib/types';

interface ArtifactViewProps {
  data: ArtifactData;
}

interface CodeVersion {
  id: string;
  timestamp: number;
  content: string;
  label?: string;
}

const ArtifactView: React.FC<ArtifactViewProps> = ({ data }) => {
  const [code, setCode] = useState(data.content);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [isCopied, setIsCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Full Screen & Layout State
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [height, setHeight] = useState(500);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Version History State
  const [versions, setVersions] = useState<CodeVersion[]>([
    { id: 'initial', timestamp: Date.now(), content: data.content, label: 'Initial Generation' }
  ]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyFilter, setHistoryFilter] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const historyRef = useRef<HTMLDivElement>(null);

  // Sync state with props when streaming
  useEffect(() => {
    if (data.content && data.content !== code) {
        setCode(data.content);
        // Update initial version if it was empty, or add new version if significantly different?
        // For streaming, we just update the current view.
        if (versions.length === 1 && versions[0].id === 'initial' && versions[0].content !== data.content) {
            setVersions([{ ...versions[0], content: data.content }]);
        }
    }
  }, [data.content]);

  // Resize Handler
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newHeight = Math.max(300, Math.min(800, height + e.movementY));
        setHeight(newHeight);
      }
    };
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, height]);

  // Click outside listener for history dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (historyRef.current && !historyRef.current.contains(event.target as Node)) {
        setShowHistory(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopy = async () => {
    if (isCopied) return;
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code', err);
    }
  };

  const handleSaveTemplate = () => {
    if (isSaving) return;
    setIsSaving(true);
    
    // Add to version history
    const newVersion: CodeVersion = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      content: code,
      label: `Version ${versions.length + 1}`
    };
    setVersions([newVersion, ...versions]);

    setTimeout(() => setIsSaving(false), 800);
  };

  const handleRevert = (version: CodeVersion) => {
    setCode(version.content);
    setShowHistory(false);
  };

  const handleExportPng = () => {
    if (isExporting) return;
    setIsExporting(true);
    setTimeout(() => setIsExporting(false), 2000);
  };

  const handleRun = () => {
    if (isRunning) return;
    setIsRunning(true);
    // Simulate compilation/execution
    setTimeout(() => {
        setIsRunning(false);
        setViewMode('preview');
    }, 1000);
  };

  const toggleFullScreen = () => {
    if (isCollapsed) setIsCollapsed(false);
    setIsFullScreen(!isFullScreen);
    if (!isFullScreen) {
        setViewMode('code');
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    if (isFullScreen && !isCollapsed) {
        setIsFullScreen(false);
    }
  };



  // Calculate container classes based on full screen mode
  const containerClasses = isFullScreen 
    ? "fixed inset-0 z-50 bg-[#09090b] flex flex-col transition-all duration-300"
    : "w-full max-w-4xl mx-auto rounded-xl border border-border bg-black/40 overflow-hidden shadow-2xl mb-4 ring-1 ring-white/5 flex flex-col transition-all duration-75 relative";

  const contentHeightStyle = isFullScreen ? { height: '100%' } : { height: `${height}px` };

  // Filter and Sort Logic for History
  const filteredVersions = versions
    .filter(v => v.label?.toLowerCase().includes(historyFilter.toLowerCase()))
    .sort((a, b) => {
        if (sortOrder === 'newest') return b.timestamp - a.timestamp;
        return a.timestamp - b.timestamp;
    });

  return (
    <div ref={containerRef} className={containerClasses}>
      {/* Artifact Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-border bg-surface/80 backdrop-blur-sm select-none">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5 group">
            {/* Fake Traffic Lights - Now Interactive */}
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50 group-hover:bg-red-500 transition-colors cursor-pointer" title="Close"></div>
            <button 
                className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50 group-hover:bg-yellow-500 transition-colors cursor-pointer"
                onClick={toggleCollapse}
                onKeyDown={(e) => e.key === 'Enter' && toggleCollapse()}
                title={isCollapsed ? "Expand" : "Collapse"}
                aria-label={isCollapsed ? "Expand" : "Collapse"}
            />
            <button 
                className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50 group-hover:bg-green-500 transition-colors cursor-pointer"
                onClick={toggleFullScreen}
                onKeyDown={(e) => e.key === 'Enter' && toggleFullScreen()}
                title="Toggle Full Screen"
                aria-label="Toggle Full Screen"
            />
          </div>
          <span className="text-xs text-zinc-400 font-medium font-mono">landing-page.tsx</span>
          
          {/* Version History Dropdown */}
          <div className="relative ml-2" ref={historyRef}>
            <button 
                onClick={() => setShowHistory(!showHistory)}
                className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-medium transition-colors ${showHistory ? 'bg-zinc-800 text-zinc-200' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}
            >
                <Icons.History size={12} />
                <span>v{versions.length}</span>
            </button>
            
            {showHistory && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-[#121214] border border-border rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 ring-1 ring-white/10">
                    <div className="px-3 py-2 bg-zinc-900/50 border-b border-white/5 space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Version History</span>
                            <span className="text-[10px] text-zinc-600">{filteredVersions.length} versions</span>
                        </div>
                        {/* Search and Filter */}
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <Icons.Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <input 
                                    type="text" 
                                    value={historyFilter} 
                                    onChange={(e) => setHistoryFilter(e.target.value)}
                                    placeholder="Find version..." 
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 pl-7 py-1 text-xs text-zinc-300 focus:outline-none focus:border-zinc-700 placeholder:text-zinc-700"
                                />
                            </div>
                            <button 
                                onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
                                className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 transition-colors"
                                title={sortOrder === 'newest' ? "Newest First" : "Oldest First"}
                            >
                                <Icons.ArrowUpDown size={12} />
                            </button>
                        </div>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto">
                        {filteredVersions.length > 0 ? (
                            filteredVersions.map((v, i) => (
                                <button 
                                    key={v.id}
                                    onClick={() => handleRevert(v)}
                                    className="w-full flex items-start gap-3 px-3 py-2.5 hover:bg-white/5 text-left group transition-colors border-b border-white/5 last:border-0"
                                >
                                    <div className={`mt-0.5 p-1 rounded-full ${i === 0 && sortOrder === 'newest' && !historyFilter ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 text-zinc-500'}`}>
                                        {(i === 0 && sortOrder === 'newest' && !historyFilter) ? <Icons.Check size={10} /> : <Icons.RotateCcw size={10} />}
                                    </div>
                                    <div>
                                        <div className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">
                                            {v.label}
                                        </div>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <Icons.Clock size={10} className="text-zinc-600" />
                                            <span className="text-[10px] text-zinc-500">{new Date(v.timestamp).toLocaleTimeString()}</span>
                                        </div>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="p-4 text-center text-xs text-zinc-600 italic">
                                No versions found.
                            </div>
                        )}
                    </div>
                </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
            {/* Actions */}
            {!isCollapsed && (
                <>
                    <button 
                      onClick={handleSaveTemplate}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                          isSaving ? 'text-blue-400 bg-blue-400/10' : 'text-secondary hover:bg-white/5'
                      }`}
                      title="Save Version"
                    >
                      {isSaving ? <Icons.Check size={14} /> : <Icons.Save size={14} />}
                      <span className="hidden sm:inline">{isSaving ? 'Saved' : 'Save'}</span>
                    </button>

                    <button 
                      onClick={handleExportPng}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                          isExporting ? 'text-indigo-400 bg-indigo-400/10' : 'text-secondary hover:bg-white/5'
                      }`}
                      title="Export as PNG"
                    >
                      {isExporting ? <Icons.Sparkles size={14} className="animate-spin" /> : <Icons.Download size={14} />}
                      <span className="hidden sm:inline">Export</span>
                    </button>

                    <div className="w-px h-4 bg-border mx-1"></div>

                    <button 
                      onClick={handleCopy}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                          isCopied ? 'text-green-400 bg-green-400/10' : 'text-secondary hover:bg-white/5'
                      }`}
                      title="Copy Code"
                    >
                      {isCopied ? <Icons.Check size={14} /> : <Icons.Copy size={14} />}
                      <span className="hidden sm:inline">{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button 
                      onClick={handleRun}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                          isRunning ? 'text-blue-400 bg-blue-400/10' : 'text-secondary hover:bg-white/5'
                      }`}
                      title="Run Code"
                    >
                      {isRunning ? <Icons.Sparkles size={14} className="animate-spin" /> : <Icons.Play size={14} />}
                      <span className="hidden sm:inline">{isRunning ? 'Running...' : 'Run'}</span>
                    </button>
                    
                    <div className="w-px h-4 bg-border mx-1"></div>
                    
                    <div className="flex bg-surface rounded-md border border-border p-0.5">
                        <button 
                          onClick={() => setViewMode('preview')}
                          className={`px-3 py-1 text-xs font-medium rounded-sm transition-all flex items-center gap-1.5 ${viewMode === 'preview' ? 'bg-zinc-700 text-white shadow-sm' : 'text-secondary hover:text-primary'}`}
                        >
                          <Icons.Eye size={12} />
                          Preview
                        </button>
                        <button 
                          onClick={() => setViewMode('code')}
                          className={`px-3 py-1 text-xs font-medium rounded-sm transition-all flex items-center gap-1.5 ${viewMode === 'code' ? 'bg-zinc-700 text-white shadow-sm' : 'text-secondary hover:text-primary'}`}
                        >
                          <Icons.Code size={12} />
                          Code
                        </button>
                    </div>

                    <div className="w-px h-4 bg-border mx-1"></div>
                </>
            )}

            <button 
                onClick={toggleFullScreen}
                className={`p-1.5 rounded-md text-secondary hover:text-primary hover:bg-white/5 transition-colors ${isFullScreen ? 'bg-white/10 text-white' : ''}`}
                title={isFullScreen ? "Minimize" : "Maximize Editor"}
            >
                {isFullScreen ? <Icons.Minimize2 size={14} /> : <Icons.Maximize2 size={14} />}
            </button>

            <button 
                onClick={toggleCollapse}
                className="p-1.5 rounded-md text-secondary hover:text-primary hover:bg-white/5 transition-colors"
                title={isCollapsed ? "Expand" : "Collapse"}
            >
                {isCollapsed ? <Icons.ChevronDown size={14} /> : <Icons.ChevronUp size={14} />}
            </button>
        </div>
      </div>

      {/* Artifact Content */}
      {!isCollapsed && (
        <div style={contentHeightStyle} className="w-full bg-white overflow-hidden relative group transition-all duration-300">
          {viewMode === 'preview' ? (
            <div className="w-full h-full bg-white text-black overflow-y-auto scrollbar-hide">
              {/* Dynamic Component Preview (Not actually executing React in this demo, showing source unless a compiler is added) */}
              {/* To truly preview dynamic code in browser without a bundler, we'd need an iframe + transpiler like sandpack */}
              {/* For this specific "Act as Engineer" task, displaying a static message or simple replacement is safer than eval() */}
              
              <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gray-50">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-gray-100">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
                        <Icons.Zap size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Code Generated</h3>
                    <p className="text-gray-500 mb-6 text-sm">
                        The code for this component has been generated by Gemini. 
                        In a production app, this would use <code>react-live</code> or <code>sandpack</code> to render.
                    </p>
                    <button onClick={() => setViewMode('code')} className="text-indigo-600 font-medium text-sm hover:underline">
                        View Generated Code
                    </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-[#0d1117] flex flex-col">
              {/* Edit Mode Warning/Info */}
              {isFullScreen && (
                  <div className="bg-blue-500/10 text-blue-400 text-xs px-4 py-2 border-b border-blue-500/20 flex items-center gap-2">
                      <Icons.PenTool size={12} />
                      <span>Editing Mode Active. Changes are saved to local version history.</span>
                  </div>
              )}

              <div className="relative flex-1 overflow-auto">
                  {/* 
                      If Full Screen, we show an actual textarea for editing.
                      If Small view, we show the pretty highlighted code for readability.
                  */}
                  {isFullScreen ? (
                      <textarea
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          className="w-full h-full bg-[#0d1117] text-zinc-300 font-mono text-[13px] leading-6 p-4 resize-none outline-none focus:ring-0 border-none"
                          spellCheck={false}
                      />
                  ) : (
                      <div className="min-w-full inline-block font-mono text-[13px] leading-6 py-4 text-left">
                          {code.split('\n').map((line, i) => (
                              <div key={line + i} className="flex hover:bg-white/5 group/line px-4">
                                  <div className="w-8 text-right pr-4 select-none text-zinc-600 text-[11px] opacity-50 group-hover/line:opacity-100 group-hover/line:text-zinc-400 font-mono">
                                      {i + 1}
                                  </div>
                                  <pre className="flex-1 pl-0 text-zinc-300 whitespace-pre break-all">{line || ' '}</pre>
                              </div>
                          ))}
                      </div>
                  )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Resize Handle (Only visible when NOT full screen and NOT collapsed) */}
      {!isFullScreen && !isCollapsed && (
        <div 
            className="w-full h-2 bg-surface hover:bg-zinc-700 cursor-ns-resize flex items-center justify-center transition-colors border-t border-border"
            onMouseDown={handleMouseDown}
            role="separator"
            aria-orientation="horizontal"
        >
            <div className="w-12 h-1 rounded-full bg-zinc-600/50"></div>
        </div>
      )}
    </div>
  );
};

export default ArtifactView;