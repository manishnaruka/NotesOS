import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { useAuth } from '../hooks/useAuth'
import { useNotes } from '../hooks/useNotes'
import { useTheme } from '../theme/ThemeContext'
import { LoginScreen } from '../screens/LoginScreen'
import { UnauthorizedScreen } from '../screens/UnauthorizedScreen'
import { NotesListScreen } from '../screens/NotesListScreen'
import { NoteEditorScreen } from '../screens/NoteEditorScreen'

export type RootStackParamList = {
  NotesList: undefined
  NoteEditor: { noteId: string }
}

const Stack = createNativeStackNavigator<RootStackParamList>()

function AuthGate() {
  const theme = useTheme()
  const { user, loading, role, authorized } = useAuth()
  const isSuperAdmin = role === 'superadmin'

  // Subscribe to notes whenever user is authenticated & authorized
  useNotes(authorized ? user : null, isSuperAdmin)

  if (loading) {
    return (
      <View style={[styles.loader, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    )
  }

  if (!user) {
    return <LoginScreen />
  }

  if (authorized === false) {
    return <UnauthorizedScreen email={user.email ?? 'Unknown'} />
  }

  // Still checking authorization
  if (authorized === null) {
    return (
      <View style={[styles.loader, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    )
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="NotesList" component={NotesListScreen} />
      <Stack.Screen name="NoteEditor" component={NoteEditorScreen} />
    </Stack.Navigator>
  )
}

export function RootNavigator() {
  return (
    <NavigationContainer>
      <AuthGate />
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
