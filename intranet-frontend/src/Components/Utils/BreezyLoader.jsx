import { motion } from "motion/react"

export default function BreezyLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* Wind effect */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-blue-200 to-transparent opacity-60 blur-lg"
      />

      {/* Title appears after wind passes */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-4xl md:text-5xl font-semibold text-blue-500 relative z-10"
      >
        Breezy
      </motion.h1>
    </div>
  );
}
