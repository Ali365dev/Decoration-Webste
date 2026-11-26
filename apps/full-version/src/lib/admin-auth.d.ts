export interface AdminUser {
  id: string;
  email: string;
  role: string;
}

export function verifyAdminPassword(password: string, apiKey: string): boolean;
export function signAdminToken(user: AdminUser, secret: string): string;
export function verifyAdminToken(token: string, secret: string): AdminUser | null;
