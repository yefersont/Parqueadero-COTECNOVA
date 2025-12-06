import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Card, CardBody, Button } from "@heroui/react";
import { Lock, User, Eye, EyeOff } from "lucide-react";
import Loader from "../../components/Loader";

function Login() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // 1. Estado de carga agregado para el botón
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  // Se asume que useAuth provee el estado de errores y la función signin
  const { signin, isAuthenticated, errors: loginErrors } = useAuth();

  const [Cargando, setCargando] = useState(true);

  useEffect(() => {
    // Definimos el temporizador que desactiva el loader después de 1 segundo (1000 ms)
    const loadTimeout = setTimeout(() => {
      setCargando(false);
    }, 200); // 1000 ms = 1 segundo

    return () => clearTimeout(loadTimeout);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/inicio");
    }
  }, [isAuthenticated, navigate]);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return; // Previene envío múltiple

    setIsLoading(true);

    // signin es una función asíncrona que debes esperar
    await signin({ email, password });

    // Importante: La carga debe terminar después de la autenticación.
    // Si la autenticación falla (y signin no navega), isLoading debe volver a false.
    // Si la autenticación es exitosa, useEffect maneja la navegación.
    setIsLoading(false);
  };

  return Cargando ? (
    <Loader texto="Cargando..." />
  ) : (
    <div
      className="
        min-h-dvh w-full 
        flex items-center justify-center 
        relative overflow-hidden 
        bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50
        px-4 
      "
    >
      {/* Decorative background elements (Opacidad reducida: opacity-40) */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      {/* Login Card (Modernizada con más blur y borde) */}
      <Card
        className="
          w-full max-w-md mx-4 shadow-2xl 
          backdrop-blur-lg bg-white/70 
          relative z-10 
          border border-gray-100 rounded-3xl
        "
      >
        <CardBody className="p-8">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-white mb-4 shadow-lg overflow-hidden border border-gray-50">
              <img
                src="/cotecnova1.png"
                alt="Logo COTECNOVA"
                className="w-full h-full object-contain scale-90" // Ajustado para mejor visibilidad del logo
              />
            </div>
            <h2 className="text-2xl font-black text-green-800 tracking-wide mt-1">
              COTECNOVA
            </h2>
            <h1 className="text-xl font-bold bg-gradient-to-r from-green-700 to-emerald-800 bg-clip-text text-transparent">
              Sistema de Gestión Vehicular
            </h1>

            <p className="text-gray-600 mt-2">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          {/* Login Form */}
          {loginErrors.map((error, i) => (
            <div
              className="bg-red-100 text-red-500 p-3 rounded-xl mb-4 text-sm text-center border border-red-200"
              key={i}
            >
              {error}
            </div>
          ))}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input (Ahora con id/htmlFor y peer-focus) */}
            <div className="relative">
              <label
                htmlFor="user-email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Usuario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User
                    // El icono cambia de color cuando el input está enfocado (peer-focus)
                    className="w-4 h-4 text-gray-400 peer-focus:text-green-600 transition-colors"
                  />
                </div>
                <input
                  id="user-email" // Agregado para accesibilidad
                  type="email"
                  placeholder="Ingresa tu usuario"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  // Agregado 'peer' y focus:border-green-600
                  className="peer w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 hover:border-green-500 transition-colors text-sm bg-white/80"
                  required
                />
              </div>
            </div>

            {/* Password Input (Ahora con id/htmlFor y peer-focus) */}
            <div className="relative">
              <label
                htmlFor="user-password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock
                    // El icono cambia de color cuando el input está enfocado (peer-focus)
                    className="w-4 h-4 text-gray-400 peer-focus:text-green-600 transition-colors"
                  />
                </div>
                <input
                  id="user-password" // Agregado para accesibilidad
                  type={isVisible ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  // Agregado 'peer' y focus:border-green-600
                  className="peer w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 hover:border-green-500 transition-colors text-sm bg-white/80"
                  required
                />
                <button
                  type="button"
                  onClick={toggleVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  aria-label={
                    isVisible ? "Ocultar contraseña" : "Mostrar contraseña"
                  } // Agregado para accesibilidad
                >
                  {isVisible ? (
                    <EyeOff className="w-5 h-5 text-gray-500 hover:text-green-700 transition-colors" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-500 hover:text-green-700 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Login Button (Ahora con estado de carga y spinner) */}
            <Button
              type="submit"
              disabled={isLoading} // Deshabilita mientras carga
              className={`
    w-full 
    text-white font-semibold 
    shadow-lg hover:shadow-xl hover:scale-[1.02] 
    transition-all duration-200 py-4 
    rounded-xl  // <--- CLASE AGREGADA AQUÍ
    ${
      isLoading
        ? "bg-gray-500 cursor-not-allowed" // Estilo de carga
        : "bg-gradient-to-r from-green-600 to-emerald-700"
    }
  `}
              size="lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  {/* Tailwind CSS Spinner */}
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Cargando...
                </div>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </form>
        </CardBody>
      </Card>

      {/* Custom Animations (Manteniendo la configuración original de la animación) */}
      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default Login;
