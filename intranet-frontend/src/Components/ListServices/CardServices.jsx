import Modal from '@/Components/Utils/Modal';
import { ToggleContext } from '@/Components/Utils/ToggleContext';
import { useAuthAttributes } from '@/context/AuthAttributsContext';

import { getUserServices, updateNumberServiceClick } from '@/api/modules/services';

import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import toast, { Toaster } from 'react-hot-toast';


export default function CardServices({ selectedCategories, selectedStatus }) {
    const authContext = useAuthAttributes();
    const user = authContext?.userAttributes;
    const { enabled } = useContext(ToggleContext);
    const [servicesList, setServicesList] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [showingServiceModal, setShowingServiceModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    useEffect(() => {
        toast.promise(
            getUserServices(),
            {
                loading: 'Chargements des services ...',
                success: (response) => {
                    setServicesList(response.data);
                    return response.message;
                },
                error: (error) => {
                    return error.message;
                }
            }
        );
    }, []);

    // Effet pour filtrer les services selon les critères sélectionnés
    useEffect(() => {
        let filtered = servicesList;

        // Filtrage par statut
        if (selectedStatus && selectedStatus.length > 0) {
            const statusIds = selectedStatus.map(status => status.value);
            filtered = filtered.filter(service => service.status_id && statusIds.includes(service.status_id));
        }

        // Filtrage par catégories
        if (selectedCategories && selectedCategories.length > 0) {
            const categoryIds = selectedCategories.map(cat => cat.value);
            filtered = filtered.filter(service => 
                service.categories && service.categories.some(cat => categoryIds.includes(cat.id))
            );
        }

        setFilteredServices(filtered);
    }, [servicesList, selectedCategories, selectedStatus]);

    const DetailService = (service) => {
        setSelectedService(service);
        setShowingServiceModal(true);
    }

    const UpdateNumberClick = (service, url) => {
        if (service && url !== '') {
            let isInternalUrl = false;

            // Normalisation des URLs pour comparaison
            const urlObj = new URL(url);
            const internalUrlObj = new URL(service.internal_url);
            
            // Comparaison
            isInternalUrl = urlObj.origin === internalUrlObj.origin &&  urlObj.pathname === internalUrlObj.pathname;

            try {
                updateNumberServiceClick(service.id, isInternalUrl, user.id);
            }
            catch (error) {
                console.error("Erreur lors de la mise à jour du nombre de clics :", error);
                toast.error("Erreur lors de la mise à jour du nombre de clics.");
                console.error(error.response?.data?.error);
                throw new Error(error.response?.data?.message || "Erreur lors de la mise à jour du nombre de clics");
            }
        }
    }


    return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        <AnimatePresence>
            {
                filteredServices.length > 0 ? filteredServices.map((service, index) => (
                    <motion.div 
                        key={service.id}
                        initial={{ 
                            opacity: 0, 
                            y: 50, 
                            scale: 0.8,
                            rotateX: -15 
                        }}
                        animate={{ 
                            opacity: 1, 
                            y: 0, 
                            scale: 1,
                            rotateX: 0 
                        }}
                        exit={{
                            opacity: 0,
                            y: -30,
                            scale: 0.9,
                            transition: { duration: 0.2 }
                        }}
                        transition={{ 
                            delay: index * 0.1, 
                            duration: 0.6,
                            type: "spring",
                            damping: 20,
                            stiffness: 300
                        }}
                        whileHover={{
                            y: -8,
                            scale: 1.02,
                            transition: { duration: 0.2 }
                        }}
                        layout
                    >
                        <div onClick={() => DetailService(service)} className="card card-compact bg-base-100/20 backdrop-blur-xl border border-base-300/30 shadow-xl hover:shadow-2xl hover:bg-base-100/30 transition-all duration-300 cursor-pointer">
                            <>
                                <motion.div 
                                    className="relative overflow-hidden"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <motion.img 
                                        className="w-full h-48 object-cover transition-transform duration-100 ease-in-out" 
                                        src={service.image_url || "storage/images/no-image-available.jpg"} 
                                        alt={service.name}
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                    {service.status !== null && (
                                        <span className="badge badge-primary absolute top-2 right-2 backdrop-blur-md border-base-300/20">
                                            {service.status.name}
                                        </span>
                                    )}
                                    <div className="absolute top-2 left-2 space-y-1">
                                        {Array.isArray(service.categories) && service.categories.map((category, catIndex) => (
                                            <span className="badge badge-secondary backdrop-blur-md border-base-300/20">
                                                {category.name}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                                <div 
                                    className="card-body"
                                >
                                    <div className="flex items-center justify-between">
                                        <p className="card-title text-base-content">
                                            {service.name}
                                        </p>

                                        <div
                                        >
                                            { enabled ? (
                                            service.internal_url ? (
                                            <a href={service.internal_url} target='blank' onClick={(e) => { e.stopPropagation(); UpdateNumberClick(service, service.internal_url); }} className="btn btn-sm btn-outline backdrop-blur-md border-base-300/30"> 
                                                {service.internal_url}
                                            </a>// Evite la propagation du click pour ne pas ouvrir le modal
                                            ) : (<p className="text-base-content/50"> Pas de lien dispo </p>)
                                            ) : (service.external_url ? (
                                                <a href={service.external_url} target='blank' onClick={(e) => { e.stopPropagation(); UpdateNumberClick(service, service.external_url); }} className="btn btn-sm btn-outline backdrop-blur-md border-base-300/30"> 
                                                {service.external_url}
                                            </a>// Evite la propagation du click pour ne pas ouvrir le modal
                                            ) :(<p className="text-base-content/50"> Pas de lien dispo </p>))}
                                        </div>
                                    </div>
                                </div>      
                            </>
                        </div>
                    </motion.div>                   
                )) : (
                    <motion.div 
                        className="flex justify-center items-center h-full w-full col-span-full"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <p className="text-base-content/50">Aucun service trouvé</p>
                    </motion.div>
                )
            }
        </AnimatePresence>


        <Modal show={showingServiceModal} onClose={() => setShowingServiceModal(false)} noPadding={true}>
            <AnimatePresence mode="wait">
                {selectedService && (
                    <motion.div 
                        key={selectedService.id}
                        initial={{ 
                            scale: 0.95, 
                            opacity: 0,
                            y: 20
                        }}
                        animate={{ 
                            scale: 1, 
                            opacity: 1,
                            y: 0
                        }}
                        exit={{ 
                            scale: 0.95, 
                            opacity: 0,
                            y: 10
                        }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 300,
                            duration: 0.3
                        }}
                        className="w-full max-w-2xl overflow-hidden relative rounded-lg"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                            backdropFilter: 'blur(40px) saturate(200%)',
                            WebkitBackdropFilter: 'blur(40px) saturate(200%)',
                            boxShadow: `
                                0 8px 32px rgba(0,0,0,0.12),
                                0 2px 6px rgba(0,0,0,0.08),
                                inset 0 1px 0 rgba(255,255,255,0.15),
                                inset 0 -1px 0 rgba(255,255,255,0.05)
                            `,
                            scrollbarWidth: 'none', /* Firefox */
                            msOverflowStyle: 'none', /* Internet Explorer 10+ */
                        }}
                    >
                    
                    
                        <motion.div 
                            className="relative overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.2 }}
                        >
                            <motion.img 
                                className="w-full h-58 object-cover transition-transform duration-300 ease-in-out" 
                                src={selectedService.image_url || "storage/images/no-image-available.jpg"} 
                                alt={selectedService.name}
                                whileHover={{ 
                                    scale: 1.05,
                                    transition: { duration: 0.6, ease: "easeOut" }
                                }}
                            />
                            {selectedService.status !== null && (
                                <motion.span 
                                    initial={{ opacity: 0, scale: 0.8, x: 20 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    transition={{ delay: 0.1, duration: 0.2 }}
                                    className="absolute top-2 right-2 text-white px-3 py-1 rounded-full text-sm"
                                    style={{
                                        background: 'rgba(0,0,0,0.4)',
                                        backdropFilter: 'blur(20px) saturate(180%)',
                                        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)'
                                    }}
                                    whileHover={{ 
                                        scale: 1.05,
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)'
                                    }}
                                >
                                    {selectedService.status.name}
                                </motion.span>
                            )}
                            <div className="absolute top-2 left-2 space-y-1">
                                {Array.isArray(selectedService.categories) && selectedService.categories.map((category, index) => (
                                    <motion.span 
                                        key={category.id} 
                                        initial={{ opacity: 0, scale: 0.8, x: -20 }}
                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                        transition={{ delay: 0.1 + (index * 0.1), duration: 0.2 }}
                                        className="inline-block text-white px-3 py-1 text-sm rounded-full mr-1"
                                        style={{
                                            background: 'rgba(0,0,0,0.4)',
                                            backdropFilter: 'blur(20px) saturate(180%)',
                                            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)'
                                        }}
                                        whileHover={{ 
                                            scale: 1.05,
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)'
                                        }}
                                    >
                                        {category.name}
                                    </motion.span>
                                ))}
                            </div>
                        </motion.div>
                        <motion.div 
                            className="p-4 relative"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                        >
                            <div className="flex items-center-x justify-between">
                                <motion.div 
                                    className="flex flex-col space-y-1"
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1, duration: 0.3 }}
                                >
                                    <p className="font-bold text-lg text-base-content">{selectedService.name}</p>
                                    <p className="text-base-content/70 text-sm"> Créer le : {dayjs(selectedService.created_at).format('DD/MM/YYYY')} </p>
                                    <p className="text-base-content/70 text-sm"> Modifié le : {dayjs(selectedService.modified_at).format('DD/MM/YYYY')} </p>
                                </motion.div>
                                <motion.div 
                                    className="flex flex-col space-y-2 justify-end"
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1, duration: 0.3 }}
                                >
                                    {selectedService.internal_url && user.is_admin ? (
                                    <motion.a 
                                        href={selectedService.internal_url} 
                                        onClick={(e) => { e.stopPropagation(); UpdateNumberClick(selectedService, selectedService.internal_url); }}
                                        target='blank' 
                                        className="text-center px-3 py-1 rounded-full text-sm transition-all"
                                        style={{
                                            background: 'rgba(255,255,255,0.25)',
                                            backdropFilter: 'blur(20px) saturate(180%)',
                                            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                                            border: '1px solid rgba(255,255,255,0.3)',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)'
                                        }}
                                        whileHover={{
                                            scale: 1.05,
                                            y: -2,
                                            boxShadow: '0 8px 20px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3)',
                                            transition: { duration: 0.01 },
                                        }}
                                        whileTap={{ 
                                            scale: 0.95,
                                            transition: { duration: 0.1 }
                                        }}
                                        transition={{ duration: 0.1 }}
                                    >
                                        {selectedService.internal_url}
                                    </motion.a>
                                    ) : null}
                                    {selectedService.external_url && (
                                        <motion.a 
                                            href={selectedService.external_url} 
                                            onClick={(e) => { e.stopPropagation(); UpdateNumberClick(selectedService, selectedService.external_url); }}
                                            target='blank' 
                                            className="text-center px-3 py-1 rounded-full text-sm transition-all"
                                            style={{
                                                background: 'rgba(255,255,255,0.25)',
                                                backdropFilter: 'blur(20px) saturate(180%)',
                                                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                                                border: '1px solid rgba(255,255,255,0.3)',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)'
                                            }}
                                            whileHover={{
                                                scale: 1.05,
                                                y: -2,
                                                boxShadow: '0 8px 20px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3)',
                                                transition: { duration: 0.01 }
                                            }}
                                            whileTap={{ 
                                                scale: 0.95,
                                                transition: { duration: 0.1 }
                                            }}
                                            transition={{ duration: 0.1 }}
                                        >
                                            {selectedService.external_url}
                                        </motion.a>
                                    )} 
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
    </section>

    );

}