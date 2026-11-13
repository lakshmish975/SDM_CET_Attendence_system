import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../src/server.js';
import mongoose from 'mongoose';

describe('Apex Academy API Endpoints Integration Suite', () => {
  afterAll(async () => {
    // If mongoose has any open connection, disconnect cleanly
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

  describe('Health Check Endpoint', () => {
    it('GET /api/health should return 200 and system status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('online');
      expect(res.body.appName).toBe('Apex Academy CET & NEET Management Platform');
      expect(res.body.timestamp).toBeDefined();
      expect(res.body.db).toBeDefined();
    });
  });

  describe('Settings Endpoints', () => {
    it('GET /api/settings should return group links and subject faculties', async () => {
      const res = await request(app).get('/api/settings');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.groupLinks).toBeDefined();
      expect(res.body.groupLinks.IPUC_CET_ABSENT).toBeDefined();
      expect(res.body.subjectFaculties).toBeDefined();
      expect(res.body.subjectFaculties.Physics).toBeDefined();
    });

    it('PUT /api/settings/faculty should update faculty for a specific subject', async () => {
      const res = await request(app)
        .put('/api/settings/faculty')
        .send({
          subject: 'Chemistry',
          faculty: 'Prof. Suresh Kumar Ph.D.'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.subjectFaculties.Chemistry).toBe('Prof. Suresh Kumar Ph.D.');
    });

    it('PUT /api/settings/group-links should update WhatsApp group links', async () => {
      const res = await request(app)
        .put('/api/settings/group-links')
        .send({
          groupLinks: {
            IPUC_CET_ABSENT: 'https://chat.whatsapp.com/test-invite-link'
          }
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.groupLinks.IPUC_CET_ABSENT).toBe('https://chat.whatsapp.com/test-invite-link');
    });
  });

  describe('Students Endpoints', () => {
    let createdStudentId = null;

    it('GET /api/students should return all preloaded student records', async () => {
      const res = await request(app).get('/api/students');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.count).toBeGreaterThanOrEqual(165);
    });

    it('GET /api/students?category=IPUC_CET should return filtered students', async () => {
      const res = await request(app).get('/api/students?category=IPUC_CET');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(24);
      res.body.data.forEach((s) => {
        expect(s.category).toBe('IPUC_CET');
      });
    });

    it('POST /api/students should validate missing fields and return 400', async () => {
      const res = await request(app)
        .post('/api/students')
        .send({ name: 'Incomplete Student' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('POST /api/students should create a new student', async () => {
      const newStudent = {
        rollNo: 'TEST_ROLL_999',
        name: 'Arjun Verma',
        category: 'IPUC_CET',
        stream: 'CET',
        type: 'LOCAL',
        phone: '9876543210'
      };

      const res = await request(app).post('/api/students').send(newStudent);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.rollNo).toBe('TEST_ROLL_999');
      createdStudentId = res.body.data._id;
    });

    it('GET /api/students/:id should fetch a single student', async () => {
      expect(createdStudentId).toBeDefined();
      const res = await request(app).get(`/api/students/${createdStudentId}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Arjun Verma');
    });

    it('PUT /api/students/:id should update an existing student', async () => {
      expect(createdStudentId).toBeDefined();
      const res = await request(app)
        .put(`/api/students/${createdStudentId}`)
        .send({ name: 'Arjun Verma (Updated)' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Arjun Verma (Updated)');
    });

    it('DELETE /api/students/:id should delete the student', async () => {
      expect(createdStudentId).toBeDefined();
      const res = await request(app).delete(`/api/students/${createdStudentId}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('Attendance Endpoints', () => {
    it('POST /api/attendance should save/upsert an attendance session', async () => {
      const payload = {
        date: '2026-11-13',
        category: 'IPUC_CET',
        subject: 'Physics',
        faculty: 'Dr. H. V. Rao',
        sessionTime: '09:30 AM',
        maxScore: 100,
        records: [
          {
            rollNo: '262715',
            name: 'NIRIKSHA B M',
            present: true,
            score: 95
          },
          {
            rollNo: '262102',
            name: 'RAMPRASAD T S',
            present: false,
            score: 0
          }
        ]
      };

      const res = await request(app).post('/api/attendance').send(payload);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.totalStudents).toBe(2);
      expect(res.body.data.presentCount).toBe(1);
      expect(res.body.data.absentCount).toBe(1);
    });

    it('GET /api/attendance should retrieve the saved session', async () => {
      const res = await request(app)
        .get('/api/attendance?date=2026-11-13&category=IPUC_CET&subject=Physics');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.date).toBe('2026-11-13');
      expect(res.body.data.subject).toBe('Physics');
      expect(res.body.data.records.length).toBe(2);
    });
  });

  describe('Excel Export Endpoints', () => {
    it('GET /api/export/excel/daily should return an Excel file attachment', async () => {
      const res = await request(app)
        .get('/api/export/excel/daily?date=2026-11-13&category=IPUC_CET&subject=Physics');

      expect(res.status).toBe(200);
      expect(res.header['content-type']).toContain('spreadsheetml');
      expect(res.body).toBeDefined();
    });
  });
});
