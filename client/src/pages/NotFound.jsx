import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="status">
      <h1>404: Page not found</h1>
      <Link className="btn" to="/">Go to home</Link>
    </div>
  );
}

export default NotFound;
