import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ArrowLeftIcon,
  UserIcon,
  DocumentTextIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import StudentExamView from '../components/StudentExamView';

export default function ExamSubmissions() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExamDetails();
  }, [examId]);

  const fetchExamDetails = async () => {
    try {
      const token = localStorage.getItem('token');
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
      setExam(data.data);
    } catch (err) {
      console.error('Error fetching exam details:', err);
      setError(err.message || 'Failed to fetch exam details');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmission = async (submissionId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/exams/${examId}/verify/${submissionId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to verify submission');
      }

      await fetchExamDetails();
      alert('Submission verified successfully!');
    } catch (err) {
      console.error('Error verifying submission:', err);
      setError(err.message || 'Failed to verify submission');
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

  if (!exam) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
          <XCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-center text-gray-900 mb-2">Exam Not Found</h2>
          <p className="text-gray-500 text-center mb-6">The exam you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/teacher')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-all duration-200"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{exam.title} - Submissions</h1>
            <p className="mt-1 text-sm text-gray-500">View and verify student submissions</p>
          </div>
          <button
            onClick={() => navigate('/teacher')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Back to Dashboard
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {/* Exam Info */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <DocumentTextIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Questions</p>
                <p className="text-xl font-bold text-gray-900">{exam.questions.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <UserIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Submissions</p>
                <p className="text-xl font-bold text-gray-900">{exam.submissions?.length || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Verification</p>
                <p className="text-xl font-bold text-gray-900">
                  {exam.submissions?.filter(sub => !sub.verified)?.length || 0}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Verified</p>
                <p className="text-xl font-bold text-gray-900">
                  {exam.submissions?.filter(sub => sub.verified)?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Submissions List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Student Submissions</h2>
          </div>
          
          {exam.submissions?.length === 0 ? (
            <div className="p-8 text-center">
              <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No submissions yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {exam.submissions?.map((submission) => (
                <div key={submission._id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {submission.student.name}
                      </h3>
                      <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <ClockIcon className="h-4 w-4" />
                          Submitted: {new Date(submission.submittedAt).toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <DocumentTextIcon className="h-4 w-4" />
                          Score: {submission.score}%
                        </div>
                      </div>
                    </div>
                    {!submission.verified && (
                      <button
                        onClick={() => handleVerifySubmission(submission._id)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-all duration-200"
                      >
                        <CheckIcon className="h-4 w-4" />
                        Verify Submission
                      </button>
                    )}
                  </div>

                  {/* Use the new StudentExamView component */}
                  <StudentExamView 
                    submission={submission} 
                    questions={exam.questions}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 