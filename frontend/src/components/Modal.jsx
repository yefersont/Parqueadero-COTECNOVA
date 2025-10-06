// Modal.jsx
import { motion, AnimatePresence } from "framer-motion";

export default function Modal({ isOpen, onClose, children, size = "md" }) {
  const sizeClasses = {
    sm: "sm:w-1/3 max-w-md",
    md: "sm:w-1/2 max-w-2xl",
    lg: "sm:w-3/4 max-w-4xl",
    xl: "sm:w-5/6 max-w-6xl",
    full: "w-[95vw] max-w-none",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Contenedor del modal */}
          <motion.div
            className={`bg-white rounded-2xl shadow-xl w-11/12 p-6 relative ${sizeClasses[size]}`}
            initial={{ scale: 0.8, opacity: 0, y: -50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Botón de cerrar */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition text-2xl font-bold"
            >
              &times;
            </button>

            {/* Contenido dinámico */}
            <div className="space-y-4">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
