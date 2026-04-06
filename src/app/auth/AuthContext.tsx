import React, { createContext, useContext, useState, useEffect } from "react";
import api from "./../../shared/api/axios";

interface ClientProfile {
  dob?: string | null;
  gender?:
    | "Male"
    | "Female"
    | "Nonbinary"
    | "Agender"
    | "Genderqueer"
    | "GenderFluid"
    | "Other"
    | "Prefer not to say"
    | null;
  preferredPronouns?: string | null;
  occupation?: string | null;
  preferredCommunication?: "Email" | "SMS" | "Phone" | null;
  activityLevel?:
    | "Sedentary"
    | "Lightly Active"
    | "Active"
    | "Very Active"
    | null;
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phone?: string;
    email?: string;
  } | null;
  medicalNotes?: string | null;
  referralSource?: string | null;
  streetAddress?: string | null;
  city?: string | null;
  state?: string | null;
  zipcode?: string | null;
}

interface User {
  id: string;
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

  orgAccessActive?: boolean;
  clientProfile?: ClientProfile | null;
}

interface Organization {
  publicId: string;
  type: "Clinic" | "Freelance";
  name: string;
  cancellationPolicyScope: "organization" | "service";
  schedulingMode: "organization" | "specialist";
  publicFacing: boolean;
  timeZone: string;
}

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setOrganization: React.Dispatch<React.SetStateAction<Organization | null>>;
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

  const [organization, setOrganization] = useState<Organization | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await api.get("/auth/validate-token");

        if (user?.organizationId) {
          const orgRes = await api.get("/organizations");
          setOrganization(orgRes.data.data.organizationDetails);
        }
      } catch {
        setUser(null);
        setOrganization(null);
        localStorage.removeItem("user");
      }
    };

    if (user) {
      bootstrap();
    }
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });

      const loggedInUser: User = res.data.data.user;

      setUser(loggedInUser);
      localStorage.setItem("user", JSON.stringify(loggedInUser));

      if (loggedInUser.organizationId) {
        const orgRes = await api.get("/organizations");
        setOrganization(orgRes.data.data.organizationDetails);
      }

      return loggedInUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {}

    setUser(null);
    setOrganization(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        organization,
        loading,
        login,
        logout,
        setUser,
        setOrganization,
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
