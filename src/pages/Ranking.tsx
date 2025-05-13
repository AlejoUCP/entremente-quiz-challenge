
import { useState, useEffect, useContext } from 'react';
import Layout from '../components/Layout';
import { AuthContext } from '../App';
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type RankingUser = {
  id: number;
  username: string;
  fullName: string;
  score: number;
  gamesPlayed: number;
  rank: number;
};

const Ranking = () => {
  const [globalRanking, setGlobalRanking] = useState<RankingUser[]>([]);
  const [categoryRanking, setCategoryRanking] = useState<RankingUser[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const { toast } = useToast();
  
  // Categories data 
  const categories = [
    { value: 'all', label: 'General' },
    { value: '9', label: 'Conocimiento General' },
    { value: '17', label: 'Ciencias' },
    { value: '23', label: 'Historia' },
    { value: '22', label: 'Geografía' },
    { value: '21', label: 'Deportes' },
  ];

  // Find current user in ranking
  const currentUserRank = globalRanking.find(u => u.id === user?.id);

  useEffect(() => {
    const fetchRankingData = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock global ranking data
        const mockGlobalRanking: RankingUser[] = [
          { id: 4, username: 'brainmaster', fullName: 'Carlos Sánchez', score: 95, gamesPlayed: 32, rank: 1 },
          { id: 8, username: 'quizchampion', fullName: 'Ana García', score: 92, gamesPlayed: 29, rank: 2 },
          { id: 15, username: 'knowledgeguru', fullName: 'Luis Martínez', score: 88, gamesPlayed: 25, rank: 3 },
          { id: 2, username: 'triviastar', fullName: 'María López', score: 85, gamesPlayed: 30, rank: 4 },
          { id: 1, username: 'userDemo', fullName: 'Usuario Demo', score: 82, gamesPlayed: 15, rank: 5 },
          { id: 9, username: 'quizmaster', fullName: 'Diego Ramírez', score: 78, gamesPlayed: 18, rank: 6 },
          { id: 7, username: 'smartypants', fullName: 'Elena Torres', score: 75, gamesPlayed: 20, rank: 7 },
          { id: 11, username: 'factfinder', fullName: 'Roberto Díaz', score: 70, gamesPlayed: 12, rank: 8 },
          { id: 23, username: 'knowledgeseeker', fullName: 'Laura Morales', score: 65, gamesPlayed: 10, rank: 9 },
          { id: 17, username: 'triviaenjoyer', fullName: 'Javier González', score: 60, gamesPlayed: 8, rank: 10 },
        ];
        
        setGlobalRanking(mockGlobalRanking);
        setCategoryRanking(mockGlobalRanking.slice().sort(() => Math.random() - 0.5));
      } catch (error) {
        console.error('Error fetching ranking data', error);
        toast({
          title: 'Error',
          description: 'No pudimos cargar el ranking. Por favor intenta de nuevo.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRankingData();
  }, [toast]);

  const handleCategoryChange = (category: string) => {
    setIsLoading(true);
    setSelectedCategory(category);
    
    // Simulate API call for category change
    setTimeout(() => {
      // Just randomize order for demo
      setCategoryRanking(globalRanking.slice().sort(() => Math.random() - 0.5));
      setIsLoading(false);
    }, 500);
  };

  if (isLoading) {
    return (
      <Layout title="Ranking Global" showBackButton={false}>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 border-4 border-entremente-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-entremente-dark dark:text-white">Cargando ranking...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Ranking" showBackButton={false}>
      <div className="max-w-lg mx-auto">
        {/* User position highlight */}
        {currentUserRank && (
          <div className="entremente-card bg-entremente-light dark:bg-gray-800 border-2 border-entremente-primary mb-6 animate-fade-in">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-entremente-primary rounded-full flex items-center justify-center text-xl text-white font-semibold mr-4">
                #{currentUserRank.rank}
              </div>
              <div>
                <h3 className="font-semibold text-entremente-dark dark:text-white">
                  {currentUserRank.fullName}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tu posición en el ranking global
                </p>
              </div>
              <div className="ml-auto text-right">
                <span className="text-2xl font-bold text-entremente-primary dark:text-entremente-light">
                  {currentUserRank.score}
                </span>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  puntos
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Category selector */}
        <div className="mb-6 animate-fade-in">
          <h3 className="text-lg font-semibold text-entremente-dark dark:text-white mb-3">
            Selecciona una categoría
          </h3>
          <div className="overflow-x-auto pb-2">
            <Tabs value={selectedCategory} onValueChange={handleCategoryChange} className="w-full">
              <TabsList className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-1">
                {categories.map(category => (
                  <TabsTrigger 
                    key={category.value} 
                    value={category.value}
                    className="data-[state=active]:bg-entremente-primary data-[state=active]:text-white"
                  >
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
          
        {/* Ranking table */}
        <div className="entremente-card overflow-hidden p-0 animate-slide-up">
          <table className="w-full">
            <thead className="bg-entremente-primary text-white">
              <tr>
                <th className="py-3 pl-4 pr-2 text-left text-sm font-semibold">#</th>
                <th className="py-3 px-2 text-left text-sm font-semibold">Usuario</th>
                <th className="py-3 px-2 text-right text-sm font-semibold">Puntos</th>
                <th className="py-3 pl-2 pr-4 text-right text-sm font-semibold">Partidas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {(selectedCategory === 'all' ? globalRanking : categoryRanking).map((rankUser, index) => {
                const isCurrentUser = rankUser.id === user?.id;
                return (
                  <tr key={rankUser.id} className={`${isCurrentUser ? 'bg-entremente-light dark:bg-gray-700' : 'bg-white dark:bg-gray-800'} hover:bg-gray-50 dark:hover:bg-gray-700`}>
                    <td className="py-3 pl-4 pr-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        index < 3 
                          ? 'bg-yellow-400 text-white font-bold'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}>
                        {rankUser.rank}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div>
                        <p className={`font-medium ${isCurrentUser ? 'text-entremente-primary dark:text-entremente-light' : 'text-gray-900 dark:text-white'}`}>
                          {rankUser.fullName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          @{rankUser.username}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right font-semibold text-entremente-dark dark:text-white">
                      {rankUser.score}
                    </td>
                    <td className="py-3 pl-2 pr-4 text-right text-sm text-gray-500 dark:text-gray-400">
                      {rankUser.gamesPlayed}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Ranking;
