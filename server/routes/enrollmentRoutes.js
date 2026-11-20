const express = require('express');
const { enroll, getMyCourses, updateProgress } = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Only students can enroll and see their enrolled courses
const studentOnly = [protect, authorize('student')];

router.post('/enroll', ...studentOnly, enroll);                                 // POST /api/enroll
router.get('/my-courses', ...studentOnly, getMyCourses);                        // GET  /api/my-courses
router.put('/my-courses/:courseId/progress', ...studentOnly, updateProgress);   // PUT  /api/my-courses/:courseId/progress

module.exports = router;
