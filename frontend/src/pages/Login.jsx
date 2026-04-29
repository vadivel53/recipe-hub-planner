import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import styles from './Auth.module.css';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
      toast.success('Welcome back! 👋');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logoMark}>🍴</div>
          <h1>Welcome back</h1>
          <p>Sign in to your RecipeHub account</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className={styles.inputWrap}>
              <FiMail size={16} className={styles.inputIcon} />
              <input
                name="email" type="email" placeholder="you@example.com"
                value={form.email} onChange={handleChange}
                className={`form-input ${styles.hasIcon}`} required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className={styles.inputWrap}>
              <FiLock size={16} className={styles.inputIcon} />
              <input
                name="password" type="password" placeholder="••••••••"
                value={form.password} onChange={handleChange}
                className={`form-input ${styles.hasIcon}`} required
              />
            </div>
          </div>

          <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
            <FiLogIn size={16} />
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className={styles.demoBox}>
          <p>Demo credentials:</p>
          <code>admin@recipehub.com / admin123</code>
          <br />
          <code>user@recipehub.com / user123</code>
        </div>

        <p className={styles.switchAuth}>
          Don't have an account? <Link to="/register">Create one →</Link>
        </p>
      </div>
    </div>
  );
}
