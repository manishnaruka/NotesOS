import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native'
import { signInWithGoogle } from '../hooks/useAuth'
import { useTheme } from '../theme/ThemeContext'

// Google logo colours — inline SVG-style via View shapes
function GoogleIcon() {
  return (
    <View style={googleIconStyles.container}>
      {/* G letter approximated with coloured squares */}
      <View style={[googleIconStyles.topLeft, { backgroundColor: '#4285F4' }]} />
      <View style={[googleIconStyles.topRight, { backgroundColor: '#EA4335' }]} />
      <View style={[googleIconStyles.bottomRight, { backgroundColor: '#FBBC05' }]} />
      <View style={[googleIconStyles.bottomLeft, { backgroundColor: '#34A853' }]} />
      <View style={googleIconStyles.center} />
    </View>
  )
}

const googleIconStyles = StyleSheet.create({
  container: {
    width: 20,
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  topLeft: { width: 10, height: 10 },
  topRight: { width: 10, height: 10 },
  bottomLeft: { width: 10, height: 10 },
  bottomRight: { width: 10, height: 10 },
  center: {
    position: 'absolute',
    width: 10,
    height: 10,
    top: 5,
    left: 5,
    backgroundColor: 'white',
    borderRadius: 5,
  },
})

export function LoginScreen() {
  const theme = useTheme()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setError(null)
    setLoading(true)
    try {
      await signInWithGoogle()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sign in'
      setError(message)
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.bg}
      />
      <View style={styles.container}>
        {/* Logo / branding */}
        <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
          <View style={styles.logoWrap}>
            <View style={[styles.logoCircle, { backgroundColor: theme.accentActiveBg }]}>
              <Text style={[styles.logoLetter, { color: theme.accent }]}>T</Text>
            </View>
            <Text style={[styles.appName, { color: theme.textPrimary }]}>TMX Notes</Text>
            <Text style={[styles.appSub, { color: theme.textSecondary }]}>
              Sign in to access your notes
            </Text>
          </View>

          {/* Google sign-in button */}
          <TouchableOpacity
            onPress={handleGoogleSignIn}
            disabled={loading}
            style={[
              styles.signInBtn,
              {
                backgroundColor: theme.btnBg,
                borderColor: theme.btnBorder,
                opacity: loading ? 0.6 : 1,
              },
            ]}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color={theme.textMuted} />
            ) : (
              <GoogleIcon />
            )}
            <Text style={[styles.signInBtnText, { color: theme.textPrimary }]}>
              {loading ? 'Signing in…' : 'Continue with Google'}
            </Text>
          </TouchableOpacity>

          {error && (
            <View
              style={[
                styles.errorBox,
                { backgroundColor: theme.errorBg, borderColor: theme.errorBorder },
              ]}
            >
              <Text style={[styles.errorText, { color: theme.errorText }]}>{error}</Text>
            </View>
          )}
        </View>
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
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 20,
    borderWidth: 1,
    padding: 28,
    gap: 20,
  },
  logoWrap: {
    alignItems: 'center',
    gap: 10,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLetter: {
    fontSize: 32,
    fontWeight: '700',
  },
  appName: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  appSub: {
    fontSize: 14,
    textAlign: 'center',
  },
  signInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  signInBtnText: {
    fontSize: 15,
    fontWeight: '500',
  },
  errorBox: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  errorText: {
    fontSize: 13,
    lineHeight: 18,
  },
})
