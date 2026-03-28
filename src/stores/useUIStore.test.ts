import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from './useUIStore';

describe('useUIStore', () => {
  beforeEach(() => {
    useUIStore.setState({
      isSidebarOpen: true,
      isModelSelectorOpen: false,
      isTemplatesModalOpen: false,
      theme: 'dark',
      isFullScreen: false,
      isCollapsed: false,
    });
  });

  describe('toggleSidebar', () => {
    it('should toggle sidebar open state', () => {
      expect(useUIStore.getState().isSidebarOpen).toBe(true);
      
      useUIStore.getState().toggleSidebar();
      expect(useUIStore.getState().isSidebarOpen).toBe(false);
      
      useUIStore.getState().toggleSidebar();
      expect(useUIStore.getState().isSidebarOpen).toBe(true);
    });
  });

  describe('setSidebarOpen', () => {
    it('should set sidebar open state', () => {
      useUIStore.getState().setSidebarOpen(false);
      expect(useUIStore.getState().isSidebarOpen).toBe(false);
      
      useUIStore.getState().setSidebarOpen(true);
      expect(useUIStore.getState().isSidebarOpen).toBe(true);
    });
  });

  describe('toggleModelSelector', () => {
    it('should toggle model selector open state', () => {
      expect(useUIStore.getState().isModelSelectorOpen).toBe(false);
      
      useUIStore.getState().toggleModelSelector();
      expect(useUIStore.getState().isModelSelectorOpen).toBe(true);
      
      useUIStore.getState().toggleModelSelector();
      expect(useUIStore.getState().isModelSelectorOpen).toBe(false);
    });
  });

  describe('setModelSelectorOpen', () => {
    it('should set model selector open state', () => {
      useUIStore.getState().setModelSelectorOpen(true);
      expect(useUIStore.getState().isModelSelectorOpen).toBe(true);
    });
  });

  describe('toggleTemplatesModal', () => {
    it('should toggle templates modal open state', () => {
      expect(useUIStore.getState().isTemplatesModalOpen).toBe(false);
      
      useUIStore.getState().toggleTemplatesModal();
      expect(useUIStore.getState().isTemplatesModalOpen).toBe(true);
      
      useUIStore.getState().toggleTemplatesModal();
      expect(useUIStore.getState().isTemplatesModalOpen).toBe(false);
    });
  });

  describe('setTemplatesModalOpen', () => {
    it('should set templates modal open state', () => {
      useUIStore.getState().setTemplatesModalOpen(true);
      expect(useUIStore.getState().isTemplatesModalOpen).toBe(true);
    });
  });

  describe('setTheme', () => {
    it('should set theme', () => {
      useUIStore.getState().setTheme('light');
      expect(useUIStore.getState().theme).toBe('light');
      
      useUIStore.getState().setTheme('dark');
      expect(useUIStore.getState().theme).toBe('dark');
    });
  });

  describe('toggleFullScreen', () => {
    it('should toggle full screen state', () => {
      expect(useUIStore.getState().isFullScreen).toBe(false);
      
      useUIStore.getState().toggleFullScreen();
      expect(useUIStore.getState().isFullScreen).toBe(true);
      
      useUIStore.getState().toggleFullScreen();
      expect(useUIStore.getState().isFullScreen).toBe(false);
    });
  });

  describe('setFullScreen', () => {
    it('should set full screen state', () => {
      useUIStore.getState().setFullScreen(true);
      expect(useUIStore.getState().isFullScreen).toBe(true);
    });
  });

  describe('toggleCollapsed', () => {
    it('should toggle collapsed state', () => {
      expect(useUIStore.getState().isCollapsed).toBe(false);
      
      useUIStore.getState().toggleCollapsed();
      expect(useUIStore.getState().isCollapsed).toBe(true);
      
      useUIStore.getState().toggleCollapsed();
      expect(useUIStore.getState().isCollapsed).toBe(false);
    });
  });

  describe('setCollapsed', () => {
    it('should set collapsed state', () => {
      useUIStore.getState().setCollapsed(true);
      expect(useUIStore.getState().isCollapsed).toBe(true);
    });
  });
});
