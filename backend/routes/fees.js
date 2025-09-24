const express = require('express');
const { body, validationResult } = require('express-validator');
const Fee = require('../models/Fee');
const Student = require('../models/Student');
const Course = require('../models/Course');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/fees
// @desc    Get all fee records with filtering
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      student,
      academicYear,
      semester,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (student) filter.student = student;
    if (academicYear) filter.academicYear = academicYear;
    if (semester) filter.semester = parseInt(semester);
    if (status) filter.overallStatus = status;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const fees = await Fee.find(filter)
      .populate('student', 'studentId firstName lastName email course semester')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Fee.countDocuments(filter);

    res.json({
      status: 'success',
      data: {
        fees,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Fees fetch error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error fetching fees'
    });
  }
});

// @route   GET /api/fees/student/:studentId
// @desc    Get fee records for a specific student
// @access  Private
router.get('/student/:studentId', auth, async (req, res) => {
  try {
    const { academicYear, semester } = req.query;
    
    const filter = { student: req.params.studentId };
    if (academicYear) filter.academicYear = academicYear;
    if (semester) filter.semester = parseInt(semester);

    const fees = await Fee.find(filter)
      .populate('student', 'studentId firstName lastName email course semester')
      .sort({ academicYear: -1, semester: -1 });

    res.json({
      status: 'success',
      data: { fees }
    });

  } catch (error) {
    console.error('Student fees fetch error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error fetching student fees'
    });
  }
});

// @route   POST /api/fees
// @desc    Create fee record for student
// @access  Private
router.post('/', auth, [
  body('student').notEmpty().withMessage('Student ID is required'),
  body('academicYear').notEmpty().withMessage('Academic year is required'),
  body('semester').isInt({ min: 1, max: 8 }).withMessage('Semester must be between 1 and 8'),
  body('fees.tuitionFee.amount').isNumeric().withMessage('Tuition fee amount must be a number'),
  body('fees.semesterFee.amount').isNumeric().withMessage('Semester fee amount must be a number'),
  body('fees.examinationFee.amount').isNumeric().withMessage('Examination fee amount must be a number')
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

    const { student, academicYear, semester, fees, dueDate } = req.body;

    // Check if student exists
    const studentExists = await Student.findById(student);
    if (!studentExists) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found'
      });
    }

    // Check if fee record already exists for this student, academic year, and semester
    const existingFee = await Fee.findOne({ student, academicYear, semester });
    if (existingFee) {
      return res.status(400).json({
        status: 'error',
        message: 'Fee record already exists for this student, academic year, and semester'
      });
    }

    const fee = new Fee({
      student,
      academicYear,
      semester,
      fees,
      dueDate: dueDate ? new Date(dueDate) : null
    });

    await fee.save();

    const populatedFee = await Fee.findById(fee._id)
      .populate('student', 'studentId firstName lastName email course semester');

    res.status(201).json({
      status: 'success',
      message: 'Fee record created successfully',
      data: { fee: populatedFee }
    });

  } catch (error) {
    console.error('Fee creation error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error creating fee record'
    });
  }
});

// @route   POST /api/fees/:id/payment
// @desc    Record payment for fee
// @access  Private
router.post('/:id/payment', auth, [
  body('amount').isNumeric().withMessage('Payment amount must be a number'),
  body('paymentMethod').isIn(['Cash', 'Cheque', 'Online', 'Bank Transfer']).withMessage('Invalid payment method'),
  body('transactionId').optional().notEmpty().withMessage('Transaction ID cannot be empty')
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
      amount,
      paymentMethod,
      transactionId,
      bankDetails,
      remarks
    } = req.body;

    const fee = await Fee.findById(req.params.id);
    if (!fee) {
      return res.status(404).json({
        status: 'error',
        message: 'Fee record not found'
      });
    }

    // Generate payment ID
    const paymentId = `PAY${Date.now().toString().slice(-8)}`;

    const payment = {
      paymentId,
      amount: parseFloat(amount),
      paymentMethod,
      paymentDate: new Date(),
      transactionId,
      bankDetails,
      receiptNumber: `RCP${Date.now().toString().slice(-6)}`,
      remarks
    };

    fee.payments.push(payment);

    // Update fee amounts
    const totalPaidAmount = fee.payments.reduce((sum, p) => sum + p.amount, 0);
    
    // Distribute payment across different fee types
    const remainingAmount = parseFloat(amount);
    let currentAmount = remainingAmount;

    // Pay tuition fee first
    if (currentAmount > 0 && fee.fees.tuitionFee.due > 0) {
      const tuitionPayment = Math.min(currentAmount, fee.fees.tuitionFee.due);
      fee.fees.tuitionFee.paid += tuitionPayment;
      fee.fees.tuitionFee.due -= tuitionPayment;
      currentAmount -= tuitionPayment;
    }

    // Pay semester fee
    if (currentAmount > 0 && fee.fees.semesterFee.due > 0) {
      const semesterPayment = Math.min(currentAmount, fee.fees.semesterFee.due);
      fee.fees.semesterFee.paid += semesterPayment;
      fee.fees.semesterFee.due -= semesterPayment;
      currentAmount -= semesterPayment;
    }

    // Pay examination fee
    if (currentAmount > 0 && fee.fees.examinationFee.due > 0) {
      const examPayment = Math.min(currentAmount, fee.fees.examinationFee.due);
      fee.fees.examinationFee.paid += examPayment;
      fee.fees.examinationFee.due -= examPayment;
      currentAmount -= examPayment;
    }

    // Pay other fees
    if (currentAmount > 0) {
      for (let otherFee of fee.fees.otherFees) {
        if (currentAmount > 0 && otherFee.due > 0) {
          const otherPayment = Math.min(currentAmount, otherFee.due);
          otherFee.paid += otherPayment;
          otherFee.due -= otherPayment;
          currentAmount -= otherPayment;
        }
      }
    }

    await fee.save();

    const populatedFee = await Fee.findById(fee._id)
      .populate('student', 'studentId firstName lastName email course semester');

    res.json({
      status: 'success',
      message: 'Payment recorded successfully',
      data: { 
        fee: populatedFee,
        payment: payment
      }
    });

  } catch (error) {
    console.error('Payment recording error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error recording payment'
    });
  }
});

// @route   GET /api/fees/stats/overview
// @desc    Get fee statistics overview
// @access  Private
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const totalFees = await Fee.countDocuments();
    const paidFees = await Fee.countDocuments({ overallStatus: 'Paid' });
    const pendingFees = await Fee.countDocuments({ overallStatus: 'Pending' });
    const overdueFees = await Fee.countDocuments({ overallStatus: 'Overdue' });

    // Total revenue
    const revenueStats = await Fee.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPaid' },
          totalExpected: { $sum: '$totalAmount' },
          totalDue: { $sum: '$totalDue' }
        }
      }
    ]);

    // Revenue by month
    const monthlyRevenue = await Fee.aggregate([
      { $unwind: '$payments' },
      {
        $group: {
          _id: {
            year: { $year: '$payments.paymentDate' },
            month: { $month: '$payments.paymentDate' }
          },
          revenue: { $sum: '$payments.amount' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    // Fees by status
    const feesByStatus = await Fee.aggregate([
      { $group: { _id: '$overallStatus', count: { $sum: 1 } } }
    ]);

    res.json({
      status: 'success',
      data: {
        overview: {
          totalFees,
          paidFees,
          pendingFees,
          overdueFees
        },
        revenue: revenueStats[0] || { totalRevenue: 0, totalExpected: 0, totalDue: 0 },
        monthlyRevenue,
        feesByStatus
      }
    });

  } catch (error) {
    console.error('Fee stats fetch error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error fetching fee statistics'
    });
  }
});

// @route   GET /api/fees/overdue
// @desc    Get overdue fee records
// @access  Private
router.get('/overdue', auth, async (req, res) => {
  try {
    const overdueFees = await Fee.find({
      overallStatus: 'Overdue',
      dueDate: { $lt: new Date() }
    })
    .populate('student', 'studentId firstName lastName email phone')
    .sort({ dueDate: 1 });

    res.json({
      status: 'success',
      data: { overdueFees }
    });

  } catch (error) {
    console.error('Overdue fees fetch error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error fetching overdue fees'
    });
  }
});

module.exports = router;
