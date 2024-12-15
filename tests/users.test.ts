import request from 'supertest';
import app from '../src/app';

describe('Users', () => {
  let createdUserId: number | null = null;
  let associatedClientId: number | null = null;
  let associatedClassId: number | null = null;

  describe('CRUD Operations', () => {
    it('should create a new user', async () => {
      const userData = {
        first_name: 'Test',
        last_name: 'User',
        email: `testuser${Date.now()}@example.com`,
        password: 'password123',
        phone: '123-456-7890'
      };
      const res = await request(app).post('/users').send(userData);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('user_id');
      createdUserId = res.body.user_id;
    });

    it('should fetch the created user by ID', async () => {
      expect(createdUserId).not.toBeNull();
      const res = await request(app).get(`/users/${createdUserId}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('user_id', createdUserId);
      expect(res.body).toHaveProperty('email', expect.stringContaining('@example.com'));
    });

    it('should update the created user', async () => {
      expect(createdUserId).not.toBeNull();
      const updatedData = { phone: '987-654-3210' };
      const res = await request(app).put(`/users/${createdUserId}`).send(updatedData);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('phone', updatedData.phone);
    });

    it('should delete the created user', async () => {
      expect(createdUserId).not.toBeNull();
      const res = await request(app).delete(`/users/${createdUserId}`);
      expect(res.status).toBe(200);

      const resGet = await request(app).get(`/users/${createdUserId}`);
      expect(resGet.status).toBe(404);
    });
  });
 
  describe('Fetching Classes Associated with a User', () => {
    beforeAll(async () => {
      const userData = {
        first_name: 'TestUserForClasses',
        last_name: 'Assoc',
        email: `assocuser${Date.now()}@example.com`,
        password: 'password123',
        phone: '123-456-7890'
      };
      const userRes = await request(app).post('/users').send(userData);
      expect(userRes.status).toBe(201);
      createdUserId = userRes.body.user_id;

      const clientData = {
        api_key: `apikey-user-classes-${Date.now()}`,
        school_name: 'UserClass School',
        subscription_type: 'basic',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 86400000).toISOString(),
        autorenew: false
      };
      const clientRes = await request(app).post('/clients').send(clientData);
      expect(clientRes.status).toBe(201);
      associatedClientId = clientRes.body.client_id;

      const classData = {
        class_name: 'Biology',
        class_reference: 'BIO1010',
        license_id: associatedClientId
      };
      const classRes = await request(app).post('/classes').send(classData);
      expect(classRes.status).toBe(201);
      associatedClassId = classRes.body.class_id;

      const classUserData = {
        class_id: associatedClassId,
        user_id: createdUserId,
        role: 'student'
      };
      const classUserRes = await request(app).post('/class-users').send(classUserData);
      expect(classUserRes.status).toBe(201);
    });

    it('should get classes associated with user', async () => {
      expect(createdUserId).not.toBeNull();
      const res = await request(app).get(`/users/${createdUserId}/classes`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('class_id', associatedClassId);
      expect(res.body[0]).toHaveProperty('class_name', 'Biology');
      expect(res.body[0]).toHaveProperty('role', 'student');
    });

    afterAll(async () => {
      if (associatedClassId && createdUserId) {
        await request(app).delete(`/class-users/${associatedClassId}/${createdUserId}`);
      }
      if (associatedClassId) {
        await request(app).delete(`/classes/${associatedClassId}`);
      }
      if (associatedClientId) {
        await request(app).delete(`/clients/${associatedClientId}`);
      }
      if (createdUserId) {
        await request(app).delete(`/users/${createdUserId}`);
      }
    });
  });
});
