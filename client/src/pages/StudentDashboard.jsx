import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../components/Alert.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getEnrolledCourses, updateProgress } from '../services/enrollmentService.js';
import getErrorMessage from '../utils/getErrorMessage.js';

function StudentDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const res = await getEnrolledCourses();
      setEnrollments(res.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleProgress = async (enrollment) => {
    setError('');
    try {
      await updateProgress(enrollment.course._id, Math.min(100, enrollment.progress + 10));
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div>
      <h1>Student Dashboard</h1>
      <p className="muted">Welcome, {user.name}. These are your enrolled courses.</p>
      <Alert>{error}</Alert>
      {loading && <p className="status">Loading...</p>}
      {!loading && enrollments.length === 0 && (
        <p className="status">You have not enrolled in any course yet. <Link to="/courses">Browse courses</Link></p>
      )}

      <div className="grid">
        {enrollments.map((enrollment) => (
          <article className="card" key={enrollment._id}>
            <h3>{enrollment.course.title}</h3>
            <p className="meta">
              By {enrollment.course.instructor ? enrollment.course.instructor.name : 'Unknown'}
            </p>
            <div className="progress" aria-label="Progress">
              <div className="bar" style={{ width: `${enrollment.progress}%` }} />
            </div>
            <p className="meta">{enrollment.progress}% complete</p>
            <div className="row">
              <button
                className="btn small"
                disabled={enrollment.progress >= 100}
                onClick={() => handleProgress(enrollment)}
              >
                +10% progress
              </button>
              <Link className="btn small light" to={`/courses/${enrollment.course._id}`}>Open</Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default StudentDashboard;
