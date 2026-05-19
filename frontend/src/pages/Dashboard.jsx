import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, inProgress: 0 });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    API.get('/complaints').then(({ data }) => {
      setRecent(data.slice(0, 5));
      setStats({
        total: data.length,
        pending: data.filter(c => c.status === 'Pending').length,
        resolved: data.filter(c => c.status === 'Resolved').length,
        inProgress: data.filter(c => c.status === 'In Progress').length,
      });
    });
  }, []);

  const statusColor = (s) =>
    s === 'Resolved' ? 'badge-green' : s === 'In Progress' ? 'badge-blue' : 'badge-yellow';

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, <strong>{user?.name}</strong> 👋</p>
        </div>
        <Link to="/register-complaint" className="btn-primary">+ File Complaint</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-total">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Complaints</div>
        </div>
        <div className="stat-card stat-pending">
          <div className="stat-number">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card stat-progress">
          <div className="stat-number">{stats.inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card stat-resolved">
          <div className="stat-number">{stats.resolved}</div>
          <div className="stat-label">Resolved</div>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <h2>Recent Complaints</h2>
          <Link to="/complaints" className="link-view-all">View All →</Link>
        </div>
        <div className="complaints-table-wrap">
          <table className="complaints-table">
            <thead>
              <tr><th>Title</th><th>Category</th><th>Location</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {recent.map(c => (
                <tr key={c._id} onClick={() => window.location.href = `/complaints/${c._id}`} className="table-row-link">
                  <td>{c.title}</td>
                  <td><span className="category-tag">{c.category}</span></td>
                  <td>📍 {c.location}</td>
                  <td><span className={`badge ${statusColor(c.status)}`}>{c.status}</span></td>
                  <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr><td colSpan="5" className="empty-msg">No complaints yet. File your first one!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}