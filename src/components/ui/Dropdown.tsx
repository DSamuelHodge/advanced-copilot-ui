import { useRef, useEffect, ReactNode } from 'react';

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'left' | 'right';
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Dropdown({ trigger, children, align = 'left', isOpen, onOpenChange }: DropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onOpenChange(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onOpenChange]);

  return (
    <div className="relative" ref={dropdownRef}>
      {trigger}
      {isOpen && (
        <div
          className={`
            absolute top-full mt-2 
            ${align === 'left' ? 'left-0' : 'right-0'}
            w-56 bg-[#121214] border border-border rounded-xl 
            shadow-2xl shadow-black/50 overflow-hidden 
            z-50 animate-in fade-in zoom-in-95 duration-100
          `}
        >
          {children}
        </div>
      )}
    </div>
  );
}

interface DropdownItemProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function DropdownItem({ children, onClick, disabled, className = '' }: DropdownItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
        text-left text-sm text-zinc-300 hover:bg-surface hover:text-white
        transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export function DropdownSeparator() {
  return <div className="h-px bg-border mx-1 my-1" />;
}

export function DropdownLabel({ children }: { children: ReactNode }) {
  return (
    <div className="px-3 py-2 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
      {children}
    </div>
  );
}
