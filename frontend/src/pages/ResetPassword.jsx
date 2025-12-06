import { useState, useEffect } from "react";
import {
  useParams,
  useNavigate,
  useSearchParams,
  Link,
} from "react-router-dom";
import Swal from "sweetalert2";
import api from "../api/axios";
import { Card, CardBody, Button } from "@heroui/react";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

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
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
      verifyToken(emailParam, token);
    } else {
      Swal.fire({
        icon: "error",
        title: "Enlace inválido",
        text: "El enlace de recuperación no es válido.",
      }).then(() => navigate("/login"));
    }
  }, [token, searchParams, navigate]);

  const verifyToken = async (emailToVerify, tokenToVerify) => {
    try {
      await api.post("/verify-reset-token", {
        email: emailToVerify,
        token: tokenToVerify,
      });
      setTokenValid(true);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Enlace expirado o inválido",
        text: "Este enlace de recuperación ha expirado o ya fue utilizado. Solicita uno nuevo.",
        confirmButtonText: "Ir a recuperación",
      }).then(() => navigate("/forgot-password"));
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!allRequirementsMet) {
      Swal.fire({
        icon: "warning",
        title: "Contraseña débil",
        text: "La contraseña no cumple con todos los requisitos de seguridad.",
      });
      return;
    }

    if (password !== passwordConfirmation) {
      Swal.fire({
        icon: "warning",
        title: "Contraseñas no coinciden",
        text: "Las contraseñas ingresadas no son iguales.",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/reset-password", {
        email,
        token,
        password,
        password_confirmation: passwordConfirmation,
      });

      Swal.fire({
        icon: "success",
        title: "¡Contraseña actualizada!",
        text: response.data.message,
        confirmButtonText: "Ir al login",
      }).then(() => navigate("/login"));
    } catch (error) {
      console.error("Error al restablecer contraseña:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "No se pudo restablecer la contraseña. Intenta nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  // --- UI del estado de Verificación (verifying) ---
  if (verifying) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="absolute inset-0 overflow-hidden">
          {/* Opacidad reducida a 40 para suavizar el fondo */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>
        </div>
        <div className="text-center relative z-10">
          <svg
            className="animate-spin h-12 w-12 text-green-600 mx-auto mb-4"
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
          <p className="text-green-800 text-lg font-semibold">
            Verificando enlace...
          </p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return null;
  }

  // --- UI principal de ResetPassword ---
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
          <div className="text-center mb-3">
            <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-white mb-4 shadow-lg overflow-hidden border border-gray-50">
              <img
                src="/cotecnova1.png"
                alt="Logo COTECNOVA"
                // Ajustado para mejor visibilidad del logo
                className="w-full h-full object-contain scale-90"
              />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-800 bg-clip-text text-transparent">
              Crear nueva contraseña
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email (readonly) */}
            <div className="relative">
              <label
                htmlFor="user-email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Correo Electrónico
              </label>
              <input
                id="user-email"
                type="email"
                value={email}
                readOnly
                // Estilo mejorado para campo de lectura
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-600 cursor-default text-sm"
              />
            </div>

            {/* Nueva contraseña */}
            <div className="relative">
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nueva Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock
                    // Icono con peer-focus
                    className="w-4 h-4 text-gray-400 peer-focus:text-green-600 transition-colors"
                  />
                </div>
                <input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  // Estilo con peer y ajustes de focus
                  className="peer w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 hover:border-green-500 transition-colors text-sm bg-white/80"
                  placeholder="••••••••"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-500 hover:text-green-700 transition-colors" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-500 hover:text-green-700 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirmar contraseña */}
            <div className="relative">
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirmar Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock
                    // Icono con peer-focus
                    className="w-4 h-4 text-gray-400 peer-focus:text-green-600 transition-colors"
                  />
                </div>
                <input
                  id="confirm-password"
                  type={showPasswordConfirmation ? "text" : "password"}
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  // Estilo con peer y ajustes de focus
                  className="peer w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 hover:border-green-500 transition-colors text-sm bg-white/80"
                  placeholder="••••••••"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswordConfirmation(!showPasswordConfirmation)
                  }
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  aria-label={
                    showPasswordConfirmation
                      ? "Ocultar confirmación"
                      : "Mostrar confirmación"
                  }
                >
                  {showPasswordConfirmation ? (
                    <EyeOff className="w-5 h-5 text-gray-500 hover:text-green-700 transition-colors" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-500 hover:text-green-700 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Requisitos de contraseña (Optimizados para reducir el espacio vertical) */}
            {password && (
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-xs font-bold text-green-800 mb-2">
                  Requisitos de seguridad:
                </p>
                {/* Reducción: font-size de 12px (text-xs), gap-x-4, gap-y-1 */}
                <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  {/* Min Length */}
                  <li
                    className={`flex items-center transition-colors ${
                      passwordRequirements.minLength
                        ? "text-green-600 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    <CheckCircleIcon
                      status={passwordRequirements.minLength}
                      size="w-3 h-3"
                    />
                    Mínimo 8 caracteres
                  </li>
                  {/* Upper Case */}
                  <li
                    className={`flex items-center transition-colors ${
                      passwordRequirements.hasUpperCase
                        ? "text-green-600 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    <CheckCircleIcon
                      status={passwordRequirements.hasUpperCase}
                      size="w-3 h-3"
                    />
                    Al menos una mayúscula
                  </li>
                  {/* Lower Case */}
                  <li
                    className={`flex items-center transition-colors ${
                      passwordRequirements.hasLowerCase
                        ? "text-green-600 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    <CheckCircleIcon
                      status={passwordRequirements.hasLowerCase}
                      size="w-3 h-3"
                    />
                    Al menos una minúscula
                  </li>
                  {/* Number */}
                  <li
                    className={`flex items-center transition-colors ${
                      passwordRequirements.hasNumber
                        ? "text-green-600 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    <CheckCircleIcon
                      status={passwordRequirements.hasNumber}
                      size="w-3 h-3"
                    />
                    Al menos un número
                  </li>
                  {/* Special Character - Lo mantengo en una sola línea para garantizar que se vea bien en pantallas pequeñas */}
                  <li
                    className={`flex items-center col-span-2 transition-colors ${
                      passwordRequirements.hasSpecial
                        ? "text-green-600 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    <CheckCircleIcon
                      status={passwordRequirements.hasSpecial}
                      size="w-3 h-3"
                    />
                    Al menos un símbolo (@$!%*#?&)
                  </li>
                </ul>
              </div>
            )}

            {/* Submit Button (con spinner y rounded-xl) */}
            <Button
              type="submit"
              // Deshabilitar si está cargando O si no se cumplen todos los requisitos
              disabled={loading || !allRequirementsMet}
              className={`
                w-full 
                text-white font-semibold 
                shadow-lg hover:shadow-xl hover:scale-[1.02] 
                transition-all duration-200 py-4 
                rounded-xl 
                ${
                  loading || !allRequirementsMet
                    ? "bg-gray-500 cursor-not-allowed" // Estilo de carga/deshabilitado
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
                  Actualizando...
                </div>
              ) : (
                "Restablecer contraseña"
              )}
            </Button>
          </form>

          {/* Back to login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-green-600 hover:text-green-700 font-medium inline-flex items-center transition-colors hover:underline"
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

// Componente auxiliar para los iconos de requisito de contraseña
// Modificado para aceptar una prop 'size' y usar un tamaño más pequeño por defecto
const CheckCircleIcon = ({ status, size = "w-4 h-4" }) => (
  <svg
    className={`${size} mr-1.5 flex-shrink-0 ${
      status ? "text-green-600" : "text-gray-400"
    }`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fillRule="evenodd"
      d={
        status
          ? "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" // Checkmark
          : "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" // X-mark/Circle
      }
      clipRule="evenodd"
    />
  </svg>
);
