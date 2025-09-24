const express = require('express');
const { body, validationResult } = require('express-validator');
const Student = require('../models/Student');
const Course = require('../models/Course');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/students
// @desc    Get all students with filtering and pagination
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      course,
      semester,
      status,
      admissionStatus,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (course) filter.course = course;
    if (semester) filter.semester = parseInt(semester);
    if (status) filter.status = status;
    if (admissionStatus) filter.admissionStatus = admissionStatus;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const students = await Student.find(filter)
      .populate('course', 'courseName courseCode department')
      .select('-password')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Student.countDocuments(filter);

    res.json({
      status: 'success',
      data: {
        students,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Students fetch error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error fetching students'
    });
  }
});

// @route   GET /api/students/:id
// @desc    Get student by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('course', 'courseName courseCode department duration totalSemesters')
      .select('-password');

    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found'
      });
    }

    res.json({
      status: 'success',
      data: { student }
    });

  } catch (error) {
    console.error('Student fetch error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error fetching student'
    });
  }
});

// @route   PUT /api/students/:id/status
// @desc    Update student status
// @access  Private
router.put('/:id/status', auth, [
  body('status').isIn(['Active', 'Inactive', 'Suspended', 'Graduated']).withMessage('Invalid status'),
  body('admissionStatus').optional().isIn(['Pending', 'Approved', 'Rejected', 'Withdrawn']).withMessage('Invalid admission status')
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

    const { status, admissionStatus } = req.body;
    const updates = {};

    if (status) updates.status = status;
    if (admissionStatus) updates.admissionStatus = admissionStatus;

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Student status updated successfully',
      data: { student }
    });

  } catch (error) {
    console.error('Student status update error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error updating student status'
    });
  }
});

// @route   PUT /api/students/:id/academic
// @desc    Update student academic information
// @access  Private
router.put('/:id/academic', auth, [
  body('course').optional().notEmpty().withMessage('Course cannot be empty'),
  body('semester').optional().isInt({ min: 1, max: 8 }).withMessage('Semester must be between 1 and 8'),
  body('academicYear').optional().notEmpty().withMessage('Academic year cannot be empty')
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

    const { course, semester, academicYear } = req.body;
    const updates = {};

    if (course) {
      // Verify course exists
      const courseExists = await Course.findById(course);
      if (!courseExists) {
        return res.status(400).json({
          status: 'error',
          message: 'Course not found'
        });
      }
      updates.course = course;
    }
    
    if (semester) updates.semester = semester;
    if (academicYear) updates.academicYear = academicYear;

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('course', 'courseName courseCode department').select('-password');

    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Academic information updated successfully',
      data: { student }
    });

  } catch (error) {
    console.error('Academic update error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error updating academic information'
    });
  }
});

// @route   GET /api/students/:id/documents
// @desc    Get student documents
// @access  Private
router.get('/:id/documents', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('documents');
    
    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found'
      });
    }

    res.json({
      status: 'success',
      data: { documents: student.documents }
    });

  } catch (error) {
    console.error('Documents fetch error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error fetching documents'
    });
  }
});

// @route   POST /api/students/:id/documents
// @desc    Upload student document
// @access  Private
router.post('/:id/documents', auth, async (req, res) => {
  try {
    const { type, url } = req.body;

    if (!type || !url) {
      return res.status(400).json({
        status: 'error',
        message: 'Document type and URL are required'
      });
    }

    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found'
      });
    }

    const document = {
      type,
      url,
      uploadedAt: new Date()
    };

    student.documents.push(document);
    await student.save();

    res.json({
      status: 'success',
      message: 'Document uploaded successfully',
      data: { document }
    });

  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error uploading document'
    });
  }
});

// @route   GET /api/students/stats/overview
// @desc    Get student statistics overview
// @access  Private
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const activeStudents = await Student.countDocuments({ status: 'Active' });
    const pendingAdmissions = await Student.countDocuments({ admissionStatus: 'Pending' });
    const approvedAdmissions = await Student.countDocuments({ admissionStatus: 'Approved' });

    // Students by course
    const studentsByCourse = await Student.aggregate([
      { $group: { _id: '$course', count: { $sum: 1 } } },
      { $lookup: { from: 'courses', localField: '_id', foreignField: '_id', as: 'course' } },
      { $unwind: '$course' },
      { $project: { courseName: '$course.courseName', count: 1 } }
    ]);

    // Students by semester
    const studentsBySemester = await Student.aggregate([
      { $group: { _id: '$semester', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      status: 'success',
      data: {
        overview: {
          totalStudents,
          activeStudents,
          pendingAdmissions,
          approvedAdmissions
        },
        studentsByCourse,
        studentsBySemester
      }
    });

  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error fetching statistics'
    });
  }
});

module.exports = router;
