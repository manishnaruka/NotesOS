import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from 'react-native'
import { X, Check } from 'lucide-react-native'
import type { Note, AllowedUser } from '../types/note'
import { subscribeToAllowedUsers } from '../lib/user-management'
import { assignNoteToUsers } from '../lib/firestore'
import { useTheme } from '../theme/ThemeContext'

interface NoteAssignModalProps {
  note: Note | null
  visible: boolean
  onClose: () => void
}

export function NoteAssignModal({ note, visible, onClose }: NoteAssignModalProps) {
  const theme = useTheme()
  const [users, setUsers] = useState<AllowedUser[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reset selection when note changes
  useEffect(() => {
    if (note) {
      setSelected(new Set((note.assignedTo ?? []).map((e) => e.toLowerCase())))
    }
  }, [note?.id])

  useEffect(() => {
    if (!visible) return
    const unsubscribe = subscribeToAllowedUsers(
      (list) => setUsers(list),
      (err) => setError(err.message),
    )
    return () => unsubscribe()
  }, [visible])

  const toggle = (email: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(email)) next.delete(email)
      else next.add(email)
      return next
    })
  }

  const handleSave = async () => {
    if (!note) return
    setSaving(true)
    setError(null)
    try {
      await assignNoteToUsers(note.id, Array.from(selected))
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable style={[styles.overlay, { backgroundColor: theme.overlayBg }]} onPress={onClose}>
        <Pressable
          style={[
            styles.sheet,
            { backgroundColor: theme.cardBg, borderColor: theme.cardBorder },
          ]}
          onPress={() => {}}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Assign Note</Text>
              <Text style={[styles.headerSub, { color: theme.textMuted }]} numberOfLines={1}>
                {note?.title}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <X size={20} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          {/* User list */}
          <ScrollView style={styles.list} bounces={false}>
            {users.length === 0 ? (
              <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                No users added yet. Add users in User Management first.
              </Text>
            ) : (
              users.map((u) => {
                const isChecked = selected.has(u.email)
                return (
                  <TouchableOpacity
                    key={u.id}
                    onPress={() => toggle(u.email)}
                    style={[
                      styles.userRow,
                      { backgroundColor: isChecked ? theme.selectedBg : 'transparent' },
                    ]}
                    activeOpacity={0.7}
                  >
                    {/* Checkbox */}
                    <View
                      style={[
                        styles.checkbox,
                        {
                          backgroundColor: isChecked ? theme.accent : 'transparent',
                          borderColor: isChecked ? theme.accent : theme.borderLight,
                        },
                      ]}
                    >
                      {isChecked && <Check size={10} color="#ffffff" strokeWidth={3} />}
                    </View>

                    {/* User info */}
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[styles.userEmail, { color: theme.textPrimary }]}
                        numberOfLines={1}
                      >
                        {u.email}
                      </Text>
                      <Text
                        style={[
                          styles.userRole,
                          {
                            color:
                              u.role === 'admin' ? theme.badgeBlueText : theme.textMuted,
                          },
                        ]}
                      >
                        {u.role}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )
              })
            )}
          </ScrollView>

          {error && (
            <Text style={[styles.errorText, { color: theme.errorText }]}>{error}</Text>
          )}

          {/* Footer */}
          <View style={[styles.footer, { borderTopColor: theme.border }]}>
            <Text style={[styles.countText, { color: theme.textMuted }]}>
              {selected.size} user{selected.size !== 1 ? 's' : ''} assigned
            </Text>
            <View style={styles.footerBtns}>
              <TouchableOpacity
                onPress={onClose}
                style={[styles.cancelBtn, { backgroundColor: theme.surfaceHover }]}
              >
                <Text style={[styles.cancelBtnText, { color: theme.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                disabled={saving}
                style={[styles.saveBtn, { backgroundColor: theme.btnPrimaryBg, opacity: saving ? 0.6 : 1 }]}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveBtnText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  sheet: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '72%',
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerSub: {
    fontSize: 12,
    marginTop: 2,
  },
  list: {
    flex: 1,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 10,
    marginHorizontal: 4,
    marginVertical: 1,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userEmail: {
    fontSize: 13,
    fontWeight: '500',
  },
  userRole: {
    fontSize: 11,
    marginTop: 1,
  },
  emptyText: {
    fontSize: 13,
    textAlign: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 12,
    paddingHorizontal: 20,
    paddingBottom: 6,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  countText: {
    fontSize: 11,
  },
  footerBtns: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 9,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '500',
  },
  saveBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 9,
    minWidth: 60,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
})
