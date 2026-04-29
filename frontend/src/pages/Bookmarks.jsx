import { useState, useEffect } from 'react';
import { getBookmarks } from '../api/users';
import RecipeCard from '../components/RecipeCard';
import { FiBookmark } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import styles from './Bookmarks.module.css';

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarkIds, setBookmarkIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBookmarks().then(res => {
      setBookmarks(res.data);
      setBookmarkIds(res.data.map(r => r._id));
      setLoading(false);
    });
  }, []);

  const handleBookmarkChange = (id) => {
    setBookmarks(prev => prev.filter(r => r._id !== id));
    setBookmarkIds(prev => prev.filter(b => b !== id));
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <FiBookmark size={28} color="var(--saffron)" />
          <div>
            <h1 className="page-title">Bookmarks</h1>
            <p className="page-subtitle">{bookmarks.length} saved recipe{bookmarks.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {loading ? <div className="spinner" /> :
          bookmarks.length === 0 ? (
            <div className="empty-state">
              <h3>No bookmarks yet</h3>
              <p>Save recipes you love by clicking the bookmark icon on any recipe.</p>
              <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>Discover Recipes</Link>
            </div>
          ) : (
            <div className="grid-3 fade-up">
              {bookmarks.map(r => (
                <RecipeCard key={r._id} recipe={r}
                  bookmarked={bookmarkIds.includes(r._id)}
                  onBookmarkChange={handleBookmarkChange} />
              ))}
            </div>
          )}
      </div>
    </div>
  );
}
