export type Role = "ADMIN" | "MANAGER" | "STAFF";
export function hasRole(userRole: string | undefined, allowed: Role[]): boolean {
  return !!userRole && (allowed as string[]).includes(userRole);
}