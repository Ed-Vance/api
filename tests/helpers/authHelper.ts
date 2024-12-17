import request from 'supertest';
import app from '../../src/app';

interface UserCredentials {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
}

interface AuthenticatedUser {
  userId: number;
  token: string;
}

/**
 * Creates a new user via /auth/signup and authenticates them to obtain a JWT token.
 *
 * @param {UserCredentials} userData - The user's sign-up data.
 * @returns {Promise<AuthenticatedUser>} - An object containing the user ID and JWT token.
 */
export const createAndAuthenticateUser = async (userData: UserCredentials): Promise<AuthenticatedUser> => {
  // Sign up the user via /auth/signup
  const signUpRes = await request(app)
    .post('/auth/signup')
    .send(userData);
  
  if (signUpRes.status !== 201) {
    throw new Error(`Failed to create user: ${signUpRes.body.error || 'Unknown error'}`);
  }

  const userId = signUpRes.body.user.user_id;
  
  // Authenticate the user via /auth/login
  const loginRes = await request(app)
    .post('/auth/login')
    .send({
      email: userData.email,
      password: userData.password,
    });
  
  if (loginRes.status !== 200) {
    throw new Error(`Failed to authenticate user: ${loginRes.body.error || 'Unknown error'}`);
  }
  
  const token = loginRes.body.token;
  
  return { userId, token };
};
