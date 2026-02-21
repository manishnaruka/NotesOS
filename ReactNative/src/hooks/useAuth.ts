import { useEffect } from 'react'
import auth from '@react-native-firebase/auth'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { useAuthStore } from '../stores/auth-store'
import { checkUserAllowed } from '../lib/user-management'
import { GOOGLE_WEB_CLIENT_ID } from '../config'

// Configure Google Sign-In once at module load time
GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID,
})

export function useAuth() {
  const { user, loading, role, authorized, setUser, setLoading, setAuthorization } = useAuthStore()

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser)

      if (firebaseUser?.email) {
        try {
          const result = await checkUserAllowed(firebaseUser.email)
          setAuthorization(result.allowed, result.role)
        } catch (err) {
          console.error('Failed to check user authorization:', err)
          setAuthorization(false, null)
        }
      } else {
        setAuthorization(null, null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [setUser, setLoading, setAuthorization])

  return { user, loading, role, authorized }
}

export async function signInWithGoogle(): Promise<void> {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
  const signInResult = await GoogleSignin.signIn()
  const idToken = signInResult.data?.idToken
  if (!idToken) throw new Error('No ID token returned from Google Sign-In')
  const credential = auth.GoogleAuthProvider.credential(idToken)
  await auth().signInWithCredential(credential)
}

export async function signOut(): Promise<void> {
  await GoogleSignin.signOut()
  await auth().signOut()
}
