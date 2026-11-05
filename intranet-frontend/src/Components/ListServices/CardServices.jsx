import Modal from "@/Components/Utils/Modal";
import { useAuthAttributes } from "@/context/AuthAttributsContext";

import {
  getUserServices,
  updateNumberServiceClick,
} from "@/api/modules/services";

import filterServices from "@/utils/filterServices";
import safeUrl from "@/utils/safeUrl";

import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import dayjs from "dayjs";
import notifyErrors from "@/utils/notifyErrors";

const NO_IMAGE = "/storage/images/no-image-available.jpg";

const NoLink = () => (
  <div className="text-center text-error px-3 py-1 rounded-full text-sm transition-all bg-error/15 backdrop-blur-md border border-white/30">
    Aucun lien
  </div>
);

export default function CardServices({ selectedCategories, selectedStatus, searchQuery }) {
  const authContext = useAuthAttributes();
  const user = authContext?.userAttributes;
  const [enabled, setEnabled] = useState(() => {
    const stored = localStorage.getItem("switch_enabled");
    return stored === "true"; // Convertir la chaîne en booléen
  });
  const [servicesList, setServicesList] = useState([]);
  const [showingServiceModal, setShowingServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    notifyErrors(getUserServices(), {
      success: (response) => {
        setServicesList(response.data);
      },
    });
  }, []);

  // L'interrupteur réseau local est réservé aux administrateurs.
  const showInternalLinks = user.is_admin && enabled;

  // Écouter les changements du switch
  useEffect(() => {
    const handleSwitchChange = (event) => {
      setEnabled(event.detail.enabled);
    };

    window.addEventListener("switchChanged", handleSwitchChange);
    return () => {
      window.removeEventListener("switchChanged", handleSwitchChange);
    };
  }, []);

  const filteredServices = useMemo(
    () => filterServices(servicesList, { selectedStatus, selectedCategories, searchQuery }),
    [servicesList, selectedCategories, selectedStatus, searchQuery]
  );

  const DetailService = (service) => {
    setSelectedService(service);
    setShowingServiceModal(true);
  };

  // Le comptage ne doit jamais gêner l'ouverture du lien : un échec reste silencieux pour l'utilisateur.
  const trackClick = (e, service, isInternalUrl) => {
    e.stopPropagation(); // Ne pas ouvrir le détail du service
    updateNumberServiceClick(service.id, isInternalUrl).catch((error) => console.error(error.message));
  };

  // Lien d'une carte de service
  const cardLink = (service) => {
    const url = safeUrl(showInternalLinks ? service.internal_url : service.external_url);
    return url ? (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => trackClick(e, service, showInternalLinks)}
        title={url}
        className="block max-w-full truncate text-center px-3 py-2 sm:py-1 rounded-full text-sm transition-all bg-white/25 backdrop-blur-md border border-white/30 shadow-md shadow-black/10"
      >
        {url}
      </a>
    ) : (
      <NoLink />
    );
  };

  // Lien du détail d'un service
  const detailLink = (service, isInternalUrl) => {
    const url = safeUrl(isInternalUrl ? service.internal_url : service.external_url);
    return url ? (
      <motion.a
        href={url}
        onClick={(e) => trackClick(e, service, isInternalUrl)}
        target="_blank"
        rel="noopener noreferrer"
        className="break-all text-center px-3 py-2 sm:py-1 rounded-2xl text-sm transition-all"
        style={{
          background: "rgba(255,255,255,0.25)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.3)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)",
        }}
        whileHover={{
          scale: 1.05,
          y: -2,
          boxShadow: "0 8px 20px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3)",
          transition: { duration: 0.01 },
        }}
        whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
        transition={{ duration: 0.1 }}
      >
        {url}
      </motion.a>
    ) : (
      <NoLink />
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.8,
      rotateX: -15,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.6,
        type: "spring",
        damping: 20,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      y: -30,
      scale: 0.9,
      transition: { duration: 0.2 },
    },
  };

  return (
    <>
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4"
      >
        <AnimatePresence mode="popLayout">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <motion.div
              key={service.id}
              layout
              variants={itemVariants}
              exit="exit"
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
            >
              <div
                onClick={() => DetailService(service)}
                className="card card-compact bg-base-100/20 backdrop-blur-xl border border-base-300/30 shadow-xl hover:shadow-2xl hover:bg-base-100/30 transition-all duration-300 cursor-pointer"
              >
                <>
                  <div className="relative overflow-hidden">
                    <img
                      className="w-full h-48 object-cover"
                      src={service.image_url || NO_IMAGE}
                      alt={service.name}
                    />
                    {/* Une seule rangée qui passe à la ligne : les badges ne peuvent plus se chevaucher. */}
                    <div className="absolute inset-x-2 top-2 flex flex-wrap items-start gap-1">
                      {Array.isArray(service.categories) &&
                        service.categories.map((category) => (
                          <span key={category.id} className="px-2 py-1 rounded-full text-xs sm:text-sm transition-all bg-neutral/40 backdrop-blur-md border border-white/30 shadow-md shadow-black/10">
                            {category.name}
                          </span>
                        ))}
                      {service.status && (
                        <span className="ml-auto px-2 py-1 rounded-full text-xs sm:text-sm transition-all bg-neutral/40 backdrop-blur-md border border-white/30 shadow-md shadow-black/10">
                          {service.status.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="card-title min-w-0 text-base-content">
                        {service.name}
                      </p>

                      <div className="min-w-0 max-w-full">{cardLink(service)}</div>
                    </div>
                  </div>
                </>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            className="flex justify-center items-center h-full w-full col-span-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-base-content/50">Aucun service trouvé</p>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal
        show={showingServiceModal}
        onClose={() => setShowingServiceModal(false)}
        noPadding={true}
      >
        <AnimatePresence mode="wait">
          {selectedService && (
            <motion.div
              key={selectedService.id}
              initial={{
                scale: 0.95,
                opacity: 0,
                y: 20,
              }}
              animate={{
                scale: 1,
                opacity: 1,
                y: 0,
              }}
              exit={{
                scale: 0.95,
                opacity: 0,
                y: 10,
              }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.3,
              }}
              className="w-full max-w-2xl overflow-hidden relative rounded-lg"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                backdropFilter: "blur(40px) saturate(200%)",
                WebkitBackdropFilter: "blur(40px) saturate(200%)",
                boxShadow: `
                                0 8px 32px rgba(0,0,0,0.12),
                                0 2px 6px rgba(0,0,0,0.08),
                                inset 0 1px 0 rgba(255,255,255,0.15),
                                inset 0 -1px 0 rgba(255,255,255,0.05)
                            `,
              }}
            >
              <motion.div
                className="relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.2 }}
              >
                <motion.img
                  className="w-full h-40 sm:h-58 object-cover"
                  src={selectedService.image_url || NO_IMAGE}
                  alt={selectedService.name}
                />
                <div className="absolute left-2 right-11 top-2 flex flex-wrap items-start gap-1">
                  {Array.isArray(selectedService.categories) &&
                    selectedService.categories.map((category, index) => (
                      <motion.span
                        key={category.id}
                        initial={{ opacity: 0, scale: 0.8, x: -20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.1, duration: 0.2 }}
                        className="px-2 py-1 rounded-full text-xs sm:text-sm transition-all bg-neutral/40 backdrop-blur-md border border-white/30 shadow-md shadow-black/10"
                        whileHover={{
                          scale: 1.05,
                          boxShadow:
                            "0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)",
                        }}
                      >
                        {category.name}
                      </motion.span>
                    ))}
                  {selectedService.status && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.2 }}
                    className="ml-auto px-2 py-1 rounded-full text-xs sm:text-sm transition-all bg-neutral/40 backdrop-blur-md border border-white/30 shadow-md shadow-black/10"
                    whileHover={{
                      scale: 1.05,
                      boxShadow:
                        "0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)",
                    }}
                  >
                    {selectedService.status.name}
                  </motion.span>
                )}
                </div>
              </motion.div>
              <motion.div
                className="pt-2 pb-1 px-4 relative"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                  <motion.div
                    className="flex flex-col space-y-1"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                  >
                    <p className="font-bold text-lg text-base-content">
                      {selectedService.name}
                    </p>
                    <p className="text-base-content/70 text-sm">
                      Créé le :{" "}
                      {dayjs(selectedService.created_at).format(
                        "DD/MM/YYYY"
                      )}
                    </p>
                    <p className="text-base-content/70 text-sm">
                      Modifié le :{" "}
                      {dayjs(selectedService.updated_at).format(
                        "DD/MM/YYYY"
                      )}
                    </p>
                  </motion.div>
                  <motion.div
                    className="flex min-w-0 flex-col space-y-2 justify-end"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                  >
                    {user.is_admin && detailLink(selectedService, true)}
                    {detailLink(selectedService, false)}
                  </motion.div>
                </div>
                <motion.div
                  className="mt-4 flex flex-col space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <p className="text-base-content/70 text-ml text-center">
                    {selectedService.description}
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>
      </motion.section>
    </>
  );
}
