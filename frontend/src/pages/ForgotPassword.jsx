import { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../api/axios';
import { Card, CardBody, Button } from "@heroui/react";
import { Mail } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'Por favor ingresa tu correo electrónico',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/forgot-password', { email });
      
      Swal.fire({
        icon: 'success',
        title: '¡Correo enviado!',
        html: `
          <p>${response.data.message}</p>
          <p class="text-sm text-gray-600 mt-2">
            Revisa tu bandeja de entrada y la carpeta de spam.
          </p>
        `,
        confirmButtonText: 'Entendido',
      });
      
      setEmail('');
      
    } catch (error) {
      console.error('Error al solicitar recuperación:', error);
      
      if (error.response?.status === 429) {
        Swal.fire({
          icon: 'error',
          title: 'Demasiados intentos',
          text: 'Has excedido el límite de solicitudes. Intenta nuevamente en una hora.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'No se pudo procesar la solicitud. Intenta nuevamente.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

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
              ¿Olvidaste tu contraseña?
            </h1>
            <h2 className="text-xl font-black text-green-800 tracking-wide mt-1">
              COTECNOVA
            </h2>
            <p className="text-gray-600 mt-2">
              Te enviaremos instrucciones para recuperarla
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent hover:border-green-500 transition-colors text-sm"
                  placeholder="tu-email@ejemplo.com"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 py-4"
              size="lg"
            >
              {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
            </Button>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Información de seguridad:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-700">
                  <li>El enlace expirará en 15 minutos</li>
                  <li>Solo puedes solicitar 3 enlaces por hora</li>
                  <li>El enlace solo se puede usar una vez</li>
                </ul>
              </div>
            </div>
          </div>

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
