export type Permission =
  | "create:service"
  | "edit:service"
  | "delete:service"
  | "feature:service"
  | "create:employee";

export const rolePermissions: Record<string, Permission[]> = {
  clinicAdmin: [
    "create:service",
    "edit:service",
    "delete:service",
    "feature:service",
    "create:employee",
  ],
  freelanceAdmin: [
    "create:service",
    "edit:service",
    "delete:service",
    "feature:service",
    "create:employee",
  ],
  specialist: [],
  frontDesk: [],
};

export const can = (role: string | undefined, permission: Permission) => {
  if (!role) return false;
  return rolePermissions[role]?.includes(permission);
};
