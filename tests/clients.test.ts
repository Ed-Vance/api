import dotenv from 'dotenv';
dotenv.config();

import request from 'supertest';
import app from '../src/app';
import { createAndAuthenticateUser } from './helpers/authHelper';

describe('Clients', () => {
  let createdClientId: number | null = null;
  let createdUserId: number | null = null;
  let authToken: string | null = null;

  beforeAll(async () => {
    const userData = {
      first_name: 'ClientTest',
      last_name: 'User',
      email: `clienttestuser${Date.now()}@example.com`,
      password: 'password123',
      phone: '888-999-0000'
    };
    const authData = await createAndAuthenticateUser(userData);
    createdUserId = authData.userId;
    authToken = authData.token;
  });

  it('should create a new client', async () => {
    expect(authToken).not.toBeNull();

    const clientData = {
      api_key: `apikey-${Date.now()}`,
      school_name: 'Test School',
      subscription_type: 'basic',
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 86400000).toISOString(),
      autorenew: true
    };
    const res = await request(app)
      .post('/clients') 
      .set('Authorization', `Bearer ${authToken}`)
      .send(clientData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('client_id');
    createdClientId = res.body.client_id;
  });

  it('should fetch the created client by ID', async () => {
    expect(createdClientId).not.toBeNull();
    expect(authToken).not.toBeNull();

    const res = await request(app)
      .get(`/clients/${createdClientId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('client_id', createdClientId);
  });

  it('should update the created client', async () => {
    expect(createdClientId).not.toBeNull();
    expect(authToken).not.toBeNull();

    const updatedData = { school_name: 'Updated Test School' };
    const res = await request(app)
      .put(`/clients/${createdClientId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedData);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('school_name', updatedData.school_name);
  });

  it('should delete the created client', async () => {
    expect(createdClientId).not.toBeNull();
    expect(authToken).not.toBeNull();

    const res = await request(app)
      .delete(`/clients/${createdClientId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);

    const resGet = await request(app)
      .get(`/clients/${createdClientId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(resGet.status).toBe(404);
  });

  afterAll(async () => {
    if (createdUserId) {
      await request(app)
        .delete(`/users/${createdUserId}`)
        .set('Authorization', `Bearer ${authToken}`);
    }
  });
});
