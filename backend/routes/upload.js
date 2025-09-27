const express = require('express');
const path = require('path');
const fs = require('fs');
const { upload, handleUploadError } = require('../middleware/upload');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/upload/single
// @desc    Upload single file
// @access  Private
router.post('/single', auth, upload.single('file'), handleUploadError, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No file uploaded'
      });
    }

    const fileUrl = `/uploads/${req.file.fieldname}/${req.file.filename}`;
    
    res.json({
      status: 'success',
      message: 'File uploaded successfully',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        url: fileUrl,
        path: req.file.path
      }
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({
      status: 'error',
      message: 'File upload failed'
    });
  }
});

// @route   POST /api/upload/multiple
// @desc    Upload multiple files
// @access  Private
router.post('/multiple', auth, upload.array('files', 5), handleUploadError, (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No files uploaded'
      });
    }

    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      url: `/uploads/${file.fieldname}/${file.filename}`,
      path: file.path
    }));
    
    res.json({
      status: 'success',
      message: 'Files uploaded successfully',
      data: {
        files: uploadedFiles,
        count: uploadedFiles.length
      }
    });
  } catch (error) {
    console.error('Files upload error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Files upload failed'
    });
  }
});

// @route   POST /api/upload/document
// @desc    Upload student document
// @access  Private
router.post('/document', auth, upload.single('document'), handleUploadError, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No document uploaded'
      });
    }

    const { documentType, studentId } = req.body;
    
    if (!documentType || !studentId) {
      return res.status(400).json({
        status: 'error',
        message: 'Document type and student ID are required'
      });
    }

    const fileUrl = `/uploads/${req.file.fieldname}/${req.file.filename}`;
    
    res.json({
      status: 'success',
      message: 'Document uploaded successfully',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        url: fileUrl,
        path: req.file.path,
        documentType,
        studentId
      }
    });
  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Document upload failed'
    });
  }
});

// @route   GET /api/upload/files/:filename
// @desc    Get uploaded file
// @access  Private
router.get('/files/:filename', auth, (req, res) => {
  try {
    const { filename } = req.params;
    const { type } = req.query; // document, profile, etc.
    
    const filePath = path.join(process.env.UPLOAD_PATH || './uploads', type || 'files', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        status: 'error',
        message: 'File not found'
      });
    }

    res.sendFile(path.resolve(filePath));
  } catch (error) {
    console.error('File retrieval error:', error);
    res.status(500).json({
      status: 'error',
      message: 'File retrieval failed'
    });
  }
});

// @route   DELETE /api/upload/files/:filename
// @desc    Delete uploaded file
// @access  Private
router.delete('/files/:filename', auth, (req, res) => {
  try {
    const { filename } = req.params;
    const { type } = req.query;
    
    const filePath = path.join(process.env.UPLOAD_PATH || './uploads', type || 'files', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        status: 'error',
        message: 'File not found'
      });
    }

    fs.unlinkSync(filePath);
    
    res.json({
      status: 'success',
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('File deletion error:', error);
    res.status(500).json({
      status: 'error',
      message: 'File deletion failed'
    });
  }
});

module.exports = router;
