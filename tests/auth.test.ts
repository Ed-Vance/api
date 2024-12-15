import request from 'supertest';
import app from '../src/app'; 

describe('Auth', () => {
  let createdUserId: number | null = null;
  let testEmail: string;
  const password = 'password123';

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
  });

  it('should login with correct credentials', async () => {
    const res = await request(app).post('/auth/login').send({
      email: testEmail,
      password: password
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Successful');
    expect(res.body.user).toHaveProperty('user_id', createdUserId);
  });
});
