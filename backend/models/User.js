const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  
  // Role and Status
  role: {
    type: String,
    enum: ['admin', 'student', 'teacher', 'staff', 'librarian', 'warden', 'accountant', 'registrar'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending'
  },
  
  // Role-specific Information (for registration)
  roleSpecificInfo: {
    type: mongoose.Schema.Types.Mixed
  },
  
  // Role-specific Information
  studentInfo: {
    studentId: String,
    rollNumber: String,
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    semester: Number,
    academicYear: String,
    admissionDate: Date,
    guardian: {
      name: String,
      relationship: String,
      phone: String,
      email: String
    }
  },
  
  teacherInfo: {
    employeeId: String,
    department: String,
    designation: String,
    qualification: String,
    joiningDate: Date,
    subjects: [String]
  },
  
  staffInfo: {
    employeeId: String,
    department: String,
    designation: String,
    joiningDate: Date
  },
  
  librarianInfo: {
    employeeId: String,
    libraryCode: String,
    specialization: String,
    joiningDate: Date
  },
  
  wardenInfo: {
    employeeId: String,
    hostelAssigned: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hostel'
    },
    joiningDate: Date
  },
  
  // System Information
  profilePicture: String,
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  
  // Timestamps
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
userSchema.index({ email: 1 });
userSchema.index({ role: 1, status: 1 });
userSchema.index({ 'studentInfo.studentId': 1 });
userSchema.index({ 'teacherInfo.employeeId': 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if account is locked
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Increment login attempts
userSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

// Reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
