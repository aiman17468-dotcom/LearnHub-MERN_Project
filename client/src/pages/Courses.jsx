import { useState, useEffect } from 'react';
import CourseCard from '../components/CourseCard.jsx';
import Alert from '../components/Alert.jsx';
import { getCourses } from '../services/courseService.js';
import getErrorMessage from '../utils/getErrorMessage.js';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('');
  const [query, setQuery] = useState('');

  // Fetch again whenever the search query changes
  useEffect(() => {
    setLoading(true);
    setError('');
    getCourses({ search: query })
      .then((res) => setCourses(res.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [query]);

  const handleSearch = (event) => {
    event.preventDefault();
    setQuery(searchText.trim());
  };

  return (
    <div>
      <h1>All Courses</h1>
      <form className="search" onSubmit={handleSearch}>
        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search courses by title..."
          aria-label="Search courses"
        />
        <button className="btn" type="submit">Search</button>
      </form>

      <Alert>{error}</Alert>
      {loading && <p className="status">Loading courses...</p>}
      {!loading && !error && courses.length === 0 && (
        <p className="status">No courses found.</p>
      )}

      <div className="grid">
        {courses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    </div>
  );
}

export default Courses;
