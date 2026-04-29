import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createRecipe, updateRecipe, getRecipe } from '../api/recipes';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiSave } from 'react-icons/fi';
import styles from './RecipeForm.module.css';

const CATEGORIES = ['Breakfast','Lunch','Dinner','Snack','Dessert','Beverage','Vegan','Other'];

export default function RecipeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: '', description: '', category: 'Dinner',
    cookTime: '', servings: 2, imageUrl: '',
    tags: '', isPublished: true,
    ingredients: [{ name: '', quantity: '' }],
    steps: [{ stepNumber: 1, instruction: '' }],
  });

  useEffect(() => {
    if (isEdit) {
      getRecipe(id).then(res => {
        const r = res.data;
        setForm({
          title: r.title, description: r.description,
          category: r.category, cookTime: r.cookTime,
          servings: r.servings, imageUrl: r.imageUrl || '',
          tags: r.tags?.join(', ') || '',
          isPublished: r.isPublished,
          ingredients: r.ingredients?.length ? r.ingredients : [{ name: '', quantity: '' }],
          steps: r.steps?.length ? r.steps : [{ stepNumber: 1, instruction: '' }],
        });
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const addIngredient = () => setForm(f => ({ ...f, ingredients: [...f.ingredients, { name: '', quantity: '' }] }));
  const removeIngredient = (i) => setForm(f => ({ ...f, ingredients: f.ingredients.filter((_, idx) => idx !== i) }));
  const updateIngredient = (i, field, val) => setForm(f => {
    const arr = [...f.ingredients];
    arr[i] = { ...arr[i], [field]: val };
    return { ...f, ingredients: arr };
  });

  const addStep = () => setForm(f => ({ ...f, steps: [...f.steps, { stepNumber: f.steps.length + 1, instruction: '' }] }));
  const removeStep = (i) => setForm(f => ({ ...f, steps: f.steps.filter((_, idx) => idx !== i).map((s, idx) => ({ ...s, stepNumber: idx + 1 })) }));
  const updateStep = (i, val) => setForm(f => {
    const arr = [...f.steps];
    arr[i] = { ...arr[i], instruction: val };
    return { ...f, steps: arr };
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Title is required');
    if (!form.cookTime) return toast.error('Cook time is required');
    setLoading(true);
    try {
      const payload = {
        ...form,
        cookTime: parseInt(form.cookTime),
        servings: parseInt(form.servings),
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        ingredients: form.ingredients.filter(i => i.name.trim()),
        steps: form.steps.filter(s => s.instruction.trim()),
      };
      if (isEdit) { await updateRecipe(id, payload); toast.success('Recipe updated!'); }
      else { const res = await createRecipe(payload); toast.success('Recipe created!'); navigate(`/recipes/${res.data._id}`); return; }
      navigate(`/recipes/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h1 className="page-title">{isEdit ? 'Edit Recipe' : 'Create New Recipe'}</h1>
          <p className="page-subtitle">{isEdit ? 'Update your recipe details' : 'Share your culinary masterpiece with the community'}</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.grid2}>
            {/* Basic Info */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Basic Information</h3>
              <div className="form-group">
                <label className="form-label">Recipe Title *</label>
                <input name="title" value={form.title} onChange={handleChange} className="form-input" placeholder="e.g. Classic Chicken Tikka Masala" required />
              </div>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} className={`form-input ${styles.textarea}`} rows={4} placeholder="Describe your recipe..." required />
              </div>
              <div className={styles.row3}>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select name="category" value={form.category} onChange={handleChange} className="form-input">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Cook Time (min) *</label>
                  <input name="cookTime" type="number" value={form.cookTime} onChange={handleChange} className="form-input" placeholder="30" min="1" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Servings</label>
                  <input name="servings" type="number" value={form.servings} onChange={handleChange} className="form-input" min="1" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input name="imageUrl" value={form.imageUrl} onChange={handleChange} className="form-input" placeholder="https://example.com/image.jpg" />
                {form.imageUrl && <img src={form.imageUrl} alt="Preview" className={styles.imgPreview} onError={e => e.target.style.display='none'} />}
              </div>
              <div className="form-group">
                <label className="form-label">Tags (comma separated)</label>
                <input name="tags" value={form.tags} onChange={handleChange} className="form-input" placeholder="spicy, indian, curry" />
              </div>
              <label className={styles.publishToggle}>
                <input type="checkbox" name="isPublished" checked={form.isPublished} onChange={handleChange} />
                <span>Publish recipe (visible to everyone)</span>
              </label>
            </div>

            {/* Ingredients + Steps */}
            <div className={styles.rightCol}>
              {/* Ingredients */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Ingredients</h3>
                <div className={styles.ingredientsList}>
                  {form.ingredients.map((ing, i) => (
                    <div key={i} className={styles.ingredientRow}>
                      <input value={ing.quantity} onChange={e => updateIngredient(i, 'quantity', e.target.value)}
                        className="form-input" placeholder="1 cup" style={{ width: '100px', flexShrink: 0 }} />
                      <input value={ing.name} onChange={e => updateIngredient(i, 'name', e.target.value)}
                        className="form-input" placeholder="Ingredient name" style={{ flex: 1 }} />
                      <button type="button" className={styles.removeBtn} onClick={() => removeIngredient(i)}
                        disabled={form.ingredients.length === 1}>
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <button type="button" className="btn btn-secondary btn-sm" onClick={addIngredient}>
                  <FiPlus size={14} /> Add Ingredient
                </button>
              </div>

              {/* Steps */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Instructions</h3>
                <div className={styles.stepsList}>
                  {form.steps.map((step, i) => (
                    <div key={i} className={styles.stepRow}>
                      <div className={styles.stepNum}>{i + 1}</div>
                      <textarea value={step.instruction} onChange={e => updateStep(i, e.target.value)}
                        className={`form-input ${styles.stepTextarea}`}
                        placeholder={`Step ${i + 1} instructions...`} rows={2} />
                      <button type="button" className={styles.removeBtn} onClick={() => removeStep(i)}
                        disabled={form.steps.length === 1}>
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <button type="button" className="btn btn-secondary btn-sm" onClick={addStep}>
                  <FiPlus size={14} /> Add Step
                </button>
              </div>
            </div>
          </div>

          <div className={styles.submitRow}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <FiSave size={16} />
              {loading ? 'Saving...' : isEdit ? 'Update Recipe' : 'Publish Recipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
