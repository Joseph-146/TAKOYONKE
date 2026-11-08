TAKOYONKE PWA STARTER — PHASE 1
================================

WHAT IS INCLUDED
- index.html: your existing Takoyonke app, retained as the starting UI
- takoyonke-app-original.html: untouched original copy for safety
- manifest.webmanifest + icons/: installable PWA metadata
- sw.js: app-shell cache so the app can reopen offline after its first online visit
- firebase-config.example.js: safe template for Firebase web configuration
- firebase-init.example.js: Firestore/Auth initialization example with persistent offline cache
- firestore.rules: initial role-based rules template

IMPORTANT CURRENT LIMITATION
This is the PWA and Firebase integration foundation, NOT a completed cloud-connected release.
The existing app still uses localStorage for its business data and its preview Host ID.
Employee registration/login and owner dashboard have NOT yet been migrated to Firebase Authentication.
Sales, inventory, cash, orders and activity are NOT yet being uploaded to Firestore.
Do not use this starter for real production sales until those integrations and security tests are complete.

FIRST: CREATE THE FIREBASE PROJECT
1. Open https://console.firebase.google.com/ and create a project named Takoyonke.
2. Add a Web App to the project and copy its Firebase web configuration.
3. Enable Authentication > Sign-in method > Email/Password.
4. Create Cloud Firestore in production mode.
5. Keep the Firebase project ID and web config. Never download or publish a service-account private key.

SECOND: PREPARE THE FILES
1. Copy firebase-config.example.js to firebase-config.js.
2. Replace the placeholder values with the Firebase Web App config.
3. Copy firebase-init.example.js to firebase-init.js.
4. Do not commit any service-account JSON or Admin SDK private key.

THIRD: GITHUB AND HOSTING
1. Create a private GitHub repository for the source code.
2. Upload the contents of this folder to the repository root.
3. Deploy the folder to Firebase Hosting (or another HTTPS host).
4. PWA installation and service workers require HTTPS, except localhost during development.

OWNER SECURITY
The current preview Host ID (TAKO-HOST-2026) is NOT secure and must not be used in a real release.
The Firestore rules expect trusted Firebase custom claims: role='owner' or role='employee'.
Assign the owner claim only from a trusted Admin SDK environment (for example a protected Cloud Function or local admin script), never from client-side JavaScript.
Create employees through Firebase Authentication and assign their employee claim through trusted admin code.

OFFLINE BEHAVIOR
- The service worker caches the app shell, not all business records.
- Firestore persistent local cache is configured in firebase-init.example.js.
- Firestore can queue supported writes while offline and synchronize them after reconnection.
- The existing app's localStorage records do not automatically migrate or sync just because Firebase is initialized.
- During integration, give every sale/event a unique ID, keep timestamps and employee IDs, and reconcile pending writes safely.

NEXT IMPLEMENTATION MILESTONE
Migrate authentication first, then employee sales/order/inventory writes, then owner real-time listeners, then migrate existing local records, and finally test offline/reconnect behavior on at least two phones and one owner device.

The starter already includes firebase-config.js and firebase-init.js with placeholders,
and index.html loads firebase-init.js as a module. Fill in the config before testing Firebase.
