const express = require('express');
const { body, validationResult } = require('express-validator');
const Book = require('../models/Book');
const IssueRecord = require('../models/IssueRecord');
const Student = require('../models/Student');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/library/books
// @desc    Get all books with filtering and pagination
// @access  Private
router.get('/books', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) filter.category = category;
    if (status) filter.status = status;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const books = await Book.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Book.countDocuments(filter);

    res.json({
      status: 'success',
      data: {
        books,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Books fetch error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error fetching books'
    });
  }
});

// @route   GET /api/library/books/:id
// @desc    Get book by ID
// @access  Private
router.get('/books/:id', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        status: 'error',
        message: 'Book not found'
      });
    }

    res.json({
      status: 'success',
      data: { book }
    });

  } catch (error) {
    console.error('Book fetch error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error fetching book'
    });
  }
});

// @route   POST /api/library/books
// @desc    Add new book
// @access  Private
router.post('/books', auth, [
  body('title').notEmpty().withMessage('Title is required'),
  body('author').notEmpty().withMessage('Author is required'),
  body('isbn').notEmpty().withMessage('ISBN is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('publisher').notEmpty().withMessage('Publisher is required'),
  body('publicationYear').isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('Invalid publication year'),
  body('totalCopies').isInt({ min: 1 }).withMessage('Total copies must be at least 1'),
  body('location').notEmpty().withMessage('Location is required')
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
      author,
      isbn,
      category,
      publisher,
      publicationYear,
      totalCopies,
      location,
      description,
      coverImage
    } = req.body;

    // Check if ISBN already exists
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({
        status: 'error',
        message: 'Book with this ISBN already exists'
      });
    }

    const book = new Book({
      title,
      author,
      isbn,
      category,
      publisher,
      publicationYear,
      totalCopies,
      availableCopies: totalCopies,
      location,
      description,
      coverImage,
      status: 'Available'
    });

    await book.save();

    res.status(201).json({
      status: 'success',
      message: 'Book added successfully',
      data: { book }
    });

  } catch (error) {
    console.error('Book creation error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error creating book'
    });
  }
});

// @route   PUT /api/library/books/:id
// @desc    Update book
// @access  Private
router.put('/books/:id', auth, [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('author').optional().notEmpty().withMessage('Author cannot be empty'),
  body('publicationYear').optional().isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('Invalid publication year'),
  body('totalCopies').optional().isInt({ min: 1 }).withMessage('Total copies must be at least 1')
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

    const allowedUpdates = [
      'title', 'author', 'category', 'publisher', 'publicationYear',
      'totalCopies', 'location', 'description', 'coverImage', 'status'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Recalculate available copies if total copies changed
    if (updates.totalCopies) {
      const book = await Book.findById(req.params.id);
      if (book) {
        const issuedCopies = book.totalCopies - book.availableCopies;
        updates.availableCopies = Math.max(0, updates.totalCopies - issuedCopies);
      }
    }

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({
        status: 'error',
        message: 'Book not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Book updated successfully',
      data: { book }
    });

  } catch (error) {
    console.error('Book update error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error updating book'
    });
  }
});

// @route   DELETE /api/library/books/:id
// @desc    Delete book
// @access  Private
router.delete('/books/:id', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        status: 'error',
        message: 'Book not found'
      });
    }

    // Check if book has active issues
    const activeIssues = await IssueRecord.countDocuments({ 
      book: req.params.id, 
      status: 'Active' 
    });
    
    if (activeIssues > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot delete book with active issues'
      });
    }

    await Book.findByIdAndDelete(req.params.id);

    res.json({
      status: 'success',
      message: 'Book deleted successfully'
    });

  } catch (error) {
    console.error('Book deletion error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error deleting book'
    });
  }
});

// @route   GET /api/library/issues
// @desc    Get all issue records
// @access  Private
router.get('/issues', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      studentId,
      status,
      sortBy = 'issueDate',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (studentId) filter.studentId = studentId;
    if (status) filter.status = status;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const issues = await IssueRecord.find(filter)
      .populate('book', 'title author isbn')
      .populate('student', 'studentId firstName lastName email')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await IssueRecord.countDocuments(filter);

    res.json({
      status: 'success',
      data: {
        issues,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Issues fetch error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error fetching issues'
    });
  }
});

// @route   POST /api/library/issue
// @desc    Issue a book to student
// @access  Private
router.post('/issue', auth, [
  body('bookId').notEmpty().withMessage('Book ID is required'),
  body('studentId').notEmpty().withMessage('Student ID is required'),
  body('dueDate').isISO8601().withMessage('Valid due date is required')
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

    const { bookId, studentId, dueDate } = req.body;

    // Check if book exists and is available
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        status: 'error',
        message: 'Book not found'
      });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No copies available for this book'
      });
    }

    // Check if student exists
    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found'
      });
    }

    // Check if student already has this book
    const existingIssue = await IssueRecord.findOne({
      book: bookId,
      studentId: studentId,
      status: 'Active'
    });

    if (existingIssue) {
      return res.status(400).json({
        status: 'error',
        message: 'Student already has this book'
      });
    }

    // Create issue record
    const issueRecord = new IssueRecord({
      book: bookId,
      studentId: studentId,
      issueDate: new Date(),
      dueDate: new Date(dueDate),
      status: 'Active',
      fine: 0,
      renewed: false
    });

    await issueRecord.save();

    // Update book available copies
    book.availableCopies -= 1;
    if (book.availableCopies === 0) {
      book.status = 'Issued';
    }
    await book.save();

    // Populate the response
    await issueRecord.populate('book', 'title author isbn');
    await issueRecord.populate('student', 'studentId firstName lastName email');

    res.status(201).json({
      status: 'success',
      message: 'Book issued successfully',
      data: { issueRecord }
    });

  } catch (error) {
    console.error('Book issue error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error issuing book'
    });
  }
});

// @route   POST /api/library/return
// @desc    Return a book
// @access  Private
router.post('/return', auth, [
  body('issueId').notEmpty().withMessage('Issue ID is required')
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

    const { issueId } = req.body;

    const issueRecord = await IssueRecord.findById(issueId)
      .populate('book');

    if (!issueRecord) {
      return res.status(404).json({
        status: 'error',
        message: 'Issue record not found'
      });
    }

    if (issueRecord.status !== 'Active') {
      return res.status(400).json({
        status: 'error',
        message: 'Book is not currently issued'
      });
    }

    // Calculate fine if overdue
    const today = new Date();
    const dueDate = new Date(issueRecord.dueDate);
    let fine = 0;

    if (today > dueDate) {
      const daysOverdue = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
      fine = daysOverdue * 5; // ₹5 per day fine
    }

    // Update issue record
    issueRecord.status = 'Returned';
    issueRecord.returnDate = today;
    issueRecord.fine = fine;
    await issueRecord.save();

    // Update book available copies
    const book = issueRecord.book;
    book.availableCopies += 1;
    if (book.availableCopies > 0) {
      book.status = 'Available';
    }
    await book.save();

    res.json({
      status: 'success',
      message: 'Book returned successfully',
      data: { 
        issueRecord,
        fine: fine > 0 ? `Fine of ₹${fine} for ${Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24))} days overdue` : 'No fine'
      }
    });

  } catch (error) {
    console.error('Book return error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error returning book'
    });
  }
});

// @route   POST /api/library/renew
// @desc    Renew a book
// @access  Private
router.post('/renew', auth, [
  body('issueId').notEmpty().withMessage('Issue ID is required')
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

    const { issueId } = req.body;

    const issueRecord = await IssueRecord.findById(issueId);

    if (!issueRecord) {
      return res.status(404).json({
        status: 'error',
        message: 'Issue record not found'
      });
    }

    if (issueRecord.status !== 'Active') {
      return res.status(400).json({
        status: 'error',
        message: 'Book is not currently issued'
      });
    }

    if (issueRecord.renewed) {
      return res.status(400).json({
        status: 'error',
        message: 'Book has already been renewed once'
      });
    }

    // Extend due date by 14 days
    const newDueDate = new Date(issueRecord.dueDate);
    newDueDate.setDate(newDueDate.getDate() + 14);

    issueRecord.dueDate = newDueDate;
    issueRecord.renewed = true;
    await issueRecord.save();

    res.json({
      status: 'success',
      message: 'Book renewed successfully for 14 more days',
      data: { 
        issueRecord,
        newDueDate: newDueDate.toISOString().split('T')[0]
      }
    });

  } catch (error) {
    console.error('Book renewal error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error renewing book'
    });
  }
});

// @route   GET /api/library/stats
// @desc    Get library statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const [
      totalBooks,
      availableBooks,
      issuedBooks,
      overdueBooks,
      totalIssues,
      activeIssues,
      totalFine
    ] = await Promise.all([
      Book.countDocuments(),
      Book.countDocuments({ status: 'Available' }),
      Book.countDocuments({ status: 'Issued' }),
      IssueRecord.countDocuments({ 
        status: 'Active', 
        dueDate: { $lt: new Date() } 
      }),
      IssueRecord.countDocuments(),
      IssueRecord.countDocuments({ status: 'Active' }),
      IssueRecord.aggregate([
        { $match: { status: 'Active' } },
        { $group: { _id: null, total: { $sum: '$fine' } } }
      ])
    ]);

    // Books by category
    const booksByCategory = await Book.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Popular books (most issued)
    const popularBooks = await IssueRecord.aggregate([
      { $group: { _id: '$book', count: { $sum: 1 } } },
      { $lookup: { from: 'books', localField: '_id', foreignField: '_id', as: 'book' } },
      { $unwind: '$book' },
      { $project: { title: '$book.title', author: '$book.author', count: 1 } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      status: 'success',
      data: {
        overview: {
          totalBooks,
          availableBooks,
          issuedBooks,
          overdueBooks,
          totalIssues,
          activeIssues,
          totalFine: totalFine[0]?.total || 0
        },
        booksByCategory,
        popularBooks
      }
    });

  } catch (error) {
    console.error('Library stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error fetching library statistics'
    });
  }
});

module.exports = router;
