const express = require('express');
const { body, validationResult } = require('express-validator');
const { Hostel, Room, HostelAllocation } = require('../models/Hostel');
const Student = require('../models/Student');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/hostels
// @desc    Get all hostels
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (search) {
      filter.$or = [
        { hostelName: { $regex: search, $options: 'i' } },
        { hostelCode: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) filter.status = status;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const hostels = await Hostel.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Hostel.countDocuments(filter);

    res.json({
      status: 'success',
      data: {
        hostels,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Hostels fetch error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error fetching hostels'
    });
  }
});

// @route   GET /api/hostels/:id
// @desc    Get hostel by ID with rooms
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) {
      return res.status(404).json({
        status: 'error',
        message: 'Hostel not found'
      });
    }

    const rooms = await Room.find({ hostel: req.params.id })
      .sort({ floor: 1, roomNumber: 1 });

    res.json({
      status: 'success',
      data: { 
        hostel,
        rooms
      }
    });

  } catch (error) {
    console.error('Hostel fetch error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error fetching hostel'
    });
  }
});

// @route   POST /api/hostels
// @desc    Create new hostel
// @access  Private
router.post('/', auth, [
  body('hostelName').notEmpty().withMessage('Hostel name is required'),
  body('hostelCode').notEmpty().withMessage('Hostel code is required'),
  body('contactInfo.phone').notEmpty().withMessage('Phone number is required'),
  body('contactInfo.wardenName').notEmpty().withMessage('Warden name is required')
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
      hostelName,
      hostelCode,
      address,
      contactInfo,
      facilities,
      rules
    } = req.body;

    // Check if hostel code already exists
    const existingHostel = await Hostel.findOne({ hostelCode });
    if (existingHostel) {
      return res.status(400).json({
        status: 'error',
        message: 'Hostel with this code already exists'
      });
    }

    const hostel = new Hostel({
      hostelName,
      hostelCode,
      address,
      contactInfo,
      facilities,
      rules
    });

    await hostel.save();

    res.status(201).json({
      status: 'success',
      message: 'Hostel created successfully',
      data: { hostel }
    });

  } catch (error) {
    console.error('Hostel creation error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error creating hostel'
    });
  }
});

// @route   POST /api/hostels/:id/rooms
// @desc    Add room to hostel
// @access  Private
router.post('/:id/rooms', auth, [
  body('roomNumber').notEmpty().withMessage('Room number is required'),
  body('floor').isInt({ min: 1 }).withMessage('Floor must be a positive integer'),
  body('roomType').isIn(['Single', 'Double', 'Triple', 'Quad']).withMessage('Invalid room type'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be a positive integer'),
  body('monthlyRent').isNumeric().withMessage('Monthly rent must be a number')
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

    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) {
      return res.status(404).json({
        status: 'error',
        message: 'Hostel not found'
      });
    }

    const {
      roomNumber,
      floor,
      roomType,
      capacity,
      amenities,
      monthlyRent
    } = req.body;

    // Check if room number already exists in this hostel
    const existingRoom = await Room.findOne({ 
      hostel: req.params.id, 
      roomNumber 
    });
    if (existingRoom) {
      return res.status(400).json({
        status: 'error',
        message: 'Room number already exists in this hostel'
      });
    }

    const room = new Room({
      hostel: req.params.id,
      roomNumber,
      floor,
      roomType,
      capacity,
      amenities,
      monthlyRent
    });

    await room.save();

    res.status(201).json({
      status: 'success',
      message: 'Room added successfully',
      data: { room }
    });

  } catch (error) {
    console.error('Room creation error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error creating room'
    });
  }
});

// @route   GET /api/hostels/rooms/available
// @desc    Get available rooms
// @access  Private
router.get('/rooms/available', auth, async (req, res) => {
  try {
    const { hostel, roomType, floor } = req.query;

    const filter = { status: 'Available' };
    if (hostel) filter.hostel = hostel;
    if (roomType) filter.roomType = roomType;
    if (floor) filter.floor = parseInt(floor);

    const availableRooms = await Room.find(filter)
      .populate('hostel', 'hostelName hostelCode')
      .sort({ hostel: 1, floor: 1, roomNumber: 1 });

    res.json({
      status: 'success',
      data: { availableRooms }
    });

  } catch (error) {
    console.error('Available rooms fetch error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error fetching available rooms'
    });
  }
});

// @route   POST /api/hostels/allocate
// @desc    Allocate hostel room to student
// @access  Private
router.post('/allocate', auth, [
  body('student').notEmpty().withMessage('Student ID is required'),
  body('hostel').notEmpty().withMessage('Hostel ID is required'),
  body('room').notEmpty().withMessage('Room ID is required'),
  body('checkInDate').notEmpty().withMessage('Check-in date is required'),
  body('monthlyRent').isNumeric().withMessage('Monthly rent must be a number'),
  body('securityDeposit').isNumeric().withMessage('Security deposit must be a number')
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
      hostel,
      room,
      checkInDate,
      expectedCheckOutDate,
      monthlyRent,
      securityDeposit,
      maintenanceFee,
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

    // Check if student already has an active allocation
    const existingAllocation = await HostelAllocation.findOne({
      student,
      allocationStatus: 'Active'
    });
    if (existingAllocation) {
      return res.status(400).json({
        status: 'error',
        message: 'Student already has an active hostel allocation'
      });
    }

    // Check if room is available
    const roomExists = await Room.findById(room);
    if (!roomExists) {
      return res.status(404).json({
        status: 'error',
        message: 'Room not found'
      });
    }

    if (roomExists.status !== 'Available') {
      return res.status(400).json({
        status: 'error',
        message: 'Room is not available'
      });
    }

    const allocation = new HostelAllocation({
      student,
      hostel,
      room,
      allocationDate: new Date(),
      checkInDate: new Date(checkInDate),
      expectedCheckOutDate: expectedCheckOutDate ? new Date(expectedCheckOutDate) : null,
      monthlyRent,
      securityDeposit,
      maintenanceFee: maintenanceFee || 0,
      remarks
    });

    await allocation.save();

    // Update room status
    roomExists.status = 'Occupied';
    await roomExists.save();

    const populatedAllocation = await HostelAllocation.findById(allocation._id)
      .populate('student', 'studentId firstName lastName email')
      .populate('hostel', 'hostelName hostelCode')
      .populate('room', 'roomNumber floor roomType');

    res.status(201).json({
      status: 'success',
      message: 'Hostel allocation created successfully',
      data: { allocation: populatedAllocation }
    });

  } catch (error) {
    console.error('Hostel allocation error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error creating hostel allocation'
    });
  }
});

// @route   GET /api/hostels/allocations
// @desc    Get hostel allocations
// @access  Private
router.get('/allocations', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      student,
      hostel,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (student) filter.student = student;
    if (hostel) filter.hostel = hostel;
    if (status) filter.allocationStatus = status;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const allocations = await HostelAllocation.find(filter)
      .populate('student', 'studentId firstName lastName email')
      .populate('hostel', 'hostelName hostelCode')
      .populate('room', 'roomNumber floor roomType')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await HostelAllocation.countDocuments(filter);

    res.json({
      status: 'success',
      data: {
        allocations,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Allocations fetch error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error fetching allocations'
    });
  }
});

// @route   PUT /api/hostels/allocations/:id/terminate
// @desc    Terminate hostel allocation
// @access  Private
router.put('/allocations/:id/terminate', auth, [
  body('actualCheckOutDate').notEmpty().withMessage('Check-out date is required')
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

    const { actualCheckOutDate, remarks } = req.body;

    const allocation = await HostelAllocation.findById(req.params.id);
    if (!allocation) {
      return res.status(404).json({
        status: 'error',
        message: 'Allocation not found'
      });
    }

    if (allocation.allocationStatus !== 'Active') {
      return res.status(400).json({
        status: 'error',
        message: 'Allocation is not active'
      });
    }

    // Update allocation
    allocation.allocationStatus = 'Terminated';
    allocation.actualCheckOutDate = new Date(actualCheckOutDate);
    if (remarks) allocation.remarks = remarks;
    await allocation.save();

    // Update room status
    const room = await Room.findById(allocation.room);
    if (room) {
      room.status = 'Available';
      await room.save();
    }

    const populatedAllocation = await HostelAllocation.findById(allocation._id)
      .populate('student', 'studentId firstName lastName email')
      .populate('hostel', 'hostelName hostelCode')
      .populate('room', 'roomNumber floor roomType');

    res.json({
      status: 'success',
      message: 'Hostel allocation terminated successfully',
      data: { allocation: populatedAllocation }
    });

  } catch (error) {
    console.error('Allocation termination error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error terminating allocation'
    });
  }
});

// @route   GET /api/hostels/stats/overview
// @desc    Get hostel statistics overview
// @access  Private
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const totalHostels = await Hostel.countDocuments();
    const activeHostels = await Hostel.countDocuments({ status: 'Active' });
    const totalRooms = await Room.countDocuments();
    const occupiedRooms = await Room.countDocuments({ status: 'Occupied' });
    const availableRooms = await Room.countDocuments({ status: 'Available' });
    const totalAllocations = await HostelAllocation.countDocuments();
    const activeAllocations = await HostelAllocation.countDocuments({ allocationStatus: 'Active' });

    // Occupancy by hostel
    const occupancyByHostel = await HostelAllocation.aggregate([
      { $match: { allocationStatus: 'Active' } },
      { $group: { _id: '$hostel', count: { $sum: 1 } } },
      { $lookup: { from: 'hostels', localField: '_id', foreignField: '_id', as: 'hostel' } },
      { $unwind: '$hostel' },
      { $project: { hostelName: '$hostel.hostelName', count: 1 } }
    ]);

    // Room types distribution
    const roomTypesDistribution = await Room.aggregate([
      { $group: { _id: '$roomType', count: { $sum: 1 } } }
    ]);

    res.json({
      status: 'success',
      data: {
        overview: {
          totalHostels,
          activeHostels,
          totalRooms,
          occupiedRooms,
          availableRooms,
          totalAllocations,
          activeAllocations
        },
        occupancyByHostel,
        roomTypesDistribution
      }
    });

  } catch (error) {
    console.error('Hostel stats fetch error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error fetching hostel statistics'
    });
  }
});

module.exports = router;
