import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  BookOpenIcon,
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

export default function EditExam() {
  const navigate = useNavigate();
  const { examId } = useParams();
  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState({
    title: '',
    subject: '',
    description: '',
    duration: 0,
    questions: []
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchExamDetails();
  }, [examId, navigate]);

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
      
      if (!data.success || !data.data) {
        throw new Error('Invalid exam data received');
      }

      // Format the exam data
      const formattedExam = {
        title: data.data.title || '',
        subject: data.data.subject || '',
        description: data.data.description || '',
        duration: data.data.duration || 0,
        questions: data.data.questions.map(q => ({
          text: q.text || '',
          options: Array.isArray(q.options) ? q.options : ['', '', '', ''],
          correctOption: typeof q.correctOption === 'number' ? q.correctOption : 0
        }))
      };

      console.log('Formatted exam data:', formattedExam);
      setExam(formattedExam);
    } catch (error) {
      console.error('Error fetching exam:', error);
      toast.error(error.message || 'Failed to fetch exam details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Validate exam data
      if (!exam.title || !exam.subject || !exam.duration) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Ensure questions array is not empty
      if (exam.questions.length === 0) {
        toast.error('Please add at least one question');
        return;
      }

      // Validate each question
      for (let i = 0; i < exam.questions.length; i++) {
        const question = exam.questions[i];
        if (!question.text) {
          toast.error(`Question ${i + 1} text is required`);
          return;
        }
        if (!question.options || question.options.some(opt => !opt)) {
          toast.error(`All options for Question ${i + 1} are required`);
          return;
        }
      }

      // Format the exam data
      const examData = {
        title: exam.title.trim(),
        subject: exam.subject.trim(),
        description: exam.description.trim(),
        duration: Number(exam.duration),
        questions: exam.questions.map(q => ({
          text: q.text.trim(),
          options: q.options.map(opt => opt.trim()),
          correctOption: Number(q.correctOption)
        }))
      };

      console.log('Sending exam data:', examData); // Debug log

      const response = await fetch(`http://localhost:5000/api/exams/${examId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(examData)
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if the error is due to existing submissions
        if (data.error === 'Cannot update exam with existing submissions') {
          toast.error('Cannot edit exam that has been attempted by students', {
            duration: 4000,
            position: 'top-right',
            style: {
              background: '#f44336',
              color: '#fff',
              minWidth: '300px'
            }
          });
          navigate('/teacher');
          return;
        }
        throw new Error(data.error || 'Failed to update exam');
      }

      toast.success('Exam updated successfully');
      navigate('/teacher');
    } catch (error) {
      console.error('Error updating exam:', error);
      toast.error(error.message || 'Failed to update exam. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...exam.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    setExam({ ...exam, questions: updatedQuestions });
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...exam.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setExam({ ...exam, questions: updatedQuestions });
  };

  const addQuestion = () => {
    setExam({
      ...exam,
      questions: [
        ...exam.questions,
        {
          text: '',
          options: ['', '', '', ''],
          correctOption: 0
        }
      ]
    });
  };

  const removeQuestion = (index) => {
    const updatedQuestions = exam.questions.filter((_, i) => i !== index);
    setExam({ ...exam, questions: updatedQuestions });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/teacher')}
                className="mr-4 p-2 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                <BookOpenIcon className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-gray-900">Edit Exam</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={exam.title}
                  onChange={(e) => setExam({ ...exam, title: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  type="text"
                  value={exam.subject}
                  onChange={(e) => setExam({ ...exam, subject: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={exam.description}
                  onChange={(e) => setExam({ ...exam, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={exam.duration}
                  onChange={(e) => setExam({ ...exam, duration: parseInt(e.target.value) })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  required
                  min="1"
                />
              </div>
            </div>
          </div>

          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Questions</h2>
              <button
                type="button"
                onClick={addQuestion}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg"
              >
                <PlusIcon className="h-5 w-5" />
                Add Question
              </button>
            </div>

            <div className="space-y-6">
              {exam.questions.map((question, questionIndex) => (
                <div key={questionIndex} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-md font-medium text-gray-900">
                      Question {questionIndex + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeQuestion(questionIndex)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Question Text
                      </label>
                      <input
                        type="text"
                        value={question.text}
                        onChange={(e) => handleQuestionChange(questionIndex, 'text', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Options
                      </label>
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                            placeholder={`Option ${optionIndex + 1}`}
                            required
                          />
                          <input
                            type="radio"
                            name={`correct-${questionIndex}`}
                            checked={question.correctOption === optionIndex}
                            onChange={() => handleQuestionChange(questionIndex, 'correctOption', optionIndex)}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                            required
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/teacher')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
} 