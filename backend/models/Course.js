const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  courseName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  duration: {
    type: Number, // in years
    required: true
  },
  totalSemesters: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  department: {
    type: String,
    required: true
  },
  credits: {
    type: Number,
    required: true
  },
  feeStructure: {
    tuitionFee: {
      type: Number,
      required: true
    },
    semesterFee: {
      type: Number,
      required: true
    },
    examinationFee: {
      type: Number,
      required: true
    },
    libraryFee: {
      type: Number,
      default: 0
    },
    laboratoryFee: {
      type: Number,
      default: 0
    },
    otherFees: [{
      name: String,
      amount: Number
    }]
  },
  eligibility: {
    minimumAge: Number,
    maximumAge: Number,
    requiredSubjects: [String],
    minimumMarks: Number
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Discontinued'],
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

// Indexes
courseSchema.index({ courseCode: 1 });
courseSchema.index({ department: 1 });
courseSchema.index({ status: 1 });

module.exports = mongoose.model('Course', courseSchema);
