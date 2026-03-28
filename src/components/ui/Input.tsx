import { InputHTMLAttributes, forwardRef, useState, useRef, useEffect } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={`
            w-full bg-transparent text-primary placeholder-zinc-500
            outline-none border border-border rounded-lg px-4 py-2
            focus:ring-1 focus:ring-zinc-700 focus:border-zinc-700
            transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          className={`
            w-full bg-transparent text-primary placeholder-zinc-500
            outline-none border border-border rounded-lg px-4 py-2
            focus:ring-1 focus:ring-zinc-700 focus:border-zinc-700
            transition-colors resize-none
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

interface AutoResizeTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxRows?: number;
}

export const AutoResizeTextarea = forwardRef<HTMLTextAreaElement, AutoResizeTextareaProps>(
  ({ maxRows = 10, className = '', ...props }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [height, setHeight] = useState('auto');

    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        const newHeight = Math.min(textareaRef.current.scrollHeight, maxRows * 24);
        textareaRef.current.style.height = `${newHeight}px`;
        setHeight(`${newHeight}px`);
      }
    }, [props.value, maxRows]);

    return (
      <textarea
        ref={ref}
        {...props}
        style={{ height }}
        className={`
          w-full bg-transparent text-primary placeholder-zinc-500
          outline-none border border-border rounded-lg px-4 py-2
          focus:ring-1 focus:ring-zinc-700 focus:border-zinc-700
          transition-colors resize-none overflow-hidden
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
      />
    );
  }
);

AutoResizeTextarea.displayName = 'AutoResizeTextarea';
