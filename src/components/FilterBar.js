const PRIORITIES = ['All', 'Top Priority', 'Mid Priority', 'Low Priority'];
const STATUSES = ['All', 'Active', 'Completed'];

export default function FilterBar({ filters, onFilterChange, categories }) {
  function handle(e) {
    const { name, value } = e.target;
    onFilterChange(name, value);
  }

  return (
    <div>
      <label htmlFor="priority">Priority</label>
      <select id="priority" name="priority" value={filters.priority} onChange={handle}>
        {PRIORITIES.map(p => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      <label htmlFor="category">Category</label>
      <select id="category" name="category" value={filters.category} onChange={handle}>
        <option value="All">All</option>
        {categories.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <label htmlFor="status">Status</label>
      <select id="status" name="status" value={filters.status} onChange={handle}>
        {STATUSES.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>
  );
}
