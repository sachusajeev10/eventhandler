import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

if (!getApps().length) {
  if (!process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL) {
    console.error("Missing Firebase Admin credentials. Please create a .env.local file and set FIREBASE_PRIVATE_KEY and FIREBASE_CLIENT_EMAIL.");
  } else {
    try {
      // Sometimes Vercel env vars include the surrounding quotes if copy-pasted directly from .env
      let privateKey = process.env.FIREBASE_PRIVATE_KEY;
      if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
        privateKey = privateKey.slice(1, -1);
      }
      privateKey = privateKey.replace(/\\n/g, '\n');

      initializeApp({
        credential: cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });
      console.log("Firebase Admin Initialized Successfully");
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
