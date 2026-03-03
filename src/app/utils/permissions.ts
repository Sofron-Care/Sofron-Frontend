export type Permission =
  | "create:service"
  | "edit:service"
  | "delete:service"
  | "feature:service"
  | "create:employee"
  | "manage:schedule"
  | "view:appointment"
  | "create:appointment"
  | "reschedule:appointment"
  | "cancel:appointment"
  | "checkin:appointment"
  | "noshow:appointment"
  | "addnote:appointment";

export const rolePermissions: Record<string, Permission[]> = {
  clinicAdmin: [
    "create:service",
    "edit:service",
    "delete:service",
    "feature:service",
    "create:employee",
    "manage:schedule",
    "view:appointment",
    "create:appointment",
    "reschedule:appointment",
    "cancel:appointment",
    "checkin:appointment",
    "noshow:appointment",
    "addnote:appointment",
  ],
  freelanceAdmin: [
    "create:service",
    "edit:service",
    "delete:service",
    "feature:service",
    "create:employee",
    "manage:schedule",
    "view:appointment",
    "create:appointment",
    "reschedule:appointment",
    "cancel:appointment",
    "checkin:appointment",
    "noshow:appointment",
    "addnote:appointment",
  ],
  specialist: [
    "manage:schedule",
    "view:appointment",
    "checkin:appointment",
    "noshow:appointment",
    "addnote:appointment",
  ],
  frontDesk: [
    "view:appointment",
    "create:appointment",
    "cancel:appointment",
    "checkin:appointment",
    "noshow:appointment",
    "addnote:appointment",
  ],
};

export const can = (role: string | undefined, permission: Permission) => {
  if (!role) return false;
  return rolePermissions[role]?.includes(permission);
};
