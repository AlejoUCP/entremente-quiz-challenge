
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

// Quiz types
type QuizQuestion = {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  all_answers: string[];
};

type QuizState = {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  score: number;
  selectedAnswer: string | null;
  isAnswered: boolean;
  timeRemaining: number;
  quizStarted: boolean;
  quizFinished: boolean;
};

const Quiz = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [state, setState] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    selectedAnswer: null,
    isAnswered: false,
    timeRemaining: 20, // 20 seconds per question
    quizStarted: false,
    quizFinished: false
  });

  // Categories data (same as in Categories.tsx)
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
  
  const currentCategory = triviaCategories.find(cat => cat.id === Number(categoryId));

  // Mock fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock questions
        const mockQuestions: QuizQuestion[] = Array(10).fill(null).map((_, index) => {
          const correct = `Respuesta correcta ${index + 1}`;
          const incorrectAnswers = [
            `Opción incorrecta A${index + 1}`,
            `Opción incorrecta B${index + 1}`,
            `Opción incorrecta C${index + 1}`
          ];
          
          // Shuffle all answers
          const all_answers = [...incorrectAnswers, correct].sort(() => Math.random() - 0.5);
          
          return {
            question: `Pregunta ${index + 1} sobre ${currentCategory?.name || 'este tema'}`,
            correct_answer: correct,
            incorrect_answers: incorrectAnswers,
            all_answers
          };
        });
        
        setState(prev => ({ ...prev, questions: mockQuestions }));
      } catch (error) {
        console.error('Error fetching questions', error);
        toast({
          title: 'Error',
          description: 'No pudimos cargar las preguntas. Por favor intenta de nuevo.',
          variant: 'destructive',
        });
      }
    };
    
    fetchQuestions();
  }, [categoryId, toast]);

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (state.quizStarted && !state.isAnswered && !state.quizFinished && state.timeRemaining > 0) {
      timer = setInterval(() => {
        setState(prev => {
          if (prev.timeRemaining <= 1) {
            clearInterval(timer);
            // Time's up, auto-submit with current selection or nothing
            return {
              ...prev,
              timeRemaining: 0,
              isAnswered: true,
            };
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);
    }
    
    return () => clearInterval(timer);
  }, [state.quizStarted, state.isAnswered, state.quizFinished, state.timeRemaining]);

  const startQuiz = () => {
    setState(prev => ({ ...prev, quizStarted: true, timeRemaining: 20 }));
  };

  const handleAnswerSelect = (answer: string) => {
    if (state.isAnswered) return; // Prevent changing answer after submission
    
    setState(prev => ({ ...prev, selectedAnswer: answer }));
  };

  const handleSubmitAnswer = () => {
    const currentQuestion = state.questions[state.currentQuestionIndex];
    let newScore = state.score;
    
    if (state.selectedAnswer === currentQuestion.correct_answer) {
      newScore += 1;
      toast({
        title: '¡Correcto!',
        description: 'Has respondido correctamente',
        variant: 'default',
        className: 'bg-green-100 dark:bg-green-900 border-green-500',
      });
    } else {
      toast({
        title: 'Incorrecto',
        description: `La respuesta correcta era: ${currentQuestion.correct_answer}`,
        variant: 'default',
        className: 'bg-red-100 dark:bg-red-900 border-red-500',
      });
    }
    
    setState(prev => ({ ...prev, isAnswered: true, score: newScore }));
  };

  const handleNextQuestion = () => {
    const isLastQuestion = state.currentQuestionIndex === state.questions.length - 1;
    
    if (isLastQuestion) {
      // End of quiz, navigate to results with score
      setState(prev => ({ ...prev, quizFinished: true }));
      navigate('/results', { 
        state: { 
          score: state.score, 
          totalQuestions: state.questions.length,
          categoryId: categoryId,
          categoryName: currentCategory?.name 
        } 
      });
      return;
    }
    
    // Move to next question
    setState(prev => ({
      ...prev,
      currentQuestionIndex: prev.currentQuestionIndex + 1,
      selectedAnswer: null,
      isAnswered: false,
      timeRemaining: 20
    }));
  };

  // Loading state
  if (state.questions.length === 0) {
    return (
      <Layout title={currentCategory?.name || 'Trivia'} showBackButton>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 border-4 border-entremente-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-entremente-dark dark:text-white">Cargando preguntas...</p>
        </div>
      </Layout>
    );
  }

  // Quiz intro screen
  if (!state.quizStarted) {
    return (
      <Layout title={currentCategory?.name || 'Trivia'} showBackButton>
        <div className="max-w-lg mx-auto mt-12">
          <div className="entremente-card text-center">
            <div className={`mx-auto w-20 h-20 rounded-full ${currentCategory?.color} flex items-center justify-center text-white text-3xl mb-4`}>
              <span>{currentCategory?.icon}</span>
            </div>
            <h2 className="text-2xl font-bold text-entremente-dark dark:text-white mb-3">
              {currentCategory?.name || 'Trivia'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Responde 10 preguntas sobre este tema. Tienes 20 segundos para cada pregunta.
            </p>
            <button 
              onClick={startQuiz}
              className="entremente-button w-full"
            >
              Comenzar Desafío
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // Active quiz
  const currentQuestion = state.questions[state.currentQuestionIndex];
  
  return (
    <Layout title={currentCategory?.name || 'Trivia'} showBackButton={false}>
      <div className="max-w-lg mx-auto">
        {/* Quiz progress bar */}
        <div className="mb-6 animate-fade-in">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-entremente-dark dark:text-gray-300">
              Pregunta {state.currentQuestionIndex + 1} de {state.questions.length}
            </span>
            <span className="text-sm text-entremente-dark dark:text-gray-300">
              Puntuación: {state.score}
            </span>
          </div>
          <Progress value={((state.currentQuestionIndex + 1) / state.questions.length) * 100} className="h-2" />
        </div>
        
        {/* Timer */}
        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-entremente-dark dark:text-gray-300">Tiempo restante</span>
            <span className="text-sm text-entremente-dark dark:text-gray-300">{state.timeRemaining}s</span>
          </div>
          <Progress 
            value={(state.timeRemaining / 20) * 100} 
            className={`h-2 ${state.timeRemaining <= 5 ? 'bg-red-500' : 'bg-entremente-primary'}`}
          />
        </div>

        {/* Question */}
        <div className="entremente-card mb-6 animate-fade-in">
          <h3 className="text-xl font-semibold text-entremente-dark dark:text-white mb-2">
            {currentQuestion.question}
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Selecciona la respuesta correcta
          </div>
        </div>

        {/* Answer options */}
        <div className="space-y-3 mb-8 animate-slide-up">
          {currentQuestion.all_answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(answer)}
              className={`w-full text-left p-4 rounded-xl transition-all border ${
                state.selectedAnswer === answer 
                  ? 'bg-entremente-light dark:bg-gray-700 border-entremente-primary dark:border-entremente-light' 
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              } ${
                state.isAnswered && answer === currentQuestion.correct_answer
                  ? 'bg-green-100 dark:bg-green-900 border-green-500'
                  : state.isAnswered && state.selectedAnswer === answer && answer !== currentQuestion.correct_answer
                  ? 'bg-red-100 dark:bg-red-900 border-red-500'
                  : ''
              }`}
              disabled={state.isAnswered}
            >
              <div className="flex items-center">
                <span className="w-8 h-8 rounded-full bg-entremente-light dark:bg-gray-700 flex items-center justify-center mr-3 text-entremente-primary dark:text-entremente-light">
                  {String.fromCharCode(65 + index)} {/* A, B, C, D */}
                </span>
                <span className="flex-1">{answer}</span>
                {state.isAnswered && answer === currentQuestion.correct_answer && (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-green-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {state.isAnswered && state.selectedAnswer === answer && answer !== currentQuestion.correct_answer && (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-red-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex justify-center">
          {!state.isAnswered ? (
            <Button
              onClick={handleSubmitAnswer}
              className="entremente-button"
              disabled={state.selectedAnswer === null}
            >
              Responder
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              className="entremente-button"
            >
              {state.currentQuestionIndex === state.questions.length - 1 ? 'Ver Resultados' : 'Siguiente Pregunta'}
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Quiz;
