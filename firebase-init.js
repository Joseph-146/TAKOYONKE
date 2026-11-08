/* Firebase client foundation for the next integration phase.
   Rename this to firebase-init.js after creating firebase-config.js. */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import {
  initializeFirestore, persistentLocalCache, persistentMultipleTabManager,
  collection, doc, setDoc, addDoc, onSnapshot, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';

const configured = firebaseConfig.apiKey !== 'PASTE_API_KEY' && firebaseConfig.projectId !== 'YOUR_PROJECT_ID';
if (!configured) {
  console.info('[Takoyonke] Firebase is not configured yet. The existing preview remains local-only.');
  window.TakoyonkeCloud = { configured: false };
} else {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
  });

  // Use a unique transaction ID per sale. Never overwrite a shared daily-total document.
  async function createSale(sale) {
    if (!auth.currentUser) throw new Error('Employee must be signed in.');
    const record = {
      ...sale,
      employeeUid: auth.currentUser.uid,
      createdAt: serverTimestamp(),
      clientCreatedAt: Date.now(),
      schemaVersion: 1
    };
    return addDoc(collection(db, 'sales'), record);
  }

  // Owner dashboard listeners must only be started after checking the owner custom claim.
  async function listenToAllSales(onData, onError) {
    const user = auth.currentUser;
    if (!user) throw new Error('Sign in first.');
    const token = await user.getIdTokenResult(true);
    if (token.claims.role !== 'owner') throw new Error('Owner access required.');
    return onSnapshot(collection(db, 'sales'), snap => onData(snap.docs.map(d => ({ id: d.id, ...d.data() }))), onError);
  }

  window.TakoyonkeCloud = { configured: true, app, auth, db, createSale, listenToAllSales };
}
