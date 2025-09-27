const express = require('express');
const User = require('../models/User');
const Course = require('../models/Course');
const Fee = require('../models/Fee');
const Book = require('../models/Book');
const IssueRecord = require('../models/IssueRecord');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/analytics/overview
// @desc    Get overview analytics
// @access  Private (Admin only)
router.get('/overview', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Admin role required.'
      });
    }

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    // Get date ranges
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const startOfYear = new Date(currentYear, 0, 1);
    const lastMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfLastMonth = new Date(currentYear, currentMonth, 0);

    // User statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'approved' });
    const pendingUsers = await User.countDocuments({ status: 'pending' });
    const rejectedUsers = await User.countDocuments({ status: 'rejected' });

    // New registrations this month
    const newRegistrationsThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    // New registrations last month
    const newRegistrationsLastMonth = await User.countDocuments({
      createdAt: { $gte: lastMonth, $lt: startOfMonth }
    });

    // User growth percentage
    const userGrowthPercentage = newRegistrationsLastMonth > 0 
      ? ((newRegistrationsThisMonth - newRegistrationsLastMonth) / newRegistrationsLastMonth * 100).toFixed(2)
      : 0;

    // Role distribution
    const roleDistribution = await User.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Monthly user registrations (last 12 months)
    const monthlyRegistrations = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(currentYear - 1, currentMonth, 1)
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Course statistics
    const totalCourses = await Course.countDocuments();
    const activeCourses = await Course.countDocuments({ status: 'active' });

    // Fee statistics
    const totalFees = await Fee.countDocuments();
    const paidFees = await Fee.countDocuments({ overallStatus: 'paid' });
    const pendingFees = await Fee.countDocuments({ overallStatus: 'pending' });
    const overdueFees = await Fee.countDocuments({ overallStatus: 'overdue' });

    // Library statistics
    const totalBooks = await Book.countDocuments();
    const availableBooks = await Book.countDocuments({ status: 'Available' });
    const issuedBooks = await IssueRecord.countDocuments({ status: 'Active' });
    const overdueBooks = await IssueRecord.countDocuments({ status: 'Overdue' });

    // Recent activity (last 30 days)
    const recentActivity = await User.find({
      createdAt: { $gte: new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000) }
    })
    .select('firstName lastName email role createdAt')
    .sort({ createdAt: -1 })
    .limit(10);

    res.json({
      status: 'success',
      data: {
        overview: {
          totalUsers,
          activeUsers,
          pendingUsers,
          rejectedUsers,
          newRegistrationsThisMonth,
          userGrowthPercentage: parseFloat(userGrowthPercentage)
        },
        courses: {
          totalCourses,
          activeCourses
        },
        fees: {
          totalFees,
          paidFees,
          pendingFees,
          overdueFees
        },
        library: {
          totalBooks,
          availableBooks,
          issuedBooks,
          overdueBooks
        },
        roleDistribution,
        monthlyRegistrations,
        recentActivity
      }
    });

  } catch (error) {
    console.error('Analytics overview error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error fetching analytics'
    });
  }
});

// @route   GET /api/analytics/users
// @desc    Get user analytics
// @access  Private (Admin only)
router.get('/users', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Admin role required.'
      });
    }

    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // User registrations over time
    const userRegistrations = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            role: '$role'
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.date': 1 }
      }
    ]);

    // User status distribution
    const statusDistribution = await User.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Top courses by student count
    const topCourses = await User.aggregate([
      {
        $match: {
          role: 'student',
          status: 'approved',
          'studentInfo.course': { $exists: true }
        }
      },
      {
        $lookup: {
          from: 'courses',
          localField: 'studentInfo.course',
          foreignField: '_id',
          as: 'course'
        }
      },
      {
        $unwind: '$course'
      },
      {
        $group: {
          _id: '$course.courseName',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json({
      status: 'success',
      data: {
        userRegistrations,
        statusDistribution,
        topCourses
      }
    });

  } catch (error) {
    console.error('User analytics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error fetching user analytics'
    });
  }
});

// @route   GET /api/analytics/financial
// @desc    Get financial analytics
// @access  Private (Admin/Accountant only)
router.get('/financial', auth, async (req, res) => {
  try {
    if (!['admin', 'accountant'].includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Admin or Accountant role required.'
      });
    }

    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Fee collection over time
    const feeCollection = await Fee.aggregate([
      {
        $match: {
          overallStatus: 'paid',
          paymentDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$paymentDate' } },
            feeType: '$feeType'
          },
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.date': 1 }
      }
    ]);

    // Fee status distribution
    const feeStatusDistribution = await Fee.aggregate([
      {
        $group: {
          _id: '$overallStatus',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    // Monthly revenue
    const monthlyRevenue = await Fee.aggregate([
      {
        $match: {
          overallStatus: 'paid',
          paymentDate: { $gte: new Date(new Date().getFullYear(), 0, 1) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$paymentDate' },
            month: { $month: '$paymentDate' }
          },
          revenue: { $sum: '$amount' },
          transactions: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.json({
      status: 'success',
      data: {
        feeCollection,
        feeStatusDistribution,
        monthlyRevenue
      }
    });

  } catch (error) {
    console.error('Financial analytics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error fetching financial analytics'
    });
  }
});

module.exports = router;
