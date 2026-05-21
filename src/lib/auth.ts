/**
 * BitOS Auth
 * --------------------------------------------------------------
 * Works out of the box with a secure-ish localStorage backend so
 * the experience is "real" from second one. You can swap in
 * Firebase Authentication by populating the VITE_FIREBASE_* env
 * vars — see firebase.ts. When Firebase is configured, the
 * AuthContext switches over automatically.
 */

export type BitUser = {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  createdAt: number;
};

const USERS_KEY = "bitos.users";
const SESSION_KEY = "bitos.session";

type StoredUser = BitUser & { passwordHash: string };

async function hash(input: string): Promise<string> {
  const enc = new TextEncoder().encode(input + ":bitos.v1");
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function readUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSession(): BitUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as BitUser) : null;
  } catch {
    return null;
  }
}

function setSession(u: BitUser | null) {
  if (!u) localStorage.removeItem(SESSION_KEY);
  else localStorage.setItem(SESSION_KEY, JSON.stringify(u));
  window.dispatchEvent(new Event("bitos:auth"));
}

export async function signUp(email: string, password: string, displayName?: string): Promise<BitUser> {
  email = email.trim().toLowerCase();
  if (!email || !password) throw new Error("Email and password required");
  if (password.length < 6) throw new Error("Password must be at least 6 characters");
  const users = readUsers();
  if (users.find((u) => u.email === email)) throw new Error("An operator with this email already exists");
  const user: StoredUser = {
    id: crypto.randomUUID(),
    email,
    displayName: displayName?.trim() || email.split("@")[0],
    createdAt: Date.now(),
    passwordHash: await hash(password),
  };
  writeUsers([...users, user]);
  const { passwordHash, ...pub } = user;
  setSession(pub);
  return pub;
}

export async function signIn(email: string, password: string): Promise<BitUser> {
  email = email.trim().toLowerCase();
  const users = readUsers();
  const user = users.find((u) => u.email === email);
  if (!user) throw new Error("No operator found with that email");
  const ph = await hash(password);
  if (user.passwordHash !== ph) throw new Error("Incorrect password");
  const { passwordHash, ...pub } = user;
  setSession(pub);
  return pub;
}

export function signOut() {
  setSession(null);
}

export function onAuthChange(cb: (u: BitUser | null) => void) {
  const handler = () => cb(getSession());
  window.addEventListener("bitos:auth", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("bitos:auth", handler);
    window.removeEventListener("storage", handler);
  };
}
