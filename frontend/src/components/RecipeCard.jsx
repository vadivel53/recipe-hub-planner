import { Link } from 'react-router-dom';
import { FiClock, FiStar, FiBookmark, FiUsers } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { toggleBookmark } from '../api/users';
import toast from 'react-hot-toast';
import styles from './RecipeCard.module.css';

const CATEGORY_COLORS = {
  Breakfast: 'badge-saffron', Lunch: 'badge-sage', Dinner: 'badge-sage',
  Dessert: 'badge-terracotta', Snack: 'badge-saffron', Beverage: 'badge-sage',
  Vegan: 'badge-sage', Other: 'badge-saffron',
};

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&q=80';

export default function RecipeCard({ recipe, bookmarked = false, onBookmarkChange }) {
  const { user } = useAuth();

  const handleBookmark = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Login to bookmark recipes');
    try {
      await toggleBookmark(recipe._id);
      onBookmarkChange?.(recipe._id);
      toast.success(bookmarked ? 'Removed from bookmarks' : 'Bookmarked!');
    } catch {
      toast.error('Failed to update bookmark');
    }
  };

  return (
    <Link to={`/recipes/${recipe._id}`} className={`card ${styles.card}`}>
      <div className={styles.imgWrap}>
        <img
          src={recipe.imageUrl || FALLBACK_IMG}
          alt={recipe.title}
          onError={(e) => { e.target.src = FALLBACK_IMG; }}
        />
        <span className={`badge ${CATEGORY_COLORS[recipe.category] || 'badge-saffron'} ${styles.catBadge}`}>
          {recipe.category}
        </span>
        {user && (
          <button
            className={`${styles.bookmark} ${bookmarked ? styles.bookmarked : ''}`}
            onClick={handleBookmark}
            title={bookmarked ? 'Remove bookmark' : 'Bookmark'}
          >
            <FiBookmark size={16} fill={bookmarked ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{recipe.title}</h3>
        <p className={styles.desc}>{recipe.description}</p>
        <div className={styles.meta}>
          <span><FiClock size={13} /> {recipe.cookTime} min</span>
          <span><FiUsers size={13} /> {recipe.servings || 2} servings</span>
          {parseFloat(recipe.avgRating) > 0 && (
            <span className={styles.rating}>
              <FiStar size={13} fill="currentColor" />
              {recipe.avgRating}
            </span>
          )}
        </div>
        {recipe.author && (
          <div className={styles.author}>
            <div className={styles.authorAvatar}>
              {recipe.author.avatar
                ? <img src={recipe.author.avatar} alt={recipe.author.name} />
                : <span>{recipe.author.name?.[0]?.toUpperCase()}</span>}
            </div>
            <span>{recipe.author.name}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
