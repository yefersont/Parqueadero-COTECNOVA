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

  // Función de registro (si se implementa en el futuro)
  const signup = async (user) => {
    // Implementar si es necesario
  };

  const signin = async (user) => {
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
        setErrors([error.response?.data?.message || error.message || "Error de conexión"]);
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Error de autenticación',
        text: error.response?.data?.message || error.message || 'Credenciales incorrectas',
        confirmButtonColor: '#d33',
      });
      setLoginLoading(false); // Solo desactivar si hay error, si es éxito redirige
    } finally {
        // Si es exitoso, el loading se quita cuando el componente se desmonta o redirige
        // Pero por seguridad, si no redirige inmediatamente:
        if (!isAuthenticated) { 
            // setLoginLoading(false); // No, mejor dejarlo en el catch o manejarlo con un timeout si es necesario
        }
        // Para asegurar que se quite el loader si algo falla o para dar tiempo a la redirección
        setTimeout(() => {
            setLoginLoading(false);
        }, 1000); 
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
