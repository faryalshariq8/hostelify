# Hostel Management API Documentation

This document outlines the newly added endpoints for the Hostel Management Application Backend.
The server runs locally (e.g. `http://localhost:5000`). All `protect` routes require a Bearer token in the `Authorization` header.

## 1. Auth & Password Reset

### Forgot Password
- **Endpoint**: `/api/auth/forgotpassword`
- **Method**: `POST`
- **Access**: Public
- **Request Body**:
  ```json
  { "email": "student@example.com" }
  ```
- **Response**: Returns a raw `resetToken` (for development purposes) and success message.

### Reset Password
- **Endpoint**: `/api/auth/resetpassword`
- **Method**: `POST`
- **Access**: Public
- **Request Body**:
  ```json
  { 
    "resetToken": "abc123xyz...", 
    "password": "newpassword123" 
  }
  ```
- **Response**: Success message indicating password update.

### Logout
- **Endpoint**: `/api/auth/logout`
- **Method**: `POST`
- **Access**: Public
- **Request Body**: None
- **Response**: Success message. Frontend handles token deletion.

---

## 2. Profile Management

### View My Profile
- **Endpoint**: `/api/profile`
- **Method**: `GET`
- **Access**: Private (Student/Admin)
- **Response**: Returns full user object (excluding password).

### Edit Profile
- **Endpoint**: `/api/profile`
- **Method**: `PUT`
- **Access**: Private (Student/Admin)
- **Request Body**:
  ```json
  { 
    "fullName": "Jane Doe",
    "avatar": "https://res.cloudinary.com/..." 
  }
  ```
- **Response**: Updated user object.

### Change Password
- **Endpoint**: `/api/profile/password`
- **Method**: `PUT`
- **Access**: Private (Student/Admin)
- **Request Body**:
  ```json
  { 
    "oldPassword": "currentpassword",
    "newPassword": "newpassword123" 
  }
  ```
- **Response**: Success message.

---

## 3. Search & Pagination Endpoints
The following endpoints now support query parameters: `search`, `page`, `limit`, and `sort`.
- **Get Hostels**: `GET /api/hostels?search=xyz&page=1&limit=10&sort=-createdAt`
- **Get Rooms**: `GET /api/rooms?search=101&page=1&limit=10`
- **Get Complaints**: `GET /api/complaints?search=wifi&status=Pending`
- **Get Students**: `GET /api/users/students?search=jane` (Admin only)

---

## 4. Fee Management

### Create Fee Structure
- **Endpoint**: `/api/fees`
- **Method**: `POST`
- **Access**: Admin
- **Request Body**:
  ```json
  { 
    "hostel": "64abcdef...", 
    "roomType": "Single", 
    "amount": 15000 
  }
  ```

### Get My Fee Details
- **Endpoint**: `/api/fees/my`
- **Method**: `GET`
- **Access**: Student
- **Response**: Returns room allocation info and amount due based on fee structure.

---

## 5. Payments

### Make Online Payment
- **Endpoint**: `/api/payments/pay`
- **Method**: `POST`
- **Access**: Student
- **Request Body**:
  ```json
  { 
    "paymentMethod": "Card", 
    "amount": 15000,
    "semester": "Fall 2026"
  }
  ```
- **Response**: Payment details with auto-generated `transactionId` and `receiptNumber`.

### Get Payment History
- **Endpoint**: `/api/payments/history`
- **Method**: `GET`
- **Access**: Student
- **Response**: List of student's payments.

### Get All Payments
- **Endpoint**: `/api/payments`
- **Method**: `GET`
- **Access**: Admin
- **Query Params**: `search`, `status`, `page`, `limit`, `sort`
- **Response**: Paginated list of all payments in the system.

---

## 6. Announcements

### Create Announcement
- **Endpoint**: `/api/announcements`
- **Method**: `POST`
- **Access**: Admin
- **Request Body**:
  ```json
  { 
    "title": "Hostel Maintenance", 
    "description": "Water will be off for 2 hours tomorrow.",
    "targetAudience": "All"
  }
  ```

### Get Announcements
- **Endpoint**: `/api/announcements`
- **Method**: `GET`
- **Access**: Public/Student
- **Response**: List of announcements.

---

## 7. Reports Dashboard (Admin Only)

- **Main Dashboard Stats**: `GET /api/reports/dashboard`
  - Returns counts: students, hostels, rooms, occupancy, applications, complaints, revenue.
- **Monthly Revenue**: `GET /api/reports/revenue`
- **Hostel Occupancy**: `GET /api/reports/occupancy`
- **Complaint Trend**: `GET /api/reports/complaints`
- **Applications Per Month**: `GET /api/reports/applications`
