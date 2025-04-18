import React from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const StudentExamView = ({ submission, questions }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Your Answers</h2>
      {submission.answers.map((answer, index) => {
        const question = questions[answer.questionIndex];
        return (
          <div key={index} className="p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-grow">
                <h3 className="text-lg font-medium text-gray-900">
                  Question {answer.questionIndex + 1}
                </h3>
                <p className="mt-1 text-gray-600">{question.text}</p>
                
                <div className="mt-4 space-y-2">
                  {question.options.map((option, optIndex) => (
                    <div
                      key={optIndex}
                      className={`p-3 rounded-lg ${
                        answer.selectedOption === optIndex
                          ? 'bg-gray-50 border border-gray-300'
                          : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">{option}</span>
                        {answer.selectedOption === optIndex && (
                          <span className="text-sm font-medium text-gray-600">
                            Your Answer
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="ml-4">
                {answer.isCorrect ? (
                  <CheckCircleIcon className="h-6 w-6 text-green-500" />
                ) : (
                  <XCircleIcon className="h-6 w-6 text-gray-400" />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StudentExamView; 