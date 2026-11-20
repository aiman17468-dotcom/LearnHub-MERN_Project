import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Alert from '../components/Alert.jsx';
import { useAuth, dashboardPath } from '../context/AuthContext.jsx';
import getErrorMessage from '../utils/getErrorMessage.js';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.email.trim() === '' || form.password === '') {
      setError('Please enter your email and password.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const user = await login(form.email.trim(), form.password);
      navigate(location.state?.from || dashboardPath(user.role), { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form narrow" onSubmit={handleSubmit}>
      <h1>Login</h1>
      <label>Email
        <input name="email" type="email" value={form.email} onChange={handleChange} />
      </label>
      <label>Password
        <input name="password" type="password" value={form.password} onChange={handleChange} />
      </label>
      <Alert>{error}</Alert>
      <button className="btn" type="submit" disabled={submitting}>
        {submitting ? 'Logging in...' : 'Login'}
      </button>
      <p>No account? <Link to="/register">Register here</Link></p>
    </form>
  );
}

export default Login;
