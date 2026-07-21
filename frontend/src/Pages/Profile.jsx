import { useState, useEffect } from 'react';
import axios from 'axios';
import ReputationScore from '../Components/Reputation';
function Profile() {
  const [user, setUser] = useState({ name: 'Mary', skills: 'farming', location: 'Kisumu' });
  const [reputation, setReputation] = useState(0);
  useEffect(() => {
    const fetchReputation = async () => {
      const response = await axios.get('http://localhost:5000/reputation');
      setReputation(response.data.score);
    };
    fetchReputation();
  }, []);
  const handleUpdate = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/update_profile', user);
    alert('Profile Updated!');
  };
  return (
    <div className="container mt-4">
      <h2>Your Profile</h2>
      <form onSubmit={handleUpdate} className="mb-4">
        <input type="text" className="form-control mb-2" value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })} />
        <input type="text" className="form-control mb-2" value={user.skills}
          onChange={(e) => setUser({ ...user, skills: e.target.value })} />
        <select className="form-control mb-2" value={user.location}
          onChange={(e) => setUser({ ...user, location: e.target.value })}>
          <option>Kisumu</option>
          <option>Nairobi</option>
        </select>
        <button type="submit" className="btn btn-primary">Update</button>
      </form>
      <ReputationScore score={reputation} />
      <h5>Job History</h5>
      <p>Farm Worker, Kisumu, KSh 500 (Completed)</p>
    </div>
  );
}
export default Profile;