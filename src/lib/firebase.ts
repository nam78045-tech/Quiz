import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfigLocal from '../../firebase-applet-config.json';

// Use environment variables if available (for Netlify/Vercel), otherwise fallback to local config
const meta = import.meta as any;
const config = {
  apiKey: meta.env?.VITE_FIREBASE_API_KEY || firebaseConfigLocal.apiKey,
  authDomain: meta.env?.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigLocal.authDomain,
  projectId: meta.env?.VITE_FIREBASE_PROJECT_ID || firebaseConfigLocal.projectId,
  storageBucket: meta.env?.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigLocal.storageBucket,
  messagingSenderId: meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigLocal.messagingSenderId,
  appId: meta.env?.VITE_FIREBASE_APP_ID || firebaseConfigLocal.appId,
  firestoreDatabaseId: meta.env?.VITE_FIREBASE_DATABASE_ID || firebaseConfigLocal.firestoreDatabaseId
};

const app = initializeApp(config);

// Use the database name specified in config
export const db = getFirestore(app, config.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
