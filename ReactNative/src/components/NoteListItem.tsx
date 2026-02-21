import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native'
import { Star, Trash2, Users } from 'lucide-react-native'
import type { Note } from '../types/note'
import { formatNoteDate } from '../utils/date'
import { useTheme } from '../theme/ThemeContext'

interface NoteListItemProps {
  note: Note
  isSelected: boolean
  onPress: (noteId: string) => void
  onDelete: (noteId: string) => void
  onTogglePin: (noteId: string, isPinned: boolean) => void
  onAssign: (note: Note) => void
  isSuperAdmin: boolean
}

export function NoteListItem({
  note,
  isSelected,
  onPress,
  onDelete,
  onTogglePin,
  onAssign,
  isSuperAdmin,
}: NoteListItemProps) {
  const theme = useTheme()
  const [actionsVisible, setActionsVisible] = useState(false)
  const assigneeCount = note.assignedTo?.length ?? 0

  const confirmDelete = () => {
    Alert.alert('Delete Note', `Delete "${note.title}"? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => onDelete(note.id),
      },
    ])
  }

  return (
    <TouchableOpacity
      onPress={() => {
        onPress(note.id)
        setActionsVisible(false)
      }}
      onLongPress={() => setActionsVisible((v) => !v)}
      activeOpacity={0.7}
      style={[
        styles.container,
        {
          backgroundColor: isSelected ? theme.selectedBg : 'transparent',
          borderBottomColor: theme.border,
          borderLeftColor: isSelected ? theme.selectedBorder : 'transparent',
        },
      ]}
    >
      <View style={styles.content}>
        {/* Title row */}
        <View style={styles.titleRow}>
          {note.isPinned && (
            <Star size={11} color="#fbbf24" fill="#fbbf24" strokeWidth={0} />
          )}
          {isSuperAdmin && assigneeCount > 0 && (
            <View style={[styles.badge, { backgroundColor: theme.badgeBlueBg }]}>
              <Users size={8} color={theme.badgeBlueText} />
              <Text style={[styles.badgeText, { color: theme.badgeBlueText }]}>
                {assigneeCount}
              </Text>
            </View>
          )}
          <Text
            style={[
              styles.title,
              { color: isSelected ? theme.accentActiveText : theme.textPrimary },
            ]}
            numberOfLines={1}
          >
            {note.title}
          </Text>
        </View>

        {/* Preview */}
        <Text style={[styles.preview, { color: theme.textSecondary }]} numberOfLines={1}>
          {note.plainTextPreview || 'No content'}
        </Text>

        {/* Date */}
        <Text style={[styles.date, { color: theme.textMuted }]}>
          {formatNoteDate(note.updatedAt)}
        </Text>
      </View>

      {/* Action buttons — revealed on long press */}
      {actionsVisible && (
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => {
              onTogglePin(note.id, note.isPinned)
              setActionsVisible(false)
            }}
            style={[styles.actionBtn, { backgroundColor: theme.surfaceHover }]}
            hitSlop={4}
          >
            <Star
              size={15}
              color={note.isPinned ? '#fbbf24' : theme.textMuted}
              fill={note.isPinned ? '#fbbf24' : 'none'}
            />
          </TouchableOpacity>

          {isSuperAdmin && (
            <>
              <TouchableOpacity
                onPress={() => {
                  onAssign(note)
                  setActionsVisible(false)
                }}
                style={[styles.actionBtn, { backgroundColor: theme.surfaceHover }]}
                hitSlop={4}
              >
                <Users
                  size={15}
                  color={assigneeCount > 0 ? theme.badgeBlueText : theme.textMuted}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setActionsVisible(false)
                  confirmDelete()
                }}
                style={[styles.actionBtn, { backgroundColor: 'rgba(239,68,68,0.12)' }]}
                hitSlop={4}
              >
                <Trash2 size={15} color="#f87171" />
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: 2,
  },
  content: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  title: {
    fontSize: 13.5,
    fontWeight: '500',
    flexShrink: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '600',
  },
  preview: {
    fontSize: 12,
    marginTop: 1,
  },
  date: {
    fontSize: 10,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 10,
  },
  actionBtn: {
    padding: 6,
    borderRadius: 8,
  },
})
