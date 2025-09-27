const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'College ERP Student Management System API',
      version: '1.0.0',
      description: 'A comprehensive Enterprise Resource Planning system for educational institutions',
      contact: {
        name: 'College ERP Support',
        email: 'support@college.edu',
        url: 'https://college.edu'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development server'
      },
      {
        url: 'https://api.college.edu/api',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'User ID'
            },
            firstName: {
              type: 'string',
              description: 'First name'
            },
            lastName: {
              type: 'string',
              description: 'Last name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address'
            },
            phone: {
              type: 'string',
              description: 'Phone number'
            },
            role: {
              type: 'string',
              enum: ['admin', 'student', 'teacher', 'librarian', 'warden', 'accountant', 'registrar'],
              description: 'User role'
            },
            status: {
              type: 'string',
              enum: ['pending', 'approved', 'rejected'],
              description: 'Account status'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation date'
            }
          }
        },
        Student: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Student ID'
            },
            studentId: {
              type: 'string',
              description: 'Student ID number'
            },
            rollNumber: {
              type: 'string',
              description: 'Roll number'
            },
            firstName: {
              type: 'string',
              description: 'First name'
            },
            lastName: {
              type: 'string',
              description: 'Last name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address'
            },
            course: {
              type: 'object',
              description: 'Course information'
            },
            semester: {
              type: 'number',
              description: 'Current semester'
            },
            academicYear: {
              type: 'string',
              description: 'Academic year'
            }
          }
        },
        Course: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Course ID'
            },
            courseName: {
              type: 'string',
              description: 'Course name'
            },
            courseCode: {
              type: 'string',
              description: 'Course code'
            },
            department: {
              type: 'string',
              description: 'Department'
            },
            duration: {
              type: 'number',
              description: 'Course duration in years'
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive'],
              description: 'Course status'
            }
          }
        },
        Fee: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Fee ID'
            },
            student: {
              type: 'string',
              description: 'Student ID'
            },
            feeType: {
              type: 'string',
              description: 'Type of fee'
            },
            amount: {
              type: 'number',
              description: 'Fee amount'
            },
            dueDate: {
              type: 'string',
              format: 'date',
              description: 'Due date'
            },
            status: {
              type: 'string',
              enum: ['pending', 'paid', 'overdue'],
              description: 'Payment status'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error'
            },
            message: {
              type: 'string',
              description: 'Error message'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object'
              },
              description: 'Validation errors'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'success'
            },
            message: {
              type: 'string',
              description: 'Success message'
            },
            data: {
              type: 'object',
              description: 'Response data'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js'] // Path to the API files
};

const specs = swaggerJsdoc(options);

module.exports = specs;
