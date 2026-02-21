/**
 * App configuration.
 * Replace the placeholder values below with your actual Firebase project values.
 *
 * HOW TO GET THESE VALUES:
 *  1. Go to Firebase Console → your project → Authentication → Sign-in method → Google
 *  2. Copy the "Web client ID" and paste it as GOOGLE_WEB_CLIENT_ID
 *  3. Set SUPERADMIN_EMAIL to the same superadmin email used in your Electron app
 *
 * For the full Firebase native setup (google-services.json / GoogleService-Info.plist)
 * see the README.md in this directory.
 */

/** The superadmin email — must match VITE_SUPERADMIN_EMAIL in the Electron app. */
export const SUPERADMIN_EMAIL = 'your-superadmin@gmail.com'

/**
 * Google Sign-In Web Client ID.
 * Found in Firebase Console → Authentication → Sign-in method → Google → Web client ID.
 */
export const GOOGLE_WEB_CLIENT_ID = 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com'
