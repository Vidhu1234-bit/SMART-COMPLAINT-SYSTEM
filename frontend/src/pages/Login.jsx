import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await API.post('/auth/login', form);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-left-content">
          <h1>Your city.<br /><span>Your voice.</span></h1>
          <p>NagarSeva connects citizens with local government to resolve civic issues faster using AI.</p>
          <div className="auth-features">
            <div className="auth-feature">
              <div className="auth-feature-dot"></div>
              AI-powered complaint analysis
            </div>
            <div className="auth-feature">
              <div className="auth-feature-dot"></div>
              Real-time status tracking
            </div>
            <div className="auth-feature">
              <div className="auth-feature-dot"></div>
              Auto department routing
            </div>
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-title">Welcome back</div>
          <div className="auth-card-sub">Sign in to your NagarSeva account</div>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>
          <p className="auth-footer">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}