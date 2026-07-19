import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

if (!getApps().length) {
  if (!process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL) {
    console.error("Missing Firebase Admin credentials. Please create a .env.local file and set FIREBASE_PRIVATE_KEY and FIREBASE_CLIENT_EMAIL.");
  } else {
    try {
      initializeApp({
        credential: cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // Handle newline characters in private key when loading from env variables
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
    } catch (error) {
      console.error('Firebase admin initialization error:', error);
    }
  }
}

// We wrap the exports in a try/catch or conditionally export them so the app doesn't immediately crash on startup
let adminDb: FirebaseFirestore.Firestore;
let adminAuth: any;

if (getApps().length > 0) {
  adminDb = getFirestore();
  adminAuth = getAuth();
}

export { adminDb, adminAuth };
