
import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import Layout from '../components/Layout';
import { useToast } from "@/components/ui/use-toast";
import { authService } from '@/services/api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Campos incompletos",
        description: "Por favor complete todos los campos",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Conectar con el backend real
      const response = await authService.login({
        username,
        password
      });
      
      // Store auth data
      login(response.user, response.token);
      
      toast({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión correctamente",
      });
      
      navigate('/categories');
    } catch (error) {
      console.error('Login error', error);
      toast({
        title: "Error de inicio de sesión",
        description: "Credenciales incorrectas o problema de conexión",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Iniciar Sesión" showBackButton>
      <div className="max-w-md mx-auto mt-8 animate-fade-in">
        <div className="entremente-card">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-entremente-primary dark:text-entremente-light">
              Iniciar Sesión
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Ingresa tus credenciales para continuar
            </p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre de Usuario
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="entremente-input"
                placeholder="Ingresa tu usuario"
                autoComplete="username"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="entremente-input"
                placeholder="Ingresa tu contraseña"
                autoComplete="current-password"
              />
            </div>
            
            <button
              type="submit"
              className="entremente-button w-full flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </>
              ) : 'Iniciar Sesión'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="text-entremente-primary dark:text-entremente-light font-medium hover:underline">
                Regístrate
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
