import { createContext, useState, useContext } from "react";

const BusquedaContext = createContext();

export function BusquedaProvider({ children }) {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  return (
    <BusquedaContext.Provider
      value={{
        terminoBusqueda,
        setTerminoBusqueda,
        fechaDesde,
        setFechaDesde,
        fechaHasta,
        setFechaHasta,
      }}
    >
      {children}
    </BusquedaContext.Provider>
  );
}

export const useBusqueda = () => useContext(BusquedaContext);
