import dotenv from 'dotenv';
dotenv.config();

import request from 'supertest';
import app from '../src/app';
import jwt from 'jsonwebtoken';

describe('Auth', () => {
  let createdUserId: number | null = null;
  let testEmail: string;
  const password = 'password123';
  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

  beforeAll(async () => {
    testEmail = `loginuser${Date.now()}@example.com`;
    const userData = {
      first_name: 'Login',
      last_name: 'User',
      email: testEmail,
      password: password,
      phone: '000-111-2222'
    };
    const res = await request(app).post('/users').send(userData);
    expect(res.status).toBe(201);
    createdUserId = res.body.user_id;
  });

  it('should fail login with wrong credentials', async () => {
    const res = await request(app).post('/auth/login').send({
      email: testEmail,
      password: 'wrongpassword'
    });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error', 'Invalid');
  });

  it('should login with correct credentials and return a token', async () => {
    const res = await request(app).post('/auth/login').send({
      email: testEmail,
      password: password
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Successful');
    expect(res.body.user).toHaveProperty('user_id', createdUserId);
    expect(res.body).toHaveProperty('token');

    const decoded = jwt.verify(res.body.token, JWT_SECRET) as jwt.JwtPayload;
    expect(decoded).toHaveProperty('user_id', createdUserId);
    expect(decoded).toHaveProperty('email', testEmail);
    expect(decoded).toHaveProperty('first_name', 'Login');
    expect(decoded).toHaveProperty('last_name', 'User');
  });

  afterAll(async () => {
    if (createdUserId) {
      await request(app).delete(`/users/${createdUserId}`);
    }
  });
});
