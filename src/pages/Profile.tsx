
import { useContext, useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { AuthContext } from '../App';
import { useToast } from "@/components/ui/use-toast";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const { toast } = useToast();
  const [userStats, setUserStats] = useState({
    totalGames: 0,
    averageScore: 0,
    highestScore: 0,
    favoriteCategory: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentGames, setRecentGames] = useState<Array<{
    id: number,
    date: string,
    category: string,
    score: number,
    total: number
  }>>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock user statistics
        setUserStats({
          totalGames: 15,
          averageScore: 7.3,
          highestScore: 10,
          favoriteCategory: 'Ciencias',
        });
        
        // Mock recent games
        setRecentGames([
          { id: 5, date: '2023-11-28', category: 'Historia', score: 8, total: 10 },
          { id: 4, date: '2023-11-27', category: 'Ciencias', score: 10, total: 10 },
          { id: 3, date: '2023-11-25', category: 'Música', score: 6, total: 10 },
          { id: 2, date: '2023-11-20', category: 'Geografía', score: 7, total: 10 },
          { id: 1, date: '2023-11-18', category: 'Deportes', score: 5, total: 10 },
        ]);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user data', error);
        toast({
          title: 'Error',
          description: 'No pudimos cargar tus datos. Por favor intenta de nuevo.',
          variant: 'destructive',
        });
      }
    };
    
    fetchUserData();
  }, [toast]);

  const handleLogout = () => {
    logout();
    toast({
      title: 'Sesión cerrada',
      description: 'Has cerrado sesión correctamente',
    });
  };
  
  if (isLoading) {
    return (
      <Layout title="Mi Perfil" showLogout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 border-4 border-entremente-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-entremente-dark dark:text-white">Cargando datos...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Mi Perfil" showLogout>
      <div className="max-w-lg mx-auto">
        {/* User profile header */}
        <div className="entremente-card mb-6 animate-fade-in">
          <div className="flex items-center">
            <div className="w-20 h-20 bg-entremente-primary rounded-full flex items-center justify-center text-3xl text-white font-semibold">
              {user?.nombre_completo?.charAt(0) || user?.username?.charAt(0) || 'U'}
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-bold text-entremente-dark dark:text-white">
                {user?.nombre_completo || 'Usuario'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                @{user?.username || 'username'}
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={handleLogout}
              className="py-2 px-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-entremente-dark dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
        
        {/* Statistics */}
        <div className="entremente-card mb-6 animate-fade-in">
          <h3 className="text-xl font-semibold text-entremente-dark dark:text-white mb-4">
            Estadísticas
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-entremente-accent dark:bg-gray-800 rounded-xl p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Total de Partidas
              </p>
              <p className="text-2xl font-bold text-entremente-dark dark:text-white">
                {userStats.totalGames}
              </p>
            </div>
            
            <div className="bg-entremente-accent dark:bg-gray-800 rounded-xl p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Puntuación Promedio
              </p>
              <p className="text-2xl font-bold text-entremente-dark dark:text-white">
                {userStats.averageScore}/10
              </p>
            </div>
            
            <div className="bg-entremente-accent dark:bg-gray-800 rounded-xl p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Mejor Puntuación
              </p>
              <p className="text-2xl font-bold text-entremente-dark dark:text-white">
                {userStats.highestScore}/10
              </p>
            </div>
            
            <div className="bg-entremente-accent dark:bg-gray-800 rounded-xl p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Categoría Favorita
              </p>
              <p className="text-2xl font-bold text-entremente-dark dark:text-white">
                {userStats.favoriteCategory}
              </p>
            </div>
          </div>
        </div>
        
        {/* Recent games */}
        <div className="entremente-card animate-slide-up">
          <h3 className="text-xl font-semibold text-entremente-dark dark:text-white mb-4">
            Partidas Recientes
          </h3>
          
          {recentGames.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-600 dark:text-gray-400">
                No has jugado ninguna partida aún.
              </p>
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-entremente-accent dark:bg-gray-800 text-entremente-dark dark:text-white">
                  <tr>
                    <th className="py-3 pl-4 pr-2 text-left text-sm font-semibold">Fecha</th>
                    <th className="py-3 px-2 text-left text-sm font-semibold">Categoría</th>
                    <th className="py-3 pl-2 pr-4 text-right text-sm font-semibold">Puntaje</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentGames.map((game) => (
                    <tr key={game.id} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-3 pl-4 pr-2 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(game.date).toLocaleDateString('es-ES')}
                      </td>
                      <td className="py-3 px-2 text-sm">{game.category}</td>
                      <td className="py-3 pl-2 pr-4 text-right text-sm font-medium">
                        <span className={`py-1 px-2 rounded-full ${
                          game.score >= 8 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                          game.score >= 6 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {game.score}/{game.total}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
