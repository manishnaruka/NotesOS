/**
 * TMX Notes — React Native
 * Mobile companion to the Electron desktop app.
 * Same Firebase backend, same 4-theme design system.
 */

import React, { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StyleSheet } from 'react-native'
import { ThemeProvider } from './src/theme/ThemeContext'
import { useThemeStore } from './src/stores/theme-store'
import { RootNavigator } from './src/navigation/RootNavigator'

function AppInner() {
  const loadTheme = useThemeStore((s) => s.loadTheme)

  // Restore persisted theme from AsyncStorage on startup
  useEffect(() => {
    loadTheme()
  }, [loadTheme])

  return (
    <ThemeProvider>
      <RootNavigator />
    </ThemeProvider>
  )
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <AppInner />
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
})
