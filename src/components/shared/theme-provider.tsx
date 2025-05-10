"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

type ProviderValue = ReturnType<typeof useTheme>;

// Use a simpler approach to define properties without direct type dependencies
export interface ThemeProviderProps extends React.PropsWithChildren {
  /** DOM attribute to apply theme with (data-theme, class, etc.) */
  attribute?: string;
  /** Default theme name */
  defaultTheme?: string;
  /** Whether to enable system theme detection */
  enableSystem?: boolean;
  /** Disable all CSS transitions when switching themes */
  disableTransitionOnChange?: boolean;
  /** Whether to use localStorage to store theme (defaults to true) */
  storageKey?: string;
}

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  return (
    // @ts-ignore - Ignore type checking for the NextThemesProvider props
    <NextThemesProvider {...props}>{children}</NextThemesProvider>
  );
}
