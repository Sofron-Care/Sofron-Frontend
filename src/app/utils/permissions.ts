export type Permission =
  | "create:service"
  | "edit:service"
  | "delete:service"
  | "feature:service";

export const rolePermissions: Record<string, Permission[]> = {
  clinicAdmin: [
    "create:service",
    "edit:service",
    "delete:service",
    "feature:service",
  ],
  freelanceAdmin: [
    "create:service",
    "edit:service",
    "delete:service",
    "feature:service",
  ],
  specialist: [],
  frontDesk: [],
};

export const can = (role: string | undefined, permission: Permission) => {
  if (!role) return false;
  return rolePermissions[role]?.includes(permission);
};
