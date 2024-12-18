import dotenv from 'dotenv';
dotenv.config();

import request from 'supertest';
import app from '../src/app';
import { createAndAuthenticateUser } from './helpers/authHelper';

describe('Classes', () => {
  let createdClientId: number | null = null;
  let createdClassId: number | null = null;
  let createdEnvironmentId: number | null = null;
  let createdUserId: number | null = null;
  let authToken: string | null = null;

  describe('CRUD Operations', () => {
    const clientData = {
      api_key: `apikey-classes-${Date.now()}`,
      school_name: 'Classes Test School',
      subscription_type: 'unlimited',
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 86400000).toISOString(), // +1 day
      autorenew: true
    };

    beforeAll(async () => {
      // Create and authenticate user
      const userData = {
        first_name: 'ClassesUser',
        last_name: 'Tester',
        email: `classesuser${Date.now()}@example.com`,
        password: 'password123',
        phone: '777-888-9999'
      };
      const authData = await createAndAuthenticateUser(userData);
      createdUserId = authData.userId;
      authToken = authData.token;

      // Create a client
      const clientRes = await request(app)
        .post('/clients') 
        .set('Authorization', `Bearer ${authToken}`)
        .send(clientData);
      expect(clientRes.status).toBe(201);
      createdClientId = clientRes.body.client_id;
    });

    afterAll(async () => {
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

    it('should create a new class', async () => {
      expect(authToken).not.toBeNull();
      expect(createdClientId).not.toBeNull();

      const classData = {
        class_name: 'Mathematics',
        class_reference: 'MATH1013',
        license_id: createdClientId
      };
      const res = await request(app)
        .post('/classes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(classData);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('class_id');
      createdClassId = res.body.class_id;
    });

    it('should fetch the created class by ID', async () => {
      expect(createdClassId).not.toBeNull();
      expect(authToken).not.toBeNull();

      const res = await request(app)
        .get(`/classes/${createdClassId}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('class_id', createdClassId);
      expect(res.body).toHaveProperty('class_name', 'Mathematics');
    });

    it('should update the created class', async () => {
      expect(createdClassId).not.toBeNull();
      expect(authToken).not.toBeNull();

      const updatedData = { class_name: 'Advanced Mathematics' };
      const res = await request(app)
        .put(`/classes/${createdClassId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedData);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('class_name', updatedData.class_name);
    });

    it('should delete the created class', async () => {
      expect(createdClassId).not.toBeNull();
      expect(authToken).not.toBeNull();

      const res = await request(app)
        .delete(`/classes/${createdClassId}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);

      const resGet = await request(app)
        .get(`/classes/${createdClassId}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(resGet.status).toBe(404);
    });
  });

  describe('Additional Endpoints', () => {
    beforeAll(async () => {
      // Create a class
      const classData = {
        class_name: 'Chemistry',
        class_reference: 'CHEM1001',
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
        environment_name: 'Chem Lab',
        environment_description: 'Virtual chem lab',
        settings: { level: 'intro' },
        active_status: true
      };
      const envRes = await request(app)
        .post('/environments')
        .set('Authorization', `Bearer ${authToken}`)
        .send(environmentData);
      expect(envRes.status).toBe(201);
      createdEnvironmentId = envRes.body.environment_id;

      // Create and authenticate another user for class-user association
      const userData = {
        first_name: 'ClassUsers',
        last_name: 'Test',
        email: `classusers${Date.now()}@example.com`,
        password: 'password123',
        phone: '555-666-7777'
      };
      const authData = await createAndAuthenticateUser(userData);
      createdUserId = authData.userId;
      const classUserAuthToken = authData.token;

      // Associate user with class
      const classUserData = {
        class_id: createdClassId,
        user_id: createdUserId,
        role: 'teacher'
      };
      const cuRes = await request(app)
        .post('/class-users')
        .set('Authorization', `Bearer ${classUserAuthToken}`)
        .send(classUserData);
      expect(cuRes.status).toBe(201);
    });

    it('should get environments associated with a class', async () => {
      expect(authToken).not.toBeNull();
      expect(createdClassId).not.toBeNull();
      expect(createdEnvironmentId).not.toBeNull();

      const res = await request(app)
        .get(`/classes/${createdClassId}/environments`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('environment_id', createdEnvironmentId);
      expect(res.body[0]).toHaveProperty('environment_name', 'Chem Lab');
    });

    it('should get users associated with a class', async () => {
      expect(authToken).not.toBeNull();
      expect(createdClassId).not.toBeNull();
      expect(createdUserId).not.toBeNull();

      const res = await request(app)
        .get(`/classes/${createdClassId}/users`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('user_id', createdUserId);
      expect(res.body[0]).toHaveProperty('role', 'teacher');
    });

    afterAll(async () => {
      if (createdClassId && createdUserId && authToken) {
        // Delete class-user association
        await request(app)
          .delete(`/class-users/${createdClassId}/${createdUserId}`)
          .set('Authorization', `Bearer ${authToken}`);
      }
      if (createdEnvironmentId) {
        // Delete environment
        await request(app)
          .delete(`/environments/${createdEnvironmentId}`)
          .set('Authorization', `Bearer ${authToken}`);
      }
      if (createdClassId) {
        // Delete class
        await request(app)
          .delete(`/classes/${createdClassId}`)
          .set('Authorization', `Bearer ${authToken}`);
      }
      if (createdUserId) {
        // Delete user
        await request(app)
          .delete(`/users/${createdUserId}`)
          .set('Authorization', `Bearer ${authToken}`);
      }
      if (createdClientId) {
        // Delete client
        await request(app)
          .delete(`/clients/${createdClientId}`)
          .set('Authorization', `Bearer ${authToken}`);
      }
    });
  });
});
