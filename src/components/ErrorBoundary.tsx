import { useState, useCallback, type ReactNode } from 'react';
import * as Icons from './Icons';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  const [state, setState] = useState<ErrorBoundaryState>({
    hasError: false,
    error: null,
  });

  const handleReset = useCallback(() => {
    setState({ hasError: false, error: null });
  }, []);

  if (state.hasError) {
    if (fallback) {
      return fallback;
    }

    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8">
        <div className="bg-surface border border-border rounded-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icons.Zap size={32} className="text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-primary mb-2">Something went wrong</h2>
          <p className="text-secondary text-sm mb-6">
            {state.error?.message || 'An unexpected error occurred. Please try again.'}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors text-sm font-medium"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}

export { ErrorBoundary };
