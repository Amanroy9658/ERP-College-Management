const mongoose = require('mongoose');

const issueRecordSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  studentId: {
    type: String,
    required: true,
    trim: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  issueDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  returnDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Active', 'Returned', 'Overdue', 'Lost'],
    default: 'Active'
  },
  fine: {
    type: Number,
    default: 0,
    min: 0
  },
  renewed: {
    type: Boolean,
    default: false
  },
  issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  returnedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  remarks: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
issueRecordSchema.index({ studentId: 1 });
issueRecordSchema.index({ book: 1 });
issueRecordSchema.index({ status: 1 });
issueRecordSchema.index({ dueDate: 1 });
issueRecordSchema.index({ issueDate: -1 });

// Pre-save middleware to check for overdue books
issueRecordSchema.pre('save', function(next) {
  if (this.status === 'Active' && this.dueDate < new Date()) {
    this.status = 'Overdue';
  }
  next();
});

module.exports = mongoose.model('IssueRecord', issueRecordSchema);

