// tests/auth.test.ts

import dotenv from 'dotenv';
dotenv.config();

import request from 'supertest';
import app from '../src/app';
import jwt from 'jsonwebtoken';
import { createAndAuthenticateUser } from './helpers/authHelper';

describe('Auth', () => {
  let createdUserId: number | null = null;
  let testEmail: string;
  const password = 'password123';
  const JWT_SECRET = process.env.JWT_SECRET;

  let authToken: string | null = null;

  beforeAll(async () => {
    testEmail = `loginuser${Date.now()}@example.com`;
    const userData = {
      first_name: 'Login',
      last_name: 'User',
      email: testEmail,
      password: password,
      phone: '000-111-2222'
    };
    const authData = await createAndAuthenticateUser(userData);
    createdUserId = authData.userId;
    authToken = authData.token;
  });

  it('should fail login with wrong credentials', async () => {
    const res = await request(app).post('/auth/login').send({ // Updated endpoint
      email: testEmail,
      password: 'wrongpassword'
    });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error', 'Invalid credentials'); // Updated error message
  });

  it('should login with correct credentials and return a token', async () => {
    const res = await request(app).post('/auth/login').send({ // Updated endpoint
      email: testEmail,
      password: password
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Successful');
    expect(res.body.user).toHaveProperty('user_id', createdUserId);
    expect(res.body.user).toHaveProperty('email', testEmail);
    expect(res.body.user).toHaveProperty('first_name', 'Login');
    expect(res.body.user).toHaveProperty('last_name', 'User');
    expect(res.body.user).not.toHaveProperty('password');
    expect(res.body).toHaveProperty('token');

    authToken = res.body.token;

    const decoded = jwt.verify(res.body.token, JWT_SECRET!) as jwt.JwtPayload; 
    expect(decoded).toHaveProperty('user_id', createdUserId);
    expect(decoded).toHaveProperty('email', testEmail);
    expect(decoded).toHaveProperty('first_name', 'Login');
    expect(decoded).toHaveProperty('last_name', 'User');
  });

  it('should deny access to a protected route without JWT', async () => {
    const res = await request(app).get('/clients'); 
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error', 'Authorization header missing.');
  });

  it('should deny access to a protected route with invalid JWT', async () => {
    const res = await request(app)
      .get('/clients') 
      .set('Authorization', `Bearer invalidtoken`);
    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('error', 'Invalid or expired token.');
  });

  afterAll(async () => {
    expect(authToken).not.toBeNull();

    if (createdUserId && authToken) {
      const res = await request(app)
        .delete(`/users/${createdUserId}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
    }
  });
});
