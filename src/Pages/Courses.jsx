import { useState, useEffect } from 'react';
import axios from 'axios';
import CourseList from '../Components/CourseList';
function Courses() {
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    const fetchCourses = async () => {
      const response = await axios.post('http://localhost:5000/courses', { skills: 'farming' });
      setCourses(response.data.courses);
    };
    fetchCourses();
  }, []);
  return (
    <div className="container mt-4">
      <h2>Skill-Building Courses</h2>
      <CourseList courses={courses} />
    </div>
  );
}
export default Courses;