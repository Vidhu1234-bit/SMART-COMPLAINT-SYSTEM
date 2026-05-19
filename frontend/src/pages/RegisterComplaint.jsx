import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const CATEGORIES = ['Water Supply', 'Electricity', 'Roads & Transport', 'Garbage & Sanitation',
  'Street Lighting', 'Drainage', 'Parks & Recreation', 'Other'];

export default function RegisterComplaint() {
  const [form, setForm] = useState({
    name: '', email: '', title: '', description: '', category: '', location: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await API.post('/complaints', form);
      setSuccess('Complaint registered! Redirecting...');
      setTimeout(() => navigate(`/complaints/${data.complaint._id}`), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register complaint.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>File a Complaint</h1>
          <p>Submit your civic issue and we'll get it resolved.</p>
        </div>
      </div>

      <div className="form-card">
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="complaint-form">
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input type="text" placeholder="Rahul Kumar"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Email Address *</label>
              <input type="email" placeholder="rahul@gmail.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
          </div>

          <div className="form-group">
            <label>Complaint Title *</label>
            <input type="text" placeholder="Brief title of the issue"
              value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required>
                <option value="">Select Category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Location *</label>
              <input type="text" placeholder="e.g. Ghaziabad, Sector 5"
                value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
            </div>
          </div>

          <div className="form-group">
            <label>Complaint Description *</label>
            <textarea rows="5" placeholder="Describe the issue in detail..."
              value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : '🚀 Submit Complaint'}
          </button>
        </form>
      </div>
    </div>
  );
}