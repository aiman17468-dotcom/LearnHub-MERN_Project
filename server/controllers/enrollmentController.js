const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const asyncHandler = require('../utils/asyncHandler');

// POST /api/enroll   body: { courseId }
const enroll = asyncHandler(async (req, res) => {
  const { courseId } = req.body;
  if (!courseId) {
    res.status(400);
    throw new Error('courseId is required');
  }

  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  const already = await Enrollment.findOne({ student: req.user._id, course: course._id });
  if (already) {
    res.status(409);
    throw new Error('You are already enrolled in this course');
  }

  const enrollment = await Enrollment.create({ student: req.user._id, course: course._id });
  res.status(201).json(enrollment);
});

// GET /api/my-courses
const getMyCourses = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user._id })
    .populate({ path: 'course', populate: { path: 'instructor', select: 'name' } })
    .sort({ createdAt: -1 });
  res.json(enrollments.filter((e) => e.course)); // skip enrollments of deleted courses
});

// PUT /api/my-courses/:courseId/progress   body: { progress }
const updateProgress = asyncHandler(async (req, res) => {
  const progress = Number(req.body.progress);
  if (Number.isNaN(progress)) {
    res.status(400);
    throw new Error('Progress must be a number');
  }

  const enrollment = await Enrollment.findOneAndUpdate(
    { student: req.user._id, course: req.params.courseId },
    { progress },
    { new: true, runValidators: true }
  );
  if (!enrollment) {
    res.status(404);
    throw new Error('You are not enrolled in this course');
  }
  res.json(enrollment);
});

module.exports = { enroll, getMyCourses, updateProgress };
