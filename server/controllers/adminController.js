const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const asyncHandler = require('../utils/asyncHandler');
const formatUser = require('../utils/formatUser');

// GET /api/admin/users
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users.map((u) => ({ ...formatUser(u), createdAt: u.createdAt })));
});

// DELETE /api/admin/users/:id
const deleteUser = asyncHandler(async (req, res) => {
  if (String(req.params.id) === String(req.user._id)) {
    res.status(400);
    throw new Error('You cannot delete your own account');
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Remove the data that belongs to this user
  if (user.role === 'instructor') {
    const courses = await Course.find({ instructor: user._id }).select('_id');
    const courseIds = courses.map((c) => c._id);
    await Enrollment.deleteMany({ course: { $in: courseIds } });
    await Course.deleteMany({ _id: { $in: courseIds } });
  }
  await Enrollment.deleteMany({ student: user._id });
  await user.deleteOne();

  res.json({ message: 'User deleted successfully' });
});

// GET /api/admin/analytics
const getAnalytics = asyncHandler(async (req, res) => {
  const [roleCounts, totalCourses, totalEnrollments, topCourses] = await Promise.all([
    User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
    Course.countDocuments(),
    Enrollment.countDocuments(),
    Enrollment.aggregate([
      { $group: { _id: '$course', enrollments: { $sum: 1 } } },
      { $sort: { enrollments: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'courses', localField: '_id', foreignField: '_id', as: 'course' } },
      { $unwind: '$course' },
      { $project: { _id: 0, title: '$course.title', enrollments: 1 } },
    ]),
  ]);

  const roles = { admin: 0, instructor: 0, student: 0 };
  roleCounts.forEach((r) => {
    roles[r._id] = r.count;
  });
  const totalUsers = roles.admin + roles.instructor + roles.student;

  res.json({ totalUsers, roles, totalCourses, totalEnrollments, topCourses });
});

module.exports = { getUsers, deleteUser, getAnalytics };
