import firestore from '@react-native-firebase/firestore'
import type { AllowedUser, UserRole } from '../types/note'
import { SUPERADMIN_EMAIL } from '../config'

const ALLOWED_USERS_COLLECTION = 'allowedUsers'

export function isSuperAdmin(email: string | null): boolean {
  return email?.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase()
}

export async function checkUserAllowed(
  email: string,
): Promise<{ allowed: boolean; role: UserRole }> {
  if (isSuperAdmin(email)) {
    return { allowed: true, role: 'superadmin' }
  }

  const snapshot = await firestore()
    .collection(ALLOWED_USERS_COLLECTION)
    .where('email', '==', email.toLowerCase())
    .get()

  if (snapshot.empty) {
    return { allowed: false, role: 'user' }
  }

  const userData = snapshot.docs[0].data()
  return { allowed: true, role: (userData.role as UserRole) || 'user' }
}

export async function addAllowedUser(
  email: string,
  role: UserRole,
  addedByEmail: string,
): Promise<void> {
  const normalizedEmail = email.toLowerCase().trim()
  await firestore()
    .collection(ALLOWED_USERS_COLLECTION)
    .doc(normalizedEmail)
    .set({
      email: normalizedEmail,
      role,
      addedBy: addedByEmail,
      addedAt: firestore.FieldValue.serverTimestamp(),
    })
}

export async function removeAllowedUser(email: string): Promise<void> {
  const normalizedEmail = email.toLowerCase().trim()
  await firestore().collection(ALLOWED_USERS_COLLECTION).doc(normalizedEmail).delete()
}

export async function updateUserRole(email: string, role: UserRole): Promise<void> {
  const normalizedEmail = email.toLowerCase().trim()
  await firestore()
    .collection(ALLOWED_USERS_COLLECTION)
    .doc(normalizedEmail)
    .set({ role }, { merge: true })
}

export function subscribeToAllowedUsers(
  callback: (users: AllowedUser[]) => void,
  onError: (error: Error) => void,
): () => void {
  return firestore()
    .collection(ALLOWED_USERS_COLLECTION)
    .onSnapshot(
      (snapshot) => {
        const users = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as AllowedUser[]

        users.sort((a, b) => a.email.localeCompare(b.email))
        callback(users)
      },
      (err) => {
        console.error('AllowedUsers subscription error:', err)
        onError(err)
      },
    )
}
