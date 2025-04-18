import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AcademicCapIcon, 
  ClockIcon, 
  CheckCircleIcon,
  ArrowRightOnRectangleIcon,
  BookOpenIcon,
  CalendarIcon,
  UserGroupIcon,
  XCircleIcon,
  ArrowRightIcon,
  UserIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('available');
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalExams: 0,
    completedExams: 0,
    pendingExams: 0,
    averageScore: 0
  });

  useEffect(() => {
    checkAuthAndFetchExams();
  }, []);

  const checkAuthAndFetchExams = async () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');

    if (!token || !userData) {
      console.log('No token or user data found, redirecting to login');
      navigate('/login');
      return;
    }

    try {
      // First test if the API is accessible
      const testResponse = await fetch('http://localhost:5000/api/exams/test');
      console.log('Test API response:', testResponse);
      
      if (!testResponse.ok) {
        throw new Error('Cannot connect to server');
      }

      // If test passes, fetch exams
      await fetchExams();
    } catch (err) {
      console.error('Initial check failed:', err);
      setError('Cannot connect to server. Please try again later.');
      setLoading(false);
    }
  };

  const fetchExams = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      
      console.log('Fetching exams with:', {
        token: token ? 'Present' : 'Missing',
        userData
      });
      
      const response = await fetch('http://localhost:5000/api/exams', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('Exams API Response:', {
        status: response.status,
        statusText: response.statusText
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          console.log('Unauthorized access, redirecting to login');
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          navigate('/login');
          return;
        }
        
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch exams (${response.status})`);
      }

      const data = await response.json();
      console.log('Received exam data:', data);

      if (!data.success || !data.data || !Array.isArray(data.data)) {
        throw new Error('Invalid data format received from server');
      }

      const processedExams = data.data.map(exam => ({
        ...exam,
        status: exam.submissions?.[0]
          ? (exam.submissions[0].verified ? 'Verified' : 'Submitted (Pending Verification)')
          : 'Not Attempted',
        score: exam.submissions?.[0]?.verified ? exam.submissions[0].score : null
      }));

      console.log('Processed exams:', processedExams);
      setExams(processedExams);

      // Calculate stats
      const totalExams = processedExams.length;
      const completedExams = processedExams.filter(exam => exam.status === 'Verified').length;
      const pendingExams = processedExams.filter(exam => exam.status === 'Submitted (Pending Verification)').length;
      
      const verifiedExams = processedExams.filter(exam => exam.status === 'Verified');
      const averageScore = verifiedExams.length > 0
        ? Math.round(verifiedExams.reduce((sum, exam) => sum + (exam.score || 0), 0) / verifiedExams.length)
        : 0;

      setStats({
        totalExams,
        completedExams,
        pendingExams,
        averageScore
      });

    } catch (err) {
      console.error('Error fetching exams:', err);
      setError(err.message || 'Failed to fetch exams');
      toast.error(err.message || 'Failed to fetch exams');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  const handleStartExam = (examId) => {
    const exam = exams.find(e => e._id === examId);
    if (!exam) {
      toast.error('Exam not found');
      return;
    }
    if (exam.status !== 'Not Attempted') {
      toast.error('You have already attempted this exam');
      return;
    }
    navigate(`/take-exam/${examId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <XCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-y-4">
            <button
              onClick={checkAuthAndFetchExams}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Try Again
            </button>
            <button
              onClick={handleLogout}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter exams based on active tab
  const filteredExams = exams.filter(exam => {
    if (activeTab === 'available') {
      return exam.status === 'Not Attempted';
    } else {
      return exam.status !== 'Not Attempted';
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md backdrop-blur-sm bg-white/90 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <BookOpenIcon className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-gray-600 font-medium">
                  {JSON.parse(localStorage.getItem('userData') || '{}').name || 'Student'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-all duration-200"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <BookOpenIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Exams</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalExams}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedExams}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingExams}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <AcademicCapIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Avg. Score</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageScore}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 border-b border-gray-200">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('available')}
              className={`${
                activeTab === 'available'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Available Exams
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`${
                activeTab === 'completed'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Completed Exams
            </button>
          </nav>
        </div>

        {/* Exam List */}
        <div className="mt-6 grid grid-cols-1 gap-6">
          {filteredExams.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {activeTab === 'available' 
                  ? 'No available exams at the moment.'
                  : 'You haven\'t completed any exams yet.'}
              </p>
            </div>
          ) : (
            filteredExams.map((exam) => (
              <div key={exam._id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{exam.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{exam.description}</p>
                    <div className="mt-4 flex items-center gap-4">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <ClockIcon className="h-4 w-4" />
                        <span>{exam.duration} minutes</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <DocumentTextIcon className="h-4 w-4" />
                        <span>{exam.questions?.length || 0} questions</span>
                      </div>
                      {exam.status !== 'Not Attempted' && (
                        <div className={`flex items-center gap-1 text-sm ${
                          exam.status === 'Verified' ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {exam.status === 'Verified' ? (
                            <CheckCircleIcon className="h-4 w-4" />
                          ) : (
                            <ClockIcon className="h-4 w-4" />
                          )}
                          <span>{exam.status}</span>
                          {exam.status === 'Verified' && (
                            <span className="ml-2 font-medium">Score: {exam.score}%</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {exam.status === 'Not Attempted' && (
                    <button
                      onClick={() => handleStartExam(exam._id)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-all duration-200"
                    >
                      Start Exam
                      <ArrowRightIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 