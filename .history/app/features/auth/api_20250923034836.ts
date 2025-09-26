import api from '@/lib/axios';

export async function loginApi({ email, password }: { email: string; password: string }) {
  // Simulate API call
  if (email === 'client@kapas.com' && password === 'password') {
    return { user: { email, name: 'Client User', role: 'client' }, token: 'dummy-client-token' };
  }
  if (email === 'therapist@kapas.com' && password === 'password') {
    return { user: { email, name: 'Therapist User', role: 'therapist' }, token: 'dummy-therapist-token' };
  }
  if (email === 'admin@kapas.com' && password === 'password') {
    return { user: { email, name: 'Admin User', role: 'admin' }, token: 'dummy-admin-token' };
  }
  throw new Error('Invalid credentials');
}

export async function registerApi({ name, email, password }: { name: string; email: string; password: string }) {
  // Simulate API call
  if (email.endsWith('@kapas.com')) {
    return { user: { email, name, role: 'client' }, token: 'dummy-client-token' };
  }
  throw new Error('Registration failed');
}

export async function logoutApi() {
  // Simulate logout
  return true;
}
