import React, { useState, useCallback, useMemo } from 'react'
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Text,
} from 'react-native'
import { Plus, Users, LogOut, Settings } from 'lucide-react-native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { Note } from '../types/note'
import { useNoteStore } from '../stores/note-store'
import { useAuthStore } from '../stores/auth-store'
import { createNote, deleteNote, togglePinNote } from '../lib/firestore'
import { signOut } from '../hooks/useAuth'
import { NoteListItem } from '../components/NoteListItem'
import { SearchBar } from '../components/SearchBar'
import { SkeletonLoader } from '../components/SkeletonLoader'
import { ThemeToggle } from '../components/ThemeToggle'
import { UserManagement } from '../components/UserManagement'
import { NoteAssignModal } from '../components/NoteAssignModal'
import { useTheme } from '../theme/ThemeContext'
import type { RootStackParamList } from '../navigation/RootNavigator'

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'NotesList'>
}

export function NotesListScreen({ navigation }: Props) {
  const theme = useTheme()
  const { user, role } = useAuthStore()
  const { notes, notesLoading, searchQuery, setSearchQuery, setSelectedNoteId } = useNoteStore()
  const isSuperAdmin = role === 'superadmin'

  const [showSettings, setShowSettings] = useState(false)
  const [showUserManagement, setShowUserManagement] = useState(false)
  const [assignNote, setAssignNote] = useState<Note | null>(null)

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes
    const q = searchQuery.toLowerCase()
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.plainTextPreview.toLowerCase().includes(q),
    )
  }, [notes, searchQuery])

  const handleNewNote = useCallback(async () => {
    if (!user || role !== 'superadmin') return
    try {
      const id = await createNote(user)
      setSelectedNoteId(id)
      navigation.navigate('NoteEditor', { noteId: id })
    } catch (err) {
      console.error('Failed to create note:', err)
    }
  }, [user, role, navigation, setSelectedNoteId])

  const handleDelete = useCallback(
    async (noteId: string) => {
      if (!user || role !== 'superadmin') return
      try {
        await deleteNote(noteId, user)
      } catch (err) {
        console.error('Failed to delete note:', err)
      }
    },
    [user, role],
  )

  const handleTogglePin = useCallback(
    async (noteId: string, isPinned: boolean) => {
      if (!user) return
      try {
        await togglePinNote(noteId, isPinned, user)
      } catch (err) {
        console.error('Failed to toggle pin:', err)
      }
    },
    [user],
  )

  const handleNotePress = useCallback(
    (noteId: string) => {
      setSelectedNoteId(noteId)
      navigation.navigate('NoteEditor', { noteId })
    },
    [navigation, setSelectedNoteId],
  )

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.sidebarBg }]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.sidebarBg}
      />

      {/* ── Header ── */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <View style={styles.headerLeft}>
          <View style={[styles.logoCircle, { backgroundColor: theme.accentActiveBg }]}>
            <Text style={[styles.logoLetter, { color: theme.accent }]}>T</Text>
          </View>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>TMX Notes</Text>
        </View>
        <View style={styles.headerRight}>
          {isSuperAdmin && (
            <TouchableOpacity
              onPress={() => setShowUserManagement(true)}
              style={[styles.iconBtn, { backgroundColor: theme.btnBg }]}
              hitSlop={6}
            >
              <Users size={17} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => setShowSettings((v) => !v)}
            style={[
              styles.iconBtn,
              { backgroundColor: showSettings ? theme.selectedBg : theme.btnBg },
            ]}
            hitSlop={6}
          >
            <Settings size={17} color={showSettings ? theme.accent : theme.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Settings panel ── */}
      {showSettings && (
        <View style={[styles.settingsPanel, { backgroundColor: theme.toolbarBg, borderBottomColor: theme.border }]}>
          <ThemeToggle />
          <TouchableOpacity
            onPress={signOut}
            style={[styles.signOutBtn, { backgroundColor: theme.btnBg, borderColor: theme.btnBorder }]}
            activeOpacity={0.8}
          >
            <LogOut size={15} color={theme.textSecondary} />
            <Text style={[styles.signOutText, { color: theme.textSecondary }]}>Sign out</Text>
          </TouchableOpacity>
          {user && (
            <Text style={[styles.userEmail, { color: theme.textMuted }]} numberOfLines={1}>
              {user.email}
            </Text>
          )}
        </View>
      )}

      {/* ── Search ── */}
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

      {/* ── Notes list ── */}
      {notesLoading ? (
        <SkeletonLoader count={8} />
      ) : (
        <FlatList
          data={filteredNotes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NoteListItem
              note={item}
              isSelected={false}
              onPress={handleNotePress}
              onDelete={handleDelete}
              onTogglePin={handleTogglePin}
              onAssign={setAssignNote}
              isSuperAdmin={isSuperAdmin}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyList}>
              <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                {searchQuery ? 'No notes match your search.' : 'No notes yet.'}
              </Text>
            </View>
          }
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          bounces
        />
      )}

      {/* ── FAB: new note ── */}
      {isSuperAdmin && (
        <TouchableOpacity
          onPress={handleNewNote}
          style={[styles.fab, { backgroundColor: theme.btnPrimaryBg }]}
          activeOpacity={0.85}
        >
          <Plus size={24} color="#ffffff" strokeWidth={2.5} />
        </TouchableOpacity>
      )}

      {/* ── Modals ── */}
      {user && (role === 'superadmin' || role === 'admin') && (
        <UserManagement
          visible={showUserManagement}
          currentUserEmail={user.email ?? ''}
          currentUserRole={role!}
          onClose={() => setShowUserManagement(false)}
        />
      )}

      <NoteAssignModal
        note={assignNote}
        visible={assignNote !== null}
        onClose={() => setAssignNote(null)}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  logoCircle: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLetter: {
    fontSize: 15,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsPanel: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  signOutText: {
    fontSize: 13,
    fontWeight: '500',
  },
  userEmail: {
    fontSize: 11,
    textAlign: 'center',
  },
  emptyList: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
})
