import { useState } from 'react';
import axios from 'axios';
function JobPosting() {
  const [formData, setFormData] = useState({ title: '', pay: '', skills: '', location: '', duration: '' });
  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/post_job', formData);
    alert('Job Posted!');
  };
  return (
    <div className="container mt-4">
      <h2>Post a Job</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" className="form-control mb-2" placeholder="Job Title (e.g., Farm Worker)"
          value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
        <input type="text" className="form-control mb-2" placeholder="Pay (e.g., KSh 500)"
          value={formData.pay} onChange={(e) => setFormData({ ...formData, pay: e.target.value })} />
        <input type="text" className="form-control mb-2" placeholder="Skills (e.g., farming)"
          value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} />
        <select className="form-control mb-2" value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}>
          <option value="">Select Location</option>
          <option>Kisumu</option>
          <option>Nairobi</option>
        </select>
        <input type="text" className="form-control mb-2" placeholder="Duration (e.g., 1 day)"
          value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
        <button type="submit" className="btn btn-primary">Post Job</button>
      </form>
    </div>
  );
}
export default JobPosting;