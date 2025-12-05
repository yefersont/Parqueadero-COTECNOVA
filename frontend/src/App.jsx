import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Usuarios from "./pages/usuarios/Usuarios";
import Ingresos from "./pages/ingresos/Ingresos";
import Salidas from "./pages/salidas/Salidas";
import Vehiculos from "./pages/vehiculos/Vehiculos";
import Propietarios from "./pages/propietarios/Propietarios";
import Inicio from "./pages/inicio/Inicio";
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/login/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { BusquedaProvider } from "./components/BusquedaContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BusquedaProvider>
        <Routes>
          {/* Ruta de login pública */}
          <Route path="/login" element={<Login />} />
          
          {/* Rutas de recuperación de contraseña (ISO 27001 A.9.4.3) */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="*"
              element={
                <div className="flex flex-col min-h-screen">
                  <Navbar />
                  <main className="flex-grow overflow-auto min-h-0">
                    <Routes>
                      {/* <Route path="/" element={<Inicio />} /> */}
                      <Route path="/inicio" element={<Inicio />} />
                      <Route path="/estadisticas" element={<Dashboard />} />
                      <Route path="/propietario" element={<Propietarios />} />
                      <Route path="/usuarios" element={<Usuarios />} />
                      <Route path="/vehiculos" element={<Vehiculos />} />
                      <Route path="/ingresos" element={<Ingresos />} />
                      {/* <Route path="/salidas" element={<Salidas />} /> */}
                    </Routes>
                  </main>
                  <Footer />
                </div>
              }
            />
          </Route>
        </Routes>
      </BusquedaProvider>
    </AuthProvider>
  );
}

export default App;
