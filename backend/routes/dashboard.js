const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Student = require('../models/Student');
const Course = require('../models/Course');
const Fee = require('../models/Fee');
const Hostel = require('../models/Hostel');
const Examination = require('../models/Examination');
const auth = require('../middleware/auth');

// Get general dashboard statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const userRole = req.user.role;
    
    let stats = {};

    if (userRole === 'admin') {
      // Admin dashboard stats
      const [
        totalUsers,
        totalStudents,
        totalTeachers,
        totalStaff,
        pendingApprovals,
        totalCourses,
        totalHostels,
        totalExaminations
      ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: 'student', status: 'approved' }),
        User.countDocuments({ role: 'teacher', status: 'approved' }),
        User.countDocuments({ role: { $in: ['staff', 'librarian', 'warden', 'accountant', 'registrar'] }, status: 'approved' }),
        User.countDocuments({ status: 'pending' }),
        Course.countDocuments(),
        Hostel.countDocuments(),
        Examination.countDocuments()
      ]);

      stats = {
        totalUsers,
        totalStudents,
        totalTeachers,
        totalStaff,
        pendingApprovals,
        totalCourses,
        totalHostels,
        totalExaminations
      };
    } else if (userRole === 'student') {
      // Student dashboard stats
      const student = await User.findById(req.user._id).populate('roleSpecificInfo.studentInfo.course');
      
      if (!student || !student.roleSpecificInfo?.studentInfo) {
        return res.status(404).json({
          status: 'error',
          message: 'Student information not found'
        });
      }

      const studentId = student.roleSpecificInfo.studentInfo.studentId;
      
      const [
        upcomingExams,
        completedExams,
        pendingFees,
        paidFees,
        hostelAllocation
      ] = await Promise.all([
        Examination.countDocuments({ 
          'students.studentId': studentId,
          examDate: { $gte: new Date() }
        }),
        Examination.countDocuments({ 
          'students.studentId': studentId,
          examDate: { $lt: new Date() }
        }),
        Fee.countDocuments({ 
          studentId: studentId,
          status: 'pending'
        }),
        Fee.countDocuments({ 
          studentId: studentId,
          status: 'paid'
        }),
        Hostel.findOne({ 'allocations.studentId': studentId })
      ]);

      stats = {
        upcomingExams,
        completedExams,
        pendingFees,
        paidFees,
        hostelAllocated: !!hostelAllocation,
        course: student.roleSpecificInfo.studentInfo.course?.courseName || 'N/A',
        semester: student.roleSpecificInfo.studentInfo.semester || 0
      };
    } else if (userRole === 'teacher') {
      // Teacher dashboard stats
      const [
        assignedCourses,
        upcomingClasses,
        totalStudents,
        pendingEvaluations
      ] = await Promise.all([
        Course.countDocuments({ 'instructors': req.user._id }),
        Examination.countDocuments({ 
          'instructor': req.user._id,
          examDate: { $gte: new Date() }
        }),
        Student.countDocuments({ 'course': { $exists: true } }),
        Examination.countDocuments({ 
          'instructor': req.user._id,
          status: 'pending'
        })
      ]);

      stats = {
        assignedCourses,
        upcomingClasses,
        totalStudents,
        pendingEvaluations
      };
    } else {
      // Other roles (staff, librarian, warden, etc.)
      const [
        totalStudents,
        totalTeachers,
        totalStaff,
        pendingTasks
      ] = await Promise.all([
        User.countDocuments({ role: 'student', status: 'approved' }),
        User.countDocuments({ role: 'teacher', status: 'approved' }),
        User.countDocuments({ role: { $in: ['staff', 'librarian', 'warden', 'accountant', 'registrar'] }, status: 'approved' }),
        User.countDocuments({ status: 'pending' })
      ]);

      stats = {
        totalStudents,
        totalTeachers,
        totalStaff,
        pendingTasks
      };
    }

    res.json({
      status: 'success',
      message: 'Dashboard statistics fetched successfully',
      data: stats
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching dashboard statistics'
    });
  }
});

// Get recent activities
router.get('/activities', auth, async (req, res) => {
  try {
    const userRole = req.user.role;
    let activities = [];

    if (userRole === 'admin') {
      // Get recent user registrations
      const recentUsers = await User.find({ status: 'pending' })
        .populate('roleSpecificInfo.studentInfo.course')
        .sort({ createdAt: -1 })
        .limit(10);

      activities = recentUsers.map(user => ({
        type: 'user_registration',
        title: 'New User Registration',
        description: `${user.firstName} ${user.lastName} registered as ${user.role}`,
        timestamp: user.createdAt,
        user: {
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role
        }
      }));
    } else if (userRole === 'student') {
      // Get student-specific activities
      const student = await User.findById(req.user._id);
      if (student?.roleSpecificInfo?.studentInfo) {
        const studentId = student.roleSpecificInfo.studentInfo.studentId;
        
        const [recentExams, recentFees] = await Promise.all([
          Examination.find({ 'students.studentId': studentId })
            .sort({ examDate: -1 })
            .limit(5),
          Fee.find({ studentId: studentId })
            .sort({ dueDate: -1 })
            .limit(5)
        ]);

        activities = [
          ...recentExams.map(exam => ({
            type: 'exam',
            title: 'Exam Scheduled',
            description: `${exam.examName} - ${exam.subject}`,
            timestamp: exam.examDate,
            exam: {
              id: exam._id,
              name: exam.examName,
              subject: exam.subject,
              date: exam.examDate
            }
          })),
          ...recentFees.map(fee => ({
            type: 'fee',
            title: 'Fee Due',
            description: `${fee.feeType} - ₹${fee.amount}`,
            timestamp: fee.dueDate,
            fee: {
              id: fee._id,
              type: fee.feeType,
              amount: fee.amount,
              status: fee.status
            }
          }))
        ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);
      }
    }

    res.json({
      status: 'success',
      message: 'Recent activities fetched successfully',
      data: activities
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching activities'
    });
  }
});

// Get notifications
router.get('/notifications', auth, async (req, res) => {
  try {
    const userRole = req.user.role;
    let notifications = [];

    if (userRole === 'admin') {
      const pendingCount = await User.countDocuments({ status: 'pending' });
      if (pendingCount > 0) {
        notifications.push({
          id: 'pending_approvals',
          type: 'warning',
          title: 'Pending Approvals',
          message: `${pendingCount} users are waiting for approval`,
          timestamp: new Date(),
          action: '/admin/dashboard'
        });
      }
    } else if (userRole === 'student') {
      const student = await User.findById(req.user._id);
      if (student?.roleSpecificInfo?.studentInfo) {
        const studentId = student.roleSpecificInfo.studentInfo.studentId;
        
        const [upcomingExams, overdueFees] = await Promise.all([
          Examination.find({ 
            'students.studentId': studentId,
            examDate: { $gte: new Date(), $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
          }),
          Fee.find({ 
            studentId: studentId,
            status: 'pending',
            dueDate: { $lt: new Date() }
          })
        ]);

        if (upcomingExams.length > 0) {
          notifications.push({
            id: 'upcoming_exams',
            type: 'info',
            title: 'Upcoming Exams',
            message: `${upcomingExams.length} exams scheduled this week`,
            timestamp: new Date(),
            action: '/student/exams'
          });
        }

        if (overdueFees.length > 0) {
          notifications.push({
            id: 'overdue_fees',
            type: 'error',
            title: 'Overdue Fees',
            message: `${overdueFees.length} fees are overdue`,
            timestamp: new Date(),
            action: '/student/fees'
          });
        }
      }
    }

    res.json({
      status: 'success',
      message: 'Notifications fetched successfully',
      data: notifications
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching notifications'
    });
  }
});

module.exports = router;