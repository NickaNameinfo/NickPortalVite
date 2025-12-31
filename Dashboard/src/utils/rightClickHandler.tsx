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

    // Also disable common keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12 (Developer Tools)
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      // Disable Ctrl+Shift+I (Developer Tools)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }
      // Disable Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        return false;
      }
      // Disable Ctrl+U (View Source)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return false;
      }
      // Disable Ctrl+S (Save Page)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        return false;
      }
    };

    // Disable text selection (optional)
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('selectstart', handleSelectStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('selectstart', handleSelectStart);
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
