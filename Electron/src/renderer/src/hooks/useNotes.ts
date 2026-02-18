import { useEffect, useState } from 'react'
import { subscribeToNotes } from '../lib/firestore'
import type { Note } from '../types/note'

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    const unsubscribe = subscribeToNotes(
      (notesList) => {
        setNotes(notesList)
        setLoading(false)
      },
      (err) => {
        setError(err)
        setLoading(false)
      }
    )
    return () => unsubscribe()
  }, [])

  return { notes, loading, error }
}
