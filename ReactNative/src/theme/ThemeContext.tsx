import React, { createContext, useContext } from 'react'
import { useThemeStore } from '../stores/theme-store'
import { getTheme, type Theme } from './index'

const ThemeContext = createContext<Theme>(getTheme('glass-dark'))

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeId = useThemeStore((s) => s.theme)
  const theme = getTheme(themeId)

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}

export function useTheme(): Theme {
  return useContext(ThemeContext)
}
