const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function createUser({ email, password } = {}) {
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
