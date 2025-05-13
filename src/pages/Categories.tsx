
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

// Define our categories
const triviaCategories = [
  { id: 9, name: 'Conocimiento General', icon: '🧠', color: 'bg-blue-500' },
  { id: 17, name: 'Ciencias', icon: '🔬', color: 'bg-green-500' },
  { id: 23, name: 'Historia', icon: '📜', color: 'bg-amber-600' },
  { id: 22, name: 'Geografía', icon: '🌎', color: 'bg-emerald-500' },
  { id: 21, name: 'Deportes', icon: '⚽', color: 'bg-red-500' },
  { id: 11, name: 'Películas', icon: '🎬', color: 'bg-purple-500' },
  { id: 12, name: 'Música', icon: '🎵', color: 'bg-pink-500' },
  { id: 14, name: 'Televisión', icon: '📺', color: 'bg-indigo-500' },
  { id: 15, name: 'Videojuegos', icon: '🎮', color: 'bg-cyan-500' },
  { id: 18, name: 'Informática', icon: '💻', color: 'bg-gray-700' },
];

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategory(categoryId);
    setTimeout(() => {
      navigate(`/quiz/${categoryId}`);
    }, 300); // Small delay for the selection animation
  };

  return (
    <Layout title="Categorías" showLogout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center animate-fade-in">
          <h2 className="text-2xl font-bold text-entremente-dark dark:text-white">
            Selecciona una Categoría
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Elige un tema para comenzar el desafío de 10 preguntas
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {triviaCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className={`entremente-card text-left transition-all duration-300 ${
                selectedCategory === category.id ? 'ring-4 ring-entremente-primary scale-95' : 'hover:scale-105'
              }`}
            >
              <div className="flex flex-col items-center">
                <div className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center text-white text-2xl mb-3`}>
                  <span>{category.icon}</span>
                </div>
                <h3 className="font-semibold text-entremente-dark dark:text-white text-center">
                  {category.name}
                </h3>
              </div>
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
