# 🏠 Hostelify — Hostel Management Mobile Application

<p align="center">
  <strong>A Full-Stack Mobile Hostel Management System</strong>
</p>

<p align="center">
  React Native · Expo · Node.js · Express.js · MongoDB Atlas · Railway
</p>

---

## 📌 Overview

**Hostelify** is a full-stack Hostel Management Mobile Application built using **React Native and Expo**, with a **Node.js/Express.js REST API** and **MongoDB Atlas** backend.

The application provides separate experiences for **students** and **administrators**, allowing hostel operations to be managed through a centralized digital platform.

Students can manage their hostel applications, room allocations, fees, complaints, announcements, leave requests, visitor requests, room transfers, and profile information.

Administrators can manage students, hostels, rooms, applications, complaints, fees, announcements, and reports.

The backend is deployed on **Railway**, allowing the mobile application to communicate with the API across multiple devices instead of relying on a local development server.

---

# 📱 Screenshots

## 🔐 Authentication

<p align="center">
  <img src="screenshots/login.png" width="250" alt="Hostelify Login Screen">
</p>

<p align="center">
  <strong>Login Screen</strong>
</p>

The authentication system supports secure student and administrator login with JWT-based authentication.

---

# 👨‍💼 Administrator Experience

## 📊 Admin Dashboard

<p align="center">
  <img src="screenshots/admin-dashboard-1.png" width="250" alt="Admin Dashboard Overview">
  <img src="screenshots/admin-dashboard-2.png" width="250" alt="Admin Dashboard Overview">
</p>

<p align="center">
  <strong>Admin Dashboard Overview</strong>
</p>

The administrator dashboard provides access to the major hostel management modules:

- Student management
- Hostel management
- Room management
- Hostel applications
- Complaints
- Fee management
- Announcements
- Reports

---

## 📢 Announcements

<p align="center">
  <img src="screenshots/announcements.png" width="250" alt="Announcements Management">
</p>

<p align="center">
  <strong>Announcements Management</strong>
</p>

Administrators can:

- Create announcements
- Edit announcements
- Delete announcements
- Define target audiences
- Manage hostel-wide notices

---

## 🛏️ Room Management

<p align="center">
  <img src="screenshots/manage-rooms.png" width="250" alt="Manage Rooms">
</p>

<p align="center">
  <strong>Room Management</strong>
</p>

Administrators can manage:

- Room numbers
- Room types
- Room capacities
- Occupancy
- Availability
- Hostel assignments

The system automatically keeps room availability and occupancy synchronized.

---

# 👨‍🎓 Student Experience

## 📱 Student Dashboard

<p align="center">
  <img src="screenshots/student-dashboard-1.png" width="250" alt="Student Dashboard Overview">
  <img src="screenshots/student-dashboard-2.png" width="250" alt="Student Dashboard Overview">
</p>

<p align="center">
  <strong>Student Dashboard Overview</strong>
</p>

Students have access to a centralized dashboard containing:

- Profile information
- Hostel application status
- Room allocation
- Fee information
- Announcements
- Complaints
- Leave requests
- Visitor requests
- Room transfer requests

---

## 🏠 Available Hostels & Applications

<p align="center">
  <img src="screenshots/available-hostels.png" width="250" alt="Available Hostels and Hostel Application">
</p>

<p align="center">
  <strong>Available Hostels</strong>
</p>

Students can:

- Browse available hostels
- View hostel information
- Check availability
- Submit hostel applications
- Track application status

---

## 👥 Visitor Requests

<p align="center">
  <img src="screenshots/visitor-requests.png" width="250" alt="Visitor Requests">
</p>

<p align="center">
  <strong>Visitor Requests</strong>
</p>

Students can submit and track visitor requests by providing:

- Visitor name
- Visit date
- Purpose
- Relationship
- Request information

---

# ✨ Features

## 🔐 Authentication & Security

- Student and administrator login
- JWT-based authentication
- Protected API routes
- Role-based authorization
- Admin-only functionality
- Persistent authentication sessions
- Automatic session validation
- Logout functionality
- Forgot password flow
- Password reset using reset tokens
- Password hashing using bcrypt/bcryptjs
- Protected backend resources

---

# 👨‍🎓 Student Features

## 📊 Student Dashboard

The student dashboard provides a centralized overview of:

- Profile
- Hostel application
- Room allocation
- Fees
- Announcements
- Complaints
- Leave requests
- Visitor requests
- Room transfers

## 👤 Student Profile

Students can view:

- Full name
- Email
- Role
- Hostel-related information
- Account information

## 🏠 Hostel Applications

Students can:

- Browse available hostels
- View hostel details
- Check hostel availability
- Submit hostel applications
- View application status

## 🛏️ Room Allocation

Students can view:

- Allocated room
- Room number
- Hostel
- Room type
- Occupancy information

## 💰 Fees & Payments

Students can:

- View hostel fee information
- View payment history
- Submit simulated payments
- Access payment-related information

The backend also includes **Stripe payment-intent functionality** for future payment processing integration.

## 📝 Complaints

Students can:

- Submit complaints
- Provide complaint descriptions
- View submitted complaints
- Track complaint status

## 📢 Announcements

Students can view announcements relevant to hostel residents.

## 🏖️ Leave Requests

Students can:

- Submit leave requests
- Specify start and end dates
- Provide a reason
- Track request status

## 👥 Visitor Requests

Students can:

- Submit visitor requests
- Provide visitor information
- Specify visit dates
- Specify purpose
- Specify relationship
- Track visitor request status

## 🔄 Room Transfer

Students can:

- Request a room transfer
- Select an available room
- Track transfer requests
- View transfer approval status

---

# 👨‍💼 Administrator Features

## 📊 Admin Dashboard

Administrators can access:

- Student management
- Hostel management
- Room management
- Hostel applications
- Complaint management
- Fee management
- Announcements
- Reports

## 👨‍🎓 Student Management

Administrators can:

- View registered students
- Search students
- Filter students
- Manage student information

## 🏠 Hostel Management

Administrators can:

- Create hostels
- Update hostels
- Delete hostels
- View hostel details
- Track total rooms
- Track available rooms
- Manage hostel information

## 🛏️ Room Management

Administrators can:

- Create rooms
- Update rooms
- Delete rooms
- Configure room capacity
- Set room types
- Track occupancy
- Track availability

The system automatically prevents invalid occupancy states and synchronizes room availability.

## 📋 Hostel Applications

Administrators can:

- View student applications
- Review applications
- Approve applications
- Allocate rooms to students

### Automatic Allocation Updates

When an application is approved:

1. A student allocation is created.
2. Room occupancy is updated.
3. Hostel availability is updated.
4. The room becomes unavailable when capacity is reached.

## 📝 Complaint Management

Administrators can:

- View complaints
- Search complaints
- Update complaint status
- Resolve complaints

## 💰 Fee Management

Administrators can configure fee structures based on:

- Hostel
- Room type
- Fee amount

## 💳 Payment Management

The backend supports:

- Payment intents
- Payment records
- Payment history
- Student payment information

## 📢 Announcement Management

Administrators can:

- Create announcements
- Edit announcements
- Delete announcements
- Define target audiences

## 📈 Reports Dashboard

Administrative reports include:

- Dashboard statistics
- Revenue information
- Hostel occupancy
- Complaint statistics
- Application statistics

---

# 📋 Complete Screen List

## 🔐 Authentication Screens

- Login
- Forgot Password
- Reset Password

## 👨‍🎓 Student Screens

- Student Dashboard
- Student Profile
- Available Hostels
- Hostel Application
- Room Allocation
- Fee Details
- Announcements
- Complaints
- Leave Requests
- Visitor Requests
- Room Transfer

## 👨‍💼 Administrator Screens

- Admin Dashboard
- Manage Students
- Manage Hostels
- Manage Rooms
- Manage Applications
- Manage Complaints
- Manage Fees
- Manage Announcements
- Reports Dashboard

---

# 🏗️ System Architecture

```text
┌──────────────────────────────┐
│      React Native App        │
│            + Expo            │
└──────────────┬───────────────┘
               │
               │ REST API / JWT
               ▼
┌──────────────────────────────┐
│     Node.js + Express.js     │
│         Backend API          │
└──────────────┬───────────────┘
               │
       ┌───────┴────────┐
       │                │
       ▼                ▼
┌──────────────┐  ┌──────────────────┐
│ MongoDB Atlas│  │ External Services │
│   Database   │  │ Stripe / Resend  │
└──────────────┘  └──────────────────┘
```

---

# 🛠️ Technology Stack

## 📱 Frontend

- React Native
- Expo
- JavaScript
- React Navigation
- Axios
- AsyncStorage
- Expo Blur
- Expo Splash Screen

## ⚙️ Backend

- Node.js
- Express.js
- REST API
- Mongoose
- JWT
- bcrypt / bcryptjs
- Stripe
- Resend

## 🗄️ Database

- MongoDB Atlas
- MongoDB Compass

## ☁️ Cloud & Deployment

- Railway — Backend hosting
- Cloudinary — Image hosting
- GitHub — Source code management

## 🧪 Development & Testing

- Android Studio
- Android Emulator
- Postman
- Git
- GitHub

---

# 🗄️ Database Models

Hostelify uses separate MongoDB collections for its major entities.

### User

Stores:

- Student/admin accounts
- Name
- Email
- Password
- Role

### Hostel

Stores:

- Hostel name
- Location
- Description
- Total rooms
- Available rooms
- Hostel image URL

### Room

Stores:

- Hostel
- Room number
- Room type
- Capacity
- Occupancy
- Fee
- Availability

### HostelApplication

Stores student hostel applications and their statuses.

### RoomAllocation

Stores approved room allocations.

### Complaint

Stores student complaints and their statuses.

### FeeStructure

Stores hostel and room-type fee configurations.

### FeePayment

Stores student payment records.

### Announcement

Stores hostel announcements and their target audiences.

### LeaveRequest

Stores student leave requests.

### VisitorRequest

Stores student visitor requests.

### RoomTransferRequest

Stores room transfer requests and approval information.

---

# 🔌 API Modules

The backend exposes REST endpoints for:

```text
/api/auth
/api/profile
/api/dashboard
/api/hostels
/api/rooms
/api/applications
/api/complaints
/api/fees
/api/payments
/api/announcements
/api/leaves
/api/visitors
/api/reports
```

Authentication uses JWT tokens attached to protected requests.

---

# 🔑 Authentication Flow

```text
User Login
    │
    ▼
POST /api/auth/login
    │
    ▼
Backend validates credentials
    │
    ▼
JWT generated
    │
    ▼
Token stored in AsyncStorage
    │
    ▼
API requests include:
Authorization: Bearer <token>
    │
    ▼
Protected backend route
```

The application also validates the saved authentication session when the app starts.

---

# ☁️ Deployment

The backend is deployed using **Railway**.

### Production API

```text
https://hostelify-production.up.railway.app
```

The mobile application communicates with the deployed backend rather than relying on the local development server.

This allows the application to work across multiple physical devices as long as they have internet access.

---

# 🖼️ Image Hosting

Hostel images are hosted using **Cloudinary**.

The application stores Cloudinary image URLs in MongoDB instead of storing image files directly in the database.

---

# 🚀 Running the Project Locally

## 1. Clone the Repository

```bash
git clone https://github.com/faryalshariq8/hostelify.git
cd hostelify
```

## 2. Install Backend Dependencies

```bash
cd backend
npm install
```

Create a `.env` file containing the required backend configuration.

Example:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
RESEND_API_KEY=your_resend_api_key
```

> ⚠️ Never commit your `.env` file to GitHub.

## 3. Start the Backend

```bash
npm run dev
```

The local backend runs on:

```text
http://localhost:5000
```

## 4. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

## 5. Run the Android Development Build

Make sure an Android emulator is running:

```bash
npx expo run:android
```

---

# 📦 Building the Android APK

To generate a release APK:

```bash
npx expo run:android --variant release
```

The generated APK can be found at:

```text
frontend/android/app/build/outputs/apk/release/app-release.apk
```

The APK can then be transferred to an Android phone and installed for testing.

Because the application communicates with the deployed Railway backend, the release APK does not need the local `localhost` or `10.0.2.2` backend when used on a physical device.

---

# 🧪 API Testing

The project includes API testing resources for:

- Authentication
- Hostel management
- Rooms
- Applications
- Allocations
- Fees
- Payments
- Complaints
- Announcements
- Leave requests
- Visitor requests
- Room transfers
- Reports

Postman can be used to test the REST API endpoints.

---

# 🔒 Security

Sensitive configuration is intentionally excluded from source control.

The following should **never** be committed:

```text
.env
API keys
JWT secrets
Stripe secret keys
Resend API keys
Database credentials
```

GitHub Push Protection is used to help prevent accidental secret exposure.

---

# 🎨 UI & Design

Hostelify uses a modern, soft visual design featuring:

- 🤎 Brown and cream color palette
- 🪟 Glassmorphism-inspired cards
- 🔲 Rounded UI components
- ✨ Blur effects
- 📝 Consistent typography
- 📱 Mobile-friendly layouts
- 👨‍🎓 Dedicated student experience
- 👨‍💼 Dedicated administrator experience

The interface maintains a consistent visual language across the application's major screens.

---

# 📂 Project Structure

```text
hostelify/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── assets/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── navigation/
│   │   ├── screens/
│   │   │   ├── admin/
│   │   │   └── student/
│   │   └── services/
│   ├── app.json
│   └── package.json
│
├── screenshots/
│   ├── login.png
│   ├── admin-dashboard-1.png
│   ├── admin-dashboard-2.png
│   ├── announcements.png
│   ├── manage-rooms.png
│   ├── student-dashboard-1.png
│   ├── student-dashboard-2.png
│   ├── available-hostels.png
│   └── visitor-requests.png
│
├── API_DOCS.md
├── .gitignore
└── README.md
```

---

# 🧑‍💻 Author

**Faryal Shariq**

Full-Stack Mobile Application Project

Built using:

- React Native
- Expo
- Node.js
- Express.js
- MongoDB Atlas
- Railway
- Cloudinary

---

# 📄 License

This project was developed as an academic/software development project.

---

# ⭐ Project Highlights

Hostelify demonstrates full-stack application development through:

- 📱 Mobile application development
- 🔌 REST API development
- 🔐 JWT authentication
- 👥 Role-based authorization
- 🗄️ MongoDB database design
- 🔄 CRUD operations
- 🛏️ Room allocation logic
- 🏠 Hostel availability management
- 💳 Payment integration
- ☁️ Cloud image hosting
- 💾 Persistent mobile sessions
- 🧪 API testing
- 🚀 Cloud backend deployment
- 📦 Android APK generation
- 🔧 Git/GitHub version control

---

<p align="center">
  <strong>Hostelify — Simplifying Hostel Management 📱🏠</strong>
</p>
