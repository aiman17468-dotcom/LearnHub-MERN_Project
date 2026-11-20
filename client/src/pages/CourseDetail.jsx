import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Alert from '../components/Alert.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getCourse } from '../services/courseService.js';
import { enrollInCourse } from '../services/enrollmentService.js';
import getErrorMessage from '../utils/getErrorMessage.js';

function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    getCourse(id)
      .then((res) => setCourse(res.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  const handleEnroll = async () => {
    setError('');
    setMessage('');
    try {
      await enrollInCourse(course._id);
      setMessage('You are enrolled! Open your dashboard to see this course.');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (loading) return <p className="status">Loading course...</p>;
  if (!course) return <Alert>{error || 'Course not found'}</Alert>;

  return (
    <div className="detail">
      <Link to="/courses">&larr; Back to courses</Link>
      <span className="badge">{course.category}</span>
      <h1>{course.title}</h1>
      <p>{course.description}</p>
      <p className="meta">
        Instructor: {course.instructor ? course.instructor.name : 'Unknown'} |{' '}
        {course.price === 0 ? 'Free' : `Rs. ${course.price}`}
      </p>

      <Alert>{error}</Alert>
      <Alert type="success">{message}</Alert>

      {user && user.role === 'student' && (
        <button className="btn" onClick={handleEnroll}>Enroll in this course</button>
      )}
      {!user && (
        <p><Link to="/login" state={{ from: `/courses/${course._id}` }}>Login</Link> as a student to enroll.</p>
      )}

      <h2>Lessons ({course.lessons.length})</h2>
      {course.lessons.length === 0 ? (
        <p className="muted">No lessons added yet.</p>
      ) : (
        <ol className="lessons">
          {course.lessons.map((lesson) => (
            <li key={lesson._id}>
              <strong>{lesson.title}</strong>
              {lesson.content && <p>{lesson.content}</p>}
              {lesson.videoUrl && (
                <a href={lesson.videoUrl} target="_blank" rel="noreferrer">Open video</a>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default CourseDetail;
