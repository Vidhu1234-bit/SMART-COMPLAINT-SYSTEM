import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const CATEGORIES = ['All', 'Water Supply', 'Electricity', 'Roads & Transport',
  'Garbage & Sanitation', 'Street Lighting', 'Drainage', 'Parks & Recreation', 'Other'];

export default function ComplaintList() {
  const [complaints, setComplaints] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/complaints').then(({ data }) => {
      setComplaints(data);
      setFiltered(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let data = complaints;
    if (category !== 'All') data = data.filter(c => c.category === category);
    if (search) data = data.filter(c =>
      c.location.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(data);
  }, [search, category, complaints]);

  const statusColor = (s) =>
    s === 'Resolved' ? 'badge-green' : s === 'In Progress' ? 'badge-blue' : 'badge-yellow';

  const priorityColor = (p) =>
    p === 'High' ? 'badge-red' : p === 'Medium' ? 'badge-orange' : 'badge-gray';

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>All Complaints</h1>
          <p>{filtered.length} complaints found</p>
        </div>
        <Link to="/register-complaint" className="btn-primary">+ New Complaint</Link>
      </div>

      <div className="filter-bar">
        <input className="search-input" type="text" placeholder="🔍 Search by location or title..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <div className="category-filters">
          {CATEGORIES.map(c => (
            <button key={c} className={`filter-btn ${category === c ? 'active' : ''}`}
              onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>
      </div>

      {loading ? <div className="loading">Loading complaints...</div> : (
        <div className="complaints-grid">
          {filtered.map(c => (
            <Link to={`/complaints/${c._id}`} key={c._id} className="complaint-card">
              <div className="card-top">
                <span className="category-tag">{c.category}</span>
                <span className={`badge ${statusColor(c.status)}`}>{c.status}</span>
              </div>
              <h3 className="card-title">{c.title}</h3>
              <p className="card-desc">{c.description.substring(0, 100)}...</p>
              <div className="card-meta">
                <span>📍 {c.location}</span>
                <span>👤 {c.name}</span>
                {c.aiAnalysis?.priority && (
                  <span className={`badge ${priorityColor(c.aiAnalysis.priority)}`}>
                    ⚡ {c.aiAnalysis.priority} Priority
                  </span>
                )}
              </div>
              <div className="card-date">{new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
            </Link>
          ))}
          {filtered.length === 0 && <div className="empty-state">No complaints match your search.</div>}
        </div>
      )}
    </div>
  );
}