import { useState } from 'react';
import axios from 'axios';

function JobList({ jobs, user, setUser }) {
  
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState(JSON.parse(localStorage.getItem(`appliedJobs_${user?.name}`)) || []);

  const handleApply = async (job) => {
  const updatedAppliedJobs = [...appliedJobs, job.Title];
  setAppliedJobs(updatedAppliedJobs);
  localStorage.setItem(`appliedJobs_${user?.name}`, JSON.stringify(updatedAppliedJobs));
  try {
    await axios.post('http://localhost:5000/apply_job', { jobTitle: job.Title });
    const updatedUser = { ...user, jobsApplied: (user.jobsApplied || 0) + 1 };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    alert(`Applied for ${job.Title}!`);
  } catch (err) {
    alert('Error applying for job.');
  }
};

  const handleShowModal = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  return (
    <>
      {jobs.length ? jobs.slice(0, 4).map((job, index) => (
        <div className="card mb-2" key={index}>
          <div className="card-body">
            <h6>{job.Title}</h6>
            <p>{job.Pay} | {job.Location} | {job.Duration}</p>
            <button
              className="btn btn-primary btn-sm me-2"
              onClick={() => handleApply(job)}
              disabled={appliedJobs.includes(job.Title)}
            >
              {appliedJobs.includes(job.Title) ? 'Applied' : 'Apply'}
            </button>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => handleShowModal(job)}>
              Details
            </button>
          </div>
        </div>
      )) : <p>No jobs found. Update your skills!</p>}
      {/* Bootstrap Modal */}
      {selectedJob && (
        <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedJob.Title}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Pay:</strong> {selectedJob.Pay}</p>
                <p><strong>Location:</strong> {selectedJob.Location}</p>
                <p><strong>Duration:</strong> {selectedJob.Duration}</p>
                <p><strong>Skills:</strong> {selectedJob.Skills}</p>
                <p>Payment via M-Pesa upon completion.</p>
                <p><strong>Status:</strong> {appliedJobs.includes(selectedJob.Title) ? 'Applied' : 'Not Applied'}</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  onClick={() => handleApply(selectedJob)}
                  disabled={appliedJobs.includes(selectedJob.Title)}
                >
                  {appliedJobs.includes(selectedJob.Title) ? 'Applied' : 'Apply'}
                </button>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default JobList;