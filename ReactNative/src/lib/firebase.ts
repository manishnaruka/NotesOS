/**
 * React Native Firebase initialises automatically from:
 *   - android/app/google-services.json  (Android)
 *   - ios/GoogleService-Info.plist      (iOS)
 *
 * No manual initializeApp() call is needed here.
 * We simply re-export the module instances for convenience.
 */

import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

export { auth, firestore }
