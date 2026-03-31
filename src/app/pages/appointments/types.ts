export type AppointmentStatus =
  | "Tentative"
  | "Confirmed"
  | "Scheduled"
  | "Completed"
  | "Checked-In"
  | "Cancelled"
  | "No-Show"
  | "Rescheduled";

export interface Appointment {
  id: string;
  publicId: string;
  organizationId: number;
  status: AppointmentStatus;
  date: string;
  startTime: string;
  endTime: string;
  serviceBooked?: {
    id: number;
    name: string;
    duration: number;
  };
  specialist?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  client?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  guestClient?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  organization?: {
    id: number;
    name: string;
    timeZone?: string;
    publicId: string;
  };
  notes?: {
    authorId: string;
    timestamp: string;
    note: string;
  }[];
}
