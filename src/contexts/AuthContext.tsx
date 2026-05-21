import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getSession, onAuthChange, signIn as authSignIn, signOut as authSignOut, signUp as authSignUp, type BitUser } from "@/lib/auth";
import { useBitStore } from "@/lib/store";

type Ctx = {
  user: BitUser | null;
  loading: boolean;
  signIn: (email: string, password: string, remember?: boolean) => Promise<BitUser>;
  signUp: (email: string, password: string, displayName?: string, remember?: boolean) => Promise<BitUser>;
  signOut: () => void;
};

const AuthContext = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<BitUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initial = getSession();
    setUser(initial);
    useBitStore.getState().hydrate(initial?.id ?? null);
    setLoading(false);
    return onAuthChange((u) => {
      setUser(u);
      useBitStore.getState().hydrate(u?.id ?? null);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn: authSignIn,
        signUp: authSignUp,
        signOut: authSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
