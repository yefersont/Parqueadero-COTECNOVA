// Loader.jsx

function Loader({ texto = "Cargando..." }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mb-4"></div>
      {texto && <p className="text-green-700 font-semibold">{texto}</p>}
    </div>
  );
}

export default Loader;
