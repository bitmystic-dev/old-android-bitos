import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getSession, onAuthChange, signIn, signOut, signUp, type BitUser } from "@/lib/auth";

type Ctx = {
  user: BitUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<BitUser>;
  signUp: (email: string, password: string, displayName?: string) => Promise<BitUser>;
  signOut: () => void;
};

const AuthContext = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<BitUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getSession());
    setLoading(false);
    return onAuthChange(setUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
