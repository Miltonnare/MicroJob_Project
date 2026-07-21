import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import JobList from '../Components/JobList';
import CourseList from '../Components/CourseList';
import ReputationScore from '../Components/Reputation';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [courses, setCourses] = useState([]);
  const [reputation, setReputation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch user
        let fetchedUser = JSON.parse(localStorage.getItem('user'));
        if (!fetchedUser) {
          try {
            const userResponse = await axios.get('http://localhost:5000/user');
            fetchedUser = userResponse.data;
            localStorage.setItem('user', JSON.stringify(fetchedUser));
          } catch (userErr) {
            console.error('User fetch error:', userErr.message);
            // Mock fallback
            fetchedUser = { name: 'Guest', skills: 'farming', location: 'Kisumu', jobsApplied: 0, coursesCompleted: 0 };
          }
        }
        setUser(fetchedUser);

        // Fetch jobs
        const jobResponse = await axios.post('http://localhost:5000/match_jobs', { skills: fetchedUser.skills || 'farming' });
        setJobs(jobResponse.data.jobs);

        // Fetch courses
        const courseResponse = await axios.post('http://localhost:5000/courses', { skills: fetchedUser.skills || 'farming' });
        setCourses(courseResponse.data.courses);

        // Fetch reputation
        const repResponse = await axios.get('http://localhost:5000/reputation');
        setReputation(repResponse.data.score);
      } catch (err) {
        console.error('Fetch error:', err.message, err.response?.data);
        setError(`Failed to load data: ${err.message}`);
        // Mock fallback data
        setUser({ name: 'Guest', skills: 'farming', location: 'Kisumu', jobsApplied: 0, coursesCompleted: 0 });
        setJobs([
          { Title: 'Farm Worker', Pay: 'KSh 500', Location: 'Kisumu', Duration: '1 day', Skills: 'farming' },
          { Title: 'Cleaner', Pay: 'KSh 300', Location: 'Nairobi', Duration: '4 hours', Skills: 'cleaning' },
        ]);
        setCourses(['Organic Farming', 'Digital Literacy']);
        setReputation(4.5);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1>Habari, {user?.name || 'Guest'}!</h1>
      <p className="lead">Find micro-jobs and build skills to thrive in Kenya’s economy.</p>
      <div className="row">
        <div className="col-md-6">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>Your Job Matches</h5>
            <Link to="/jobs" className="btn btn-secondary btn-sm">View All</Link>
          </div>
          <JobList jobs={jobs} user={user} />
        </div>
        <div className="col-md-6">
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5>Recommended Courses</h5>
              <Link to="/courses" className="btn btn-secondary btn-sm">Explore More</Link>
            </div>
            <CourseList courses={courses} user={user} />
          </div>
          <ReputationScore score={reputation} />
          <div className="mt-4">
            <h5>Your Progress</h5>
            <p>Jobs Applied: {user?.jobsApplied || 0} | Courses Completed: {user?.coursesCompleted || 0}</p>
            <Link to="/profile" className="btn btn-primary me-2">Update Profile</Link>
            <Link to="/post-job" className="btn btn-secondary">Post a Job</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;