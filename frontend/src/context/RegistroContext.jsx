import { createContext, useState, useContext } from "react";

const RegistroContext = createContext();

export function RegistroProvider({ children }) {
  const [idPropietario, setIdPropietario] = useState(null);
  const [idVehiculo, setVehiculoPropietario] = useState(null);

  return (
    <RegistroContext.Provider
      value={{
        idPropietario,
        setIdPropietario,
        idVehiculo,
        setVehiculoPropietario,
      }}
    >
      {children}
    </RegistroContext.Provider>
  );
}

export const useRegistro = () => useContext(RegistroContext);
