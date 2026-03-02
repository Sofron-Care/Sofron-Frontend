export type Permission =
  | "create:service"
  | "edit:service"
  | "delete:service"
  | "feature:service"
  | "create:employee"
  | "manage:schedule";

export const rolePermissions: Record<string, Permission[]> = {
  clinicAdmin: [
    "create:service",
    "edit:service",
    "delete:service",
    "feature:service",
    "create:employee",
    "manage:schedule",
  ],
  freelanceAdmin: [
    "create:service",
    "edit:service",
    "delete:service",
    "feature:service",
    "create:employee",
    "manage:schedule",
  ],
  specialist: ["manage:schedule"],
  frontDesk: [],
};

export const can = (role: string | undefined, permission: Permission) => {
  if (!role) return false;
  return rolePermissions[role]?.includes(permission);
};
