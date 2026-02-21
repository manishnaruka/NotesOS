import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { FileText, Plus } from 'lucide-react-native'
import { useTheme } from '../theme/ThemeContext'

interface EmptyStateProps {
  onNewNote?: () => void
}

export function EmptyState({ onNewNote }: EmptyStateProps) {
  const theme = useTheme()

  return (
    <View style={styles.container}>
      <View style={[styles.iconWrap, { backgroundColor: theme.surfaceHover }]}>
        <FileText size={32} color={theme.textMuted} strokeWidth={1.5} />
      </View>
      <Text style={[styles.title, { color: theme.textPrimary }]}>No note selected</Text>
      <Text style={[styles.subtitle, { color: theme.textMuted }]}>
        {onNewNote ? 'Select a note from the list or create a new one.' : 'Select a note to start reading.'}
      </Text>
      {onNewNote && (
        <TouchableOpacity
          onPress={onNewNote}
          style={[styles.button, { backgroundColor: theme.btnPrimaryBg }]}
          activeOpacity={0.8}
        >
          <Plus size={16} color="#ffffff" />
          <Text style={styles.buttonText}>New Note</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
})
