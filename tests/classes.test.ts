import request from 'supertest';
import app from '../src/app'; 

describe('Classes', () => {
  let createdClientId: number | null = null;
  let createdClassId: number | null = null;
  let createdEnvironmentId: number | null = null;
  let createdUserId: number | null = null;

  describe('CRUD Operations', () => {
    beforeAll(async () => {
      const clientData = {
        api_key: `apikey-classes-${Date.now()}`,
        school_name: 'Classes Test School',
        subscription_type: 'unlimited',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 86400000).toISOString(), // +1 day
        autorenew: true
      };
      const clientRes = await request(app).post('/clients').send(clientData);
      expect(clientRes.status).toBe(201);
      createdClientId = clientRes.body.client_id;
    });

    afterAll(async () => {
      if (createdClientId) {
        await request(app).delete(`/clients/${createdClientId}`);
      }
    });

    it('should create a new class', async () => {
      const classData = {
        class_name: 'Mathematics',
        class_reference: 'MATH1013',
        license_id: createdClientId
      };
      const res = await request(app).post('/classes').send(classData);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('class_id');
      createdClassId = res.body.class_id;
    });

    it('should fetch the created class by ID', async () => {
      expect(createdClassId).not.toBeNull();
      const res = await request(app).get(`/classes/${createdClassId}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('class_id', createdClassId);
      expect(res.body).toHaveProperty('class_name', 'Mathematics');
    });

    it('should update the created class', async () => {
      expect(createdClassId).not.toBeNull();
      const updatedData = { class_name: 'Advanced Mathematics' };
      const res = await request(app).put(`/classes/${createdClassId}`).send(updatedData);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('class_name', updatedData.class_name);
    });

    it('should delete the created class', async () => {
      expect(createdClassId).not.toBeNull();
      const res = await request(app).delete(`/classes/${createdClassId}`);
      expect(res.status).toBe(200);

      const resGet = await request(app).get(`/classes/${createdClassId}`);
      expect(resGet.status).toBe(404);
    });
  });


  describe('Additional Endpoints', () => {
    beforeAll(async () => {
      const clientData = {
        api_key: `apikey-class-extra-${Date.now()}`,
        school_name: 'Extra School',
        subscription_type: 'basic',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 86400000).toISOString(),
        autorenew: true
      };
      const clientRes = await request(app).post('/clients').send(clientData);
      expect(clientRes.status).toBe(201);
      createdClientId = clientRes.body.client_id;

      const classData = {
        class_name: 'Chemistry',
        class_reference: 'CHEM1001',
        license_id: createdClientId
      };
      const classRes = await request(app).post('/classes').send(classData);
      expect(classRes.status).toBe(201);
      createdClassId = classRes.body.class_id;

      const environmentData = {
        class_id: createdClassId,
        environment_name: 'Chem Lab',
        environment_description: 'Virtual chem lab',
        settings: { level: 'intro' },
        active_status: true
      };
      const envRes = await request(app).post('/environments').send(environmentData);
      expect(envRes.status).toBe(201);
      createdEnvironmentId = envRes.body.environment_id;

      const userData = {
        first_name: 'ClassUsers',
        last_name: 'Test',
        email: `classusers${Date.now()}@example.com`,
        password: 'password123',
        phone: '555-666-7777'
      };
      const userRes = await request(app).post('/users').send(userData);
      expect(userRes.status).toBe(201);
      createdUserId = userRes.body.user_id;

      const classUserData = {
        class_id: createdClassId,
        user_id: createdUserId,
        role: 'teacher'
      };
      const cuRes = await request(app).post('/class-users').send(classUserData);
      expect(cuRes.status).toBe(201);
    });

    afterAll(async () => {
      if (createdClassId && createdUserId) {
        await request(app).delete(`/class-users/${createdClassId}/${createdUserId}`);
      }
      if (createdEnvironmentId) {
        await request(app).delete(`/environments/${createdEnvironmentId}`);
      }
      if (createdClassId) {
        await request(app).delete(`/classes/${createdClassId}`);
      }
      if (createdUserId) {
        await request(app).delete(`/users/${createdUserId}`);
      }
      if (createdClientId) {
        await request(app).delete(`/clients/${createdClientId}`);
      }
    });

    it('should get environments associated with a class', async () => {
      expect(createdClassId).not.toBeNull();
      const res = await request(app).get(`/classes/${createdClassId}/environments`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('environment_id', createdEnvironmentId);
      expect(res.body[0]).toHaveProperty('environment_name', 'Chem Lab');
    });

    it('should get users associated with a class', async () => {
      expect(createdClassId).not.toBeNull();
      const res = await request(app).get(`/classes/${createdClassId}/users`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('user_id', createdUserId);
      expect(res.body[0]).toHaveProperty('role', 'teacher');
    });
  });
});
