import request from 'supertest';
import app from '../src/app';

describe('Clients', () => {
  let createdClientId: number | null = null;
 
  it('should create a new client', async () => {
    const clientData = {
      api_key: `apikey-${Date.now()}`,
      school_name: 'Test School',
      subscription_type: 'basic',
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 86400000).toISOString(),
      autorenew: true
    };
    const res = await request(app).post('/clients').send(clientData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('client_id');
    createdClientId = res.body.client_id;
  });

  it('should fetch the created client by ID', async () => {
    expect(createdClientId).not.toBeNull();
    const res = await request(app).get(`/clients/${createdClientId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('client_id', createdClientId);
  });

  it('should update the created client', async () => {
    expect(createdClientId).not.toBeNull();
    const updatedData = { school_name: 'Updated Test School' };
    const res = await request(app).put(`/clients/${createdClientId}`).send(updatedData);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('school_name', updatedData.school_name);
  });

  it('should delete the created client', async () => {
    expect(createdClientId).not.toBeNull();
    const res = await request(app).delete(`/clients/${createdClientId}`);
    expect(res.status).toBe(200);

    const resGet = await request(app).get(`/clients/${createdClientId}`);
    expect(resGet.status).toBe(404);
  });
});
