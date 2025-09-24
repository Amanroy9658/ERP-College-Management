const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
  hostelName: {
    type: String,
    required: true,
    trim: true
  },
  hostelCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  contactInfo: {
    phone: String,
    email: String,
    wardenName: String,
    wardenPhone: String
  },
  facilities: [{
    name: String,
    description: String,
    available: { type: Boolean, default: true }
  }],
  rules: [String],
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Under Maintenance'],
    default: 'Active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const roomSchema = new mongoose.Schema({
  hostel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hostel',
    required: true
  },
  roomNumber: {
    type: String,
    required: true
  },
  floor: {
    type: Number,
    required: true
  },
  roomType: {
    type: String,
    enum: ['Single', 'Double', 'Triple', 'Quad'],
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  currentOccupancy: {
    type: Number,
    default: 0
  },
  amenities: [String],
  monthlyRent: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Available', 'Occupied', 'Under Maintenance', 'Reserved'],
    default: 'Available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const allocationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  hostel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hostel',
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  allocationDate: {
    type: Date,
    required: true
  },
  checkInDate: {
    type: Date,
    required: true
  },
  expectedCheckOutDate: Date,
  actualCheckOutDate: Date,
  
  // Fee Information
  monthlyRent: {
    type: Number,
    required: true
  },
  securityDeposit: {
    type: Number,
    required: true
  },
  maintenanceFee: {
    type: Number,
    default: 0
  },
  
  // Payment Status
  rentPayments: [{
    month: String,
    year: Number,
    amount: Number,
    paidDate: Date,
    status: {
      type: String,
      enum: ['Paid', 'Pending', 'Overdue'],
      default: 'Pending'
    }
  }],
  
  // Status
  allocationStatus: {
    type: String,
    enum: ['Active', 'Terminated', 'Transferred', 'Suspended'],
    default: 'Active'
  },
  
  // Documents
  documents: [{
    type: String,
    url: String,
    uploadedAt: Date
  }],
  
  // Remarks
  remarks: String,
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
hostelSchema.index({ hostelCode: 1 });
hostelSchema.index({ status: 1 });

roomSchema.index({ hostel: 1, roomNumber: 1 });
roomSchema.index({ status: 1 });
roomSchema.index({ roomType: 1 });

allocationSchema.index({ student: 1 });
allocationSchema.index({ hostel: 1, room: 1 });
allocationSchema.index({ allocationStatus: 1 });

// Update room occupancy when allocation is created/updated
allocationSchema.post('save', async function() {
  const Room = mongoose.model('Room');
  const room = await Room.findById(this.room);
  if (room) {
    const activeAllocations = await mongoose.model('HostelAllocation').countDocuments({
      room: this.room,
      allocationStatus: 'Active'
    });
    room.currentOccupancy = activeAllocations;
    await room.save();
  }
});

module.exports = {
  Hostel: mongoose.model('Hostel', hostelSchema),
  Room: mongoose.model('Room', roomSchema),
  HostelAllocation: mongoose.model('HostelAllocation', allocationSchema)
};
