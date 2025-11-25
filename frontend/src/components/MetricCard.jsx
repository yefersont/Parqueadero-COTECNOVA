import { motion } from "framer-motion";

function MetricCard({ title, value, icon, color = "blue", subtitle }) {
  const colorClasses = {
    blue: {
      gradient: "from-blue-500 to-blue-600",
      shadow: "shadow-blue-500/20",
      glow: "group-hover:shadow-blue-500/40",
      bg: "from-blue-50/80 to-blue-100/50",
    },
    green: {
      gradient: "from-emerald-500 to-emerald-600",
      shadow: "shadow-emerald-500/20",
      glow: "group-hover:shadow-emerald-500/40",
      bg: "from-emerald-50/80 to-emerald-100/50",
    },
    red: {
      gradient: "from-red-500 to-red-600",
      shadow: "shadow-red-500/20",
      glow: "group-hover:shadow-red-500/40",
      bg: "from-red-50/80 to-red-100/50",
    },
    purple: {
      gradient: "from-purple-500 to-purple-600",
      shadow: "shadow-purple-500/20",
      glow: "group-hover:shadow-purple-500/40",
      bg: "from-purple-50/80 to-purple-100/50",
    },
    orange: {
      gradient: "from-orange-500 to-orange-600",
      shadow: "shadow-orange-500/20",
      glow: "group-hover:shadow-orange-500/40",
      bg: "from-orange-50/80 to-orange-100/50",
    },
  };

  const currentColor = colorClasses[color] || colorClasses.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`
        relative group
        bg-white/80 backdrop-blur-sm
        rounded-2xl shadow-xl border border-gray-100
        p-4 
        hover:shadow-2xl transition-all duration-300
        overflow-hidden
        ${currentColor.shadow} ${currentColor.glow}
      `}
    >
      {/* Efecto de gradiente sutil en hover */}
      <div
        className={`
        absolute inset-0 bg-gradient-to-br ${currentColor.bg}
        opacity-0 group-hover:opacity-100 transition-opacity duration-500
      `}
      ></div>

      {/* Contenido */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-gray-900 mb-1 tabular-nums">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-gray-500 font-medium mt-1">{subtitle}</p>
          )}
        </div>
        <motion.div
          whileHover={{ rotate: 10, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className={`
            w-12 h-12 
            bg-gradient-to-br ${currentColor.gradient}
            rounded-2xl 
            flex items-center justify-center 
            shadow-lg ${currentColor.shadow}
            group-hover:shadow-xl transition-all duration-300
          `}
        >
          {icon}
        </motion.div>
      </div>

      {/* Separador decorativo */}
      <div
        className={`
        absolute bottom-0 left-0 right-0 h-1 
        bg-gradient-to-r ${currentColor.gradient}
        opacity-0 group-hover:opacity-100 transition-opacity duration-300
      `}
      ></div>
    </motion.div>
  );
}

export default MetricCard;
