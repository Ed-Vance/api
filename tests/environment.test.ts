jest.setTimeout(30000);
import dotenv from 'dotenv';
dotenv.config();

import request from 'supertest';
import app from '../src/app';
import { createAndAuthenticateUser } from './helpers/authHelper';

describe('Environment', () => {
  let createdClientId: number | null = null;
  let createdClassId: number | null = null;
  let createdEnvironmentId: number | null = null;
  let createdUserId: number | null = null;
  let authToken: string | null = null;

  beforeAll(async () => {
    // Create and authenticate user
    const userData = {
      first_name: 'EnvTest',
      last_name: 'User',
      email: `envtestuser${Date.now()}@example.com`,
      password: 'password123',
      phone: '555-666-7777'
    };
    const authData = await createAndAuthenticateUser(userData);
    createdUserId = authData.userId;
    authToken = authData.token;

    // Create a client
    const clientData = {
      api_key: `apikey-environment-${Date.now()}`,
      school_name: 'Environment Test School',
      subscription_type: 'unlimited',
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
      class_name: 'Science',
      class_reference: 'SCI1001',
      license_id: createdClientId
    };
    const classRes = await request(app)
      .post('/classes')
      .set('Authorization', `Bearer ${authToken}`)
      .send(classData);
    expect(classRes.status).toBe(201);
    createdClassId = classRes.body.class_id;
  });

  it('should create a new environment', async () => {
    expect(authToken).not.toBeNull();
    expect(createdClassId).not.toBeNull();

    const environmentData = {
      class_id: createdClassId,
      environment_name: 'Virtual Lab',
      environment_description: 'A VR lab setting',
      settings: { difficulty: 'easy', theme: 'dark' },
      active_status: true
    };
    const res = await request(app)
      .post('/environments')
      .set('Authorization', `Bearer ${authToken}`)
      .send(environmentData);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('environment_id');
    createdEnvironmentId = res.body.environment_id;
  });

  it('should fetch the created environment by ID', async () => {
    expect(authToken).not.toBeNull();
    expect(createdEnvironmentId).not.toBeNull();

    const res = await request(app)
      .get(`/environments/${createdEnvironmentId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('environment_id', createdEnvironmentId);
  });

  it('should update the environment', async () => {
    expect(authToken).not.toBeNull();
    expect(createdEnvironmentId).not.toBeNull();

    const updatedData = { active_status: false };
    const res = await request(app)
      .put(`/environments/${createdEnvironmentId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedData);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('active_status', false);
  });

  it('should delete the environment', async () => {
    expect(authToken).not.toBeNull();
    expect(createdEnvironmentId).not.toBeNull();

    const res = await request(app)
      .delete(`/environments/${createdEnvironmentId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);

    const resGet = await request(app)
      .get(`/environments/${createdEnvironmentId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(resGet.status).toBe(404);
  });

  afterAll(async () => {
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
