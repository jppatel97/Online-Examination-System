# Online Examination System

A modern, full-stack web application for conducting online examinations with role-based access control for students and teachers.

## 🌟 Features

- **User Authentication**
  - Secure registration and login system
  - Role-based access (Student/Teacher)
  - JWT-based authentication
  - Password encryption

- **Student Features**
  - View available exams
  - Take exams with timer
  - View exam results
  - Track progress and scores
  - View verified submissions

- **Teacher Features**
  - Create and manage exams
  - Add questions with multiple options
  - Set exam duration and points
  - Verify student submissions
  - View student performance
  - Manage exam status

- **Technical Features**
  - Real-time exam timer
  - Responsive design
  - Modern UI/UX
  - Secure data handling
  - Error handling and validation

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router
- React Hot Toast
- Heroicons

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- JWT Authentication
- Bcrypt.js

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account

## 🚀 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/online-examination-system.git
   cd online-examination-system
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

4. Create a `.env` file in the backend directory:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   ```

5. Start the development servers:
   - Frontend (from root directory):
     ```bash
     npm start
     ```
   - Backend (from backend directory):
     ```bash
     npm run dev
     ```

## 🔐 User Roles

### Student
- Register with email and password
- View available exams
- Take exams within time limit
- View results after verification
- Track progress

### Teacher
- Register with special teacher password
- Create and manage exams
- Add questions with correct answers
- Verify student submissions
- View student performance

## 📱 Usage

1. **Registration**
   - Students: Register with basic details
   - Teachers: Register with password starting with "PDPU"

2. **Login**
   - Use registered email and password
   - System redirects to appropriate dashboard

3. **Student Dashboard**
   - View available exams
   - Start exams
   - View results
   - Track progress

4. **Teacher Dashboard**
   - Create new exams
   - Manage existing exams
   - Verify submissions
   - View student performance

## 🐛 Error Handling

- Form validation
- Authentication errors
- Database errors
- Network errors
- User-friendly error messages

## 🔒 Security Features

- Password encryption
- JWT authentication
- Protected routes
- Role-based access control
- Input validation

