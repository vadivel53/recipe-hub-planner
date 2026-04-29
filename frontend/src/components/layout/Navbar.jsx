import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiGrid, FiBookmark, FiCalendar, FiPlusCircle } from 'react-icons/fi';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropOpen(false);
  };

  return (
    <nav className={styles.nav}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>🍴</span>
          <span>Recipe<em>Hub</em></span>
        </Link>

        <div className={`${styles.links} ${open ? styles.open : ''}`}>
          <NavLink to="/" end className={({ isActive }) => isActive ? styles.active : ''} onClick={() => setOpen(false)}>Discover</NavLink>
          {user && (
            <>
              <NavLink to="/planner" className={({ isActive }) => isActive ? styles.active : ''} onClick={() => setOpen(false)}>
                <FiCalendar size={15} /> Meal Planner
              </NavLink>
              <NavLink to="/recipes/new" className={({ isActive }) => isActive ? styles.active : ''} onClick={() => setOpen(false)}>
                <FiPlusCircle size={15} /> Add Recipe
              </NavLink>
            </>
          )}
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) => isActive ? styles.active : ''} onClick={() => setOpen(false)}>
              <FiGrid size={15} /> Admin
            </NavLink>
          )}
        </div>

        <div className={styles.right}>
          {user ? (
            <div className={styles.userMenu}>
              <button className={styles.avatar} onClick={() => setDropOpen(!dropOpen)}>
                {user.avatar ? <img src={user.avatar} alt={user.name} /> : <span>{user.name?.[0]?.toUpperCase()}</span>}
              </button>
              {dropOpen && (
                <div className={styles.dropdown}>
                  <div className={styles.dropHeader}>
                    <strong>{user.name}</strong>
                    <small>{user.email}</small>
                  </div>
                  <Link to="/profile" onClick={() => setDropOpen(false)}><FiUser size={14} /> My Profile</Link>
                  <Link to="/bookmarks" onClick={() => setDropOpen(false)}><FiBookmark size={14} /> Bookmarks</Link>
                  <hr />
                  <button onClick={handleLogout}><FiLogOut size={14} /> Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.authBtns}>
              <Link to="/login" className="btn btn-ghost">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </div>
          )}
          <button className={styles.hamburger} onClick={() => setOpen(!open)}>
            {open ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
