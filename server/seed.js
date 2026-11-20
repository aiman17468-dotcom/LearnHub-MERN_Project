// Run once with: npm run seed
// Creates demo users (admin, instructor, student) and sample courses
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Course = require('./models/Course');

const findOrCreate = async (data) => {
  const existing = await User.findOne({ email: data.email });
  return existing || User.create(data);
};

const run = async () => {
  await connectDB();

  const admin = await findOrCreate({
    name: process.env.ADMIN_NAME || 'Admin',
    email: process.env.ADMIN_EMAIL || 'admin@learnhub.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@123',
    role: 'admin',
  });
  const instructor = await findOrCreate({
    name: 'Demo Instructor',
    email: 'instructor@learnhub.com',
    password: 'Instructor@123',
    role: 'instructor',
  });
  await findOrCreate({
    name: 'Demo Student',
    email: 'student@learnhub.com',
    password: 'Student@123',
    role: 'student',
  });

  if ((await Course.countDocuments()) === 0) {
    await Course.create([
      {
        title: 'HTML & CSS Basics',
        description: 'Learn how to build and style responsive web pages from scratch.',
        category: 'Web Development',
        price: 0,
        instructor: instructor._id,
        lessons: [
          { title: 'Intro to HTML', content: 'Tags, elements and page structure.' },
          { title: 'Styling with CSS', content: 'Selectors, box model and flexbox.' },
        ],
      },
      {
        title: 'JavaScript for Beginners',
        description: 'Variables, functions, arrays and DOM in simple steps.',
        category: 'Programming',
        price: 1500,
        instructor: instructor._id,
        lessons: [{ title: 'Variables and Types', content: 'let, const and data types.' }],
      },
      {
        title: 'React Fundamentals',
        description: 'Components, props, state and hooks with real examples.',
        category: 'Web Development',
        price: 2500,
        instructor: instructor._id,
        lessons: [{ title: 'Your First Component', content: 'JSX and functional components.' }],
      },
    ]);
  }

  console.log('Seed complete.');
  console.log(`Admin:      ${admin.email} / ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);
  console.log('Instructor: instructor@learnhub.com / Instructor@123');
  console.log('Student:    student@learnhub.com / Student@123');
  await mongoose.disconnect();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
