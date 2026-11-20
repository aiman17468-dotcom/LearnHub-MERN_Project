const express = require('express');
const {
  getCourses,
  getMyCreatedCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  addLesson,
  deleteLesson,
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();
const staff = [protect, authorize('instructor', 'admin')];

router.get('/', getCourses);                              // anyone can browse
router.get('/mine', ...staff, getMyCreatedCourses);       // must be before '/:id'
router.get('/:id', getCourse);

router.post('/', ...staff, createCourse);                 // instructor / admin
router.put('/:id', ...staff, updateCourse);               // owner / admin
router.delete('/:id', ...staff, deleteCourse);            // owner / admin
router.post('/:id/lessons', ...staff, addLesson);
router.delete('/:id/lessons/:lessonId', ...staff, deleteLesson);

module.exports = router;
