import { Link } from 'react-router-dom';

function CourseCard({ course }) {
  return (
    <article className="card">
      <span className="badge">{course.category}</span>
      <h3>{course.title}</h3>
      <p className="muted">
        {course.description.length > 90
          ? `${course.description.slice(0, 90)}...`
          : course.description}
      </p>
      <p className="meta">
        By {course.instructor ? course.instructor.name : 'Unknown'} |{' '}
        {course.price === 0 ? 'Free' : `Rs. ${course.price}`}
      </p>
      <Link className="btn small" to={`/courses/${course._id}`}>View details</Link>
    </article>
  );
}

export default CourseCard;
