/**
 * Calculate the progress percentage for a range input
 */
export function getRangeProgress(value: number, min: number, max: number): number {
  return ((value - min) / (max - min)) * 100;
}

/**
 * Get the CSS custom property style for range input progress
 */
export function getRangeStyle(value: number, min: number, max: number): React.CSSProperties {
  return {
    // @ts-ignore - CSS custom properties
    '--range-progress': `${getRangeProgress(value, min, max)}%`,
  };
}
