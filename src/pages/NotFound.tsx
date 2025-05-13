
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-entremente-accent to-white dark:from-gray-900 dark:to-gray-800">
      <div className="text-center px-4">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-entremente-primary dark:text-entremente-light">404</h1>
          <div className="w-16 h-1 bg-entremente-primary dark:bg-entremente-light mx-auto my-4"></div>
          <p className="text-2xl text-gray-700 dark:text-gray-300 mb-6">
            Página no encontrada
          </p>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
            Lo sentimos, la página que estás buscando no existe o ha sido movida a otra ubicación.
          </p>
        </div>

        <Link to="/" className="entremente-button inline-flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
