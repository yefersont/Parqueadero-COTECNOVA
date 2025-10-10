import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Usuarios from "./pages/usuarios/Usuarios";
import Ingresos from "./pages/ingresos/Ingresos";
import Salidas from "./pages/salidas/Salidas";
import Vehiculos from "./pages/vehiculos/Vehiculos";
import Propietarios from "./pages/propietarios/Propietarios";
import Inicio from "./pages/inicio/Inicio";
import { BusquedaProvider } from "./components/BusquedaContext";
function App() {
  return (
    // layout flex-column que ocupa toda la pantalla
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow overflow-auto min-h-0">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/propietario" element={<Propietarios />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/vehiculos" element={<Vehiculos />} />
          <Route path="/ingresos" element={<Ingresos />} />
          <Route path="/salidas" element={<Salidas />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
