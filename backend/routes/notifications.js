const express = require('express');
const { body, validationResult } = require('express-validator');
const Notification = require('../models/Notification');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get user notifications
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      read,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { userId: req.user._id };
    
    if (type) filter.type = type;
    if (read !== undefined) filter.read = read === 'true';

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const notifications = await Notification.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notification.countDocuments(filter);
    const unreadCount = await Notification.countDocuments({ 
      userId: req.user._id, 
      read: false 
    });

    res.json({
      status: 'success',
      data: {
        notifications,
        unreadCount,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Notifications fetch error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error fetching notifications'
    });
  }
});

// @route   POST /api/notifications
// @desc    Create new notification
// @access  Private
router.post('/', auth, [
  body('title').notEmpty().withMessage('Title is required'),
  body('message').notEmpty().withMessage('Message is required'),
  body('type').isIn(['info', 'success', 'warning', 'error']).withMessage('Invalid notification type'),
  body('userId').optional().isMongoId().withMessage('Invalid user ID')
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
      title,
      message,
      type,
      userId,
      actionUrl,
      metadata
    } = req.body;

    // If userId is provided, send to specific user, otherwise send to all users
    let targetUsers = [];
    
    if (userId) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }
      targetUsers = [userId];
    } else {
      // Send to all users (for system-wide notifications)
      const users = await User.find({ status: 'approved' }).select('_id');
      targetUsers = users.map(user => user._id);
    }

    // Create notifications for all target users
    const notifications = targetUsers.map(userId => ({
      userId,
      title,
      message,
      type,
      actionUrl,
      metadata,
      createdBy: req.user._id
    }));

    const createdNotifications = await Notification.insertMany(notifications);

    res.status(201).json({
      status: 'success',
      message: 'Notifications created successfully',
      data: { notifications: createdNotifications }
    });

  } catch (error) {
    console.error('Notification creation error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error creating notifications'
    });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { read: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        status: 'error',
        message: 'Notification not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Notification marked as read',
      data: { notification }
    });

  } catch (error) {
    console.error('Notification read error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error marking notification as read'
    });
  }
});

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put('/read-all', auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, read: false },
      { read: true, readAt: new Date() }
    );

    res.json({
      status: 'success',
      message: 'All notifications marked as read'
    });

  } catch (error) {
    console.error('Mark all read error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error marking all notifications as read'
    });
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!notification) {
      return res.status(404).json({
        status: 'error',
        message: 'Notification not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Notification deleted successfully'
    });

  } catch (error) {
    console.error('Notification deletion error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error deleting notification'
    });
  }
});

// @route   GET /api/notifications/stats
// @desc    Get notification statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const [
      totalNotifications,
      unreadNotifications,
      notificationsByType,
      recentNotifications
    ] = await Promise.all([
      Notification.countDocuments({ userId: req.user._id }),
      Notification.countDocuments({ userId: req.user._id, read: false }),
      Notification.aggregate([
        { $match: { userId: req.user._id } },
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Notification.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    res.json({
      status: 'success',
      data: {
        totalNotifications,
        unreadNotifications,
        notificationsByType,
        recentNotifications
      }
    });

  } catch (error) {
    console.error('Notification stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error fetching notification statistics'
    });
  }
});

module.exports = router;
