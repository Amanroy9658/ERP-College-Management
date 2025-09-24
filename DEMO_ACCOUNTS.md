# Demo Accounts for ERP Student Management System

## Backend Server
- **URL**: http://localhost:5000
- **Status**: ✅ Running

## Frontend Server  
- **URL**: http://localhost:3000 (or 3001 if 3000 is busy)
- **Status**: ✅ Running

## Demo Login Accounts

### Admin Account
- **Email**: admin@college.edu
- **Password**: admin123
- **Role**: Admin
- **Status**: Approved
- **Access**: Full system access, user management, analytics

### Student Accounts
- **Email**: john.doe@student.edu
- **Password**: student123
- **Role**: Student
- **Status**: Approved
- **Student ID**: STU001
- **Course**: Computer Science Engineering

- **Email**: jane.smith@student.edu
- **Password**: student123
- **Role**: Student
- **Status**: Approved
- **Student ID**: STU002
- **Course**: Business Administration

### Teacher Account
- **Email**: prof.williams@teacher.edu
- **Password**: teacher123
- **Role**: Teacher
- **Status**: Approved
- **Department**: Computer Science

### Staff Accounts
- **Email**: librarian@staff.edu
- **Password**: staff123
- **Role**: Librarian
- **Status**: Approved

- **Email**: warden@staff.edu
- **Password**: staff123
- **Role**: Warden
- **Status**: Approved

- **Email**: accountant@staff.edu
- **Password**: staff123
- **Role**: Accountant
- **Status**: Approved

## How to Test

1. **Open Browser**: Go to http://localhost:3000 (or 3001)
2. **Login**: Use any of the above credentials
3. **Role-based Access**: Each role will redirect to their respective dashboard
4. **Features**: Test all modules (Student Management, Fee Management, Hostel Management, etc.)

## API Testing

You can also test the API directly using curl or Postman:

```bash
# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@college.edu","password":"admin123"}'

# Test health check
curl http://localhost:5000/api/health
```

## Troubleshooting

- If you get 503 Service Unavailable: Backend server is not running
- If you get CORS errors: Check if both servers are running on correct ports
- If login fails: Use the exact email addresses listed above
