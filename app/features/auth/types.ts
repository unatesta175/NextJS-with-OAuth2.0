export type UserRole = 'client' | 'therapist' | 'admin';

export interface AuthUser {
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  token: string | null;
}


