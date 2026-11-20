import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from '../components/CourseCard.jsx';
import { getCourses } from '../services/courseService.js';

function Home() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    getCourses()
      .then((res) => setCourses(res.data.slice(0, 3)))
      .catch(() => setCourses([])); // the home page still works if the API is down
  }, []);

  return (
    <div>
      <section className="hero">
        <h1>Learn new skills at your own pace</h1>
        <p>Browse courses, enroll with one click and track your progress. Instructors can create and manage their own courses.</p>
        <div className="row">
          <Link to="/courses" className="btn">Browse courses</Link>
          <Link to="/register" className="btn light">Create account</Link>
        </div>
      </section>

      {courses.length > 0 && (
        <section>
          <h2>Latest courses</h2>
          <div className="grid">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default Home;
