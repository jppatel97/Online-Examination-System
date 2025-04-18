import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

function ExamResults() {
  const navigate = useNavigate();

  // Mock exam results data
  const examResults = {
    title: 'Mathematics Final Exam',
    score: 85,
    totalQuestions: 10,
    correctAnswers: 8,
    incorrectAnswers: 2,
    questions: [
      {
        id: 1,
        text: 'What is 2 + 2?',
        correctAnswer: 1,
        selectedAnswer: 1,
        options: ['3', '4', '5', '6'],
      },
      {
        id: 2,
        text: 'What is the square root of 16?',
        correctAnswer: 1,
        selectedAnswer: 3,
        options: ['2', '4', '6', '8'],
      },
      // Add more questions as needed
    ],
  };

  const handleBackToDashboard = () => {
    navigate('/student');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          {/* Header */}
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Exam Results</h2>
            <p className="mt-1 text-sm text-gray-500">{examResults.title}</p>
          </div>

          {/* Score Summary */}
          <div className="px-4 py-5 sm:p-6">
            <div className="bg-primary bg-opacity-5 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500">Your Score</p>
                  <p className="mt-2 text-4xl font-bold text-primary">
                    {examResults.score}%
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    {examResults.correctAnswers} out of {examResults.totalQuestions} correct
                  </p>
                </div>
              </div>
            </div>

            {/* Question Review */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Question Review</h3>
              {examResults.questions.map((question) => (
                <div
                  key={question.id}
                  className={`border rounded-lg p-4 ${
                    question.correctAnswer === question.selectedAnswer
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start">
                    {question.correctAnswer === question.selectedAnswer ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mt-1" />
                    ) : (
                      <XCircleIcon className="h-5 w-5 text-red-500 mt-1" />
                    )}
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {question.text}
                      </p>
                      <div className="mt-2 space-y-2">
                        {question.options.map((option, index) => (
                          <div
                            key={index}
                            className={`text-sm ${
                              index === question.correctAnswer
                                ? 'text-green-600 font-medium'
                                : index === question.selectedAnswer &&
                                  index !== question.correctAnswer
                                ? 'text-red-600 font-medium'
                                : 'text-gray-500'
                            }`}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-4 sm:px-6 border-t border-gray-200">
            <button
              onClick={handleBackToDashboard}
              className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExamResults; 