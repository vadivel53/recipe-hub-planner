import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <span className={styles.logo}>🍴 Recipe<em>Hub</em></span>
          <p>A community platform for sharing and discovering amazing recipes from home cooks around the world.</p>
        </div>
        <div className={styles.links}>
          <h4>Explore</h4>
          <Link to="/">Discover Recipes</Link>
          <Link to="/planner">Meal Planner</Link>
          <Link to="/recipes/new">Add Recipe</Link>
        </div>
        <div className={styles.links}>
          <h4>Account</h4>
          <Link to="/profile">My Profile</Link>
          <Link to="/bookmarks">Bookmarks</Link>
          <Link to="/login">Sign In</Link>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} RecipeHub. Built with React & Node.js.</p>
        <p style={{ fontSize: '0.75rem', opacity: 0.5 }}>API Docs: <a href="http://localhost:5000/api/docs" target="_blank" rel="noreferrer">Swagger UI</a></p>
      </div>
    </footer>
  );
}
