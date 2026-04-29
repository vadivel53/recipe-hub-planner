import { useState, useEffect } from 'react';
import { getRecipes } from '../api/recipes';
import { getBookmarks } from '../api/users';
import { useAuth } from '../context/AuthContext';
import RecipeCard from '../components/RecipeCard';
import { FiSearch, FiFilter } from 'react-icons/fi';
import styles from './Home.module.css';

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Beverage', 'Vegan', 'Other'];
const COOK_TIMES = [
  { label: 'Any time', value: '' },
  { label: 'Under 15 min', value: 15 },
  { label: 'Under 30 min', value: 30 },
  { label: 'Under 60 min', value: 60 },
];

export default function Home() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [maxCookTime, setMaxCookTime] = useState('');

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      if (maxCookTime) params.maxCookTime = maxCookTime;
      const res = await getRecipes(params);
      setRecipes(res.data);
    } catch {
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecipes(); }, [category, maxCookTime]);

  useEffect(() => {
    if (!user) return;
    getBookmarks().then(res => setBookmarks(res.data.map(r => r._id)));
  }, [user]);

  const handleSearch = (e) => { e.preventDefault(); fetchRecipes(); };

  const handleBookmarkChange = (id) => {
    setBookmarks(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className="container">
          <p className={styles.heroEyebrow}>Community Recipes</p>
          <h1 className={styles.heroTitle}>
            Discover, Cook,<br />
            <em>Share the Love.</em>
          </h1>
          <p className={styles.heroSub}>
            Thousands of recipes from home cooks. Find your next favourite meal.
          </p>
          <form className={styles.searchBar} onSubmit={handleSearch}>
            <FiSearch size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search recipes, ingredients, tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>
      </div>

      <div className="container">
        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.categories}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`${styles.catBtn} ${category === cat ? styles.catActive : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className={styles.timeFilter}>
            <FiFilter size={14} />
            <select
              value={maxCookTime}
              onChange={e => setMaxCookTime(e.target.value)}
              className="form-input"
              style={{ width: 'auto', padding: '6px 12px' }}
            >
              {COOK_TIMES.map(t => (
                <option key={t.label} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        <div className={styles.resultsHeader}>
          <span className={styles.count}>
            {loading ? 'Loading...' : `${recipes.length} recipe${recipes.length !== 1 ? 's' : ''} found`}
          </span>
        </div>

        {loading ? (
          <div className="spinner" />
        ) : recipes.length === 0 ? (
          <div className="empty-state">
            <h3>No recipes found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid-3 fade-up">
            {recipes.map(r => (
              <RecipeCard
                key={r._id}
                recipe={r}
                bookmarked={bookmarks.includes(r._id)}
                onBookmarkChange={handleBookmarkChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
