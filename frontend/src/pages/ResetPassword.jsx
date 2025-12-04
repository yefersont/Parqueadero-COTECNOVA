import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../api/axios';
import { Card, CardBody, Button } from "@heroui/react";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  // Requisitos de contraseña
  const passwordRequirements = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[@$!%*#?&]/.test(password),
  };

  const allRequirementsMet = Object.values(passwordRequirements).every(Boolean);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
      verifyToken(emailParam, token);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Enlace inválido',
        text: 'El enlace de recuperación no es válido.',
      }).then(() => navigate('/login'));
    }
  }, [token, searchParams, navigate]);

  const verifyToken = async (emailToVerify, tokenToVerify) => {
    try {
      await api.post('/verify-reset-token', {
        email: emailToVerify,
        token: tokenToVerify,
      });
      setTokenValid(true);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Enlace expirado o inválido',
        text: 'Este enlace de recuperación ha expirado o ya fue utilizado. Solicita uno nuevo.',
        confirmButtonText: 'Ir a recuperación',
      }).then(() => navigate('/forgot-password'));
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!allRequirementsMet) {
      Swal.fire({
        icon: 'warning',
        title: 'Contraseña débil',
        text: 'La contraseña no cumple con todos los requisitos de seguridad.',
      });
      return;
    }

    if (password !== passwordConfirmation) {
      Swal.fire({
        icon: 'warning',
        title: 'Contraseñas no coinciden',
        text: 'Las contraseñas ingresadas no son iguales.',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/reset-password', {
        email,
        token,
        password,
        password_confirmation: passwordConfirmation,
      });

      Swal.fire({
        icon: 'success',
        title: '¡Contraseña actualizada!',
        text: response.data.message,
        confirmButtonText: 'Ir al login',
      }).then(() => navigate('/login'));

    } catch (error) {
      console.error('Error al restablecer contraseña:', error);
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo restablecer la contraseña. Intenta nuevamente.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        <div className="text-center relative z-10">
          <svg className="animate-spin h-12 w-12 text-green-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-green-800 text-lg font-semibold">Verificando enlace...</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return null;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Card */}
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
              Crear nueva contraseña
            </h1>
            <h2 className="text-xl font-black text-green-800 tracking-wide mt-1">
              COTECNOVA
            </h2>
            <p className="text-gray-600 mt-2">
              Ingresa tu nueva contraseña segura
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email (readonly) */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-50 text-gray-600"
              />
            </div>

            {/* Nueva contraseña */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nueva Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent hover:border-green-500 transition-colors text-sm"
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirmar contraseña */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type={showPasswordConfirmation ? 'text' : 'password'}
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent hover:border-green-500 transition-colors text-sm"
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPasswordConfirmation ? (
                    <EyeOff className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Requisitos de contraseña */}
            {password && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-2">Requisitos de contraseña:</p>
                <ul className="space-y-1 text-sm">
                  <li className={`flex items-center ${passwordRequirements.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Mínimo 8 caracteres
                  </li>
                  <li className={`flex items-center ${passwordRequirements.hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}>
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Al menos una mayúscula
                  </li>
                  <li className={`flex items-center ${passwordRequirements.hasLowerCase ? 'text-green-600' : 'text-gray-500'}`}>
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Al menos una minúscula
                  </li>
                  <li className={`flex items-center ${passwordRequirements.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Al menos un número
                  </li>
                  <li className={`flex items-center ${passwordRequirements.hasSpecial ? 'text-green-600' : 'text-gray-500'}`}>
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Al menos un símbolo (@$!%*#?&)
                  </li>
                </ul>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || !allRequirementsMet}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 py-4"
              size="lg"
            >
              {loading ? 'Actualizando...' : 'Restablecer contraseña'}
            </Button>
          </form>

          {/* Back to login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-green-600 hover:text-green-700 font-medium inline-flex items-center transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver al inicio de sesión
            </Link>
          </div>
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
