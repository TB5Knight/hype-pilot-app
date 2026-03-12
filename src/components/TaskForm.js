import { useState } from 'react';

const CATEGORIES = ['Work', 'Personal', 'School', 'Health', 'Finance', 'Other'];
const PRIORITIES = ['Top Priority', 'Mid Priority', 'Low Priority'];

const empty = { title: '', category: '', dueDate: '', priority: '', description: '' };

export default function TaskForm({ onAddTask }) {
  const [fields, setFields] = useState(empty);

  function handleChange(e) {
    const { name, value } = e.target;
    setFields(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!fields.title.trim() || !fields.priority || !fields.dueDate) return;
    onAddTask(fields);
    setFields(empty);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          value={fields.title}
          onChange={handleChange}
          placeholder="Task title"
          required
        />
      </div>

      <div>
        <label htmlFor="category">Category</label>
        <select id="category" name="category" value={fields.category} onChange={handleChange}>
          <option value="">-- Select category --</option>
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="dueDate">Due Date</label>
        <input
          id="dueDate"
          name="dueDate"
          type="date"
          value={fields.dueDate}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="priority">Priority</label>
        <select id="priority" name="priority" value={fields.priority} onChange={handleChange} required>
          <option value="">-- Select priority --</option>
          {PRIORITIES.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={fields.description}
          onChange={handleChange}
          placeholder="Optional description"
          rows={3}
        />
      </div>

      <button type="submit">Add Task</button>
    </form>
  );
}
