import dotenv from 'dotenv';
dotenv.config();

import request from 'supertest';
import app from '../src/app';
import { createAndAuthenticateUser } from './helpers/authHelper';

describe('Class_Users', () => {
  let createdUserId: number | null = null;
  let createdClientId: number | null = null;
  let createdClassId: number | null = null;

  let createdClassUserClassId: number | null = null;
  let createdClassUserUserId: number | null = null;
  let authToken: string | null = null;

  beforeAll(async () => {
    // Create and authenticate user
    const userData = {
      first_name: 'ClassUserTest',
      last_name: 'User',
      email: `classuser${Date.now()}@example.com`,
      password: 'password123',
      phone: '999-888-7777'
    };
    const authData = await createAndAuthenticateUser(userData);
    createdUserId = authData.userId;
    authToken = authData.token;

    // Create a client
    const clientData = {
      api_key: `apikey-class-user-${Date.now()}`,
      school_name: 'Class User Test School',
      subscription_type: 'basic',
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 86400000).toISOString(),
      autorenew: true
    };
    const clientRes = await request(app)
      .post('/clients') 
      .set('Authorization', `Bearer ${authToken}`)
      .send(clientData);
    expect(clientRes.status).toBe(201);
    createdClientId = clientRes.body.client_id;

    // Create a class
    const classData = {
      class_name: 'History',
      class_reference: 'HIST2001',
      license_id: createdClientId
    };
    const classRes = await request(app)
      .post('/classes') 
      .set('Authorization', `Bearer ${authToken}`)
      .send(classData);
    expect(classRes.status).toBe(201);
    createdClassId = classRes.body.class_id;
  });

  it('should create a new class_user', async () => {
    expect(authToken).not.toBeNull();
    expect(createdClassId).not.toBeNull();
    expect(createdUserId).not.toBeNull();

    const classUserData = {
      class_id: createdClassId,
      user_id: createdUserId,
      role: 'student'
    };
    const res = await request(app)
      .post('/class-users') 
      .set('Authorization', `Bearer ${authToken}`)
      .send(classUserData);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('class_id', createdClassId);
    expect(res.body).toHaveProperty('user_id', createdUserId);

    createdClassUserClassId = res.body.class_id;
    createdClassUserUserId = res.body.user_id;
  });

  it('should fetch the created class_user by composite ID', async () => {
    expect(authToken).not.toBeNull();
    expect(createdClassUserClassId).not.toBeNull();
    expect(createdClassUserUserId).not.toBeNull();

    const res = await request(app)
      .get(`/class-users/${createdClassUserClassId}/${createdClassUserUserId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('class_id', createdClassUserClassId);
    expect(res.body).toHaveProperty('user_id', createdClassUserUserId);
  });

  it('should update the class_user role', async () => {
    expect(authToken).not.toBeNull();
    expect(createdClassUserClassId).not.toBeNull();
    expect(createdClassUserUserId).not.toBeNull();

    const updatedData = { role: 'teacher' };
    const res = await request(app)
      .put(`/class-users/${createdClassUserClassId}/${createdClassUserUserId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedData);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('role', 'teacher');
  });

  it('should delete the class_user', async () => {
    expect(authToken).not.toBeNull();
    expect(createdClassUserClassId).not.toBeNull();
    expect(createdClassUserUserId).not.toBeNull();

    const res = await request(app)
      .delete(`/class-users/${createdClassUserClassId}/${createdClassUserUserId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);

    const resGet = await request(app)
      .get(`/class-users/${createdClassUserClassId}/${createdClassUserUserId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(resGet.status).toBe(404);
  });

  afterAll(async () => {
    if (createdClassUserClassId && createdClassUserUserId) {
      await request(app)
        .delete(`/class-users/${createdClassUserClassId}/${createdClassUserUserId}`)
        .set('Authorization', `Bearer ${authToken}`);
    }
    if (createdClassId && createdClientId && createdUserId) {
      // Delete class
      await request(app)
        .delete(`/classes/${createdClassId}`)
        .set('Authorization', `Bearer ${authToken}`);

      // Delete client
      await request(app)
        .delete(`/clients/${createdClientId}`)
        .set('Authorization', `Bearer ${authToken}`);

      // Delete user
      await request(app)
        .delete(`/users/${createdUserId}`)
        .set('Authorization', `Bearer ${authToken}`);
    }
  });
});
