const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  
  // Fee Structure
  fees: {
    tuitionFee: {
      amount: Number,
      paid: { type: Number, default: 0 },
      due: { type: Number, default: 0 },
      status: { type: String, enum: ['Paid', 'Partial', 'Pending'], default: 'Pending' }
    },
    semesterFee: {
      amount: Number,
      paid: { type: Number, default: 0 },
      due: { type: Number, default: 0 },
      status: { type: String, enum: ['Paid', 'Partial', 'Pending'], default: 'Pending' }
    },
    examinationFee: {
      amount: Number,
      paid: { type: Number, default: 0 },
      due: { type: Number, default: 0 },
      status: { type: String, enum: ['Paid', 'Partial', 'Pending'], default: 'Pending' }
    },
    libraryFee: {
      amount: { type: Number, default: 0 },
      paid: { type: Number, default: 0 },
      due: { type: Number, default: 0 },
      status: { type: String, enum: ['Paid', 'Partial', 'Pending'], default: 'Pending' }
    },
    laboratoryFee: {
      amount: { type: Number, default: 0 },
      paid: { type: Number, default: 0 },
      due: { type: Number, default: 0 },
      status: { type: String, enum: ['Paid', 'Partial', 'Pending'], default: 'Pending' }
    },
    hostelFee: {
      amount: { type: Number, default: 0 },
      paid: { type: Number, default: 0 },
      due: { type: Number, default: 0 },
      status: { type: String, enum: ['Paid', 'Partial', 'Pending'], default: 'Pending' }
    },
    otherFees: [{
      name: String,
      amount: Number,
      paid: { type: Number, default: 0 },
      due: { type: Number, default: 0 },
      status: { type: String, enum: ['Paid', 'Partial', 'Pending'], default: 'Pending' }
    }]
  },
  
  // Payment Information
  totalAmount: {
    type: Number,
    required: true
  },
  totalPaid: {
    type: Number,
    default: 0
  },
  totalDue: {
    type: Number,
    required: true
  },
  
  // Payment History
  payments: [{
    paymentId: String,
    amount: Number,
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Cheque', 'Online', 'Bank Transfer']
    },
    paymentDate: Date,
    transactionId: String,
    bankDetails: {
      bankName: String,
      accountNumber: String,
      ifscCode: String
    },
    receiptNumber: String,
    status: {
      type: String,
      enum: ['Success', 'Failed', 'Pending'],
      default: 'Success'
    },
    remarks: String
  }],
  
  // Due Dates and Penalties
  dueDate: Date,
  lateFeeAmount: {
    type: Number,
    default: 0
  },
  penaltyApplied: {
    type: Boolean,
    default: false
  },
  
  // Status
  overallStatus: {
    type: String,
    enum: ['Paid', 'Partial', 'Pending', 'Overdue'],
    default: 'Pending'
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
feeSchema.index({ student: 1, academicYear: 1, semester: 1 });
feeSchema.index({ overallStatus: 1 });
feeSchema.index({ dueDate: 1 });

// Calculate totals before saving
feeSchema.pre('save', function(next) {
  const fees = this.fees;
  
  // Calculate total amount
  this.totalAmount = fees.tuitionFee.amount + 
                   fees.semesterFee.amount + 
                   fees.examinationFee.amount + 
                   fees.libraryFee.amount + 
                   fees.laboratoryFee.amount + 
                   fees.hostelFee.amount +
                   fees.otherFees.reduce((sum, fee) => sum + fee.amount, 0);
  
  // Calculate total paid
  this.totalPaid = fees.tuitionFee.paid + 
                  fees.semesterFee.paid + 
                  fees.examinationFee.paid + 
                  fees.libraryFee.paid + 
                  fees.laboratoryFee.paid + 
                  fees.hostelFee.paid +
                  fees.otherFees.reduce((sum, fee) => sum + fee.paid, 0);
  
  // Calculate total due
  this.totalDue = this.totalAmount - this.totalPaid;
  
  // Update overall status
  if (this.totalDue === 0) {
    this.overallStatus = 'Paid';
  } else if (this.totalPaid > 0) {
    this.overallStatus = 'Partial';
  } else {
    this.overallStatus = 'Pending';
  }
  
  // Check for overdue
  if (this.dueDate && new Date() > this.dueDate && this.totalDue > 0) {
    this.overallStatus = 'Overdue';
  }
  
  next();
});

module.exports = mongoose.model('Fee', feeSchema);
