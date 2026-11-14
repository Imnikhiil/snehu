import type { CSSProperties } from 'react';

/** Lets you pass CSS custom properties (--x) in a style prop without TypeScript complaints. */
export const cssVars = (v: Record<string, string | number>) => v as CSSProperties;