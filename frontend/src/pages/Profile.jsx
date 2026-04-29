import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyRecipes, updateProfile } from '../api/users';
import { deleteRecipe } from '../api/recipes';
import RecipeCard from '../components/RecipeCard';
import toast from 'react-hot-toast';
import { FiEdit2, FiSave, FiX, FiPlusCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import styles from './Profile.module.css';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', bio: '', avatar: '' });

  useEffect(() => {
    if (user) setForm({ name: user.name, bio: user.bio || '', avatar: user.avatar || '' });
    getMyRecipes().then(res => { setRecipes(res.data); setLoading(false); });
  }, [user]);

  const handleSave = async () => {
    try {
      const res = await updateProfile(form);
      updateUser(res.data);
      setEditing(false);
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update profile'); }
  };

  const handleDeleteRecipe = async (id) => {
    if (!window.confirm('Delete this recipe?')) return;
    await deleteRecipe(id);
    setRecipes(r => r.filter(rec => rec._id !== id));
    toast.success('Recipe deleted');
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.layout}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.profileCard}>
              <div className={styles.avatarWrap}>
                {form.avatar
                  ? <img src={form.avatar} alt={user?.name} className={styles.avatar} onError={e => e.target.style.display = 'none'} />
                  : <div className={styles.avatarFallback}>{user?.name?.[0]?.toUpperCase()}</div>
                }
              </div>

              {editing ? (
                <div className={styles.editForm}>
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bio</label>
                    <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} className="form-input" rows={3} placeholder="Tell us about yourself..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Avatar URL</label>
                    <input value={form.avatar} onChange={e => setForm(f => ({ ...f, avatar: e.target.value }))} className="form-input" placeholder="https://..." />
                  </div>
                  <div className={styles.editBtns}>
                    <button className="btn btn-primary btn-sm" onClick={handleSave}><FiSave size={13} /> Save</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setEditing(false)}><FiX size={13} /> Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className={styles.name}>{user?.name}</h2>
                  <p className={styles.email}>{user?.email}</p>
                  {user?.bio && <p className={styles.bio}>{user.bio}</p>}
                  <span className={`badge ${user?.role === 'admin' ? 'badge-terracotta' : 'badge-saffron'}`}>
                    {user?.role}
                  </span>
                  <button className="btn btn-secondary btn-sm" style={{ marginTop: 12, width: '100%' }} onClick={() => setEditing(true)}>
                    <FiEdit2 size={13} /> Edit Profile
                  </button>
                </>
              )}
            </div>

            <div className={styles.statCard}>
              <div className={styles.stat}>
                <strong>{recipes.length}</strong>
                <span>Recipes</span>
              </div>
            </div>
          </aside>

          {/* Main */}
          <main className={styles.main}>
            <div className={styles.mainHeader}>
              <h2 className={styles.sectionTitle}>My Recipes</h2>
              <Link to="/recipes/new" className="btn btn-primary btn-sm">
                <FiPlusCircle size={14} /> New Recipe
              </Link>
            </div>

            {loading ? <div className="spinner" style={{ margin: '40px auto' }} /> :
              recipes.length === 0 ? (
                <div className="empty-state">
                  <h3>No recipes yet</h3>
                  <p>Share your first recipe with the community!</p>
                  <Link to="/recipes/new" className="btn btn-primary" style={{ marginTop: 16 }}>
                    <FiPlusCircle size={15} /> Create Recipe
                  </Link>
                </div>
              ) : (
                <div className="grid-2">
                  {recipes.map(r => (
                    <div key={r._id} className={styles.recipeWrap}>
                      <RecipeCard recipe={r} />
                      <div className={styles.recipeActions}>
                        <Link to={`/recipes/${r._id}/edit`} className="btn btn-secondary btn-sm">
                          <FiEdit2 size={12} /> Edit
                        </Link>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteRecipe(r._id)}>
                          <FiX size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </main>
        </div>
      </div>
    </div>
  );
}
