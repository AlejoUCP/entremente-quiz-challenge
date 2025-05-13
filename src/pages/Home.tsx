
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';

const Home = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gradient-to-b from-entremente-accent to-white dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center items-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo and App Name */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block relative mb-6">
            <div className="w-24 h-24 rounded-full bg-entremente-primary flex items-center justify-center shadow-lg animate-pulse-soft">
              <span className="text-white text-4xl font-bold">E</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-entremente-secondary rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-bold">!</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-entremente-dark dark:text-white mb-2">Entremente</h1>
          <p className="text-gray-600 dark:text-gray-300 text-xl">Desafío Express – Reta tu mente</p>
        </div>

        {/* Call to Action Buttons */}
        <div className="space-y-4 animate-slide-up">
          {isLoggedIn ? (
            <>
              <Link to="/categories" className="entremente-button block w-full text-center">
                Comenzar a Jugar
              </Link>
              <Link to="/profile" className="block w-full text-center py-3 px-6 bg-white dark:bg-gray-800 text-entremente-primary dark:text-entremente-light font-medium rounded-xl border border-entremente-light dark:border-gray-700 transition-all hover:bg-entremente-accent">
                Mi Perfil
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="entremente-button block w-full text-center">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="block w-full text-center py-3 px-6 bg-white dark:bg-gray-800 text-entremente-primary dark:text-entremente-light font-medium rounded-xl border border-entremente-light dark:border-gray-700 transition-all hover:bg-entremente-accent">
                Registrarse
              </Link>
            </>
          )}
        </div>

        {/* App Features */}
        <div className="mt-16 space-y-6 animate-fade-in">
          <h2 className="text-xl font-semibold text-entremente-dark dark:text-white text-center mb-4">
            Características
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
              <div className="bg-entremente-light dark:bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-entremente-primary dark:text-entremente-light">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h3 className="font-semibold text-entremente-primary dark:text-entremente-light">Trivias</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Preguntas de múltiples categorías</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
              <div className="bg-entremente-light dark:bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-entremente-primary dark:text-entremente-light">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                </svg>
              </div>
              <h3 className="font-semibold text-entremente-primary dark:text-entremente-light">Ranking</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Compite con otros jugadores</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
              <div className="bg-entremente-light dark:bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-entremente-primary dark:text-entremente-light">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
              </div>
              <h3 className="font-semibold text-entremente-primary dark:text-entremente-light">Educativo</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Aprende mientras juegas</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
              <div className="bg-entremente-light dark:bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-entremente-primary dark:text-entremente-light">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h3 className="font-semibold text-entremente-primary dark:text-entremente-light">Divertido</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Interfaz atractiva y animada</p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400 pb-8">
          &copy; 2023 Entremente - Todos los derechos reservados
        </div>
      </div>
    </div>
  );
};

export default Home;
