import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import CreateExam from './pages/CreateExam';
import EditExam from './pages/EditExam';
import TakeExam from './pages/TakeExam';
import ExamResults from './pages/ExamResults';
import ExamDetails from './pages/ExamDetails';
import ExamSubmissions from './pages/ExamSubmissions';
import About from './pages/About';
import Features from './pages/Features';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Header from './components/Header';
import TeacherRegister from './pages/TeacherRegister';
import PrivateRoute from './components/PrivateRoute';

// Wrapper component to handle header visibility
function AppContent() {
  const location = useLocation();
  
  // Don't show header on exam pages
  const hideHeaderPaths = ['/take-exam'];
  const shouldShowHeader = !hideHeaderPaths.some(path => location.pathname.startsWith(path));

  return (
    <div className="min-h-screen bg-gray-50">
      {shouldShowHeader && <Header />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/teacher-register" element={<TeacherRegister />} />

        {/* Protected Teacher Routes */}
        <Route 
          path="/teacher" 
          element={
            <PrivateRoute allowedRoles={['teacher']}>
              <TeacherDashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/create-exam" 
          element={
            <PrivateRoute allowedRoles={['teacher']}>
              <CreateExam />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/edit-exam/:examId" 
          element={
            <PrivateRoute allowedRoles={['teacher']}>
              <EditExam />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/exam-submissions/:examId" 
          element={
            <PrivateRoute allowedRoles={['teacher']}>
              <ExamSubmissions />
            </PrivateRoute>
          } 
        />

        {/* Protected Student Routes */}
        <Route 
          path="/student" 
          element={
            <PrivateRoute allowedRoles={['student']}>
              <StudentDashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/take-exam/:examId" 
          element={
            <PrivateRoute allowedRoles={['student']}>
              <TakeExam />
            </PrivateRoute>
          } 
        />

        {/* Catch all other routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <AppContent />
    </Router>
  );
}

export default App; 