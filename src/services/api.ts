
import axios from 'axios';

// Base URL para el backend - cambiar según tu configuración
const API_BASE_URL = 'http://localhost:3001/api';
// URL de LibreTranslate API
const LIBRE_TRANSLATE_URL = 'https://libretranslate.com/translate';
// URL de OpenTDB
const OPENTDB_URL = 'https://opentdb.com/api.php';

// Cliente axios para nuestro backend
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para agregar token en cada petición
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Servicios de autenticación
export const authService = {
  register: async (userData: { username: string, password: string, fullName: string }) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },
  
  login: async (credentials: { username: string, password: string }) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },
  
  logout: async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

// Servicio para obtener preguntas
export const quizService = {
  getQuestions: async (categoryId: number) => {
    try {
      // Obtenemos 10 preguntas de opción múltiple de la categoría seleccionada
      const response = await axios.get(`${OPENTDB_URL}`, {
        params: {
          amount: 10,
          category: categoryId,
          type: 'multiple'
        }
      });
      
      if (response.data.results && response.data.results.length > 0) {
        // Traducimos las preguntas
        const translatedQuestions = await Promise.all(
          response.data.results.map(async (question: any) => {
            const translatedQuestion = await translateText(question.question);
            const translatedCorrectAnswer = await translateText(question.correct_answer);
            const translatedIncorrectAnswers = await Promise.all(
              question.incorrect_answers.map((answer: string) => translateText(answer))
            );
            
            // Mezclar respuestas
            const allAnswers = [...translatedIncorrectAnswers, translatedCorrectAnswer].sort(() => Math.random() - 0.5);
            
            return {
              question: translatedQuestion,
              correct_answer: translatedCorrectAnswer,
              incorrect_answers: translatedIncorrectAnswers,
              all_answers: allAnswers
            };
          })
        );
        
        return translatedQuestions;
      }
      
      throw new Error('No se pudieron cargar las preguntas');
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  },
  
  saveResult: async (resultData: { categoryId: number, score: number, totalQuestions: number }) => {
    const response = await apiClient.post('/quiz/results', resultData);
    return response.data;
  }
};

// Servicio para obtener datos de usuario
export const userService = {
  getProfile: async () => {
    const response = await apiClient.get('/user/profile');
    return response.data;
  },
  
  getRecentGames: async () => {
    const response = await apiClient.get('/user/games');
    return response.data;
  },
  
  getRanking: async () => {
    const response = await apiClient.get('/ranking');
    return response.data;
  }
};

// Función para traducir texto utilizando LibreTranslate API
async function translateText(text: string): Promise<string> {
  try {
    // Detectamos si el texto está en inglés
    const detectResponse = await axios.post(`${LIBRE_TRANSLATE_URL}/detect`, {
      q: text
    });
    
    // Si ya está en español, devolvemos el texto tal cual
    if (detectResponse.data[0]?.language === 'es') {
      return text;
    }
    
    // Si está en otro idioma (principalmente inglés), lo traducimos
    const response = await axios.post(LIBRE_TRANSLATE_URL, {
      q: text,
      source: detectResponse.data[0]?.language || 'en',
      target: 'es',
      format: 'text'
    });
    
    return response.data.translatedText || text;
  } catch (error) {
    console.error('Error translating text:', error);
    // En caso de error, devolvemos el texto original
    return text;
  }
}
