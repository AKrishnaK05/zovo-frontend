import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold gradient-text">404</h1>
        <h2 className="text-2xl font-bold text-white mt-4">Page Not Found</h2>
        <p className="text-gray-400 mt-2">The page you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="btn-accent inline-block mt-6"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;