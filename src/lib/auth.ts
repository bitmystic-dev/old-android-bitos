/**
 * BitOS Auth — Firebase-backed.
 * A synchronous user cache is kept in localStorage (Remember Me) or
 * sessionStorage (this tab only) so route guards stay sync.
 */
import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { getFbAuth } from "./firebase";

export type BitUser = {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  createdAt: number;
};

const SESSION_KEY = "bitos.session";
const REMEMBER_KEY = "bitos.remember";

function toBitUser(u: User): BitUser {
  return {
    id: u.uid,
    email: u.email ?? "",
    displayName: u.displayName || (u.email?.split("@")[0] ?? "operator"),
    avatar: u.photoURL ?? undefined,
    createdAt: u.metadata.creationTime ? new Date(u.metadata.creationTime).getTime() : Date.now(),
  };
}

function cacheUser(u: BitUser | null) {
  if (typeof window === "undefined") return;
  const remember = localStorage.getItem(REMEMBER_KEY) === "1";
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
  if (u) {
    (remember ? localStorage : sessionStorage).setItem(SESSION_KEY, JSON.stringify(u));
  }
  window.dispatchEvent(new Event("bitos:auth"));
}

export function getSession(): BitUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as BitUser) : null;
  } catch {
    return null;
  }
}

async function applyPersistence(remember: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem(REMEMBER_KEY, remember ? "1" : "0");
  try {
    await setPersistence(getFbAuth(), remember ? browserLocalPersistence : browserSessionPersistence);
  } catch {
    /* ignore — falls back to default */
  }
}

export async function signUp(
  email: string,
  password: string,
  displayName?: string,
  remember = true,
): Promise<BitUser> {
  email = email.trim().toLowerCase();
  if (!email || !password) throw new Error("Email and password required");
  if (password.length < 6) throw new Error("Password must be at least 6 characters");
  await applyPersistence(remember);
  try {
    const cred = await createUserWithEmailAndPassword(getFbAuth(), email, password);
    if (displayName?.trim()) {
      try { await updateProfile(cred.user, { displayName: displayName.trim() }); } catch {}
    }
    const u = toBitUser({ ...cred.user, displayName: displayName?.trim() || cred.user.displayName } as User);
    cacheUser(u);
    return u;
  } catch (e: any) {
    throw new Error(prettyAuthError(e?.code) || e?.message || "Sign up failed");
  }
}

export async function signIn(
  email: string,
  password: string,
  remember = true,
): Promise<BitUser> {
  email = email.trim().toLowerCase();
  await applyPersistence(remember);
  try {
    const cred = await signInWithEmailAndPassword(getFbAuth(), email, password);
    const u = toBitUser(cred.user);
    cacheUser(u);
    return u;
  } catch (e: any) {
    throw new Error(prettyAuthError(e?.code) || e?.message || "Sign in failed");
  }
}

export async function signOut() {
  try { await fbSignOut(getFbAuth()); } catch {}
  cacheUser(null);
}

export function onAuthChange(cb: (u: BitUser | null) => void) {
  if (typeof window === "undefined") return () => {};
  // Sync listener (cross-tab + manual)
  const sync = () => cb(getSession());
  window.addEventListener("bitos:auth", sync);
  window.addEventListener("storage", sync);
  // Firebase listener — source of truth, refreshes cache
  const unsub = onAuthStateChanged(getFbAuth(), (u) => {
    const mapped = u ? toBitUser(u) : null;
    cacheUser(mapped);
    cb(mapped);
  });
  return () => {
    window.removeEventListener("bitos:auth", sync);
    window.removeEventListener("storage", sync);
    try { unsub(); } catch {}
  };
}

function prettyAuthError(code?: string): string | null {
  switch (code) {
    case "auth/invalid-email": return "Invalid email";
    case "auth/email-already-in-use": return "Email already registered";
    case "auth/weak-password": return "Password too weak (min 6 chars)";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential": return "Incorrect email or password";
    case "auth/network-request-failed": return "Network error — check connection";
    case "auth/too-many-requests": return "Too many attempts — try again later";
    default: return null;
  }
}
