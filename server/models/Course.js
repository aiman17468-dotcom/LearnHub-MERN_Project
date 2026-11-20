const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Lesson title is required'], trim: true },
  content: { type: String, trim: true },
  videoUrl: { type: String, trim: true },
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    description: { type: String, required: [true, 'Description is required'], trim: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, trim: true, default: 'General' },
    price: { type: Number, min: [0, 'Price cannot be negative'], default: 0 },
    lessons: [lessonSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
