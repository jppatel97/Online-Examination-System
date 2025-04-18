import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AcademicCapIcon, 
  ClockIcon, 
  CheckCircleIcon,
  ArrowRightOnRectangleIcon,
  BookOpenIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CalendarIcon,
  XCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalExams: 0,
    totalSubmissions: 0,
    pendingVerification: 0,
    averageScore: 0
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    if (!token) {
      navigate('/login');
      return;
    }

    // Verify teacher role
    if (userData.role !== 'teacher') {
      toast.error('Access denied. Teacher privileges required.');
      navigate('/login');
      return;
    }

    fetchExams();
  }, [navigate]);

  const fetchExams = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      
      console.log('Fetching exams for teacher:', userData.id);
      
      const response = await fetch('http://localhost:5000/api/exams', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch exams');
      }

      const data = await response.json();
      console.log('Fetched exams data:', data);
      
      // The backend should already filter exams for the teacher
      // No need to filter again on the frontend
      setExams(data.data || []);
      console.log('Setting exams:', data.data);

      // Calculate stats
      const totalSubmissions = data.data.reduce((acc, exam) => 
        acc + (exam.submissions?.length || 0), 0
      );

      const pendingVerification = data.data.reduce((acc, exam) => 
        acc + (exam.submissions?.filter(sub => !sub.verified)?.length || 0), 0
      );

      const allScores = data.data
        .flatMap(exam => exam.submissions || [])
        .filter(sub => sub.verified)
        .map(sub => sub.score || 0);

      const averageScore = allScores.length > 0
        ? Math.round((allScores.reduce((a, b) => a + b, 0) / allScores.length) * 10) / 10
        : 0;

      setStats({
        totalExams: data.data.length,
        totalSubmissions,
        pendingVerification,
        averageScore
      });

    } catch (err) {
      console.error('Error fetching exams:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  const handleCreateExam = () => {
    navigate('/create-exam');
  };

  const handleEditExam = async (examId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch the exam details first
      const response = await fetch(`http://localhost:5000/api/exams/${examId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch exam details');
      }

      const data = await response.json();
      console.log('Fetched exam details:', data);
      
      // Store the exam data in localStorage for editing
      localStorage.setItem('editExam', JSON.stringify(data.data));
      
      // Navigate to edit page
      navigate(`/edit-exam/${examId}`);
    } catch (err) {
      console.error('Error fetching exam details:', err);
      setError(err.message || 'Failed to fetch exam details');
    } finally {
      setLoading(false);
    }
  };

  const handleViewSubmissions = async (examId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch the exam details with submissions
      const response = await fetch(`http://localhost:5000/api/exams/${examId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch exam submissions');
      }

      const data = await response.json();
      console.log('Fetched exam submissions:', data);
      
      // Store the exam data in localStorage for viewing submissions
      localStorage.setItem('examSubmissions', JSON.stringify(data.data));
      
      // Navigate to submissions page
      navigate(`/exam-submissions/${examId}`);
    } catch (err) {
      console.error('Error fetching exam submissions:', err);
      setError(err.message || 'Failed to fetch exam submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExam = async (examId) => {
    if (!window.confirm('Are you sure you want to delete this exam? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/exams/${examId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete exam');
      }

      // Show success toast
      toast.success('Exam deleted successfully', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#4CAF50',
          color: '#fff',
        },
      });

      // Refresh the exams list
      fetchExams();
    } catch (err) {
      console.error('Error deleting exam:', err);
      // Show error toast
      toast.error(err.message || 'Failed to delete exam', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#f44336',
          color: '#fff',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md backdrop-blur-sm bg-white/90 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <BookOpenIcon className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <AcademicCapIcon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-gray-600 font-medium">
                  {JSON.parse(localStorage.getItem('userData') || '{}').name || 'Teacher'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-100 hover:shadow-primary/30"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <DocumentTextIcon className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold text-gray-900">Total Exams</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalExams}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <UserGroupIcon className="h-6 w-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">Submissions</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalSubmissions}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <ClockIcon className="h-6 w-6 text-yellow-500" />
              <h3 className="text-lg font-semibold text-gray-900">Pending</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.pendingVerification}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <AcademicCapIcon className="h-6 w-6 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900">Avg. Score</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.averageScore}%</p>
          </div>
        </div>

        {/* Create Exam Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Exams</h2>
          <button
            onClick={handleCreateExam}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <PlusIcon className="h-5 w-5" />
            Create New Exam
          </button>
        </div>

        {/* Exam List */}
        <div className="grid grid-cols-1 gap-6">
          {exams.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No exams created yet</p>
              <p className="text-sm text-gray-400 mt-2">Create your first exam to get started</p>
            </div>
          ) : (
            exams.map((exam) => (
              <div
                key={exam._id}
                className="bg-white overflow-hidden shadow-md hover:shadow-xl rounded-xl transition-all duration-200 border border-gray-100"
              >
                <div className="px-6 py-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <DocumentTextIcon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {exam.title}
                        </h3>
                        <div className="mt-1 flex items-center gap-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <ClockIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <p>{exam.duration} minutes</p>
                          </div>
                          <div className="text-sm text-gray-500">
                            {exam.questions.length} Questions
                          </div>
                          <div className="text-sm text-gray-500">
                            {exam.submissions?.length || 0} Submissions
                          </div>
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          Subject: {exam.subject}
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          {exam.description}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleViewSubmissions(exam._id)}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors duration-200"
                        title="View Submissions"
                        disabled={loading}
                      >
                        <UserGroupIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEditExam(exam._id)}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-500 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        title="Edit Exam"
                        disabled={loading}
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteExam(exam._id)}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Delete Exam"
                        disabled={loading}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
} 