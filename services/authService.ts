const API_BASE_URL = 'https://dummyjson.com';

export type RegisterInput = {
  email: string;
  password: string;
  phone?: string;
  role?: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export async function registerUser(input: RegisterInput) {
  const res = await fetch(`${API_BASE_URL}/users/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: input.email.split('@')[0],
      email: input.email,
      password: input.password,
      phone: input.phone || '',
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Registration failed');
  return { message: 'Registered', userId: String(data.id) };
}

export async function loginUser(input: LoginInput) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: input.email, password: input.password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return { token: data.token, userId: String(data.id) };
}

export async function logoutUser() {
  return { message: 'Logged out' };
}
