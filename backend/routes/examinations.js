const express = require('express');
const { body, validationResult } = require('express-validator');
const { Subject, Exam, Result, SemesterResult } = require('../models/Examination');
const Student = require('../models/Student');
const Course = require('../models/Course');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/examinations/subjects
// @desc    Get all subjects
// @access  Private
router.get('/subjects', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      course,
      semester,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (search) {
      filter.$or = [
        { subjectName: { $regex: search, $options: 'i' } },
        { subjectCode: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (course) filter.course = course;
    if (semester) filter.semester = parseInt(semester);
    if (status) filter.status = status;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const subjects = await Subject.find(filter)
      .populate('course', 'courseName courseCode department')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Subject.countDocuments(filter);

    res.json({
      status: 'success',
      data: {
        subjects,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Subjects fetch error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error fetching subjects'
    });
  }
});

// @route   POST /api/examinations/subjects
// @desc    Create new subject
// @access  Private
router.post('/subjects', auth, [
  body('subjectCode').notEmpty().withMessage('Subject code is required'),
  body('subjectName').notEmpty().withMessage('Subject name is required'),
  body('course').notEmpty().withMessage('Course is required'),
  body('semester').isInt({ min: 1, max: 8 }).withMessage('Semester must be between 1 and 8'),
  body('credits').isInt({ min: 1 }).withMessage('Credits must be a positive integer'),
  body('theoryMarks').isInt({ min: 1 }).withMessage('Theory marks must be a positive integer'),
  body('totalMarks').isInt({ min: 1 }).withMessage('Total marks must be a positive integer')
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
      subjectCode,
      subjectName,
      course,
      semester,
      credits,
      theoryMarks,
      practicalMarks,
      internalMarks,
      totalMarks
    } = req.body;

    // Check if subject code already exists
    const existingSubject = await Subject.findOne({ subjectCode });
    if (existingSubject) {
      return res.status(400).json({
        status: 'error',
        message: 'Subject with this code already exists'
      });
    }

    // Verify course exists
    const courseExists = await Course.findById(course);
    if (!courseExists) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }

    const subject = new Subject({
      subjectCode,
      subjectName,
      course,
      semester,
      credits,
      theoryMarks,
      practicalMarks: practicalMarks || 0,
      internalMarks: internalMarks || 0,
      totalMarks
    });

    await subject.save();

    const populatedSubject = await Subject.findById(subject._id)
      .populate('course', 'courseName courseCode department');

    res.status(201).json({
      status: 'success',
      message: 'Subject created successfully',
      data: { subject: populatedSubject }
    });

  } catch (error) {
    console.error('Subject creation error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error creating subject'
    });
  }
});

// @route   GET /api/examinations/exams
// @desc    Get all exams
// @access  Private
router.get('/exams', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      course,
      semester,
      examType,
      status,
      sortBy = 'examDate',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (search) {
      filter.examName = { $regex: search, $options: 'i' };
    }
    
    if (course) filter.course = course;
    if (semester) filter.semester = parseInt(semester);
    if (examType) filter.examType = examType;
    if (status) filter.status = status;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const exams = await Exam.find(filter)
      .populate('course', 'courseName courseCode department')
      .populate('subjects', 'subjectName subjectCode')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Exam.countDocuments(filter);

    res.json({
      status: 'success',
      data: {
        exams,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Exams fetch error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error fetching exams'
    });
  }
});

// @route   POST /api/examinations/exams
// @desc    Create new exam
// @access  Private
router.post('/exams', auth, [
  body('examName').notEmpty().withMessage('Exam name is required'),
  body('examType').isIn(['Midterm', 'Final', 'Internal', 'Assignment', 'Quiz', 'Practical']).withMessage('Invalid exam type'),
  body('academicYear').notEmpty().withMessage('Academic year is required'),
  body('semester').isInt({ min: 1, max: 8 }).withMessage('Semester must be between 1 and 8'),
  body('course').notEmpty().withMessage('Course is required'),
  body('examDate').notEmpty().withMessage('Exam date is required'),
  body('examDuration').isInt({ min: 1 }).withMessage('Exam duration must be a positive integer')
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
      examName,
      examType,
      academicYear,
      semester,
      course,
      subjects,
      examDate,
      endDate,
      examDuration,
      venue,
      instructions
    } = req.body;

    // Verify course exists
    const courseExists = await Course.findById(course);
    if (!courseExists) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }

    // Verify subjects exist
    if (subjects && subjects.length > 0) {
      const subjectsExist = await Subject.find({ _id: { $in: subjects } });
      if (subjectsExist.length !== subjects.length) {
        return res.status(400).json({
          status: 'error',
          message: 'One or more subjects not found'
        });
      }
    }

    const exam = new Exam({
      examName,
      examType,
      academicYear,
      semester,
      course,
      subjects: subjects || [],
      examDate: new Date(examDate),
      endDate: endDate ? new Date(endDate) : null,
      examDuration,
      venue,
      instructions: instructions || []
    });

    await exam.save();

    const populatedExam = await Exam.findById(exam._id)
      .populate('course', 'courseName courseCode department')
      .populate('subjects', 'subjectName subjectCode');

    res.status(201).json({
      status: 'success',
      message: 'Exam created successfully',
      data: { exam: populatedExam }
    });

  } catch (error) {
    console.error('Exam creation error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error creating exam'
    });
  }
});

// @route   GET /api/examinations/results
// @desc    Get exam results
// @access  Private
router.get('/results', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      student,
      exam,
      subject,
      academicYear,
      semester,
      status,
      sortBy = 'resultDate',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (student) filter.student = student;
    if (exam) filter.exam = exam;
    if (subject) filter.subject = subject;
    if (academicYear) filter.academicYear = academicYear;
    if (semester) filter.semester = parseInt(semester);
    if (status) filter.status = status;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const results = await Result.find(filter)
      .populate('student', 'studentId firstName lastName email')
      .populate('exam', 'examName examType examDate')
      .populate('subject', 'subjectName subjectCode')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Result.countDocuments(filter);

    res.json({
      status: 'success',
      data: {
        results,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Results fetch error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error fetching results'
    });
  }
});

// @route   POST /api/examinations/results
// @desc    Create/Update exam result
// @access  Private
router.post('/results', auth, [
  body('student').notEmpty().withMessage('Student ID is required'),
  body('exam').notEmpty().withMessage('Exam ID is required'),
  body('subject').notEmpty().withMessage('Subject ID is required'),
  body('theoryMarks.obtained').isNumeric().withMessage('Theory marks obtained must be a number'),
  body('theoryMarks.total').isNumeric().withMessage('Theory marks total must be a number')
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
      student,
      exam,
      subject,
      theoryMarks,
      practicalMarks,
      internalMarks,
      attendance,
      remarks
    } = req.body;

    // Check if student exists
    const studentExists = await Student.findById(student);
    if (!studentExists) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found'
      });
    }

    // Check if exam exists
    const examExists = await Exam.findById(exam);
    if (!examExists) {
      return res.status(404).json({
        status: 'error',
        message: 'Exam not found'
      });
    }

    // Check if subject exists
    const subjectExists = await Subject.findById(subject);
    if (!subjectExists) {
      return res.status(404).json({
        status: 'error',
        message: 'Subject not found'
      });
    }

    // Check if result already exists
    let result = await Result.findOne({ student, exam, subject });
    
    if (result) {
      // Update existing result
      result.theoryMarks = theoryMarks || result.theoryMarks;
      result.practicalMarks = practicalMarks || result.practicalMarks;
      result.internalMarks = internalMarks || result.internalMarks;
      result.attendance = attendance || result.attendance;
      result.remarks = remarks || result.remarks;
      result.resultDate = new Date();
    } else {
      // Create new result
      result = new Result({
        student,
        exam,
        subject,
        theoryMarks: theoryMarks || { obtained: 0, total: 0 },
        practicalMarks: practicalMarks || { obtained: 0, total: 0 },
        internalMarks: internalMarks || { obtained: 0, total: 0 },
        attendance: attendance || 0,
        remarks
      });
    }

    await result.save();

    const populatedResult = await Result.findById(result._id)
      .populate('student', 'studentId firstName lastName email')
      .populate('exam', 'examName examType examDate')
      .populate('subject', 'subjectName subjectCode');

    res.status(201).json({
      status: 'success',
      message: 'Result saved successfully',
      data: { result: populatedResult }
    });

  } catch (error) {
    console.error('Result creation error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error saving result'
    });
  }
});

// @route   GET /api/examinations/semester-results/:studentId
// @desc    Get semester results for a student
// @access  Private
router.get('/semester-results/:studentId', auth, async (req, res) => {
  try {
    const { academicYear, semester } = req.query;
    
    const filter = { student: req.params.studentId };
    if (academicYear) filter.academicYear = academicYear;
    if (semester) filter.semester = parseInt(semester);

    const semesterResults = await SemesterResult.find(filter)
      .populate('course', 'courseName courseCode department')
      .populate('results')
      .sort({ academicYear: -1, semester: -1 });

    res.json({
      status: 'success',
      data: { semesterResults }
    });

  } catch (error) {
    console.error('Semester results fetch error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error fetching semester results'
    });
  }
});

// @route   GET /api/examinations/stats/overview
// @desc    Get examination statistics overview
// @access  Private
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const totalSubjects = await Subject.countDocuments();
    const activeSubjects = await Subject.countDocuments({ status: 'Active' });
    const totalExams = await Exam.countDocuments();
    const scheduledExams = await Exam.countDocuments({ status: 'Scheduled' });
    const completedExams = await Exam.countDocuments({ status: 'Completed' });
    const totalResults = await Result.countDocuments();

    // Results by status
    const resultsByStatus = await Result.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Results by grade
    const resultsByGrade = await Result.aggregate([
      { $group: { _id: '$grade', count: { $sum: 1 } } }
    ]);

    // Average performance by course
    const avgPerformanceByCourse = await Result.aggregate([
      {
        $lookup: {
          from: 'students',
          localField: 'student',
          foreignField: '_id',
          as: 'student'
        }
      },
      { $unwind: '$student' },
      {
        $group: {
          _id: '$student.course',
          avgGradePoints: { $avg: '$gradePoints' },
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: '_id',
          as: 'course'
        }
      },
      { $unwind: '$course' },
      { $project: { courseName: '$course.courseName', avgGradePoints: 1, count: 1 } }
    ]);

    res.json({
      status: 'success',
      data: {
        overview: {
          totalSubjects,
          activeSubjects,
          totalExams,
          scheduledExams,
          completedExams,
          totalResults
        },
        resultsByStatus,
        resultsByGrade,
        avgPerformanceByCourse
      }
    });

  } catch (error) {
    console.error('Examination stats fetch error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error fetching examination statistics'
    });
  }
});

module.exports = router;
