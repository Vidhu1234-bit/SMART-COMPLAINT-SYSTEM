import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const STATUSES = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

export default function ComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [status, setStatus] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    API.get(`/complaints/${id}`).then(({ data }) => {
      setComplaint(data);
      setStatus(data.status);
    });
  }, [id]);

  const handleStatusUpdate = async () => {
    setUpdateLoading(true);
    try {
      const { data } = await API.put(`/complaints/${id}`, { status });
      setComplaint(data.complaint);
      setMsg('Status updated successfully!');
    } catch { setMsg('Update failed.'); }
    setUpdateLoading(false);
  };

  const handleAIAnalyze = async () => {
    setAiLoading(true);
    setMsg('');
    try {
      await API.post('/ai/analyze', { complaintId: id });
      const { data } = await API.get(`/complaints/${id}`);
      setComplaint(data);
      setMsg('AI analysis complete!');
    } catch { setMsg('AI analysis failed. Check your API key.'); }
    setAiLoading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this complaint?')) return;
    await API.delete(`/complaints/${id}`);
    navigate('/complaints');
  };

  if (!complaint) return <div className="loading">Loading...</div>;

  const ai = complaint.aiAnalysis;
  const priorityColor = (p) =>
    p === 'High' ? 'badge-red' : p === 'Medium' ? 'badge-orange' : 'badge-gray';

  return (
    <div className="page">
      <button className="btn-back" onClick={() => navigate('/complaints')}>← Back</button>

      <div className="detail-grid">
        <div className="detail-main">
          <div className="detail-card">
            <div className="detail-top">
              <span className="category-tag">{complaint.category}</span>
              <span className={`badge ${complaint.status === 'Resolved' ? 'badge-green' : complaint.status === 'In Progress' ? 'badge-blue' : 'badge-yellow'}`}>
                {complaint.status}
              </span>
            </div>
            <h1 className="detail-title">{complaint.title}</h1>
            <div className="detail-meta">
              <span>👤 {complaint.name}</span>
              <span>✉️ {complaint.email}</span>
              <span>📍 {complaint.location}</span>
              <span>🗓️ {new Date(complaint.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="detail-description">
              <h3>Description</h3>
              <p>{complaint.description}</p>
            </div>
          </div>

          {/* AI Analysis */}
          {ai?.priority ? (
            <div className="ai-card">
              <div className="ai-header">
                <span className="ai-badge">🤖 AI Analysis</span>
                <span className={`badge ${priorityColor(ai.priority)}`}>⚡ {ai.priority} Priority</span>
              </div>
              <div className="ai-grid">
                <div className="ai-item">
                  <div className="ai-label">Responsible Department</div>
                  <div className="ai-value">🏛️ {ai.department}</div>
                </div>
                <div className="ai-item full">
                  <div className="ai-label">AI Summary</div>
                  <div className="ai-value">{ai.summary}</div>
                </div>
                <div className="ai-item full">
                  <div className="ai-label">Auto-Response to Citizen</div>
                  <div className="ai-response">{ai.autoResponse}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="ai-placeholder">
              <div className="ai-placeholder-text">
                <h3>🤖 AI Analysis Not Yet Run</h3>
                <p>Click "Run AI Analysis" to detect priority, suggest department, and generate auto-response.</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="detail-sidebar">
          <div className="sidebar-card">
            <h3>Update Status</h3>
            <select value={status} onChange={e => setStatus(e.target.value)}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button className="btn-primary full-width" onClick={handleStatusUpdate} disabled={updateLoading}>
              {updateLoading ? 'Updating...' : 'Update Status'}
            </button>
          </div>

          <div className="sidebar-card">
            <h3>AI Actions</h3>
            <button className="btn-ai full-width" onClick={handleAIAnalyze} disabled={aiLoading}>
              {aiLoading ? '🤖 Analyzing...' : '🤖 Run AI Analysis'}
            </button>
          </div>

          <div className="sidebar-card">
            <h3>Danger Zone</h3>
            <button className="btn-danger full-width" onClick={handleDelete}>🗑️ Delete Complaint</button>
          </div>

          {msg && <div className="alert alert-success">{msg}</div>}
        </div>
      </div>
    </div>
  );
}