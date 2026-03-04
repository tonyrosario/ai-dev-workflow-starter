const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface CreateUserInput {
  email?: string;
  password?: string;
}

interface User {
  email: string;
  password: string;
}

export function createUser({ email, password }: CreateUserInput = {}): User {
  if (!email) {
    throw new Error('Email is required');
  }
  if (!EMAIL_REGEX.test(email)) {
    throw new Error('Invalid email format');
  }
  if (!password) {
    throw new Error('Password is required');
  }
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }
  return { email, password };
}
