# ERP Student Management System

A comprehensive Enterprise Resource Planning (ERP) system designed to solve the fragmented data management issues in educational institutions. This system integrates admissions, fee collection, hostel allocation, and examination records into a unified platform.

## 🎯 Problem Solved

Currently, educational institutions handle:
- **Admissions** - Separate systems for student registration
- **Fee Collection** - Disconnected payment tracking
- **Hostel Allocation** - Manual room assignment processes
- **Examination Records** - Isolated result management
- **User Management** - No centralized role-based access control
- **Form Processing** - Manual form submissions and approvals

This leads to:
- ❌ Duplicate data entry across systems
- ❌ Lack of real-time monitoring
- ❌ Data inconsistency and errors
- ❌ Inefficient administrative processes
- ❌ Security vulnerabilities
- ❌ Poor user experience

## ✅ Solution

Our ERP system provides:
- ✅ **Unified Database** - Single source of truth for all student data
- ✅ **Real-time Monitoring** - Live dashboard with key metrics
- ✅ **Integrated Modules** - Seamless data flow between systems
- ✅ **Automated Processes** - Reduced manual work and errors
- ✅ **Role-based Access Control** - Secure access for different user types
- ✅ **Admin Approval Workflow** - Centralized account management
- ✅ **Google Forms Integration** - Seamless form submissions
- ✅ **Mobile-responsive Design** - Access from any device

## 🏗️ Architecture

### Backend (Node.js + Express + MongoDB)
```
backend/
├── models/           # Database schemas
│   ├── Student.js   # Student information
│   ├── Course.js    # Course management
│   ├── Fee.js       # Fee structure and payments
│   ├── Hostel.js    # Hostel and room management
│   └── Examination.js # Exams and results
├── routes/          # API endpoints
│   ├── auth.js      # Authentication
│   ├── students.js  # Student management
│   ├── courses.js   # Course management
│   ├── fees.js      # Fee management
│   ├── hostels.js   # Hostel management
│   ├── examinations.js # Exam management
│   └── dashboard.js # Analytics and reports
├── middleware/      # Authentication and validation
└── server.js       # Main server file
```

### Frontend (Next.js + React + TypeScript)
```
frontend/
├── src/
│   ├── app/         # Next.js app directory
│   └── components/  # React components
│       ├── Dashboard.tsx           # Main dashboard
│       ├── StudentManagement.tsx   # Student module
│       ├── FeeManagement.tsx      # Fee module
│       ├── HostelManagement.tsx   # Hostel module
│       ├── ExaminationManagement.tsx # Exam module
│       ├── Navigation.tsx         # Sidebar navigation
│       └── AppLayout.tsx          # Main layout
└── package.json
```

## 🚀 Features

### 🔐 Authentication & Authorization
- **Multi-role Registration** - Students, Teachers, Staff, Librarian, Warden, Admin
- **Admin Approval System** - Centralized account approval workflow
- **Secure Login** - JWT-based authentication with role-based access
- **Account Security** - Password hashing, login attempt limiting

### 📊 Admin Dashboard
- **User Management** - Approve/reject user registrations
- **System Overview** - Real-time statistics and KPIs
- **Role Management** - Manage different user roles and permissions
- **Analytics** - Comprehensive reporting and insights

### 👨‍🎓 Student Portal
- **Personal Dashboard** - Academic information and quick actions
- **Examination Schedule** - Upcoming exams and results
- **Hostel Information** - Room allocation and fee management
- **Mess Services** - Meal plans and payment tracking
- **Google Forms Integration** - Seamless form submissions
- **Library Services** - Book borrowing and fine management

### 👨‍🏫 Teacher Dashboard
- **Class Management** - Student lists and attendance
- **Exam Management** - Create and manage examinations
- **Grade Entry** - Result entry and grade management
- **Subject Management** - Course and curriculum management

### 🏠 Hostel Management
- **Room Allocation** - Automated room assignment
- **Occupancy Tracking** - Real-time room availability
- **Fee Management** - Hostel fee collection and tracking
- **Maintenance Requests** - Facility management

### 💰 Fee Management
- **Flexible Fee Structure** - Multiple fee types and categories
- **Payment Tracking** - Complete payment history
- **Automated Notifications** - Due date reminders
- **Revenue Analytics** - Financial reporting and insights

### 📚 Examination Management
- **Exam Scheduling** - Automated exam timetable generation
- **Result Management** - Grade calculation and result publishing
- **Performance Analytics** - Student performance tracking
- **Question Paper Management** - Secure exam paper handling

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Hook Form** - Form management

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Troubleshooting

#### Common Issues:

**1. Network Error / Backend Connection Failed**
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB (if not running)
mongod --dbpath ./data/db

# Check backend server
cd backend
npm run dev
# Should show: Server running on port 5000
```

**2. Frontend Build Errors**
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**3. Database Connection Issues**
```bash
# Check MongoDB connection
mongo
# Should connect to MongoDB shell

# Create database directory
mkdir -p data/db
```

**4. Port Already in Use**
```bash
# Kill processes on ports 3000 and 5000
npx kill-port 3000
npx kill-port 5000
```

### Backend Setup
```bash
cd backend
npm install
cp config.env.example config.env
# Edit config.env with your database credentials
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Create Admin User
```bash
cd backend
npm run create-admin
# This creates an admin user with:
# Email: admin@college.edu
# Password: admin123
# Please change password after first login
```

### Quick Setup (Windows)
```bash
# Run the setup script
setup.bat

# Start development servers
start-dev.bat
```

### Environment Variables
Create `backend/config.env`:
```env
MONGODB_URI=mongodb://localhost:27017/student_erp
PORT=5000
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration (any role)
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password

### Admin Management
- `GET /api/admin/pending-approvals` - Get pending user approvals
- `POST /api/admin/approve-user/:id` - Approve/reject user
- `GET /api/admin/users` - Get all users with filtering
- `PUT /api/admin/users/:id/status` - Update user status
- `GET /api/admin/dashboard-stats` - Admin dashboard statistics

### Students
- `GET /api/students` - Get all students (with pagination)
- `GET /api/students/:id` - Get student by ID
- `PUT /api/students/:id/status` - Update student status
- `GET /api/students/stats/overview` - Student statistics

### Fees
- `GET /api/fees` - Get fee records
- `POST /api/fees` - Create fee record
- `POST /api/fees/:id/payment` - Record payment
- `GET /api/fees/overdue` - Get overdue fees

### Hostels
- `GET /api/hostels` - Get all hostels
- `POST /api/hostels` - Create hostel
- `POST /api/hostels/allocate` - Allocate room to student
- `GET /api/hostels/rooms/available` - Get available rooms

### Examinations
- `GET /api/examinations/subjects` - Get all subjects
- `POST /api/examinations/exams` - Create exam
- `POST /api/examinations/results` - Record exam result
- `GET /api/examinations/semester-results/:studentId` - Get student results

## 📊 Database Schema

### Student Schema
```javascript
{
  studentId: String,        // Unique student identifier
  firstName: String,
  lastName: String,
  email: String,           // Unique email
  phone: String,
  dateOfBirth: Date,
  gender: String,
  course: ObjectId,       // Reference to Course
  semester: Number,
  academicYear: String,
  admissionDate: Date,
  admissionStatus: String, // Pending, Approved, Rejected
  status: String,         // Active, Inactive, Graduated
  // ... additional fields
}
```

### Fee Schema
```javascript
{
  student: ObjectId,      // Reference to Student
  academicYear: String,
  semester: Number,
  fees: {
    tuitionFee: { amount: Number, paid: Number, due: Number },
    semesterFee: { amount: Number, paid: Number, due: Number },
    examinationFee: { amount: Number, paid: Number, due: Number },
    // ... other fee types
  },
  totalAmount: Number,
  totalPaid: Number,
  totalDue: Number,
  payments: [Payment],    // Payment history
  overallStatus: String   // Paid, Partial, Pending, Overdue
}
```

## 🎨 UI/UX Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Modern Interface** - Clean, intuitive design with Tailwind CSS
- **Real-time Updates** - Live data updates and notifications
- **Accessibility** - WCAG compliant components
- **Dark Mode Ready** - Prepared for theme switching

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for password security
- **Input Validation** - Server-side validation for all inputs
- **Rate Limiting** - API rate limiting to prevent abuse
- **CORS Protection** - Cross-origin request security
- **Helmet.js** - Security headers

## 📈 Performance Optimizations

- **Database Indexing** - Optimized queries with proper indexes
- **Pagination** - Efficient data loading for large datasets
- **Caching** - Strategic caching for frequently accessed data
- **Code Splitting** - Optimized bundle sizes
- **Lazy Loading** - Components loaded on demand

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB instance
2. Configure environment variables
3. Deploy to Heroku, AWS, or your preferred platform

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or your preferred platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- [ ] Mobile app development
- [ ] Advanced reporting and analytics
- [ ] Integration with external payment gateways
- [ ] Email and SMS notifications
- [ ] Multi-language support
- [ ] Advanced user roles and permissions
- [ ] API documentation with Swagger
- [ ] Automated testing suite
- [ ] Performance monitoring
- [ ] Backup and recovery systems

---

**Built with ❤️ for educational institutions**
