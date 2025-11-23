import { motion } from "framer-motion"; // Note: assurez-vous d'utiliser 'framer-motion' ou 'motion/react' selon votre version
import { useEffect } from "react";

export default function IntranetLoader() {

  useEffect(() => {
    document.title = "Chargement - Intranet";
  }, []);


  return (
    // CONTAINER PRINCIPAL : Utilisation de bg-base-200 pour s'adapter au thème (sombre/clair)
    <div className="relative min-h-screen w-full overflow-hidden bg-base-200 flex items-center justify-center font-sans">
      {/* --- FOND ANIMÉ --- */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 2 }}
          className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary/20 blur-[120px]"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-secondary/20 blur-[120px]"
        />
      </div>

      {/* --- CARTE GLASSMORPHISM --- */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="card glass w-96 z-10 relative overflow-hidden"
      >
        <div className="card-body items-center text-center py-10">
          {/* Titre avec dégradé */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="card-title text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          >
            Intranet
          </motion.h1>

          {/* Sous-titre */}
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-base-content/70 font-medium mt-1"
          >
            Dashboard de services auto-hébergés
          </motion.p>

          {/* DAISY UI LOADER */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex flex-col items-center gap-3"
          >
            {/* Choix 1 : Loading Infinity (très moderne) */}
            <span className="loading loading-infinity loading-lg text-secondary h-16 w-16"></span>

            {/* Texte de statut optionnel */}
            <span className="text-xs text-base-content/50 uppercase tracking-widest animate-pulse">
              Chargement
            </span>
          </motion.div>
        </div>

        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 3, ease: "easeInOut" }}
          className="h-1 bg-gradient-to-r from-primary via-secondary to-primary absolute bottom-0 left-0"
        />
      </motion.div>
    </div>
  );
}
