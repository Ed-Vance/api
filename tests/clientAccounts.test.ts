import request from 'supertest';
import app from '../src/app';
import { createAndAuthenticateUser } from './helpers/authHelper';

describe('Client_Accounts', () => {
  let createdUserId: number | null = null;
  let createdClientId: number | null = null;

  let createdClientAccountClientId: number | null = null;
  let createdClientAccountUserId: number | null = null;
  let authToken: string | null = null;

  beforeAll(async () => {
    // Create and authenticate user
    const userData = {
      first_name: 'CAUser',
      last_name: 'Test',
      email: `causer${Date.now()}@example.com`,
      password: 'password123',
      phone: '111-222-3333'
    };
    const authData = await createAndAuthenticateUser(userData);
    createdUserId = authData.userId;
    authToken = authData.token;

    // Create a client
    const clientData = {
      api_key: `apikey-${Date.now()}`,
      school_name: 'CA Test School',
      subscription_type: 'basic',
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 86400000).toISOString(),
      autorenew: false
    };
    const clientRes = await request(app)
      .post('/clients')
      .set('Authorization', `Bearer ${authToken}`)
      .send(clientData);
    expect(clientRes.status).toBe(201);
    createdClientId = clientRes.body.client_id;
  });

  it('should create a new client_account', async () => {
    expect(authToken).not.toBeNull();
    expect(createdClientId).not.toBeNull();
    expect(createdUserId).not.toBeNull();

    const accountData = {
      client_id: createdClientId,
      user_id: createdUserId
    };
    const res = await request(app)
      .post('/client-accounts')
      .set('Authorization', `Bearer ${authToken}`)
      .send(accountData);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('client_id', createdClientId);
    expect(res.body).toHaveProperty('user_id', createdUserId);

    createdClientAccountClientId = res.body.client_id;
    createdClientAccountUserId = res.body.user_id;
  });

  it('should fetch the created client_account by composite ID', async () => {
    expect(authToken).not.toBeNull();
    expect(createdClientAccountClientId).not.toBeNull();
    expect(createdClientAccountUserId).not.toBeNull();

    const res = await request(app)
      .get(`/client-accounts/${createdClientAccountClientId}/${createdClientAccountUserId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('client_id', createdClientAccountClientId);
    expect(res.body).toHaveProperty('user_id', createdClientAccountUserId);
  });

  it('should delete the created client_account', async () => {
    expect(authToken).not.toBeNull();
    expect(createdClientAccountClientId).not.toBeNull();
    expect(createdClientAccountUserId).not.toBeNull();

    const res = await request(app)
      .delete(`/client-accounts/${createdClientAccountClientId}/${createdClientAccountUserId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);

    const resGet = await request(app)
      .get(`/client-accounts/${createdClientAccountClientId}/${createdClientAccountUserId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(resGet.status).toBe(404);
  });

  afterAll(async () => {
    if (createdClientId && createdUserId) {
      // Ensure client_account is deleted
      await request(app)
        .delete(`/client-accounts/${createdClientId}/${createdUserId}`)
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
