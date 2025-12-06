export default function Perfil() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      {/* Icono de construcción o código (animado) */}
      <div className="bg-yellow-100 p-4 rounded-full mb-4 animate-pulse">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-yellow-600"
        >
          {/* Este SVG representa un documento de código o un archivo en proceso */}
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          {/* Lápiz/Herramienta de edición sobre el archivo */}
          <line x1="12" x2="12" y1="18" y2="12" />
          <line x1="12" x2="12.01" y1="12" y2="12" />
        </svg>
      </div>

      {/* Título Principal */}
      <h2 className="text-3xl font-extrabold text-gray-800">
        En desarrollo...
      </h2>

      {/* Subtítulo descriptivo */}
      <p className="text-gray-500 mt-3 max-w-sm mx-auto text-lg">
        Estamos construyendo esta sección. ¡Vuelve pronto!
      </p>
    </div>
  );
}
