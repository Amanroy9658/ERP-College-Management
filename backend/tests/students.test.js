const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Course = require('../models/Course');

describe('Student Routes', () => {
  let authToken;
  let testCourse;

  beforeEach(async () => {
    // Clean up database
    await User.deleteMany({});
    await Course.deleteMany({});

    // Create test course
    testCourse = new Course({
      courseName: 'Computer Science',
      courseCode: 'CS101',
      department: 'Computer Science',
      duration: 4,
      status: 'active'
    });
    await testCourse.save();

    // Create admin user
    const admin = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@test.com',
      password: 'password123',
      phone: '1234567890',
      role: 'admin',
      status: 'approved'
    });
    await admin.save();

    // Login to get token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'password123'
      });

    authToken = loginResponse.body.data.token;
  });

  describe('GET /api/students', () => {
    it('should get all students with authentication', async () => {
      const response = await request(app)
        .get('/api/students')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('students');
      expect(response.body.data).toHaveProperty('pagination');
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/students')
        .expect(401);

      expect(response.body.status).toBe('error');
    });
  });

  describe('GET /api/students/:id', () => {
    it('should get student by ID', async () => {
      // Create a test student
      const student = new User({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        password: 'password123',
        phone: '1234567890',
        role: 'student',
        status: 'approved',
        studentInfo: {
          course: testCourse._id,
          semester: 1,
          academicYear: '2024-25'
        }
      });
      await student.save();

      const response = await request(app)
        .get(`/api/students/${student._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.student.email).toBe('john.doe@test.com');
    });

    it('should return 404 for non-existent student', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/students/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.status).toBe('error');
    });
  });
});
