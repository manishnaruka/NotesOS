import { useEffect } from 'react'
import type { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { subscribeToNotes } from '../lib/firestore'
import { useNoteStore } from '../stores/note-store'

type User = FirebaseAuthTypes.User

export function useNotes(user: User | null, isSuperAdmin: boolean) {
  const { notes, notesLoading, setNotes, setNotesLoading } = useNoteStore()

  useEffect(() => {
    if (!user) {
      setNotes([])
      setNotesLoading(false)
      return
    }

    setNotesLoading(true)

    const unsubscribe = subscribeToNotes(
      (notesList) => {
        setNotes(notesList)
        setNotesLoading(false)
      },
      (err) => {
        console.error('Notes subscription error:', err)
        setNotesLoading(false)
      },
      user.email ?? '',
      isSuperAdmin,
    )

    return () => unsubscribe()
  }, [user?.uid, isSuperAdmin]) // eslint-disable-line react-hooks/exhaustive-deps

  return { notes, loading: notesLoading }
}
