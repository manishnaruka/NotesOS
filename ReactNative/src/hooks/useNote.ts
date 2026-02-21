import { useNoteStore } from '../stores/note-store'
import type { Note } from '../types/note'

export function useNote(noteId: string | null): { note: Note | null } {
  const notes = useNoteStore((s) => s.notes)
  const note = noteId ? (notes.find((n) => n.id === noteId) ?? null) : null
  return { note }
}
