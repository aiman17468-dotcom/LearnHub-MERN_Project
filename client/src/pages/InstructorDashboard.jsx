import { useState, useEffect } from 'react';
import Alert from '../components/Alert.jsx';
import CourseForm from '../components/CourseForm.jsx';
import {
  getMyCreatedCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  addLesson,
  deleteLesson,
} from '../services/courseService.js';
import getErrorMessage from '../utils/getErrorMessage.js';

const emptyLesson = { title: '', content: '', videoUrl: '' };

function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [lesson, setLesson] = useState(emptyLesson);

  const selectedCourse = courses.find((c) => c._id === selectedId);

  const load = async () => {
    try {
      const res = await getMyCreatedCourses();
      setCourses(res.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Runs an API action, then shows a message and reloads the list
  const run = async (action, successText) => {
    setError('');
    setMessage('');
    try {
      await action();
      setMessage(successText);
      await load();
      return true;
    } catch (err) {
      setError(getErrorMessage(err));
      return false;
    }
  };

  const handleSave = async (data) => {
    const ok = await run(
      () => (editing ? updateCourse(editing._id, data) : createCourse(data)),
      editing ? 'Course updated.' : 'Course created.'
    );
    if (ok) {
      setShowForm(false);
      setEditing(null);
    }
  };

  const handleDelete = async (course) => {
    if (!window.confirm(`Delete "${course.title}"?`)) return;
    const ok = await run(() => deleteCourse(course._id), 'Course deleted.');
    if (ok && selectedId === course._id) setSelectedId(null);
  };

  const handleAddLesson = async (event) => {
    event.preventDefault();
    if (lesson.title.trim() === '') {
      setError('Lesson title is required.');
      return;
    }
    const ok = await run(() => addLesson(selectedId, lesson), 'Lesson added.');
    if (ok) setLesson(emptyLesson);
  };

  return (
    <div>
      <h1>Instructor Dashboard</h1>
      <Alert>{error}</Alert>
      <Alert type="success">{message}</Alert>

      {showForm ? (
        <div>
          <h2>{editing ? 'Edit course' : 'New course'}</h2>
          <CourseForm
            key={editing ? editing._id : 'new'}
            initial={editing}
            submitLabel={editing ? 'Save changes' : 'Create course'}
            onSubmit={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditing(null);
            }}
          />
        </div>
      ) : (
        <button className="btn" onClick={() => setShowForm(true)}>+ Add new course</button>
      )}

      <h2>My courses</h2>
      {loading && <p className="status">Loading...</p>}
      {!loading && courses.length === 0 && <p className="status">You have not created any course yet.</p>}

      <div className="table-wrap">
        {courses.length > 0 && (
          <table>
            <thead>
              <tr><th>Title</th><th>Category</th><th>Price</th><th>Lessons</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id}>
                  <td>{course.title}</td>
                  <td>{course.category}</td>
                  <td>{course.price === 0 ? 'Free' : `Rs. ${course.price}`}</td>
                  <td>{course.lessons.length}</td>
                  <td className="actions">
                    <button className="btn small" onClick={() => setSelectedId(course._id)}>Lessons</button>
                    <button
                      className="btn small light"
                      onClick={() => {
                        setEditing(course);
                        setShowForm(true);
                      }}
                    >
                      Edit
                    </button>
                    <button className="btn small danger" onClick={() => handleDelete(course)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedCourse && (
        <section className="panel">
          <h2>Lessons: {selectedCourse.title}</h2>
          {selectedCourse.lessons.length === 0 && <p className="muted">No lessons yet.</p>}
          <ul className="lesson-list">
            {selectedCourse.lessons.map((l) => (
              <li key={l._id}>
                <span>{l.title}</span>
                <button
                  className="btn small danger"
                  onClick={() => run(() => deleteLesson(selectedCourse._id, l._id), 'Lesson removed.')}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <form className="form" onSubmit={handleAddLesson}>
            <label>Lesson title
              <input value={lesson.title} onChange={(e) => setLesson({ ...lesson, title: e.target.value })} />
            </label>
            <label>Content
              <textarea rows="2" value={lesson.content} onChange={(e) => setLesson({ ...lesson, content: e.target.value })} />
            </label>
            <label>Video link (optional)
              <input value={lesson.videoUrl} onChange={(e) => setLesson({ ...lesson, videoUrl: e.target.value })} />
            </label>
            <button className="btn" type="submit">Add lesson</button>
          </form>
        </section>
      )}
    </div>
  );
}

export default InstructorDashboard;
