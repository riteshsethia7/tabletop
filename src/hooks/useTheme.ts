import { useEffect } from 'react';
import { useSettingsStore, getEffectiveTheme } from '../stores/settingsStore';

/**
 * Hook to apply theme and accent color to the document
 * Listens to settings changes and system theme changes
 */
export function useTheme() {
  const { theme, accentColor, reducedMotion } = useSettingsStore();

  useEffect(() => {
    const root = document.documentElement;

    // Apply effective theme (resolve 'system' to 'light' or 'dark')
    const effectiveTheme = getEffectiveTheme(theme);
    root.classList.remove('light', 'dark');
    root.classList.add(effectiveTheme);

    // Apply accent color
    root.setAttribute('data-accent', accentColor);

    // Apply reduced motion preference
    if (reducedMotion) {
      root.style.setProperty('--animation-duration', '0.01ms');
    } else {
      root.style.removeProperty('--animation-duration');
    }

    // Update meta theme-color for PWA
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const primaryColor = getComputedStyle(root).getPropertyValue('--color-primary');
      metaThemeColor.setAttribute('content', primaryColor.trim() || '#2563eb');
    }
  }, [theme, accentColor, reducedMotion]);

  // Listen to system theme changes when theme is 'system'
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(e.matches ? 'dark' : 'light');
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Older browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [theme]);
}
