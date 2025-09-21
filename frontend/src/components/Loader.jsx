// Loader.jsx
import { motion } from "framer-motion";

function Loader({ texto = "Cargando..." }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen -mt-20">
      <motion.div
        className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />

      <motion.p
        className="mt-3 text-green-600 font-semibold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
      >
        {texto}
      </motion.p>
    </div>
  );
}

export default Loader;
