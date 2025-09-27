const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Course = require('../models/Course');
const Student = require('../models/Student');
const auth = require('../middleware/auth');
const emailService = require('../services/emailService');
const smsService = require('../services/smsService');

const router = express.Router();

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user (any role)
// @access  Public
router.post('/register', [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['student', 'teacher', 'staff', 'librarian', 'warden', 'accountant', 'registrar']).withMessage('Invalid role'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      role,
      roleSpecificInfo
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User with this email already exists'
      });
    }

    // Create user object
    const userData = {
      firstName,
      lastName,
      email,
      phone,
      password,
      role,
      status: 'pending'
    };

    // Add role-specific information
    if (role === 'student' && roleSpecificInfo) {
      userData.studentInfo = {
        course: roleSpecificInfo.course,
        semester: roleSpecificInfo.semester,
        academicYear: roleSpecificInfo.academicYear,
        guardian: roleSpecificInfo.guardian
      };
    } else if (role === 'teacher' && roleSpecificInfo) {
      userData.teacherInfo = {
        department: roleSpecificInfo.department,
        designation: roleSpecificInfo.designation,
        qualification: roleSpecificInfo.qualification,
        subjects: roleSpecificInfo.subjects
      };
    } else if (role === 'staff' && roleSpecificInfo) {
      userData.staffInfo = {
        department: roleSpecificInfo.department,
        designation: roleSpecificInfo.designation
      };
    } else if (role === 'librarian' && roleSpecificInfo) {
      userData.librarianInfo = {
        specialization: roleSpecificInfo.specialization
      };
    } else if (role === 'warden' && roleSpecificInfo) {
      userData.wardenInfo = {
        hostelAssigned: roleSpecificInfo.hostelAssigned
      };
    }

    // Generate unique ID for students
    if (role === 'student') {
      const studentCount = await User.countDocuments({ role: 'student' });
      userData.studentInfo = {
        ...userData.studentInfo,
        studentId: `STU${String(studentCount + 1).padStart(3, '0')}`,
        rollNumber: `R${String(studentCount + 1).padStart(4, '0')}`,
        admissionDate: new Date()
      };
    }

    // Create new user
    const user = new User(userData);
    await user.save();

    // Create notification for admin
    try {
      const Notification = require('../models/Notification');
      const adminUsers = await User.find({ role: 'admin', status: 'approved' });
      
      for (const admin of adminUsers) {
        await Notification.create({
          recipient: admin._id,
          type: 'info',
          title: 'New User Registration',
          message: `${user.firstName} ${user.lastName} (${user.role}) has registered and is pending approval.`,
          actionUrl: '/admin/dashboard?tab=pending'
        });
      }
    } catch (notificationError) {
      console.error('Error creating notification:', notificationError);
      // Don't fail registration if notification creation fails
    }

    // Send welcome email and SMS
    try {
      await emailService.sendWelcomeEmail(user);
      await smsService.sendWelcomeSMS(user);
    } catch (emailSmsError) {
      console.error('Error sending welcome email/SMS:', emailSmsError);
      // Don't fail registration if email/SMS fails
    }

    res.status(201).json({
      status: 'success',
      message: 'Registration successful! Your account is pending approval from admin.',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          status: user.status
        }
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'User with this email already exists'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Server error during registration',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user (any role)
// @access  Public
router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({
        status: 'error',
        message: 'Account temporarily locked due to too many failed login attempts'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      await user.incLoginAttempts();
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Check if account is approved
    if (user.status !== 'approved') {
      return res.status(403).json({
        status: 'error',
        message: `Account is ${user.status}. Please wait for admin approval.`,
        data: { status: user.status }
      });
    }

    // Reset login attempts and update last login
    await user.resetLoginAttempts();
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role);

    res.json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          status: user.status,
          ...(user.role === 'student' && user.studentInfo && {
            studentId: user.studentInfo.studentId,
            rollNumber: user.studentInfo.rollNumber
          }),
          ...(user.role === 'teacher' && user.teacherInfo && {
            employeeId: user.teacherInfo.employeeId,
            department: user.teacherInfo.department
          })
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during login'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('studentInfo.course', 'courseName courseCode department')
      .select('-password');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.json({
      status: 'success',
      data: { user }
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error fetching profile'
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, [
  body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
  body('phone').optional().notEmpty().withMessage('Phone number cannot be empty'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const allowedUpdates = [
      'firstName', 'lastName', 'phone', 'profilePicture'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Profile updated successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error updating profile'
    });
  }
});

// @route   POST /api/auth/change-password
// @desc    Change user password
// @access  Private
router.post('/change-password', auth, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Check current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        status: 'error',
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      status: 'success',
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error changing password'
    });
  }
});

module.exports = router;
