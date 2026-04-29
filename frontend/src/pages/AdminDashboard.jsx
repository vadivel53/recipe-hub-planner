import { useState, useEffect } from 'react';
import { getAdminStats, getAllUsers, deleteUser } from '../api/users';
import { getAllRecipesAdmin, deleteRecipe } from '../api/recipes';
import toast from 'react-hot-toast';
import { FiUsers, FiBook, FiCheckCircle, FiTrash2, FiEye } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAdminStats(), getAllUsers(), getAllRecipesAdmin()])
      .then(([s, u, r]) => {
        setStats(s.data); setUsers(u.data); setRecipes(r.data);
      }).finally(() => setLoading(false));
  }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await deleteUser(id);
    setUsers(u => u.filter(user => user._id !== id));
    toast.success('User deleted');
  };

  const handleDeleteRecipe = async (id) => {
    if (!window.confirm('Delete this recipe?')) return;
    await deleteRecipe(id);
    setRecipes(r => r.filter(rec => rec._id !== id));
    toast.success('Recipe deleted');
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Manage users, recipes and platform content</p>
        </div>

        {/* Stat cards */}
        <div className={styles.statGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'rgba(232,148,58,0.12)', color: 'var(--saffron)' }}>
              <FiUsers size={22} />
            </div>
            <div>
              <strong>{stats?.totalUsers}</strong>
              <span>Total Users</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'rgba(107,140,107,0.12)', color: 'var(--sage)' }}>
              <FiBook size={22} />
            </div>
            <div>
              <strong>{stats?.totalRecipes}</strong>
              <span>Total Recipes</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'rgba(107,140,107,0.12)', color: 'var(--sage)' }}>
              <FiCheckCircle size={22} />
            </div>
            <div>
              <strong>{stats?.publishedRecipes}</strong>
              <span>Published</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {['overview','users','recipes'].map(t => (
            <button key={t} className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`}
              onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div className={styles.overviewGrid}>
            <div className={styles.tableSection}>
              <h3 className={styles.tableTitle}>Recent Recipes</h3>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead><tr><th>Title</th><th>Author</th><th>Category</th><th>Actions</th></tr></thead>
                  <tbody>
                    {stats?.recentRecipes?.map(r => (
                      <tr key={r._id}>
                        <td><Link to={`/recipes/${r._id}`} className={styles.link}>{r.title}</Link></td>
                        <td>{r.author?.name}</td>
                        <td><span className="badge badge-saffron">{r.category}</span></td>
                        <td>
                          <div className={styles.rowActions}>
                            <Link to={`/recipes/${r._id}`} className={styles.iconBtn}><FiEye size={14} /></Link>
                            <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => handleDeleteRecipe(r._id)}><FiTrash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className={styles.tableSection}>
              <h3 className={styles.tableTitle}>Recent Users</h3>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
                  <tbody>
                    {stats?.recentUsers?.map(u => (
                      <tr key={u._id}>
                        <td>{u.name}</td>
                        <td style={{ fontSize: '0.82rem', color: 'var(--bark-light)' }}>{u.email}</td>
                        <td><span className={`badge ${u.role === 'admin' ? 'badge-terracotta' : 'badge-sage'}`}>{u.role}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Users table */}
        {tab === 'users' && (
          <div className={styles.tableSection}>
            <h3 className={styles.tableTitle}>All Users ({users.length})</h3>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td><strong>{u.name}</strong></td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--bark-light)' }}>{u.email}</td>
                      <td><span className={`badge ${u.role === 'admin' ? 'badge-terracotta' : 'badge-sage'}`}>{u.role}</span></td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--bark-light)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        {u.role !== 'admin' && (
                          <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => handleDeleteUser(u._id)}><FiTrash2 size={14} /></button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recipes table */}
        {tab === 'recipes' && (
          <div className={styles.tableSection}>
            <h3 className={styles.tableTitle}>All Recipes ({recipes.length})</h3>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead><tr><th>Title</th><th>Author</th><th>Category</th><th>Cook Time</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {recipes.map(r => (
                    <tr key={r._id}>
                      <td><Link to={`/recipes/${r._id}`} className={styles.link}>{r.title}</Link></td>
                      <td style={{ fontSize: '0.82rem' }}>{r.author?.name}</td>
                      <td><span className="badge badge-saffron">{r.category}</span></td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--bark-light)' }}>{r.cookTime} min</td>
                      <td>
                        <span className={`badge ${r.isPublished ? 'badge-sage' : 'badge-terracotta'}`}>
                          {r.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td>
                        <div className={styles.rowActions}>
                          <Link to={`/recipes/${r._id}`} className={styles.iconBtn}><FiEye size={14} /></Link>
                          <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => handleDeleteRecipe(r._id)}><FiTrash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
