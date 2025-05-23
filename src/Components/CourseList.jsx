import { useState } from "react";
import axios from "axios";
function CourseList({ courses, user,setUser }) {
  const [enrolledCourses, setEnrolledCourses] = useState(JSON.parse(localStorage.getItem(`enrolledCourses_${user?.name}`)) || []);

 const handleEnroll = async (course) => {
  const updatedEnrolledCourses = [...enrolledCourses, course];
  setEnrolledCourses(updatedEnrolledCourses);
  localStorage.setItem(`enrolledCourses_${user?.name}`, JSON.stringify(updatedEnrolledCourses));
  try {
    await axios.post('http://localhost:5000/enroll_course', { courseTitle: course });
    const updatedUser = { ...user, coursesCompleted: (user.coursesCompleted || 0) + 1 };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    alert(`Enrolled in ${course}!`);
  } catch (err) {
    alert('Error enrolling in course.');
  }
};

  return (
    <div className="mb-4">
      {courses.length ? courses.slice(0, 3).map((course, index) => (
        <div className="list-group-item d-flex justify-content-between align-items-center" key={index}>
          {course}
          <button
            className="btn btn-primary btn-sm"
            onClick={() => handleEnroll(course)}
            disabled={enrolledCourses.includes(course)}
          >
            {enrolledCourses.includes(course) ? 'Enrolled' : 'Enroll'}
          </button>
        </div>
      )) : <p>No courses found.</p>}
    </div>
  );
}

export default CourseList;