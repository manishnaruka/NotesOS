import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native'
import {
  RichText,
  Toolbar,
  useEditorBridge,
  TenTapStartKit,
  PlaceholderBridge,
  HighlightBridge,
  UnderlineBridge,
  TaskListBridge,
} from '@10play/tentap-editor'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { RouteProp } from '@react-navigation/native'
import { ArrowLeft, Star, Trash2, Users, Check } from 'lucide-react-native'
import { useAuthStore } from '../stores/auth-store'
import { useNote } from '../hooks/useNote'
import { updateNoteContent, deleteNote, togglePinNote } from '../lib/firestore'
import { NoteAssignModal } from '../components/NoteAssignModal'
import { useTheme } from '../theme/ThemeContext'
import type { RootStackParamList } from '../navigation/RootNavigator'

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'NoteEditor'>
  route: RouteProp<RootStackParamList, 'NoteEditor'>
}

const SAVE_DEBOUNCE_MS = 1200
const DEFAULT_CONTENT = JSON.stringify({ type: 'doc', content: [{ type: 'paragraph' }] })

export function NoteEditorScreen({ navigation, route }: Props) {
  const theme = useTheme()
  const { noteId } = route.params
  const { user, role } = useAuthStore()
  const { note } = useNote(noteId)
  const isSuperAdmin = role === 'superadmin'

  const [isFocused, setIsFocused] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [savedOk, setSavedOk] = useState(false)
  const [showAssign, setShowAssign] = useState(false)
  const hasEdited = useRef(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const editor = useEditorBridge({
    autofocus: false,
    avoidIosKeyboard: true,
    initialContent: note ? JSON.stringify(note.content) : DEFAULT_CONTENT,
    bridgeExtensions: [
      ...TenTapStartKit,
      PlaceholderBridge.configureExtension({ placeholder: 'Start writing…' }),
      HighlightBridge,
      UnderlineBridge,
      TaskListBridge,
    ],
    theme: {
      toolbar: {
        toolbarBody: {
          backgroundColor: theme.toolbarBg,
          borderTopColor: theme.border,
          borderTopWidth: StyleSheet.hairlineWidth,
        },
      },
    },
  })

  // ── Save helpers ──────────────────────────────────────────────────────────

  const performSave = useCallback(async () => {
    if (!user || !note || !hasEdited.current) return
    setIsSaving(true)
    try {
      const json = await editor.getJSON()
      if (json) {
        await updateNoteContent(note.id, json as never, user)
        setSavedOk(true)
        setTimeout(() => setSavedOk(false), 1500)
      }
    } catch (err) {
      console.error('Auto-save failed:', err)
    } finally {
      setIsSaving(false)
    }
  }, [editor, note, user])

  const scheduleSave = useCallback(() => {
    hasEdited.current = true
    setSavedOk(false)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(performSave, SAVE_DEBOUNCE_MS)
  }, [performSave])

  // Listen to editor changes
  useEffect(() => {
    // @10play/tentap-editor exposes an 'update' event on the editor bridge
    const unsub = (editor as unknown as { on: (e: string, cb: () => void) => () => void }).on?.(
      'update',
      scheduleSave,
    )
    return () => {
      unsub?.()
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [editor, scheduleSave])

  // Save when navigating away
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
      performSave()
    })
    return unsubscribe
  }, [navigation, performSave])

  // ── Actions ───────────────────────────────────────────────────────────────

  const handleDelete = useCallback(async () => {
    if (!user || !note) return
    Alert.alert('Delete Note', `Delete "${note.title}"? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteNote(note.id, user)
            navigation.goBack()
          } catch (err) {
            console.error('Failed to delete note:', err)
          }
        },
      },
    ])
  }, [user, note, navigation])

  const handleTogglePin = useCallback(async () => {
    if (!user || !note) return
    try {
      await togglePinNote(note.id, note.isPinned, user)
    } catch (err) {
      console.error('Failed to toggle pin:', err)
    }
  }, [user, note])

  if (!note) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.editorBg }]}>
        <ActivityIndicator style={{ flex: 1 }} color={theme.accent} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.editorBg }]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.toolbarBg}
      />

      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <View
        style={[
          styles.topBar,
          { backgroundColor: theme.toolbarBg, borderBottomColor: theme.border },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <ArrowLeft size={22} color={theme.textSecondary} />
        </TouchableOpacity>

        <Text style={[styles.noteTitle, { color: theme.textPrimary }]} numberOfLines={1}>
          {note.title}
        </Text>

        <View style={styles.topBarActions}>
          {/* Save status */}
          {isSaving ? (
            <ActivityIndicator size="small" color={theme.textMuted} />
          ) : savedOk ? (
            <Check size={16} color={theme.accent} strokeWidth={2.5} />
          ) : null}

          {/* Pin */}
          <TouchableOpacity onPress={handleTogglePin} hitSlop={8}>
            <Star
              size={20}
              color={note.isPinned ? '#fbbf24' : theme.textMuted}
              fill={note.isPinned ? '#fbbf24' : 'none'}
            />
          </TouchableOpacity>

          {/* Assign (superadmin only) */}
          {isSuperAdmin && (
            <TouchableOpacity onPress={() => setShowAssign(true)} hitSlop={8}>
              <Users
                size={20}
                color={
                  (note.assignedTo?.length ?? 0) > 0 ? theme.badgeBlueText : theme.textMuted
                }
              />
            </TouchableOpacity>
          )}

          {/* Delete (superadmin only) */}
          {isSuperAdmin && (
            <TouchableOpacity onPress={handleDelete} hitSlop={8}>
              <Trash2 size={20} color={theme.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── Editor + Toolbar ─────────────────────────────────────────────── */}
      <KeyboardAvoidingView
        style={styles.editorWrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <RichText
          editor={editor}
          style={[styles.richText, { backgroundColor: theme.editorBg }]}
          containerStyle={{ flex: 1 }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false)
            // Also save on blur as a fallback
            if (hasEdited.current) performSave()
          }}
        />

        {/* Tentap built-in formatting toolbar */}
        <Toolbar editor={editor} hidden={!isFocused} />
      </KeyboardAvoidingView>

      {/* ── Assign modal ─────────────────────────────────────────────────── */}
      <NoteAssignModal note={note} visible={showAssign} onClose={() => setShowAssign(false)} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  noteTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  topBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  editorWrapper: {
    flex: 1,
  },
  richText: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    fontSize: 15,
    lineHeight: 24,
  },
})
