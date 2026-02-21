import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Sun, Moon, Layers, Square } from 'lucide-react-native'
import { useThemeStore } from '../stores/theme-store'
import { useTheme } from '../theme/ThemeContext'

export function ThemeToggle() {
  const theme = useTheme()
  const { theme: themeId, toggleMode, toggleStyle } = useThemeStore()

  const isDark = themeId.includes('dark')
  const isGlass = themeId.includes('glass')

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.textMuted }]}>Appearance</Text>
      <View style={styles.row}>
        {/* Light / Dark toggle */}
        <TouchableOpacity
          onPress={toggleMode}
          style={[
            styles.btn,
            {
              backgroundColor: theme.btnBg,
              borderColor: theme.btnBorder,
            },
          ]}
          activeOpacity={0.7}
        >
          {isDark ? (
            <Moon size={15} color={theme.textPrimary} strokeWidth={2} />
          ) : (
            <Sun size={15} color={theme.textPrimary} strokeWidth={2} />
          )}
          <Text style={[styles.btnText, { color: theme.textPrimary }]}>
            {isDark ? 'Dark' : 'Light'}
          </Text>
        </TouchableOpacity>

        {/* Glass / Minimal toggle */}
        <TouchableOpacity
          onPress={toggleStyle}
          style={[
            styles.btn,
            {
              backgroundColor: theme.btnBg,
              borderColor: theme.btnBorder,
            },
          ]}
          activeOpacity={0.7}
        >
          {isGlass ? (
            <Layers size={15} color={theme.textPrimary} strokeWidth={2} />
          ) : (
            <Square size={15} color={theme.textPrimary} strokeWidth={2} />
          )}
          <Text style={[styles.btnText, { color: theme.textPrimary }]}>
            {isGlass ? 'Glass' : 'Minimal'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
  },
  btnText: {
    fontSize: 13,
    fontWeight: '500',
  },
})
