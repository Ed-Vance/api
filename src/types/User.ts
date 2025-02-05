/**
 * Represents a user in the system.
 */
export interface User {
    user_id: number;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    password?: string; 
    phone: string | null;
  }
  
  /**
   * Represents a sanitized user object without sensitive information.
   */
  export interface SanitizedUser {
    user_id: number;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    phone: string | null;
  }
  