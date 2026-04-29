import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMealPlan, removeMeal, clearPlan } from '../api/users';
import toast from 'react-hot-toast';
import { FiTrash2, FiPlus, FiClock } from 'react-icons/fi';
import styles from './MealPlanner.module.css';

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const MEAL_TYPES = ['Breakfast','Lunch','Dinner','Snack'];

const FALLBACK = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=200&q=60';

export default function MealPlanner() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMealPlan().then(res => { setPlan(res.data); setLoading(false); });
  }, []);

  const getMeal = (day, mealType) =>
    plan?.meals?.find(m => m.day === day && m.mealType === mealType);

  const handleRemove = async (day, mealType) => {
    try {
      const res = await removeMeal({ day, mealType });
      setPlan(res.data);
      toast.success('Removed from plan');
    } catch { toast.error('Failed to remove'); }
  };

  const handleClear = async () => {
    if (!window.confirm('Clear entire meal plan?')) return;
    await clearPlan();
    setPlan(prev => ({ ...prev, meals: [] }));
    toast.success('Plan cleared');
  };

  const totalMeals = plan?.meals?.length || 0;

  if (loading) return <div className="spinner" />;

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <h1 className="page-title">Weekly Meal Planner</h1>
            <p className="page-subtitle">Plan your meals for the entire week</p>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.stat}>
              <strong>{totalMeals}</strong>
              <span>meals planned</span>
            </div>
            {totalMeals > 0 && (
              <button className="btn btn-danger btn-sm" onClick={handleClear}>
                <FiTrash2 size={14} /> Clear All
              </button>
            )}
          </div>
        </div>

        <div className={styles.grid}>
          {DAYS.map(day => (
            <div key={day} className={styles.dayCol}>
              <div className={styles.dayHeader}>{day}</div>
              {MEAL_TYPES.map(mealType => {
                const meal = getMeal(day, mealType);
                return (
                  <div key={mealType} className={styles.mealSlot}>
                    <div className={styles.mealLabel}>{mealType}</div>
                    {meal ? (
                      <div className={styles.mealCard}>
                        <img
                          src={meal.recipe?.imageUrl || FALLBACK}
                          alt={meal.recipe?.title}
                          onError={e => e.target.src = FALLBACK}
                        />
                        <div className={styles.mealInfo}>
                          <Link to={`/recipes/${meal.recipe?._id}`} className={styles.mealTitle}>
                            {meal.recipe?.title}
                          </Link>
                          <span className={styles.mealMeta}>
                            <FiClock size={11} /> {meal.recipe?.cookTime} min
                          </span>
                        </div>
                        <button
                          className={styles.removeBtn}
                          onClick={() => handleRemove(day, mealType)}
                          title="Remove"
                        >
                          <FiTrash2 size={12} />
                        </button>
                      </div>
                    ) : (
                      <Link to="/" className={styles.emptySlot}>
                        <FiPlus size={14} />
                        <span>Add meal</span>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className={styles.tip}>
          <strong>Tip:</strong> Browse recipes and click <em>"Add to Planner"</em> on any recipe page to schedule meals here.
        </div>
      </div>
    </div>
  );
}
