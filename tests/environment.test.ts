import request from 'supertest';
import app from '../src/app';

describe('Environment', () => {
  let createdClientId: number | null = null;
  let createdClassId: number | null = null;
  let createdEnvironmentId: number | null = null;
 
  beforeAll(async () => {
    const clientData = {
      api_key: `apikey-environment-${Date.now()}`,
      school_name: 'Environment Test School',
      subscription_type: 'unlimited',
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 86400000).toISOString(),
      autorenew: true
    };
    const clientRes = await request(app).post('/clients').send(clientData);
    expect(clientRes.status).toBe(201);
    createdClientId = clientRes.body.client_id;

    const classData = {
      class_name: 'Science',
      class_reference: 'SCI1001',
      license_id: createdClientId
    };
    const classRes = await request(app).post('/classes').send(classData);
    expect(classRes.status).toBe(201);
    createdClassId = classRes.body.class_id;
  });

  it('should create a new environment', async () => {
    const environmentData = {
      class_id: createdClassId,
      environment_name: 'Virtual Lab',
      environment_description: 'A VR lab setting',
      settings: { difficulty: 'easy', theme: 'dark' },
      active_status: true
    };
    const res = await request(app).post('/environments').send(environmentData);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('environment_id');
    createdEnvironmentId = res.body.environment_id;
  });

  it('should fetch the created environment by ID', async () => {
    const res = await request(app).get(`/environments/${createdEnvironmentId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('environment_id', createdEnvironmentId);
  });

  it('should update the environment', async () => {
    const updatedData = { active_status: false };
    const res = await request(app).put(`/environments/${createdEnvironmentId}`).send(updatedData);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('active_status', false);
  });

  it('should delete the environment', async () => {
    const res = await request(app).delete(`/environments/${createdEnvironmentId}`);
    expect(res.status).toBe(200);

    const resGet = await request(app).get(`/environments/${createdEnvironmentId}`);
    expect(resGet.status).toBe(404);
  });
});
