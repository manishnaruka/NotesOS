import firestore from '@react-native-firebase/firestore'
import type { FirebaseAuthTypes } from '@react-native-firebase/auth'
import type { Note, NoteUserInfo, TiptapJSON } from '../types/note'
import { extractTitle, extractPlainTextPreview } from '../utils/content'

type User = FirebaseAuthTypes.User

const NOTES_COLLECTION = 'notes'

const defaultContent: TiptapJSON = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
}

function toNoteUserInfo(user: User): NoteUserInfo {
  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
  }
}

export async function createNote(user: User): Promise<string> {
  const userInfo = toNoteUserInfo(user)
  const ref = await firestore().collection(NOTES_COLLECTION).add({
    title: 'Untitled',
    content: defaultContent,
    plainTextPreview: '',
    createdAt: firestore.FieldValue.serverTimestamp(),
    updatedAt: firestore.FieldValue.serverTimestamp(),
    isPinned: false,
    isDeleted: false,
    userId: user.uid,
    tags: [],
    assignedTo: [],
    createdBy: userInfo,
    lastEditedBy: userInfo,
  })
  return ref.id
}

export async function updateNoteContent(
  noteId: string,
  content: TiptapJSON,
  user: User,
): Promise<void> {
  await firestore()
    .collection(NOTES_COLLECTION)
    .doc(noteId)
    .update({
      content,
      title: extractTitle(content),
      plainTextPreview: extractPlainTextPreview(content),
      updatedAt: firestore.FieldValue.serverTimestamp(),
      lastEditedBy: toNoteUserInfo(user),
    })
}

export async function deleteNote(noteId: string, user: User): Promise<void> {
  await firestore()
    .collection(NOTES_COLLECTION)
    .doc(noteId)
    .update({
      isDeleted: true,
      updatedAt: firestore.FieldValue.serverTimestamp(),
      lastEditedBy: toNoteUserInfo(user),
    })
}

export async function togglePinNote(
  noteId: string,
  isPinned: boolean,
  user: User,
): Promise<void> {
  await firestore()
    .collection(NOTES_COLLECTION)
    .doc(noteId)
    .update({
      isPinned: !isPinned,
      updatedAt: firestore.FieldValue.serverTimestamp(),
      lastEditedBy: toNoteUserInfo(user),
    })
}

/** Superadmin sets which users (by email) can see a note. */
export async function assignNoteToUsers(noteId: string, userEmails: string[]): Promise<void> {
  await firestore()
    .collection(NOTES_COLLECTION)
    .doc(noteId)
    .update({
      assignedTo: userEmails.map((e) => e.toLowerCase()),
    })
}

/**
 * Subscribe to notes.
 * - Superadmin sees ALL non-deleted notes.
 * - Other users only see notes where their email is in `assignedTo`.
 */
export function subscribeToNotes(
  callback: (notes: Note[]) => void,
  onError: (error: Error) => void,
  userEmail: string,
  isSuperAdmin: boolean,
): () => void {
  const base = firestore().collection(NOTES_COLLECTION)

  const query = isSuperAdmin
    ? base.where('isDeleted', '==', false)
    : base
        .where('isDeleted', '==', false)
        .where('assignedTo', 'array-contains', userEmail.toLowerCase())

  return query.onSnapshot(
    (snapshot) => {
      const notes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Note[]

      // Sort client-side: pinned first, then by updatedAt descending
      notes.sort((a, b) => {
        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1
        const aTime = a.updatedAt?.toMillis?.() ?? 0
        const bTime = b.updatedAt?.toMillis?.() ?? 0
        return bTime - aTime
      })

      callback(notes)
    },
    (err) => {
      console.error('Firestore subscription error:', err)
      onError(err)
    },
  )
}
