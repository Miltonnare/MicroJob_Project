import { useState } from 'react';
import axios from 'axios';
import JobList from '../Components/JobList';
function Jobs() {
  const [formData, setFormData] = useState({ skills: '', location: '' });
  const [jobs, setJobs] = useState([]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post('http://localhost:5000/match_jobs', formData);
    setJobs(response.data.jobs);
  };
  return (
    <div className="container mt-4">
      <h2>Find Jobs</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <input type="text" className="form-control mb-2" placeholder="Skills (e.g., farming)"
          value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} />
        <select className="form-control mb-2" value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}>
          <option value="">Select Location</option>
          <option>Kisumu</option>
          <option>Nairobi</option>
        </select>
        <button type="submit" className="btn btn-primary">Search</button>
      </form>
      <JobList jobs={jobs} />
    </div>
  );
}
export default Jobs;