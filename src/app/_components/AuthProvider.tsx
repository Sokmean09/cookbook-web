"use client";

import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { Users } from "../../../generated/prisma";
import z from "zod";
import { useRouter } from "next/navigation";

type AuthContext = {
  authToken?: string | null;
  currentUser?: Users | null;
  handleLogin: (
    prevState: unknown,
    formData: FormData
  ) => Promise<{ errors?: Record<string, string[]> } | void>;
  handleLogout: () => Promise<void>;
};

const AuthContext = createContext<AuthContext | undefined>(undefined);

type AuthProviderProps = PropsWithChildren;

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .trim(),
});

export default function AuthProvider({ children }: AuthProviderProps) {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<Users | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch user");
        const { authToken, user } = await res.json();

        setAuthToken(authToken);
        setCurrentUser(user);
      } catch {
        setAuthToken(null);
        setCurrentUser(null);
      }
    }

    fetchUser();
  }, []);

  async function handleLogin(prevState: unknown, formData: FormData) {
    try {
      const result = loginSchema.safeParse(Object.fromEntries(formData));

      if (!result.success) {
        return {
          errors: result.error.flatten().fieldErrors,
        };
      }

      const { email, password } = result.data;

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        return {
          errors: { email: ["Invalid email or password"] },
        };
      }
      const { authToken, user } = await res.json();

      setAuthToken(authToken); 
      setCurrentUser(user);

      router.push("/");
    } catch (err) {
      console.error("Login error:", err);
      setAuthToken(null);
      setCurrentUser(null);
    }
  }

  async function handleLogout() {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } catch (err) {
    console.error("Logout error:", err);
  } finally {
    setAuthToken(null);
    setCurrentUser(null);
    router.push("/login");
  }
}

  return (
    <AuthContext.Provider
      value={{
        authToken,
        currentUser,
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used inside of a AuthProvider");
  }

  return context;
}
