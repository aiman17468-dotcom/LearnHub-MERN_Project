const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const asyncHandler = require('../utils/asyncHandler');

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Admin can manage every course, an instructor only their own
const canManage = (course, user) =>
  user.role === 'admin' || course.instructor.equals(user._id);

const findCourse = async (id, res) => {
  const course = await Course.findById(id);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  return course;
};

const checkOwner = (course, user, res) => {
  if (!canManage(course, user)) {
    res.status(403);
    throw new Error('You can only manage your own courses');
  }
};

// GET /api/courses?search=&category=
const getCourses = asyncHandler(async (req, res) => {
  const { search, category } = req.query;
  const filter = {};
  if (search) filter.title = { $regex: escapeRegex(String(search)), $options: 'i' };
  if (category) filter.category = String(category);

  const courses = await Course.find(filter)
    .populate('instructor', 'name')
    .sort({ createdAt: -1 });
  res.json(courses);
});

// GET /api/courses/mine  (courses of the logged-in instructor)
const getMyCreatedCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ instructor: req.user._id })
    .populate('instructor', 'name')
    .sort({ createdAt: -1 });
  res.json(courses);
});

// GET /api/courses/:id
const getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate('instructor', 'name email');
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  res.json(course);
});

// POST /api/courses
const createCourse = asyncHandler(async (req, res) => {
  const { title, description, category, price } = req.body;
  const course = await Course.create({
    title,
    description,
    category,
    price,
    instructor: req.user._id,
  });
  res.status(201).json(course);
});

// PUT /api/courses/:id
const updateCourse = asyncHandler(async (req, res) => {
  const course = await findCourse(req.params.id, res);
  checkOwner(course, req.user, res);

  ['title', 'description', 'category', 'price'].forEach((field) => {
    if (req.body[field] !== undefined) course[field] = req.body[field];
  });
  await course.save();
  res.json(course);
});

// DELETE /api/courses/:id
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await findCourse(req.params.id, res);
  checkOwner(course, req.user, res);

  await Enrollment.deleteMany({ course: course._id });
  await course.deleteOne();
  res.json({ message: 'Course deleted successfully' });
});

// POST /api/courses/:id/lessons
const addLesson = asyncHandler(async (req, res) => {
  const course = await findCourse(req.params.id, res);
  checkOwner(course, req.user, res);

  const { title, content, videoUrl } = req.body;
  if (!title) {
    res.status(400);
    throw new Error('Lesson title is required');
  }
  course.lessons.push({ title, content, videoUrl });
  await course.save();
  res.status(201).json(course);
});

// DELETE /api/courses/:id/lessons/:lessonId
const deleteLesson = asyncHandler(async (req, res) => {
  const course = await findCourse(req.params.id, res);
  checkOwner(course, req.user, res);

  course.lessons.pull(req.params.lessonId);
  await course.save();
  res.json(course);
});

module.exports = {
  getCourses,
  getMyCreatedCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  addLesson,
  deleteLesson,
};
