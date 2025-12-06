import { createContext, useState, useContext, useEffect } from "react";
import { loginRequest, logoutRequest, verifyTokenRequest } from "../api/auth";
import Swal from "sweetalert2";
import Loader from "../components/Loader";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // Estados para timeout de sesión (ISO 27001)
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [timeoutCountdown, setTimeoutCountdown] = useState(2); // minutos restantes

  // Timeout de sesión: 30 minutos de inactividad
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutos en milisegundos
  const WARNING_TIME = 2 * 60 * 1000; // Advertencia 2 minutos antes

  // Función de registro (si se implementa en el futuro)
  const signup = async (user) => {
    // Implementar si es necesario
  };

  const signin = async (user) => {
    setErrors([]); // Limpiar errores previos
    setLoginLoading(true);
    try {
      const res = await loginRequest(user);
      setUser(res.data.user);
      setIsAuthenticated(true);
      localStorage.setItem("token", res.data.access_token);

      // Configurar token por defecto para futuras peticiones si usas una instancia global de axios
      // axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`;
    } catch (error) {
      console.log(error);
      if (Array.isArray(error.response?.data)) {
        setErrors(error.response.data);
      } else {
        setErrors([
          error.response?.data?.message || error.message || "Error de conexión",
        ]);
      }
    } finally {
      // Siempre desactivar loading después de la petición
      setLoginLoading(false);
    }
  };

  const logout = async () => {
    setLogoutLoading(true);
    try {
      await logoutRequest();
      localStorage.removeItem("token");
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.log(error);
      localStorage.removeItem("token");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      // Pequeño delay para que se aprecie la animación si la respuesta es muy rápida
      setTimeout(() => {
        setLogoutLoading(false);
      }, 500);
    }
  };

  // Timeout de sesión por inactividad (ISO 27001)
  useEffect(() => {
    if (!isAuthenticated) return;

    let timeoutId;
    let warningId;
    let countdownInterval;

    const resetTimer = () => {
      // Limpiar timers anteriores
      clearTimeout(timeoutId);
      clearTimeout(warningId);
      clearInterval(countdownInterval);
      setShowTimeoutWarning(false);

      // Advertencia a los 28 minutos (2 minutos antes de cerrar sesión)
      warningId = setTimeout(() => {
        setShowTimeoutWarning(true);
        let countdown = 120; // 2 minutos en segundos
        setTimeoutCountdown(2);

        // Actualizar countdown cada segundo
        countdownInterval = setInterval(() => {
          countdown -= 1;
          setTimeoutCountdown(Math.ceil(countdown / 60));

          if (countdown <= 0) {
            clearInterval(countdownInterval);
          }
        }, 1000);
      }, SESSION_TIMEOUT - WARNING_TIME);

      // Cerrar sesión a los 30 minutos
      timeoutId = setTimeout(() => {
        Swal.fire({
          icon: "warning",
          title: "Sesión expirada",
          text: "Su sesión ha expirado por inactividad",
          confirmButtonColor: "#d33",
        });
        logout();
      }, SESSION_TIMEOUT);
    };

    // Eventos que detectan actividad del usuario
    const events = ["mousedown", "keydown", "scroll", "touchstart", "click"];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Iniciar timer al montar el componente
    resetTimer();

    // Cleanup al desmontar
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(warningId);
      clearInterval(countdownInterval);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [isAuthenticated]);

  // Mostrar advertencia de timeout
  useEffect(() => {
    if (showTimeoutWarning) {
      Swal.fire({
        icon: "warning",
        title: "Sesión por expirar",
        html: `Su sesión expirará en <strong>${timeoutCountdown}</strong> minuto(s) por inactividad.<br/>Mueva el mouse o presione cualquier tecla para continuar.`,
        confirmButtonText: "Continuar sesión",
        confirmButtonColor: "#16a34a",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          setShowTimeoutWarning(false);
        }
      });
    }
  }, [showTimeoutWarning, timeoutCountdown]);

  // Verificar token al cargar la app
  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const res = await verifyTokenRequest(token);
        if (!res.data) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        setIsAuthenticated(true);
        setUser(res.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setIsAuthenticated(false);
        setLoading(false);
        localStorage.removeItem("token");
      }
    };

    checkLogin();
  }, []);

  if (logoutLoading) {
    return <Loader texto="Cerrando sesión..." />;
  }

  if (loginLoading) {
    return <Loader texto="Iniciando sesión..." />;
  }

  // Función para verificar si el usuario es administrador
  const isAdmin = () => {
    return user?.rol?.Rol === "Administrativo";
  };

  return (
    <AuthContext.Provider
      value={{
        signup,
        signin,
        logout,
        user,
        isAuthenticated,
        errors,
        loading,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
