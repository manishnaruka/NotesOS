import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from 'react-native'
import { X, Trash2, ChevronDown } from 'lucide-react-native'
import type { AllowedUser, UserRole } from '../types/note'
import {
  subscribeToAllowedUsers,
  addAllowedUser,
  removeAllowedUser,
  updateUserRole,
  isSuperAdmin,
} from '../lib/user-management'
import { useTheme } from '../theme/ThemeContext'
import { SUPERADMIN_EMAIL } from '../config'

interface UserManagementProps {
  visible: boolean
  currentUserEmail: string
  currentUserRole: UserRole
  onClose: () => void
}

export function UserManagement({
  visible,
  currentUserEmail,
  currentUserRole,
  onClose,
}: UserManagementProps) {
  const theme = useTheme()
  const [users, setUsers] = useState<AllowedUser[]>([])
  const [newEmail, setNewEmail] = useState('')
  const [newRole, setNewRole] = useState<UserRole>('user')
  const [error, setError] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [rolePickerFor, setRolePickerFor] = useState<string | null>(null)

  useEffect(() => {
    if (!visible) return
    const unsubscribe = subscribeToAllowedUsers(
      (list) => setUsers(list),
      (err) => setError(err.message),
    )
    return () => unsubscribe()
  }, [visible])

  const handleAdd = async () => {
    const email = newEmail.trim().toLowerCase()
    if (!email) return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address')
      return
    }
    if (isSuperAdmin(email)) {
      setError('Superadmin is always authorized and cannot be added here')
      return
    }
    setError(null)
    setAdding(true)
    try {
      await addAllowedUser(email, newRole, currentUserEmail)
      setNewEmail('')
      setNewRole('user')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add user')
    } finally {
      setAdding(false)
    }
  }

  const handleRemove = async (email: string) => {
    try {
      await removeAllowedUser(email)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove user')
    }
  }

  const handleRoleChange = async (email: string, role: UserRole) => {
    try {
      await updateUserRole(email, role)
      setRolePickerFor(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role')
    }
  }

  const canManageUsers =
    currentUserRole === 'superadmin' || currentUserRole === 'admin'

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
            <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
              User Management
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <X size={20} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Add user row */}
          {canManageUsers && (
            <View style={[styles.addRow, { borderBottomColor: theme.border }]}>
              <TextInput
                style={[
                  styles.emailInput,
                  {
                    backgroundColor: theme.inputBg,
                    borderColor: theme.inputBorder,
                    color: theme.textPrimary,
                  },
                ]}
                value={newEmail}
                onChangeText={setNewEmail}
                placeholder="user@gmail.com"
                placeholderTextColor={theme.textMuted}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="done"
                onSubmitEditing={handleAdd}
              />
              {/* Role picker */}
              {currentUserRole === 'superadmin' && (
                <TouchableOpacity
                  onPress={() =>
                    setNewRole((r) => (r === 'user' ? 'admin' : 'user'))
                  }
                  style={[
                    styles.roleBtn,
                    {
                      backgroundColor: theme.inputBg,
                      borderColor: theme.inputBorder,
                    },
                  ]}
                >
                  <Text style={{ color: theme.textPrimary, fontSize: 12 }}>
                    {newRole === 'admin' ? 'Admin' : 'User'}
                  </Text>
                  <ChevronDown size={12} color={theme.textMuted} />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={handleAdd}
                disabled={adding || !newEmail.trim()}
                style={[
                  styles.addBtn,
                  { backgroundColor: theme.btnPrimaryBg, opacity: adding || !newEmail.trim() ? 0.5 : 1 },
                ]}
              >
                {adding ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.addBtnText}>Add</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {error && (
            <View style={[styles.errorBox, { backgroundColor: theme.errorBg, borderColor: theme.errorBorder }]}>
              <Text style={[styles.errorText, { color: theme.errorText }]}>{error}</Text>
            </View>
          )}

          {/* User list */}
          <ScrollView style={styles.list} bounces={false}>
            {/* Superadmin row */}
            <View style={[styles.userRow, { borderBottomColor: theme.border }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.userEmail, { color: theme.textPrimary }]} numberOfLines={1}>
                  {SUPERADMIN_EMAIL}
                </Text>
                <View style={[styles.rolePill, { backgroundColor: theme.badgePurpleBg }]}>
                  <Text style={[styles.rolePillText, { color: theme.badgePurpleText }]}>
                    superadmin
                  </Text>
                </View>
              </View>
            </View>

            {users.length === 0 && (
              <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                No additional users added yet
              </Text>
            )}

            {users.map((u) => (
              <View key={u.id} style={[styles.userRow, { borderBottomColor: theme.border }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.userEmail, { color: theme.textPrimary }]} numberOfLines={1}>
                    {u.email}
                  </Text>
                  {canManageUsers && currentUserRole === 'superadmin' ? (
                    <TouchableOpacity
                      onPress={() =>
                        handleRoleChange(u.email, u.role === 'user' ? 'admin' : 'user')
                      }
                      style={[
                        styles.rolePill,
                        {
                          backgroundColor:
                            u.role === 'admin' ? theme.badgeBlueBg : theme.badgeMutedBg,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.rolePillText,
                          {
                            color:
                              u.role === 'admin' ? theme.badgeBlueText : theme.badgeMutedText,
                          },
                        ]}
                      >
                        {u.role} ▾
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View
                      style={[
                        styles.rolePill,
                        {
                          backgroundColor:
                            u.role === 'admin' ? theme.badgeBlueBg : theme.badgeMutedBg,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.rolePillText,
                          {
                            color:
                              u.role === 'admin' ? theme.badgeBlueText : theme.badgeMutedText,
                          },
                        ]}
                      >
                        {u.role}
                      </Text>
                    </View>
                  )}
                </View>
                {canManageUsers && (
                  <TouchableOpacity
                    onPress={() => handleRemove(u.email)}
                    style={styles.removeBtn}
                    hitSlop={8}
                  >
                    <Trash2 size={16} color="#f87171" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </ScrollView>

          {/* Footer */}
          <View style={[styles.footer, { borderTopColor: theme.border }]}>
            <Text style={[styles.footerText, { color: theme.textMuted }]}>
              {users.length} user{users.length !== 1 ? 's' : ''} + 1 superadmin
            </Text>
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
    maxWidth: 480,
    maxHeight: '80%',
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  emailInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
  },
  roleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  addBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
  addBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  errorBox: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  errorText: {
    fontSize: 12,
  },
  list: {
    flex: 1,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  userEmail: {
    fontSize: 13,
    fontWeight: '500',
  },
  rolePill: {
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
  },
  rolePillText: {
    fontSize: 10,
    fontWeight: '600',
  },
  removeBtn: {
    padding: 6,
    marginLeft: 10,
  },
  emptyText: {
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 24,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
  },
})
