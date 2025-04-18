import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ClockIcon,
  CalendarIcon,
  UserGroupIcon,
  ChartBarIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

function ExamDetails() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);

  useEffect(() => {
    const allExams = JSON.parse(localStorage.getItem('exams') || '[]');
    const currentExam = allExams.find(e => e.id.toString() === examId);
    if (currentExam) {
      setExam(currentExam);
    }
  }, [examId]);

  if (!exam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Exam not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/teacher')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Back to Dashboard
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{exam.title}</h1>
              <p className="text-lg text-gray-600 mt-1">{exam.subject}</p>
            </div>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
              exam.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <ClockIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="text-xl font-bold text-gray-900">{exam.duration} min</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <DocumentTextIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Questions</p>
                <p className="text-xl font-bold text-gray-900">{exam.questions.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Submissions</p>
                <p className="text-xl font-bold text-gray-900">{exam.submissions || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. Score</p>
                <p className="text-xl font-bold text-gray-900">
                  {exam.lastSubmission ? `${exam.lastSubmission.score}%` : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Questions</h2>
          <div className="space-y-6">
            {exam.questions.map((question, index) => (
              <div key={index} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Question {index + 1}
                    </h3>
                    <p className="mt-2 text-gray-700">{question.text}</p>
                  </div>
                  {exam.lastSubmission && (
                    <div className="flex items-center gap-2">
                      {exam.lastSubmission.answers[index] === question.correctOption ? (
                        <CheckCircleIcon className="h-6 w-6 text-green-500" />
                      ) : (
                        <XCircleIcon className="h-6 w-6 text-red-500" />
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4 space-y-3">
                  {question.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className={`p-4 rounded-lg border-2 ${
                        question.correctOption === optionIndex
                          ? 'border-green-500 bg-green-50'
                          : exam.lastSubmission?.answers[index] === optionIndex
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">{option}</span>
                        {question.correctOption === optionIndex && (
                          <span className="text-sm font-medium text-green-600">
                            Correct Answer
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submission Details */}
        {exam.lastSubmission && (
          <div className="mt-8 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Latest Submission</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600">Submitted At</p>
                <p className="text-lg font-medium text-gray-900">
                  {new Date(exam.lastSubmission.submittedAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Time Spent</p>
                <p className="text-lg font-medium text-gray-900">
                  {Math.floor(exam.lastSubmission.timeSpent / 60)} minutes
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Score</p>
                <p className="text-lg font-medium text-green-600">
                  {exam.lastSubmission.score}%
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExamDetails; 