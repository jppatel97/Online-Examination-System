const express = require('express');
const router = express.Router();
const {
  createExam,
  getExams,
  getExam,
  updateExam,
  deleteExam,
  submitExam,
  verifySubmission
} = require('../controllers/exam');
const { protect, authorize } = require('../middleware/auth');

// Test route - no auth required
router.get('/test', (req, res) => {
  res.json({ message: 'Exam route working!' });
});

router
  .route('/')
  .get(protect, getExams)
  .post(protect, authorize('teacher'), createExam);

router
  .route('/:id')
  .get(protect, getExam)
  .put(protect, authorize('teacher'), updateExam)
  .delete(protect, authorize('teacher'), deleteExam);

router
  .route('/:id/submit')
  .post(protect, authorize('student'), submitExam);

router
  .route('/:id/verify/:submissionId')
  .put(protect, authorize('teacher'), verifySubmission);

module.exports = router; 