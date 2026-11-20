import { useState, useEffect } from 'react';
import Alert from '../components/Alert.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getUsers, deleteUser, getAnalytics } from '../services/adminService.js';
import { getCourses, deleteCourse } from '../services/courseService.js';
import getErrorMessage from '../utils/getErrorMessage.js';

function AdminDashboard() {
  const { user: currentUser } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = async () => {
    try {
      const [analyticsRes, usersRes, coursesRes] = await Promise.all([
        getAnalytics(),
        getUsers(),
        getCourses(),
      ]);
      setAnalytics(analyticsRes.data);
      setUsers(usersRes.data);
      setCourses(coursesRes.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (action, text, successText) => {
    if (!window.confirm(text)) return;
    setError('');
    setMessage('');
    try {
      await action();
      setMessage(successText);
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (loading) return <p className="status">Loading dashboard...</p>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <Alert>{error}</Alert>
      <Alert type="success">{message}</Alert>

      {analytics && (
        <>
          <h2>Analytics</h2>
          <div className="stats">
            <div className="stat"><span>Total users</span><strong>{analytics.totalUsers}</strong></div>
            <div className="stat"><span>Students</span><strong>{analytics.roles.student}</strong></div>
            <div className="stat"><span>Instructors</span><strong>{analytics.roles.instructor}</strong></div>
            <div className="stat"><span>Courses</span><strong>{analytics.totalCourses}</strong></div>
            <div className="stat"><span>Enrollments</span><strong>{analytics.totalEnrollments}</strong></div>
          </div>

          <h3>Most popular courses</h3>
          {analytics.topCourses.length === 0 ? (
            <p className="muted">No enrollments yet.</p>
          ) : (
            <ol>
              {analytics.topCourses.map((c) => (
                <li key={c.title}>{c.title} ({c.enrollments} enrolled)</li>
              ))}
            </ol>
          )}
        </>
      )}

      <h2>Manage users</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Action</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <button
                    className="btn small danger"
                    disabled={u.id === currentUser.id}
                    onClick={() =>
                      handleDelete(() => deleteUser(u.id), `Delete user ${u.name}?`, 'User deleted.')
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Manage courses</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Title</th><th>Instructor</th><th>Category</th><th>Action</th></tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c._id}>
                <td>{c.title}</td>
                <td>{c.instructor ? c.instructor.name : 'Unknown'}</td>
                <td>{c.category}</td>
                <td>
                  <button
                    className="btn small danger"
                    onClick={() =>
                      handleDelete(() => deleteCourse(c._id), `Delete course "${c.title}"?`, 'Course deleted.')
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
