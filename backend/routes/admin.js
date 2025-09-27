const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get pending approvals
router.get('/pending-approvals', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Admin role required.'
      });
    }

    const pendingUsers = await User.find({ status: 'pending' })
      .populate('roleSpecificInfo.studentInfo.course')
      .sort({ createdAt: -1 });

    res.json({
      status: 'success',
      message: 'Pending approvals fetched successfully',
      data: pendingUsers
    });
  } catch (error) {
    console.error('Error fetching pending approvals:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching pending approvals'
    });
  }
});

// Approve or reject user
router.post('/approve-user/:userId', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Admin role required.'
      });
    }

    const { userId } = req.params;
    const { action, reason } = req.body; // action: 'approve' or 'reject'

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid action. Must be approve or reject.'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    if (user.status !== 'pending') {
      return res.status(400).json({
        status: 'error',
        message: 'User is not pending approval'
      });
    }

    // Update user status
    user.status = action === 'approve' ? 'approved' : 'rejected';
    if (reason) {
      user.rejectionReason = reason;
    }
    user.approvedBy = req.user._id;
    user.approvedAt = new Date();

    await user.save();

    // Create notification for the user
    try {
      const Notification = require('../models/Notification');
      await Notification.create({
        recipient: user._id,
        type: action === 'approve' ? 'success' : 'error',
        title: `Account ${action === 'approve' ? 'Approved' : 'Rejected'}`,
        message: action === 'approve' 
          ? 'Your account has been approved! You can now log in to access your dashboard.'
          : `Your account has been rejected. Reason: ${reason || 'No reason provided'}`,
        actionUrl: action === 'approve' ? `/${user.role}/dashboard` : '/login'
      });
    } catch (notificationError) {
      console.error('Error creating notification:', notificationError);
      // Don't fail approval if notification creation fails
    }

    // Send approval/rejection email and SMS
    try {
      const emailService = require('../services/emailService');
      const smsService = require('../services/smsService');
      
      await emailService.sendApprovalEmail(user, action === 'approve');
      await smsService.sendApprovalSMS(user, action === 'approve');
    } catch (emailSmsError) {
      console.error('Error sending approval email/SMS:', emailSmsError);
      // Don't fail approval if email/SMS fails
    }

    res.json({
      status: 'success',
      message: `User ${action}d successfully`,
      data: {
        userId: user._id,
        status: user.status,
        approvedBy: req.user._id,
        approvedAt: user.approvedAt
      }
    });
  } catch (error) {
    console.error('Error processing approval:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while processing approval'
    });
  }
});

// Get dashboard statistics
router.get('/dashboard-stats', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Admin role required.'
      });
    }

    const [
      totalUsers,
      pendingUsers,
      approvedUsers,
      rejectedUsers,
      usersByRole,
      recentRegistrations
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: 'pending' }),
      User.countDocuments({ status: 'approved' }),
      User.countDocuments({ status: 'rejected' }),
      User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      User.find({ status: 'pending' })
        .populate('roleSpecificInfo.studentInfo.course')
        .sort({ createdAt: -1 })
        .limit(10)
    ]);

    res.json({
      status: 'success',
      message: 'Dashboard statistics fetched successfully',
      data: {
        totalUsers,
        pendingApprovals: pendingUsers,
        approvedUsers,
        rejectedUsers,
        usersByRole,
        recentRegistrations
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching dashboard statistics'
    });
  }
});

// Get all users with pagination
router.get('/users', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Admin role required.'
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const role = req.query.role || '';
    const status = req.query.status || '';

    // Build query
    let query = {};
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) {
      query.role = role;
    }
    
    if (status) {
      query.status = status;
    }

    const [users, totalCount] = await Promise.all([
      User.find(query)
        .populate('roleSpecificInfo.studentInfo.course')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(query)
    ]);

    res.json({
      status: 'success',
      message: 'Users fetched successfully',
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasNext: page < Math.ceil(totalCount / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching users'
    });
  }
});

// Suspend or activate user
router.post('/user-status/:userId', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Admin role required.'
      });
    }

    const { userId } = req.params;
    const { status, reason } = req.body;

    if (!['active', 'suspended'].includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid status. Must be active or suspended.'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    user.status = status === 'active' ? 'approved' : 'suspended';
    if (reason) {
      user.suspensionReason = reason;
    }
    user.statusUpdatedBy = req.user._id;
    user.statusUpdatedAt = new Date();

    await user.save();

    res.json({
      status: 'success',
      message: `User status updated to ${status}`,
      data: {
        userId: user._id,
        status: user.status,
        updatedBy: req.user._id,
        updatedAt: user.statusUpdatedAt
      }
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating user status'
    });
  }
});

module.exports = router;