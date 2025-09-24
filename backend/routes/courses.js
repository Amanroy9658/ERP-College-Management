const express = require('express');
const { body, validationResult } = require('express-validator');
const Course = require('../models/Course');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/courses
// @desc    Get all courses
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      department,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (search) {
      filter.$or = [
        { courseName: { $regex: search, $options: 'i' } },
        { courseCode: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (department) filter.department = department;
    if (status) filter.status = status;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const courses = await Course.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Course.countDocuments(filter);

    res.json({
      status: 'success',
      data: {
        courses,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Courses fetch error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error fetching courses'
    });
  }
});

// @route   GET /api/courses/:id
// @desc    Get course by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }

    res.json({
      status: 'success',
      data: { course }
    });

  } catch (error) {
    console.error('Course fetch error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error fetching course'
    });
  }
});

// @route   POST /api/courses
// @desc    Create new course
// @access  Private
router.post('/', auth, [
  body('courseCode').notEmpty().withMessage('Course code is required'),
  body('courseName').notEmpty().withMessage('Course name is required'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
  body('totalSemesters').isInt({ min: 1, max: 8 }).withMessage('Total semesters must be between 1 and 8'),
  body('department').notEmpty().withMessage('Department is required'),
  body('credits').isInt({ min: 1 }).withMessage('Credits must be a positive integer'),
  body('feeStructure.tuitionFee').isNumeric().withMessage('Tuition fee must be a number'),
  body('feeStructure.semesterFee').isNumeric().withMessage('Semester fee must be a number'),
  body('feeStructure.examinationFee').isNumeric().withMessage('Examination fee must be a number')
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
      courseCode,
      courseName,
      description,
      duration,
      totalSemesters,
      department,
      credits,
      feeStructure,
      eligibility
    } = req.body;

    // Check if course code already exists
    const existingCourse = await Course.findOne({ courseCode });
    if (existingCourse) {
      return res.status(400).json({
        status: 'error',
        message: 'Course with this code already exists'
      });
    }

    const course = new Course({
      courseCode,
      courseName,
      description,
      duration,
      totalSemesters,
      department,
      credits,
      feeStructure,
      eligibility
    });

    await course.save();

    res.status(201).json({
      status: 'success',
      message: 'Course created successfully',
      data: { course }
    });

  } catch (error) {
    console.error('Course creation error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error creating course'
    });
  }
});

// @route   PUT /api/courses/:id
// @desc    Update course
// @access  Private
router.put('/:id', auth, [
  body('courseName').optional().notEmpty().withMessage('Course name cannot be empty'),
  body('duration').optional().isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
  body('totalSemesters').optional().isInt({ min: 1, max: 8 }).withMessage('Total semesters must be between 1 and 8'),
  body('department').optional().notEmpty().withMessage('Department cannot be empty'),
  body('credits').optional().isInt({ min: 1 }).withMessage('Credits must be a positive integer')
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
      'courseName', 'description', 'duration', 'totalSemesters',
      'department', 'credits', 'feeStructure', 'eligibility', 'status'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Course updated successfully',
      data: { course }
    });

  } catch (error) {
    console.error('Course update error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error updating course'
    });
  }
});

// @route   DELETE /api/courses/:id
// @desc    Delete course
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }

    // Check if course has students enrolled
    const Student = require('../models/Student');
    const enrolledStudents = await Student.countDocuments({ course: req.params.id });
    
    if (enrolledStudents > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot delete course with enrolled students'
      });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.json({
      status: 'success',
      message: 'Course deleted successfully'
    });

  } catch (error) {
    console.error('Course deletion error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error deleting course'
    });
  }
});

// @route   GET /api/courses/departments/list
// @desc    Get list of departments
// @access  Private
router.get('/departments/list', auth, async (req, res) => {
  try {
    const departments = await Course.distinct('department');
    
    res.json({
      status: 'success',
      data: { departments }
    });

  } catch (error) {
    console.error('Departments fetch error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error fetching departments'
    });
  }
});

// @route   GET /api/courses/stats/overview
// @desc    Get course statistics overview
// @access  Private
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments();
    const activeCourses = await Course.countDocuments({ status: 'Active' });
    const inactiveCourses = await Course.countDocuments({ status: 'Inactive' });

    // Courses by department
    const coursesByDepartment = await Course.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Students enrolled per course
    const Student = require('../models/Student');
    const studentsPerCourse = await Student.aggregate([
      { $group: { _id: '$course', count: { $sum: 1 } } },
      { $lookup: { from: 'courses', localField: '_id', foreignField: '_id', as: 'course' } },
      { $unwind: '$course' },
      { $project: { courseName: '$course.courseName', courseCode: '$course.courseCode', count: 1 } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      status: 'success',
      data: {
        overview: {
          totalCourses,
          activeCourses,
          inactiveCourses
        },
        coursesByDepartment,
        studentsPerCourse
      }
    });

  } catch (error) {
    console.error('Course stats fetch error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error fetching course statistics'
    });
  }
});

module.exports = router;
