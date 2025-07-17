import { motion } from "motion/react"

export default function IntranetLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-gradient-to-br from-rose-50 to-purple-50">
      {/* Animated gradient wave effect */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-rose-300/40 to-purple-300/40 opacity-70 blur-lg"
      />

      {/* Secondary wave for depth */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-purple-200/30 to-rose-200/30 opacity-50 blur-md"
      />

      {/* Loading content */}
      <div className="relative z-10 text-center">
        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent mb-2"
        >
          L'Intranet
        </motion.h1>
        
        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="text-lg text-rose-600/70 font-medium"
        >
          Dashboard de services auto-hébergés
        </motion.p>

        {/* Loading dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="flex justify-center space-x-2 mt-6"
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-2 h-2 bg-gradient-to-r from-rose-400 to-purple-400 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.3,
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
