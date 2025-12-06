import { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../api/axios";
import { Card, CardBody, Button } from "@heroui/react";
import { Mail } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      Swal.fire({
        icon: "warning",
        title: "Campo requerido",
        text: "Por favor ingresa tu correo electrónico",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/forgot-password", { email });

      Swal.fire({
        icon: "success",
        title: "¡Correo enviado!",
        html: `
          <p>${response.data.message}</p>
          <p class="text-sm text-gray-600 mt-2">
            Revisa tu bandeja de entrada y la carpeta de spam.
          </p>
        `,
        confirmButtonText: "Entendido",
      });

      setEmail("");
    } catch (error) {
      console.error("Error al solicitar recuperación:", error);

      if (error.response?.status === 429) {
        Swal.fire({
          icon: "error",
          title: "Demasiados intentos",
          text: "Has excedido el límite de solicitudes. Intenta nuevamente en una hora.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error.response?.data?.message ||
            "No se pudo procesar la solicitud. Intenta nuevamente.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Decorative background elements (Opacidad reducida: opacity-40) */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      {/* Card (Modernizada con más blur y borde) */}
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
                // Ajustado para mejor visibilidad del logo
                className="w-full h-full object-contain scale-90"
              />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-800 bg-clip-text text-transparent">
              {/* Ajuste de color para contraste */}
              ¿Olvidaste tu contraseña?
            </h1>

            <p className="text-gray-600 mt-2">
              Te enviaremos instrucciones para recuperarla
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input (Ahora con id/htmlFor y peer-focus) */}
            <div className="relative">
              <label
                htmlFor="recovery-email" // Agregado htmlFor
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail
                    // El icono cambia de color cuando el input está enfocado (peer-focus)
                    className="w-4 h-4 text-gray-400 peer-focus:text-green-600 transition-colors"
                  />
                </div>
                <input
                  id="recovery-email" // Agregado id para accesibilidad
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  // Agregado 'peer' y ajustes de focus
                  className="peer w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 hover:border-green-500 transition-colors text-sm bg-white/80"
                  placeholder="tu-email@ejemplo.com"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Submit Button (Ahora con spinner y rounded-xl) */}
            <Button
              type="submit"
              disabled={loading}
              className={`
                w-full 
                text-white font-semibold 
                shadow-lg hover:shadow-xl hover:scale-[1.02] 
                transition-all duration-200 py-4 
                rounded-xl  
                ${
                  loading
                    ? "bg-gray-500 cursor-not-allowed" // Estilo de carga
                    : "bg-gradient-to-r from-green-600 to-emerald-700"
                }
              `}
              size="lg"
            >
              {loading ? (
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
                  Enviando...
                </div>
              ) : (
                "Enviar enlace de recuperación"
              )}
            </Button>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>

              <div className="text-sm text-yellow-800">
                <p className="font-semibold mb-1">Información de seguridad:</p>
                <ul className="list-disc list-inside space-y-1 text-yellow-700">
                  <li>
                    El enlace expirará en <b>15 minutos</b>
                  </li>
                  <li>
                    Solo puedes solicitar <b>3 enlaces por hora</b>
                  </li>
                  <li>
                    El enlace solo se puede usar <b>una vez</b>
                  </li>
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
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
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
