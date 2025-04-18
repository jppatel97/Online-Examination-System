import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ClockIcon, 
  ExclamationCircleIcon,
  ArrowLeftIcon,
  ShieldExclamationIcon,
  CheckCircleIcon,
  QuestionMarkCircleIcon,
  ArrowRightIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

export default function TakeExam() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exam, setExam] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [warningCount, setWarningCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const maxWarnings = 3;
  const maxTabSwitches = 2;
  const autoSubmitDelay = 1000; // 1 second delay before auto-submit
  const [answeredCount, setAnsweredCount] = useState(0);

  useEffect(() => {
    const loadExam = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/exams/${examId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        console.log('Loaded exam data:', data);
        console.log('Questions:', data.data?.questions);

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch exam');
        }
        
        if (!data.data || !data.data.questions || data.data.questions.length === 0) {
          throw new Error('Invalid exam data received');
        }

        // Transform the questions data to match the expected format
        const transformedExam = {
          ...data.data,
          questions: data.data.questions.map(q => ({
            text: q.text,
            options: q.options.map(opt => opt.text || opt)
          }))
        };

        console.log('Transformed exam data:', transformedExam);
        setExam(transformedExam);
        setTimeLeft(data.data.duration * 60); // Convert minutes to seconds
        setIsPageLoaded(true);
      } catch (err) {
        console.error('Error loading exam:', err);
        setError(err.message || 'Failed to load exam');
      } finally {
        setLoading(false);
      }
    };

    loadExam();
  }, [examId]);

  // Timer effect
  useEffect(() => {
    if (!exam || timeLeft <= 0 || examSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [exam, timeLeft, examSubmitted]);

  // Security measures - only activate after page is loaded
  useEffect(() => {
    if (!isPageLoaded) return;

    let autoSubmitTimeout;
    let lastActiveTime = Date.now();
    let inactivityTimeout;

    const handleSubmitWithViolation = (reason) => {
      if (!examSubmitted) {
        handleSubmit(true, reason);
      }
    };

    const handleSecurityViolation = (message) => {
      showSecurityWarning(message);
    };

    // Disable right click
    const handleContextMenu = (e) => {
      e.preventDefault();
      handleSecurityViolation('Right-clicking is not allowed during the exam');
    };

    // Disable keyboard shortcuts
    const handleKeyDown = (e) => {
      // Prevent common shortcuts
      if (
        (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'p' || e.key === 's')) || // Copy, Paste, Print, Save
        (e.altKey && e.key === 'PrintScreen') ||
        e.key === 'PrintScreen'
      ) {
        e.preventDefault();
        handleSecurityViolation('Keyboard shortcuts are not allowed during the exam');
      }
    };

    // Disable copy and paste
    const handleCopyPaste = (e) => {
      e.preventDefault();
      handleSecurityViolation('Copying and pasting are not allowed during the exam');
    };

    // Handle visibility change (tab switching)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount(prev => {
          const newCount = prev + 1;
          if (newCount >= maxTabSwitches) {
            handleSecurityViolation('Excessive tab switching detected');
          }
          return newCount;
        });
        handleSecurityViolation('Switching tabs or windows is not allowed during the exam');
      }
    };

    // Handle user activity
    const resetInactivityTimer = () => {
      lastActiveTime = Date.now();
      clearTimeout(inactivityTimeout);
      inactivityTimeout = setTimeout(() => {
        handleSecurityViolation('User inactivity detected');
      }, 300000); // 5 minutes of inactivity
    };

    const handleActivity = () => {
      resetInactivityTimer();
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('paste', handleCopyPaste);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('mousemove', handleActivity);
    document.addEventListener('keypress', handleActivity);
    document.addEventListener('click', handleActivity);

    // Start inactivity timer
    resetInactivityTimer();

    // Attempt to request fullscreen
    const requestFullScreen = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } catch (error) {
        console.warn('Fullscreen request failed:', error);
        handleSecurityViolation('Fullscreen mode rejected');
      }
    };
    requestFullScreen();

    return () => {
      // Clean up event listeners and timeouts
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('copy', handleCopyPaste);
      document.removeEventListener('paste', handleCopyPaste);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('mousemove', handleActivity);
      document.removeEventListener('keypress', handleActivity);
      document.removeEventListener('click', handleActivity);
      clearTimeout(autoSubmitTimeout);
      clearTimeout(inactivityTimeout);
    };
  }, [isPageLoaded]);

  const handleSelectAnswer = (questionIndex, optionIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const handleSubmit = async (isAutoSubmit = false, reason = '') => {
    try {
      if (examSubmitted) return;
      setLoading(true);
      const token = localStorage.getItem('token');

      // Format answers for submission
      const answers = Object.entries(selectedAnswers).map(([questionIndex, selectedOption]) => ({
        questionIndex: parseInt(questionIndex),
        selectedOption
      }));

      const response = await fetch(`http://localhost:5000/api/exams/${examId}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answers })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit exam');
      }

      setExamSubmitted(true);
      alert(`Exam submitted successfully! Your score: ${data.data.score}%`);
      
      // Use the correct path for student dashboard
      navigate('/student');
    } catch (err) {
      console.error('Error submitting exam:', err);
      setError(err.message || 'Failed to submit exam');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const showSecurityWarning = (message) => {
    setWarningCount(prev => {
      const newCount = prev + 1;
      
      // Show warning message with try count
      const warningMessage = `Security Violation (${newCount}/3): ${message}`;
      alert(warningMessage);
      
      // Auto-submit after 3 violations
      if (newCount >= 3) {
        handleSubmit(true, 'Maximum security violations reached (3/3)');
        return newCount;
      }
      
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
      return newCount;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
          <ExclamationCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-center text-gray-900 mb-2">Error</h2>
          <p className="text-gray-500 text-center mb-6">{error}</p>
          <button
            onClick={() => navigate('/student')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-all duration-200"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
          <ExclamationCircleIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-center text-gray-900 mb-2">Exam Not Found</h2>
          <p className="text-gray-500 text-center mb-6">The exam you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/student')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-all duration-200"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQuestionData = exam.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      {/* Security Warning Alert */}
      {showWarning && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-bounce">
          <ShieldExclamationIcon className="h-5 w-5" />
          <div>
            <p className="font-medium">Security Warning ({warningCount}/3)</p>
            <p className="text-sm">Exam will auto-submit after 3 violations</p>
          </div>
        </div>
      )}

      {/* Security Status Indicator */}
      <div className="fixed top-4 left-4 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md z-50">
        <div className="flex items-center gap-2">
          <ShieldExclamationIcon className={`h-5 w-5 ${warningCount > 0 ? 'text-red-500' : 'text-green-500'}`} />
          <span className="text-sm font-medium">
            Violations: {warningCount}/3
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Exam Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{exam.title}</h1>
              <p className="text-gray-500">{exam.subject}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                Question {currentQuestion + 1} of {exam.questions.length}
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <ClockIcon className="h-5 w-5" />
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div
              className="bg-primary rounded-full h-1 transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / exam.questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {currentQuestionData?.text || 'No question text available'}
          </h2>
          <div className="space-y-3">
            {currentQuestionData?.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelectAnswer(currentQuestion, index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedAnswers[currentQuestion] === index
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 hover:border-primary/50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              currentQuestion === 0
                ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                : 'text-primary hover:bg-primary/10'
            }`}
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Previous
          </button>
          {currentQuestion === exam.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={loading || Object.keys(selectedAnswers).length !== exam.questions.length}
              className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Exam
              <CheckCircleIcon className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion(prev => Math.min(exam.questions.length - 1, prev + 1))}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-all duration-200"
            >
              Next
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Question Navigation */}
        <div className="mt-8">
          <div className="flex flex-wrap gap-2">
            {exam.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                  currentQuestion === index
                    ? 'bg-primary text-white'
                    : selectedAnswers[index] !== undefined
                    ? 'bg-primary/10 text-primary'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 