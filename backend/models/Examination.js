const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  subjectCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  subjectName: {
    type: String,
    required: true,
    trim: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  credits: {
    type: Number,
    required: true
  },
  theoryMarks: {
    type: Number,
    required: true
  },
  practicalMarks: {
    type: Number,
    default: 0
  },
  internalMarks: {
    type: Number,
    default: 0
  },
  totalMarks: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
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

const examSchema = new mongoose.Schema({
  examName: {
    type: String,
    required: true,
    trim: true
  },
  examType: {
    type: String,
    enum: ['Midterm', 'Final', 'Internal', 'Assignment', 'Quiz', 'Practical'],
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
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  examDate: {
    type: Date,
    required: true
  },
  endDate: Date,
  examDuration: {
    type: Number, // in minutes
    required: true
  },
  venue: String,
  instructions: [String],
  status: {
    type: String,
    enum: ['Scheduled', 'Ongoing', 'Completed', 'Cancelled'],
    default: 'Scheduled'
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

const resultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  
  // Marks
  theoryMarks: {
    obtained: { type: Number, default: 0 },
    total: Number
  },
  practicalMarks: {
    obtained: { type: Number, default: 0 },
    total: Number
  },
  internalMarks: {
    obtained: { type: Number, default: 0 },
    total: Number
  },
  totalMarks: {
    obtained: { type: Number, default: 0 },
    total: Number
  },
  
  // Grade and Status
  grade: {
    type: String,
    enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F', 'I', 'W'],
    default: 'I'
  },
  gradePoints: {
    type: Number,
    default: 0
  },
  credits: Number,
  creditPoints: {
    type: Number,
    default: 0
  },
  
  // Status
  status: {
    type: String,
    enum: ['Pass', 'Fail', 'Incomplete', 'Withdrawn', 'Absent'],
    default: 'Incomplete'
  },
  
  // Additional Information
  attendance: {
    type: Number,
    default: 0
  },
  remarks: String,
  
  // Timestamps
  resultDate: {
    type: Date,
    default: Date.now
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

const semesterResultSchema = new mongoose.Schema({
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
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  
  // Results
  results: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Result'
  }],
  
  // Semester Statistics
  totalCredits: {
    type: Number,
    default: 0
  },
  earnedCredits: {
    type: Number,
    default: 0
  },
  totalCreditPoints: {
    type: Number,
    default: 0
  },
  sgpa: {
    type: Number,
    default: 0
  },
  
  // Status
  status: {
    type: String,
    enum: ['Pass', 'Fail', 'Incomplete', 'Withdrawn'],
    default: 'Incomplete'
  },
  
  // Ranking
  classRank: Number,
  totalStudents: Number,
  
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
subjectSchema.index({ subjectCode: 1 });
subjectSchema.index({ course: 1, semester: 1 });

examSchema.index({ academicYear: 1, semester: 1 });
examSchema.index({ examType: 1 });
examSchema.index({ status: 1 });

resultSchema.index({ student: 1, exam: 1, subject: 1 });
resultSchema.index({ student: 1, academicYear: 1, semester: 1 });

semesterResultSchema.index({ student: 1, academicYear: 1, semester: 1 });
semesterResultSchema.index({ course: 1, academicYear: 1, semester: 1 });

// Calculate totals and grades before saving
resultSchema.pre('save', function(next) {
  // Calculate total marks
  this.totalMarks.obtained = (this.theoryMarks.obtained || 0) + 
                            (this.practicalMarks.obtained || 0) + 
                            (this.internalMarks.obtained || 0);
  
  this.totalMarks.total = (this.theoryMarks.total || 0) + 
                         (this.practicalMarks.total || 0) + 
                         (this.internalMarks.total || 0);
  
  // Calculate grade points and grade
  const percentage = (this.totalMarks.obtained / this.totalMarks.total) * 100;
  
  if (percentage >= 90) {
    this.grade = 'A+';
    this.gradePoints = 10;
  } else if (percentage >= 80) {
    this.grade = 'A';
    this.gradePoints = 9;
  } else if (percentage >= 70) {
    this.grade = 'B+';
    this.gradePoints = 8;
  } else if (percentage >= 60) {
    this.grade = 'B';
    this.gradePoints = 7;
  } else if (percentage >= 50) {
    this.grade = 'C+';
    this.gradePoints = 6;
  } else if (percentage >= 40) {
    this.grade = 'C';
    this.gradePoints = 5;
  } else if (percentage >= 35) {
    this.grade = 'D';
    this.gradePoints = 4;
  } else {
    this.grade = 'F';
    this.gradePoints = 0;
  }
  
  // Calculate credit points
  this.creditPoints = this.gradePoints * (this.credits || 0);
  
  // Set status
  if (this.grade === 'F') {
    this.status = 'Fail';
  } else if (this.grade === 'I' || this.grade === 'W') {
    this.status = 'Incomplete';
  } else {
    this.status = 'Pass';
  }
  
  next();
});

module.exports = {
  Subject: mongoose.model('Subject', subjectSchema),
  Exam: mongoose.model('Exam', examSchema),
  Result: mongoose.model('Result', resultSchema),
  SemesterResult: mongoose.model('SemesterResult', semesterResultSchema)
};
