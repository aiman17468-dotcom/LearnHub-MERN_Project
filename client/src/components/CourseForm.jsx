import { useState } from 'react';
import Alert from './Alert.jsx';

// Controlled form used to create and edit a course
function CourseForm({ initial, submitLabel, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    description: initial?.description || '',
    category: initial?.category || 'General',
    price: initial?.price ?? 0,
  });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (form.title.trim() === '' || form.description.trim() === '') {
      setError('Title and description are required.');
      return;
    }
    if (Number(form.price) < 0 || Number.isNaN(Number(form.price))) {
      setError('Price must be 0 or more.');
      return;
    }
    setError('');
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category.trim() || 'General',
      price: Number(form.price),
    });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>Title
        <input name="title" value={form.title} onChange={handleChange} />
      </label>
      <label>Description
        <textarea name="description" rows="3" value={form.description} onChange={handleChange} />
      </label>
      <label>Category
        <input name="category" value={form.category} onChange={handleChange} />
      </label>
      <label>Price (Rs.)
        <input name="price" type="number" min="0" value={form.price} onChange={handleChange} />
      </label>
      <Alert>{error}</Alert>
      <div className="row">
        <button type="submit" className="btn">{submitLabel}</button>
        {onCancel && (
          <button type="button" className="btn light" onClick={onCancel}>Cancel</button>
        )}
      </div>
    </form>
  );
}

export default CourseForm;
