import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../components/Alert.jsx';
import { useAuth, dashboardPath } from '../context/AuthContext.jsx';
import getErrorMessage from '../utils/getErrorMessage.js';

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.name.trim() === '' || form.email.trim() === '' || form.password === '') {
      setError('Please fill in all fields.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const user = await register({ ...form, name: form.name.trim(), email: form.email.trim() });
      navigate(dashboardPath(user.role), { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form narrow" onSubmit={handleSubmit}>
      <h1>Create account</h1>
      <label>Name
        <input name="name" value={form.name} onChange={handleChange} />
      </label>
      <label>Email
        <input name="email" type="email" value={form.email} onChange={handleChange} />
      </label>
      <label>Password
        <input name="password" type="password" value={form.password} onChange={handleChange} />
      </label>
      <label>I am a
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
        </select>
      </label>
      <Alert>{error}</Alert>
      <button className="btn" type="submit" disabled={submitting}>
        {submitting ? 'Creating account...' : 'Register'}
      </button>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </form>
  );
}

export default Register;
