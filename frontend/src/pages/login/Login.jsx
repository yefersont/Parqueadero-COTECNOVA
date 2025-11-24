import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import { Card, CardBody, Button } from "@heroui/react";
import { Lock, User, Eye, EyeOff } from "lucide-react";

function Login() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  
  const { signin, isAuthenticated, errors: loginErrors } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/inicio");
    }
  }, [isAuthenticated, navigate]);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = (e) => {
    e.preventDefault();
    signin({ email, password });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md mx-4 shadow-2xl backdrop-blur-sm bg-white/90 relative z-10">
        <CardBody className="p-8">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-white mb-4 shadow-lg overflow-hidden">
              <img
                src="/cotecnova.png"
                alt="Logo COTECNOVA"
                className="w-full h-full object-cover scale-75"
              />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
              Sistema de Gestión Vehicular
            </h1>
            <h2 className="text-xl font-black text-green-800 tracking-wide mt-1">
              COTECNOVA
            </h2>
            <p className="text-gray-600 mt-2">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          {/* Login Form */}
          {loginErrors.map((error, i) => (
            <div className="bg-red-100 text-red-500 p-3 rounded-lg mb-4 text-sm text-center" key={i}>
              {error}
            </div>
          ))}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="Ingresa tu usuario"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent hover:border-green-500 transition-colors text-sm"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type={isVisible ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent hover:border-green-500 transition-colors text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={toggleVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {isVisible ? (
                    <EyeOff className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-2 border-gray-300 text-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-0 cursor-pointer transition-colors"
                />
                <span className="text-sm text-gray-600 select-none">
                  Recuérdame
                </span>
              </label>
              <button
                type="button"
                className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 py-4"
              size="lg"
            >
              Iniciar Sesión
            </Button>
          </form>
        </CardBody>
      </Card>

      {/* Custom Animations */}
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
