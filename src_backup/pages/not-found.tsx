import { Link } from 'wouter';

export default function NotFoundPage() {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for does not exist or has been moved.</p>
        <Link href="/" className="home-button">
          Return to Home
        </Link>
      </div>
    </div>
  );
}