import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Dashboard from './Pages/Dashboard';
import Jobs from './Pages/Jobs';
import Courses from './Pages/Courses';
import Profile from './Pages/Profile';
import JobPosting from './Pages/JobPosting';
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/post-job" element={<JobPosting />} />
      </Routes>
    </Router>
  );
}
export default App;