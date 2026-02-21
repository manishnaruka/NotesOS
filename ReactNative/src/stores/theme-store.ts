import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { ThemeId, ThemeStyle, ThemeMode } from '../theme'

const THEME_KEY = 'tmx-theme'

function isValidThemeId(value: string | null): value is ThemeId {
  return (
    value === 'glass-dark' ||
    value === 'glass-light' ||
    value === 'minimal-dark' ||
    value === 'minimal-light'
  )
}

interface ThemeStore {
  theme: ThemeId
  setTheme: (theme: ThemeId) => void
  toggleMode: () => void
  toggleStyle: () => void
  loadTheme: () => Promise<void>
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: 'glass-dark',

  loadTheme: async () => {
    try {
      const stored = await AsyncStorage.getItem(THEME_KEY)
      if (isValidThemeId(stored)) {
        set({ theme: stored })
      }
    } catch {
      // silently keep default
    }
  },

  setTheme: (theme) => {
    AsyncStorage.setItem(THEME_KEY, theme).catch(() => {})
    set({ theme })
  },

  toggleMode: () => {
    const current = get().theme
    const [style, mode] = current.split('-') as [ThemeStyle, ThemeMode]
    const newTheme: ThemeId = `${style}-${mode === 'dark' ? 'light' : 'dark'}`
    AsyncStorage.setItem(THEME_KEY, newTheme).catch(() => {})
    set({ theme: newTheme })
  },

  toggleStyle: () => {
    const current = get().theme
    const [style, mode] = current.split('-') as [ThemeStyle, ThemeMode]
    const newTheme: ThemeId = `${style === 'glass' ? 'minimal' : 'glass'}-${mode}`
    AsyncStorage.setItem(THEME_KEY, newTheme).catch(() => {})
    set({ theme: newTheme })
  },
}))
