const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [{
    questionIndex: {
      type: Number,
      required: true
    },
    selectedOption: {
      type: Number,
      required: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    }
  }],
  score: {
    type: Number,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  verifiedAt: {
    type: Date
  },
  verifiedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

const ExamSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  subject: {
    type: String,
    required: [true, 'Please add a subject'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  duration: {
    type: Number,
    required: [true, 'Please add duration'],
    min: [1, 'Duration must be at least 1 minute']
  },
  questions: [{
    text: {
      type: String,
      required: [true, 'Please add question text']
    },
    options: [{
      type: String,
      required: [true, 'Please add option text']
    }],
    correctOption: {
      type: Number,
      required: [true, 'Please specify correct option']
    }
  }],
  submissions: [SubmissionSchema],
  teacher: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate submissions from the same student
ExamSchema.pre('save', function(next) {
  if (this.submissions && this.submissions.length > 0) {
    const studentIds = this.submissions.map(sub => sub.student.toString());
    const uniqueStudentIds = [...new Set(studentIds)];
    if (studentIds.length !== uniqueStudentIds.length) {
      next(new Error('A student cannot submit the same exam multiple times'));
    }
  }
  next();
});

module.exports = mongoose.model('Exam', ExamSchema); 