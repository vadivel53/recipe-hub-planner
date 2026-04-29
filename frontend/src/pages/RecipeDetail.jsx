import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getRecipe, deleteRecipe, rateRecipe } from '../api/recipes';
import { toggleBookmark, addMeal, getBookmarks } from '../api/users';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiClock, FiUsers, FiStar, FiEdit2, FiTrash2, FiBookmark, FiCalendar, FiArrowLeft } from 'react-icons/fi';
import styles from './RecipeDetail.module.css';

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const MEAL_TYPES = ['Breakfast','Lunch','Dinner','Snack'];

const FALLBACK = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&q=80';

export default function RecipeDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [planModal, setPlanModal] = useState(false);
  const [planDay, setPlanDay] = useState('Monday');
  const [planMeal, setPlanMeal] = useState('Dinner');

  useEffect(() => {
    getRecipe(id).then(res => {
      setRecipe(res.data);
      setLoading(false);
    }).catch(() => { toast.error('Recipe not found'); navigate('/'); });
  }, [id]);

  useEffect(() => {
    if (!user) return;
    getBookmarks().then(res => {
      setBookmarked(res.data.some(r => r._id === id));
    });
  }, [user, id]);

  const handleBookmark = async () => {
    if (!user) return toast.error('Login to bookmark');
    await toggleBookmark(id);
    setBookmarked(!bookmarked);
    toast.success(bookmarked ? 'Removed bookmark' : 'Bookmarked!');
  };

  const handleRate = async (value) => {
    if (!user) return toast.error('Login to rate');
    try {
      const res = await rateRecipe(id, value);
      setUserRating(value);
      setRecipe(prev => ({ ...prev, avgRating: res.data.avgRating, ratings: [...(prev.ratings || []).filter(r => r.user !== user._id), { user: user._id, value }] }));
      toast.success('Rating saved!');
    } catch { toast.error('Failed to rate'); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this recipe?')) return;
    try {
      await deleteRecipe(id);
      toast.success('Recipe deleted');
      navigate('/');
    } catch { toast.error('Failed to delete'); }
  };

  const handleAddToPlanner = async () => {
    if (!user) return toast.error('Login to use planner');
    try {
      await addMeal({ day: planDay, mealType: planMeal, recipeId: id });
      toast.success(`Added to ${planDay} ${planMeal}!`);
      setPlanModal(false);
    } catch { toast.error('Failed to add to planner'); }
  };

  if (loading) return <div className="spinner" />;
  if (!recipe) return null;

  const isOwner = user && (user._id === recipe.author?._id || user.role === 'admin');

  return (
    <div className={styles.page}>
      <div className="container">
        <button className={`btn btn-ghost ${styles.back}`} onClick={() => navigate(-1)}>
          <FiArrowLeft size={16} /> Back
        </button>

        <div className={styles.layout}>
          {/* Left: image + actions */}
          <div className={styles.left}>
            <div className={styles.imgWrap}>
              <img src={recipe.imageUrl || FALLBACK} alt={recipe.title}
                onError={e => e.target.src = FALLBACK} />
            </div>

            {/* Action buttons */}
            <div className={styles.actions}>
              <button className={`btn btn-secondary ${bookmarked ? styles.bookmarked : ''}`} onClick={handleBookmark}>
                <FiBookmark size={16} fill={bookmarked ? 'currentColor' : 'none'} />
                {bookmarked ? 'Bookmarked' : 'Bookmark'}
              </button>
              <button className="btn btn-primary" onClick={() => setPlanModal(true)}>
                <FiCalendar size={16} /> Add to Planner
              </button>
            </div>

            {/* Rating */}
            <div className={styles.ratingBox}>
              <h4>Rate this recipe</h4>
              <div className={styles.stars}>
                {[1,2,3,4,5].map(s => (
                  <button key={s}
                    className={`${styles.star} ${(hoverRating || userRating) >= s ? styles.starFilled : ''}`}
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => handleRate(s)}
                  >
                    <FiStar size={22} />
                  </button>
                ))}
              </div>
              {parseFloat(recipe.avgRating) > 0 && (
                <p className={styles.avgRating}>
                  Average: <strong>{recipe.avgRating}</strong> ({recipe.ratings?.length} ratings)
                </p>
              )}
            </div>

            {isOwner && (
              <div className={styles.ownerActions}>
                <Link to={`/recipes/${id}/edit`} className="btn btn-secondary">
                  <FiEdit2 size={14} /> Edit Recipe
                </Link>
                <button className="btn btn-danger" onClick={handleDelete}>
                  <FiTrash2 size={14} /> Delete
                </button>
              </div>
            )}
          </div>

          {/* Right: content */}
          <div className={styles.right}>
            <span className={`badge badge-saffron`}>{recipe.category}</span>
            <h1 className={styles.title}>{recipe.title}</h1>
            <p className={styles.desc}>{recipe.description}</p>

            <div className={styles.metaRow}>
              <div className={styles.metaItem}>
                <FiClock size={18} />
                <div><strong>{recipe.cookTime}</strong><span>minutes</span></div>
              </div>
              <div className={styles.metaItem}>
                <FiUsers size={18} />
                <div><strong>{recipe.servings}</strong><span>servings</span></div>
              </div>
              {parseFloat(recipe.avgRating) > 0 && (
                <div className={styles.metaItem}>
                  <FiStar size={18} style={{ color: 'var(--saffron)' }} />
                  <div><strong>{recipe.avgRating}</strong><span>rating</span></div>
                </div>
              )}
            </div>

            {recipe.tags?.length > 0 && (
              <div className={styles.tags}>
                {recipe.tags.map(tag => <span key={tag} className={styles.tag}>#{tag}</span>)}
              </div>
            )}

            {/* Ingredients */}
            <div className={styles.section}>
              <h2>Ingredients</h2>
              <ul className={styles.ingredients}>
                {recipe.ingredients?.map((ing, i) => (
                  <li key={i}>
                    <span className={styles.ingQty}>{ing.quantity}</span>
                    <span>{ing.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Steps */}
            <div className={styles.section}>
              <h2>Instructions</h2>
              <ol className={styles.steps}>
                {recipe.steps?.map((step, i) => (
                  <li key={i} className={styles.step}>
                    <div className={styles.stepNum}>{i + 1}</div>
                    <p>{step.instruction}</p>
                  </li>
                ))}
              </ol>
            </div>

            {recipe.author && (
              <div className={styles.authorCard}>
                <div className={styles.authorAvatar}>
                  {recipe.author.avatar
                    ? <img src={recipe.author.avatar} alt={recipe.author.name} />
                    : <span>{recipe.author.name?.[0]?.toUpperCase()}</span>}
                </div>
                <div>
                  <p className={styles.authorLabel}>Recipe by</p>
                  <strong>{recipe.author.name}</strong>
                  {recipe.author.bio && <p className={styles.authorBio}>{recipe.author.bio}</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Planner Modal */}
      {planModal && (
        <div className={styles.modalOverlay} onClick={() => setPlanModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h3>Add to Meal Planner</h3>
            <p>Adding: <strong>{recipe.title}</strong></p>
            <div className="form-group mt-2">
              <label className="form-label">Day</label>
              <select value={planDay} onChange={e => setPlanDay(e.target.value)} className="form-input">
                {DAYS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group mt-2">
              <label className="form-label">Meal</label>
              <select value={planMeal} onChange={e => setPlanMeal(e.target.value)} className="form-input">
                {MEAL_TYPES.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div className={styles.modalBtns}>
              <button className="btn btn-secondary" onClick={() => setPlanModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAddToPlanner}>
                <FiCalendar size={14} /> Add to Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
