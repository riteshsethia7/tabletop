/**
 * Platform detection utilities
 */

/**
 * Detect if running on iOS (iPhone, iPad, iPod)
 */
export function isIOS(): boolean {
  if (typeof window === 'undefined') return false;

  // Check User Agent
  const ua = window.navigator.userAgent;
  const isIOSUA = /iPad|iPhone|iPod/.test(ua);

  // Check for iPad on iOS 13+ (reports as Mac)
  const isIPadOS = ua.includes('Mac') && 'ontouchend' in document;

  return isIOSUA || isIPadOS;
}

/**
 * Get maximum simultaneous touches supported by device
 * iOS Safari has a hardware limit of 5 touches
 */
export function getMaxTouches(): number {
  return isIOS() ? 5 : 12;
}
