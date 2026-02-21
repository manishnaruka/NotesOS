import { useState, useEffect } from 'react'
import { X, Check } from 'lucide-react'
import type { Note, AllowedUser } from '../types/note'
import { subscribeToAllowedUsers } from '../lib/user-management'
import { assignNoteToUsers } from '../lib/firestore'

interface NoteAssignModalProps {
  note: Note
  onClose: () => void
}

export function NoteAssignModal({ note, onClose }: NoteAssignModalProps) {
  const [users, setUsers] = useState<AllowedUser[]>([])
  const [selected, setSelected] = useState<Set<string>>(
    new Set((note.assignedTo ?? []).map((e) => e.toLowerCase()))
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = subscribeToAllowedUsers(
      (usersList) => setUsers(usersList),
      (err) => setError(err.message)
    )
    return () => unsubscribe()
  }, [])

  const toggle = (email: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(email)) next.delete(email)
      else next.add(email)
      return next
    })
  }

  const handleSave = async () => {
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
    <div className="fixed inset-0 bg-[var(--overlay-bg)] backdrop-blur-md flex items-center justify-center z-50">
      <div className="glass-card w-full max-w-sm mx-4 max-h-[70vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold text-[var(--text-primary)]">Assign Note</h2>
            <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">{note.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors ml-3 flex-shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* User checklist */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {users.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)] text-center py-6">
              No users added yet. Add users in User Management first.
            </p>
          ) : (
            <div className="space-y-0.5">
              {users.map((u) => {
                const isChecked = selected.has(u.email)
                return (
                  <button
                    key={u.id}
                    onClick={() => toggle(u.email)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                      isChecked ? 'bg-[var(--selected-bg)]' : 'hover:bg-[var(--surface-hover)]'
                    }`}
                  >
                    {/* Custom checkbox */}
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all border ${
                        isChecked
                          ? 'bg-[var(--accent)] border-[var(--accent)]'
                          : 'border-[var(--border-light)] bg-transparent'
                      }`}
                    >
                      {isChecked && <Check size={10} className="text-white" strokeWidth={3} />}
                    </div>

                    {/* User info */}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-[var(--text-primary)] truncate">{u.email}</p>
                      <span
                        className={`text-[10px] font-medium ${
                          u.role === 'admin'
                            ? 'text-[var(--badge-blue-text)]'
                            : 'text-[var(--text-muted)]'
                        }`}
                      >
                        {u.role}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {error && <p className="text-xs text-[var(--error-text)] px-5 pb-1">{error}</p>}

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--border)]">
          <p className="text-[10px] text-[var(--text-muted)]">
            {selected.size} user{selected.size !== 1 ? 's' : ''} assigned
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-3 py-1.5 text-sm font-medium text-white glass-btn-primary rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
