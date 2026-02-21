import React from 'react'
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import { Search, X } from 'lucide-react-native'
import { useTheme } from '../theme/ThemeContext'

interface SearchBarProps {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChangeText, placeholder = 'Search notes…' }: SearchBarProps) {
  const theme = useTheme()

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.inputBg,
          borderColor: theme.inputBorder,
        },
      ]}
    >
      <Search size={15} color={theme.textMuted} strokeWidth={2} />
      <TextInput
        style={[styles.input, { color: theme.textPrimary }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textMuted}
        returnKeyType="search"
        clearButtonMode="never"
        autoCorrect={false}
        autoCapitalize="none"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')} hitSlop={8}>
          <X size={15} color={theme.textMuted} strokeWidth={2} />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginHorizontal: 12,
    marginVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
})
