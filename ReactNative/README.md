# TMX Notes — React Native

Mobile companion to the Electron desktop app.
Uses the **same Firebase backend** — notes, users, and roles are fully shared.

---

## Features

| Feature | Desktop (Electron) | Mobile (React Native) |
|---|---|---|
| Google Sign-In | ✅ | ✅ |
| Role-based access (superadmin / admin / user) | ✅ | ✅ |
| Create / Edit / Delete notes | ✅ | ✅ |
| Rich text editor (TipTap / TenTap) | ✅ | ✅ |
| Pin / unpin notes | ✅ | ✅ |
| Search notes | ✅ | ✅ |
| Assign notes to users | ✅ | ✅ |
| User management | ✅ | ✅ |
| 4 themes (glass-dark, glass-light, minimal-dark, minimal-light) | ✅ | ✅ |
| Real-time sync via Firestore | ✅ | ✅ |

---

## Tech Stack

- **React Native CLI** (not Expo)
- **TypeScript**
- **@react-native-firebase** — Auth + Firestore
- **@react-native-google-signin/google-signin** — Google Sign-In
- **@10play/tentap-editor** — TipTap-compatible rich text editor
- **Zustand** — State management
- **React Navigation** — Stack navigation
- **Lucide React Native** — Icons

---

## Setup

### 1. Initialize the React Native project

```bash
cd /path/to/NotesOS

# Create the RN project (generates android/ and ios/ native directories)
npx react-native@latest init TMXNotesRN --template react-native-template-typescript

# Copy all source files from this ReactNative/ folder into the new project
cp -r ReactNative/src TMXNotesRN/
cp ReactNative/App.tsx TMXNotesRN/App.tsx
cp ReactNative/package.json TMXNotesRN/package.json
cp ReactNative/tsconfig.json TMXNotesRN/tsconfig.json
cp ReactNative/babel.config.js TMXNotesRN/babel.config.js

cd TMXNotesRN
npm install
```

### 2. Firebase native configuration

**Android:**
1. Go to [Firebase Console](https://console.firebase.google.com) → Your project → Project Settings → Your apps → Android
2. Download `google-services.json`
3. Place it at `android/app/google-services.json`
4. In `android/build.gradle`, add: `classpath 'com.google.gms:google-services:4.4.0'`
5. In `android/app/build.gradle`, add at the bottom: `apply plugin: 'com.google.gms.google-services'`

**iOS:**
1. Go to Firebase Console → Your project → Project Settings → Your apps → iOS
2. Download `GoogleService-Info.plist`
3. Open Xcode, drag `GoogleService-Info.plist` into the `TMXNotesRN` target
4. Run `cd ios && pod install`

### 3. Google Sign-In configuration

1. Open `src/config.ts`
2. Set `SUPERADMIN_EMAIL` to match your Electron app's `VITE_SUPERADMIN_EMAIL`
3. Set `GOOGLE_WEB_CLIENT_ID` — found in Firebase Console → Authentication → Sign-in method → Google → Web client ID

```ts
// src/config.ts
export const SUPERADMIN_EMAIL = 'your-superadmin@gmail.com'
export const GOOGLE_WEB_CLIENT_ID = 'xxxx.apps.googleusercontent.com'
```

**Android additional step:**
Add your SHA-1 fingerprint to Firebase (App Settings → Your Android app → Add fingerprint):
```bash
cd android && ./gradlew signingReport
```

**iOS additional step:**
Add `REVERSED_CLIENT_ID` URL scheme. Open `ios/TMXNotesRN/Info.plist` and add:
```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>YOUR_REVERSED_CLIENT_ID</string>  <!-- from GoogleService-Info.plist -->
    </array>
  </dict>
</array>
```

### 4. Run the app

```bash
# Android
npx react-native run-android

# iOS
npx react-native run-ios
```

---

## Project Structure

```
ReactNative/
├── src/
│   ├── assets/            Static assets
│   ├── components/        Shared UI components
│   │   ├── EmptyState.tsx
│   │   ├── NoteAssignModal.tsx
│   │   ├── NoteListItem.tsx
│   │   ├── SearchBar.tsx
│   │   ├── SkeletonLoader.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── UserManagement.tsx
│   ├── hooks/             Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useNote.ts
│   │   └── useNotes.ts
│   ├── lib/               Firebase interactions
│   │   ├── firebase.ts
│   │   ├── firestore.ts
│   │   └── user-management.ts
│   ├── navigation/
│   │   └── RootNavigator.tsx
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── NoteEditorScreen.tsx
│   │   ├── NotesListScreen.tsx
│   │   └── UnauthorizedScreen.tsx
│   ├── stores/            Zustand global state
│   │   ├── auth-store.ts
│   │   ├── note-store.ts
│   │   └── theme-store.ts
│   ├── theme/             Theme system
│   │   ├── index.ts       4 theme objects
│   │   └── ThemeContext.tsx
│   ├── types/
│   │   └── note.ts        Shared types (matches Electron)
│   └── utils/
│       ├── content.ts     TipTap content helpers
│       └── date.ts        Date formatting
├── App.tsx
├── index.js
├── package.json
├── tsconfig.json
├── babel.config.js
└── metro.config.js
```

---

## Theme System

The app supports the same 4 themes as the desktop:

| Theme ID | Mode | Style |
|---|---|---|
| `glass-dark` | Dark | Glassmorphism (default) |
| `glass-light` | Light | Glassmorphism |
| `minimal-dark` | Dark | Flat |
| `minimal-light` | Light | Flat |

Theme is persisted via `AsyncStorage` and restored on app launch.
Toggle via the **Settings** button (⚙️) in the notes list header.

---

## Note Content Compatibility

Notes use the **same TipTap JSON format** as the desktop app.
You can edit a note on mobile and it will render correctly on desktop (and vice-versa).

Rich text features supported:
- Bold, Italic, Underline, Strikethrough
- Headings (H1–H6)
- Bullet lists, Ordered lists, Task lists
- Blockquote, Code, Code block
- Highlight (multi-color)
