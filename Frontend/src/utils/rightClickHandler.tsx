import React, { useEffect } from 'react';

/**
 * Hook to disable right-click context menu
 * @param enabled - Whether to disable right-click (default: true)
 * @param showMessage - Whether to show an alert message when right-click is attempted (default: false)
 * @param message - Custom message to show (optional)
 */
export const useDisableRightClick = (
  enabled: boolean = true,
  showMessage: boolean = false,
  message: string = 'Right-click is disabled on this page.'
) => {
  useEffect(() => {
    if (!enabled) return;

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      if (showMessage) {
        console.warn(message);
      }
      return false;
    };

    // Also disable common keyboard shortcuts for developer tools
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12 (Developer Tools)
      if (e.key === 'F12') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      
      // Disable Ctrl+Shift+I (Developer Tools)
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      
      // Disable Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      
      // Disable Ctrl+Shift+C (Inspect Element)
      if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      
      // Disable Ctrl+Shift+K (Console in Firefox)
      if (e.ctrlKey && e.shiftKey && (e.key === 'K' || e.key === 'k')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      
      // Disable Ctrl+U (View Source)
      if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      
      // Disable Ctrl+S (Save Page)
      if (e.ctrlKey && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      
      // Disable Ctrl+Shift+Del (Clear browsing data)
      if (e.ctrlKey && e.shiftKey && e.key === 'Delete') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      
      // Disable Ctrl+P (Print - can be used to view source)
      if (e.ctrlKey && (e.key === 'P' || e.key === 'p')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // Disable text selection (optional - can be commented out if text selection is needed)
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // Disable drag (prevents dragging images/elements)
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable copy (Ctrl+C) - optional, comment out if copy is needed
    const handleCopy = (_e: ClipboardEvent) => {
      // Uncomment to disable copy
      // e.preventDefault();
      // return false;
    };

    // Prevent opening DevTools via browser menu (some browsers)
    const handleBeforeUnload = (_e: BeforeUnloadEvent) => {
      // This can help prevent some inspection methods
    };

    // Block common DevTools detection methods
    const blockDevTools = () => {
      // Override console methods in production (optional)
      if (import.meta.env.PROD) {
        // Uncomment to disable console in production
        // console.log = console.warn = console.error = () => {};
      }
    };

    // Block DevTools on initialization
    blockDevTools();

    // Add all event listeners with capture phase for better blocking
    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('selectstart', handleSelectStart, true);
    document.addEventListener('dragstart', handleDragStart, true);
    document.addEventListener('copy', handleCopy, true);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('selectstart', handleSelectStart, true);
      document.removeEventListener('dragstart', handleDragStart, true);
      document.removeEventListener('copy', handleCopy, true);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [enabled, showMessage, message]);
};

/**
 * Component wrapper to disable right-click
 */
interface DisableRightClickProps {
  children: React.ReactNode;
  enabled?: boolean;
  showMessage?: boolean;
  message?: string;
}

export const DisableRightClick: React.FC<DisableRightClickProps> = ({
  children,
  enabled = true,
  showMessage = false,
  message,
}) => {
  useDisableRightClick(enabled, showMessage, message);
  return <>{children}</>;
};
