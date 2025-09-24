const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Student = require('./models/Student');
const Course = require('./models/Course');
const Fee = require('./models/Fee');

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Create courses
    const courses = await Course.insertMany([
      {
        courseName: 'Computer Science Engineering',
        courseCode: 'CSE',
        department: 'Computer Science',
        duration: 4,
        totalSemesters: 8,
        description: 'Bachelor of Technology in Computer Science Engineering'
      },
      {
        courseName: 'Business Administration',
        courseCode: 'BBA',
        department: 'Management',
        duration: 3,
        totalSemesters: 6,
        description: 'Bachelor of Business Administration'
      },
      {
        courseName: 'Mechanical Engineering',
        courseCode: 'ME',
        department: 'Mechanical',
        duration: 4,
        totalSemesters: 8,
        description: 'Bachelor of Technology in Mechanical Engineering'
      }
    ]);

    console.log('✅ Courses created');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@college.edu',
      phone: '+91 9876543210',
      password: adminPassword,
      role: 'admin',
      status: 'approved'
    });

    console.log('✅ Admin user created');

    // Create demo students
    const studentPassword = await bcrypt.hash('student123', 10);
    const students = await User.insertMany([
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@student.edu',
        phone: '+91 9876543211',
        password: studentPassword,
        role: 'student',
        status: 'approved',
        studentInfo: {
          studentId: 'STU001',
          rollNumber: '2024CSE001',
          course: courses[0]._id,
          semester: 3,
          academicYear: '2024-25',
          admissionDate: new Date('2024-07-01'),
          guardian: {
            name: 'Robert Doe',
            relationship: 'Father',
            phone: '+91 9876543212',
            email: 'robert.doe@email.com'
          }
        }
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@student.edu',
        phone: '+91 9876543213',
        password: studentPassword,
        role: 'student',
        status: 'approved',
        studentInfo: {
          studentId: 'STU002',
          rollNumber: '2024BBA001',
          course: courses[1]._id,
          semester: 2,
          academicYear: '2024-25',
          admissionDate: new Date('2024-07-01'),
          guardian: {
            name: 'Mary Smith',
            relationship: 'Mother',
            phone: '+91 9876543214',
            email: 'mary.smith@email.com'
          }
        }
      },
      {
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.johnson@student.edu',
        phone: '+91 9876543215',
        password: studentPassword,
        role: 'student',
        status: 'approved',
        studentInfo: {
          studentId: 'STU003',
          rollNumber: '2024ME001',
          course: courses[2]._id,
          semester: 4,
          academicYear: '2024-25',
          admissionDate: new Date('2024-07-01'),
          guardian: {
            name: 'David Johnson',
            relationship: 'Father',
            phone: '+91 9876543216',
            email: 'david.johnson@email.com'
          }
        }
      }
    ]);

    console.log('✅ Student users created');

    // Create teacher
    const teacherPassword = await bcrypt.hash('teacher123', 10);
    const teacher = await User.create({
      firstName: 'Dr. Sarah',
      lastName: 'Wilson',
      email: 'sarah.wilson@faculty.edu',
      phone: '+91 9876543217',
      password: teacherPassword,
      role: 'teacher',
      status: 'approved',
      teacherInfo: {
        employeeId: 'TCH001',
        department: 'Computer Science',
        designation: 'Professor',
        qualification: 'Ph.D. in Computer Science',
        joiningDate: new Date('2020-01-01'),
        subjects: ['Data Structures', 'Algorithms', 'Database Management']
      }
    });

    console.log('✅ Teacher user created');

    // Create fee records
    const feeRecords = await Fee.insertMany([
      {
        student: students[0]._id,
        academicYear: '2024-25',
        semester: 3,
        fees: {
          tuitionFee: { amount: 50000, paid: 50000, due: 0, status: 'Paid' },
          semesterFee: { amount: 10000, paid: 10000, due: 0, status: 'Paid' },
          examinationFee: { amount: 5000, paid: 5000, due: 0, status: 'Paid' },
          libraryFee: { amount: 2000, paid: 2000, due: 0, status: 'Paid' },
          laboratoryFee: { amount: 3000, paid: 3000, due: 0, status: 'Paid' },
          hostelFee: { amount: 15000, paid: 15000, due: 0, status: 'Paid' },
          otherFees: []
        },
        totalAmount: 85000,
        totalPaid: 85000,
        totalDue: 0,
        overallStatus: 'Paid',
        dueDate: new Date('2024-08-15'),
        payments: [
          {
            amount: 85000,
            paymentDate: new Date('2024-08-10'),
            paymentMethod: 'Online',
            status: 'Success',
            paymentId: 'PAY001',
            receiptNumber: 'RCP001'
          }
        ]
      },
      {
        student: students[1]._id,
        academicYear: '2024-25',
        semester: 2,
        fees: {
          tuitionFee: { amount: 40000, paid: 25000, due: 15000, status: 'Partial' },
          semesterFee: { amount: 8000, paid: 8000, due: 0, status: 'Paid' },
          examinationFee: { amount: 4000, paid: 0, due: 4000, status: 'Pending' },
          libraryFee: { amount: 1500, paid: 1500, due: 0, status: 'Paid' },
          laboratoryFee: { amount: 2000, paid: 0, due: 2000, status: 'Pending' },
          hostelFee: { amount: 12000, paid: 0, due: 12000, status: 'Pending' },
          otherFees: []
        },
        totalAmount: 67500,
        totalPaid: 34500,
        totalDue: 33000,
        overallStatus: 'Partial',
        dueDate: new Date('2024-08-15'),
        payments: [
          {
            amount: 34500,
            paymentDate: new Date('2024-08-05'),
            paymentMethod: 'Bank Transfer',
            status: 'Success',
            paymentId: 'PAY002',
            receiptNumber: 'RCP002'
          }
        ]
      },
      {
        student: students[2]._id,
        academicYear: '2024-25',
        semester: 4,
        fees: {
          tuitionFee: { amount: 55000, paid: 0, due: 55000, status: 'Pending' },
          semesterFee: { amount: 12000, paid: 0, due: 12000, status: 'Pending' },
          examinationFee: { amount: 6000, paid: 0, due: 6000, status: 'Pending' },
          libraryFee: { amount: 2500, paid: 0, due: 2500, status: 'Pending' },
          laboratoryFee: { amount: 4000, paid: 0, due: 4000, status: 'Pending' },
          hostelFee: { amount: 18000, paid: 0, due: 18000, status: 'Pending' },
          otherFees: []
        },
        totalAmount: 95500,
        totalPaid: 0,
        totalDue: 95500,
        overallStatus: 'Overdue',
        dueDate: new Date('2024-07-15'),
        payments: []
      }
    ]);

    console.log('✅ Fee records created');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Demo Credentials:');
    console.log('Admin: admin@college.edu / admin123');
    console.log('Student: john.doe@student.edu / student123');
    console.log('Teacher: sarah.wilson@faculty.edu / teacher123');
    console.log('\n🔗 Access URLs:');
    console.log('Frontend: http://localhost:3001');
    console.log('Backend API: http://localhost:5000/api');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

module.exports = seedData;
