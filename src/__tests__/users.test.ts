import { describe, it, expect } from 'vitest';
import { createUser } from '../users.js';

describe('createUser', () => {
  describe('success', () => {
    it('returns { email, password } when inputs are valid', () => {
      const result = createUser({ email: 'user@example.com', password: 'secret12' });
      expect(result).toEqual({ email: 'user@example.com', password: 'secret12' });
    });

    it('accepts a password exactly 8 characters long', () => {
      const result = createUser({ email: 'a@b.co', password: '12345678' });
      expect(result).toEqual({ email: 'a@b.co', password: '12345678' });
    });
  });

  describe('email validation', () => {
    it('throws "Email is required" when email is missing', () => {
      expect(() => createUser({ password: 'secret12' })).toThrow('Email is required');
    });

    it('throws "Email is required" when email is an empty string', () => {
      expect(() => createUser({ email: '', password: 'secret12' })).toThrow('Email is required');
    });

    it('throws "Invalid email format" when email has no @', () => {
      expect(() => createUser({ email: 'notanemail', password: 'secret12' })).toThrow(
        'Invalid email format',
      );
    });

    it('throws "Invalid email format" when email has no domain', () => {
      expect(() => createUser({ email: 'user@', password: 'secret12' })).toThrow(
        'Invalid email format',
      );
    });

    it('throws "Invalid email format" when email has no TLD', () => {
      expect(() => createUser({ email: 'user@domain', password: 'secret12' })).toThrow(
        'Invalid email format',
      );
    });
  });

  describe('password validation', () => {
    it('throws "Password is required" when password is missing', () => {
      expect(() => createUser({ email: 'user@example.com' })).toThrow('Password is required');
    });

    it('throws "Password is required" when password is an empty string', () => {
      expect(() => createUser({ email: 'user@example.com', password: '' })).toThrow(
        'Password is required',
      );
    });

    it('throws "Password must be at least 8 characters" when password is 7 characters', () => {
      expect(() => createUser({ email: 'user@example.com', password: '1234567' })).toThrow(
        'Password must be at least 8 characters',
      );
    });
  });

  describe('edge cases', () => {
    it('throws "Email is required" when called with no arguments', () => {
      expect(() => createUser()).toThrow('Email is required');
    });

    it('email validation runs before password validation', () => {
      expect(() => createUser({ email: 'bad', password: '' })).toThrow('Invalid email format');
    });
  });
});
