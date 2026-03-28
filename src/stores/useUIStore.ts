import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIStore {
  isSidebarOpen: boolean;
  isModelSelectorOpen: boolean;
  isTemplatesModalOpen: boolean;
  theme: 'dark' | 'light';
  isFullScreen: boolean;
  isCollapsed: boolean;
  
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleModelSelector: () => void;
  setModelSelectorOpen: (open: boolean) => void;
  toggleTemplatesModal: () => void;
  setTemplatesModalOpen: (open: boolean) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleFullScreen: () => void;
  setFullScreen: (fullScreen: boolean) => void;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      isSidebarOpen: true,
      isModelSelectorOpen: false,
      isTemplatesModalOpen: false,
      theme: 'dark',
      isFullScreen: false,
      isCollapsed: false,

      toggleSidebar: () => {
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
      },

      setSidebarOpen: (open: boolean) => {
        set({ isSidebarOpen: open });
      },

      toggleModelSelector: () => {
        set((state) => ({ isModelSelectorOpen: !state.isModelSelectorOpen }));
      },

      setModelSelectorOpen: (open: boolean) => {
        set({ isModelSelectorOpen: open });
      },

      toggleTemplatesModal: () => {
        set((state) => ({ isTemplatesModalOpen: !state.isTemplatesModalOpen }));
      },

      setTemplatesModalOpen: (open: boolean) => {
        set({ isTemplatesModalOpen: open });
      },

      setTheme: (theme: 'dark' | 'light') => {
        set({ theme });
      },

      toggleFullScreen: () => {
        set((state) => ({ isFullScreen: !state.isFullScreen }));
      },

      setFullScreen: (fullScreen: boolean) => {
        set({ isFullScreen: fullScreen });
      },

      toggleCollapsed: () => {
        set((state) => ({ isCollapsed: !state.isCollapsed }));
      },

      setCollapsed: (collapsed: boolean) => {
        set({ isCollapsed: collapsed });
      },
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        isSidebarOpen: state.isSidebarOpen,
        theme: state.theme,
      }),
    }
  )
);
