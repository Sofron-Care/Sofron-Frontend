import React, { createContext, useContext, useState, useEffect } from "react";
import api from "./../../shared/api/axios";

interface User {
  id: number;
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profilePicture?: string;
  organizationId?: number | null;
  isVerified: boolean;
  isActive: boolean;
  onboardingCompleted: boolean;
  requiresOnboarding: boolean;
  needsToAcceptTOS: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

api.defaults.withCredentials = true;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const validate = async () => {
      try {
        await api.get("/auth/validate-token");
      } catch {
        setUser(null);
        localStorage.removeItem("user");
      }
    };

    if (user) {
      validate();
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const loggedInUser = res.data.data.user;

      setUser(loggedInUser);
      localStorage.setItem("user", JSON.stringify(loggedInUser));
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      // Even if backend fails, we still clear local state
    }

    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
