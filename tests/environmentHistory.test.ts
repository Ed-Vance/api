import dotenv from 'dotenv';
dotenv.config();

import request from 'supertest';
import app from '../src/app';
import { createAndAuthenticateUser } from './helpers/authHelper';

describe('Environment_History', () => {
  let createdClientId: number | null = null;
  let createdClassId: number | null = null;
  let createdEnvironmentId: number | null = null;
  let createdUserId: number | null = null;
  let authToken: string | null = null;

  let environmentIdForHistory: number | null = null;
  let userIdForHistory: number | null = null;

  beforeAll(async () => {
    // Create and authenticate user
    const userData = {
      first_name: 'EnvHist',
      last_name: 'Tester',
      email: `envhistuser${Date.now()}@example.com`,
      password: 'password123',
      phone: '444-555-6666'
    };
    const authData = await createAndAuthenticateUser(userData);
    createdUserId = authData.userId;
    authToken = authData.token;

    // Create a client
    const clientData = {
      api_key: `apikey-envhist-${Date.now()}`,
      school_name: 'Environment History Test School',
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
      class_name: 'Physics',
      class_reference: 'PHYS3001',
      license_id: createdClientId
    };
    const classRes = await request(app)
      .post('/classes')
      .set('Authorization', `Bearer ${authToken}`)
      .send(classData);
    expect(classRes.status).toBe(201);
    createdClassId = classRes.body.class_id;

    // Create an environment
    const environmentData = {
      class_id: createdClassId,
      environment_name: 'Physics Lab',
      environment_description: 'A lab simulation',
      settings: { gravity: '9.8m/s2' },
      active_status: true
    };
    const envRes = await request(app)
      .post('/environments') 
      .set('Authorization', `Bearer ${authToken}`)
      .send(environmentData);
    expect(envRes.status).toBe(201);
    createdEnvironmentId = envRes.body.environment_id;

    // Set IDs for history
    environmentIdForHistory = createdEnvironmentId;
    userIdForHistory = createdUserId;
  });

  it('should create an environment_history record', async () => {
    expect(authToken).not.toBeNull();
    expect(environmentIdForHistory).not.toBeNull();
    expect(userIdForHistory).not.toBeNull();

    const historyData = {
      environment_id: environmentIdForHistory,
      user_id: userIdForHistory,
      timestamp: new Date().toISOString(),
      message: 'User entered the environment',
      message_type: 'response'
    };
    const res = await request(app)
      .post('/environment-history') 
      .set('Authorization', `Bearer ${authToken}`)
      .send(historyData);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('environment_id', environmentIdForHistory);
    expect(res.body).toHaveProperty('user_id', userIdForHistory);
  });

  it('should fetch the environment_history by composite IDs', async () => {
    expect(authToken).not.toBeNull();
    expect(environmentIdForHistory).not.toBeNull();
    expect(userIdForHistory).not.toBeNull();

    const res = await request(app)
      .get(`/environment-history/${environmentIdForHistory}/${userIdForHistory}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    const record = res.body[0];
    expect(record.environment_id).toBe(environmentIdForHistory);
    expect(record.user_id).toBe(userIdForHistory);
  });

  it('should delete the environment_history record', async () => {
    expect(authToken).not.toBeNull();
    expect(environmentIdForHistory).not.toBeNull();
    expect(userIdForHistory).not.toBeNull();

    const res = await request(app)
      .delete(`/environment-history/${environmentIdForHistory}/${userIdForHistory}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);

    const resGet = await request(app)
      .get(`/environment-history/${environmentIdForHistory}/${userIdForHistory}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(resGet.status).toBe(404);
  });

  afterAll(async () => {
    if (createdEnvironmentId) {
      await request(app)
        .delete(`/environments/${createdEnvironmentId}`)
        .set('Authorization', `Bearer ${authToken}`);
    }
    if (createdClassId) {
      await request(app)
        .delete(`/classes/${createdClassId}`)
        .set('Authorization', `Bearer ${authToken}`);
    }
    if (createdClientId) {
      await request(app)
        .delete(`/clients/${createdClientId}`)
        .set('Authorization', `Bearer ${authToken}`);
    }
    if (createdUserId) {
      await request(app)
        .delete(`/users/${createdUserId}`)
        .set('Authorization', `Bearer ${authToken}`);
    }
  });
});
