import { User } from '../types/User'; 

/**
 * SanitizedUser interface excludes sensitive information like passwords.
 */
export interface SanitizedUser {
  user_id: number;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
}

/**
 * Sanitizes a single user object by removing sensitive fields.
 *
 * @param {User} user - The user object to sanitize.
 * @returns {SanitizedUser} - The sanitized user object.
 */
export const sanitizeUser = (user: User): SanitizedUser => {
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
};

/**
 * Sanitizes an array of user objects by removing sensitive fields.
 *
 * @param {User[]} users - The array of user objects to sanitize.
 * @returns {SanitizedUser[]} - The array of sanitized user objects.
 */
export const sanitizeUsers = (users: User[]): SanitizedUser[] => {
  return users.map(user => sanitizeUser(user));
};
