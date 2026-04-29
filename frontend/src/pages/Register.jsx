import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiUserPlus } from 'react-icons/fi';
import styles from './Auth.module.css';

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      toast.success('Account created! Welcome to RecipeHub 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logoMark}>🍴</div>
          <h1>Join RecipeHub</h1>
          <p>Create an account and start sharing recipes</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className={styles.inputWrap}>
              <FiUser size={16} className={styles.inputIcon} />
              <input name="name" type="text" placeholder="Jane Smith"
                value={form.name} onChange={handleChange}
                className={`form-input ${styles.hasIcon}`} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <div className={styles.inputWrap}>
              <FiMail size={16} className={styles.inputIcon} />
              <input name="email" type="email" placeholder="you@example.com"
                value={form.email} onChange={handleChange}
                className={`form-input ${styles.hasIcon}`} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className={styles.inputWrap}>
              <FiLock size={16} className={styles.inputIcon} />
              <input name="password" type="password" placeholder="Min 6 characters"
                value={form.password} onChange={handleChange}
                className={`form-input ${styles.hasIcon}`} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className={styles.inputWrap}>
              <FiLock size={16} className={styles.inputIcon} />
              <input name="confirmPassword" type="password" placeholder="Repeat password"
                value={form.confirmPassword} onChange={handleChange}
                className={`form-input ${styles.hasIcon}`} required />
            </div>
          </div>

          <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
            <FiUserPlus size={16} />
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className={styles.switchAuth}>
          Already have an account? <Link to="/login">Sign in →</Link>
        </p>
      </div>
    </div>
  );
}
