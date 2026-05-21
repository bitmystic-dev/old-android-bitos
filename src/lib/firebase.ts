/**
 * BitOS Firebase bootstrap.
 * Initialized on the client only — server-side rendering skips init.
 */
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAGJyfDDnoIyb9DeE9ixFK32Wmptq_wiKE",
  authDomain: "bitos-auth.firebaseapp.com",
  projectId: "bitos-auth",
  storageBucket: "bitos-auth.firebasestorage.app",
  messagingSenderId: "630836558945",
  appId: "1:630836558945:web:a57cb47297ad4b8bf03e20",
};

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;

function ensure() {
  if (typeof window === "undefined") return;
  if (!_app) _app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  if (!_auth) _auth = getAuth(_app);
  if (!_db) _db = getFirestore(_app);
}

export function getFbAuth(): Auth {
  ensure();
  return _auth as Auth;
}
export function getFbDb(): Firestore {
  ensure();
  return _db as Firestore;
}
