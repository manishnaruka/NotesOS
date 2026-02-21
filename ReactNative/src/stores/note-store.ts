import { create } from 'zustand'
import type { Note } from '../types/note'

interface NoteStore {
  selectedNoteId: string | null
  searchQuery: string
  notes: Note[]
  notesLoading: boolean
  setSelectedNoteId: (id: string | null) => void
  setSearchQuery: (query: string) => void
  setNotes: (notes: Note[]) => void
  setNotesLoading: (loading: boolean) => void
}

export const useNoteStore = create<NoteStore>((set) => ({
  selectedNoteId: null,
  searchQuery: '',
  notes: [],
  notesLoading: true,
  setSelectedNoteId: (id) => set({ selectedNoteId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setNotes: (notes) => set({ notes }),
  setNotesLoading: (loading) => set({ notesLoading: loading }),
}))
