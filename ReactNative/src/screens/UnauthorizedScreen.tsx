import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native'
import { ShieldOff, LogOut } from 'lucide-react-native'
import { signOut } from '../hooks/useAuth'
import { useTheme } from '../theme/ThemeContext'

interface UnauthorizedScreenProps {
  email: string
}

export function UnauthorizedScreen({ email }: UnauthorizedScreenProps) {
  const theme = useTheme()

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.bg}
      />
      <View style={styles.container}>
        <View style={[styles.iconWrap, { backgroundColor: theme.errorBg }]}>
          <ShieldOff size={36} color={theme.errorText} strokeWidth={1.5} />
        </View>

        <Text style={[styles.title, { color: theme.textPrimary }]}>Access Denied</Text>
        <Text style={[styles.body, { color: theme.textSecondary }]}>
          <Text style={{ color: theme.accent }}>{email}</Text>
          {' '}is not authorised to access TMX Notes.{'\n'}
          Please contact an administrator to request access.
        </Text>

        <TouchableOpacity
          onPress={signOut}
          style={[styles.signOutBtn, { backgroundColor: theme.btnBg, borderColor: theme.btnBorder }]}
          activeOpacity={0.8}
        >
          <LogOut size={16} color={theme.textSecondary} />
          <Text style={[styles.signOutText, { color: theme.textSecondary }]}>
            Sign out
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 16,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  body: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  signOutText: {
    fontSize: 14,
    fontWeight: '500',
  },
})
