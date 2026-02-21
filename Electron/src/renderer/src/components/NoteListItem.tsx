import type { Note } from '../types/note'
import { formatNoteDate } from '../utils/date'
import { useNoteStore } from '../stores/note-store'
import { Star, Trash2, Users } from 'lucide-react'

interface NoteListItemProps {
  note: Note
  onDelete: (noteId: string) => void
  onTogglePin: (noteId: string, isPinned: boolean) => void
  onAssign: (note: Note) => void
  isSuperAdmin: boolean
}

export function NoteListItem({ note, onDelete, onTogglePin, onAssign, isSuperAdmin }: NoteListItemProps) {
  const { selectedNoteId, setSelectedNoteId } = useNoteStore()
  const isSelected = selectedNoteId === note.id
  const assigneeCount = note.assignedTo?.length ?? 0

  return (
    <button
      onClick={() => setSelectedNoteId(note.id)}
      className={`w-full text-left px-3 py-2.5 border-b border-[var(--border)] transition-all duration-200 group ${
        isSelected
          ? 'bg-[var(--selected-bg)] border-l-2 border-l-[var(--selected-border)] shadow-[var(--selected-shadow)]'
          : 'hover:bg-[var(--surface-hover)] border-l-2 border-l-transparent'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            {note.isPinned && (
              <Star size={12} className="text-amber-400 flex-shrink-0" fill="currentColor" />
            )}
            {/* Assignee count badge — visible to superadmin only */}
            {isSuperAdmin && assigneeCount > 0 && (
              <span className="inline-flex items-center gap-0.5 px-1 py-px text-[9px] font-medium rounded bg-[var(--badge-blue-bg)] text-[var(--badge-blue-text)] flex-shrink-0">
                <Users size={8} />
                {assigneeCount}
              </span>
            )}
            <h3 className={`text-sm font-medium truncate ${isSelected ? 'text-[var(--accent-active-text)]' : 'text-[var(--text-primary)]'}`}>
              {note.title}
            </h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)] truncate mt-0.5">{note.plainTextPreview || 'No content'}</p>
          <span className="text-[10px] text-[var(--text-muted)] mt-1 block">{formatNoteDate(note.updatedAt)}</span>
        </div>

        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
          {/* Pin */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onTogglePin(note.id, note.isPinned)
            }}
            className="p-1 rounded hover:bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-amber-400"
            title={note.isPinned ? 'Unpin' : 'Pin'}
          >
            <Star size={14} fill={note.isPinned ? 'currentColor' : 'none'} />
          </button>

          {isSuperAdmin && (
            <>
              {/* Assign */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onAssign(note)
                }}
                className={`p-1 rounded hover:bg-[var(--surface-hover)] transition-colors ${
                  assigneeCount > 0
                    ? 'text-[var(--badge-blue-text)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--badge-blue-text)]'
                }`}
                title="Assign to users"
              >
                <Users size={14} />
              </button>

              {/* Delete */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(note.id)
                }}
                className="p-1 rounded hover:bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-red-400"
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </>
          )}
        </div>
      </div>
    </button>
  )
}
