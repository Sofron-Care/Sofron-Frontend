import { createContext } from "react";

export type Role = "clinicAdmin" | "specialist" | "frontDesk" | "client";

export interface DemoUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  organization?: {
    id: number;
    publicId: string;
    name: string;
  } | null;
}

export interface DemoUsers {
  clinicAdmin?: DemoUser;
  specialist?: DemoUser;
  frontDesk?: DemoUser;
  client?: DemoUser;
  password?: string;
}

export interface DemoContextType {
  isDemo: boolean;
  loading: boolean;
  users: DemoUsers | null;
  role: Role | null;
  mode: "guided" | "free" | null;
  setRole: (role: Role) => void;
  setMode: (mode: "guided" | "free") => void;
  loginAs: (role: Role) => Promise<void>;
}

export const DemoContext = createContext<DemoContextType | null>(null);
