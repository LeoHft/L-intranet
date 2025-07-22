import Modal from '@/Components/Utils/Modal';
import { ToggleContext } from '@/Components/Utils/ToggleContext';
import { useAuthAttributes } from '@/context/AuthAttributsContext';

import { getUserServices } from '@/api/modules/services';

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


    return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-4">
        {
            filteredServices.length > 0 ? filteredServices.map(service => (
                <div key={service.id} onClick={() => DetailService(service)} className="max-w-sm rounded-2xl overflow-hidden backdrop-blur-xl bg-white/20 border border-white/30 shadow-xl hover:shadow-2xl hover:bg-white/30 transition-all duration-300 ease-in-out">
                    <div className="relative overflow-hidden">
                        <img 
                            className="w-full h-48 object-cover hover:scale-110 transition-transform duration-100 ease-in-out" 
                            src={service.image_url || "storage/images/no-image-available.jpg"} 
                            alt={service.name} 
                        />
                        {service.status !== null && (
                            <span className="absolute top-2 right-2 backdrop-blur-md bg-black/30 text-white px-3 py-1 rounded-full text-xs border border-white/20">
                                {service.status.name}
                            </span>
                        )}
                        <div className="absolute top-2 left-2 space-y-1">
                            {Array.isArray(service.categories) && service.categories.map(category => (
                                <span key={category.id} className="inline-block backdrop-blur-md bg-black/30 text-white px-3 py-1 text-xs rounded-full mr-1 border border-white/20">{category.name}</span>
                            ))}
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="flex items-center justify-between">
                            <p className="font-bold text-lg text-gray-800">{service.name}</p>

                            { enabled ? (
                            service.internal_url ? (
                            <a href={service.internal_url} target='blank' onClick={(e) => e.stopPropagation()} className="text-center backdrop-blur-md bg-white/20 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-white/30 transition-all duration-300 block border border-white/30"> 
                                {service.internal_url}
                            </a>// Evite la propagation du click pour ne pas ouvrir le modal
                            ) : (<p className="w-full text-center text-gray-500"> Pas de lien dispo </p>)
                            ) : (service.external_url ? (
                                <a href={service.external_url} target='blank' onClick={(e) => e.stopPropagation()} className="text-center backdrop-blur-md bg-white/20 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-white/30 transition-all duration-300 block border border-white/30"> 
                                {service.external_url}
                            </a>// Evite la propagation du click pour ne pas ouvrir le modal
                            ) :(<p className="w-full text-center text-gray-500"> Pas de lien dispo </p>))}
                        </div>
                    </div>                         
                </div>
            )) : (
                <div className="flex justify-center items-center h-full w-full">
                    <p className="text-gray-500">Aucun service trouvé</p>
                </div>
            )
        }


        <Modal show={showingServiceModal} onClose={() => setShowingServiceModal(false)}>
            <AnimatePresence mode="wait">
                {selectedService && (
                    <motion.div 
                        key={selectedService.id}
                        initial={{ 
                            scale: 0.85, 
                            opacity: 0,
                            rotateX: -15,
                            y: 50
                        }}
                        animate={{ 
                            scale: 1, 
                            opacity: 1,
                            rotateX: 0,
                            y: 0
                        }}
                        exit={{ 
                            scale: 0.9, 
                            opacity: 0,
                            rotateX: 10,
                            y: -20
                        }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 300,
                            duration: 0.6
                        }}
                        className="max-w overflow-hidden relative"
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
                            transformStyle: 'preserve-3d',
                            perspective: '1000px'
                        }}
                    >
                        {/* Effet de reflet liquide animé */}
                        <motion.div 
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.1) 100%)',
                            }}
                            animate={{
                                background: [
                                    'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.1) 100%)',
                                    'linear-gradient(145deg, rgba(255,255,255,0.3) 0%, transparent 35%, transparent 65%, rgba(255,255,255,0.15) 100%)',
                                    'linear-gradient(125deg, rgba(255,255,255,0.35) 0%, transparent 25%, transparent 75%, rgba(255,255,255,0.05) 100%)',
                                    'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.1) 100%)'
                                ]
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                        
                        {/* Reflets dynamiques sur les bords */}
                        <motion.div 
                            className="absolute top-0 left-0 w-full h-1 pointer-events-none"
                            style={{
                                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
                            }}
                            animate={{
                                background: [
                                    'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
                                    'linear-gradient(90deg, transparent 20%, rgba(255,255,255,0.8) 70%, transparent 100%)',
                                    'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 30%, transparent 80%)',
                                    'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)'
                                ]
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    
                        <motion.div 
                            className="relative overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
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
                                    transition={{ delay: 0.3, duration: 0.4 }}
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
                                        transition={{ delay: 0.2 + (index * 0.1), duration: 0.4 }}
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
                            transition={{ delay: 0.2, duration: 0.6 }}
                        >
                            <div className="flex items-center-x justify-between">
                                <motion.div 
                                    className="flex flex-col space-y-1"
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                >
                                    <p className="font-bold text-lg text-gray-800">{selectedService.name}</p>
                                    <p className="text-gray-600 text-sm"> Créer le : {dayjs(selectedService.created_at).format('DD/MM/YYYY')} </p>
                                    <p className="text-gray-600 text-sm"> Modifié le : {dayjs(selectedService.modified_at).format('DD/MM/YYYY')} </p>
                                </motion.div>
                                <motion.div 
                                    className="flex flex-col space-y-2 justify-end"
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4, duration: 0.5 }}
                                >
                                    {selectedService.internal_url && user.is_admin ? (
                                    <motion.a 
                                        href={selectedService.internal_url} 
                                        target='blank' 
                                        className="text-center text-gray-700 px-3 py-1 rounded-full text-sm transition-all"
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
                                            transition: { duration: 0.1 }
                                        }}
                                        whileTap={{ 
                                            scale: 0.95,
                                            transition: { duration: 0.1 }
                                        }}
                                    >
                                        {selectedService.internal_url}
                                    </motion.a>
                                    ) : null}
                                    {selectedService.external_url && (
                                        <motion.a 
                                            href={selectedService.external_url} 
                                            target='blank' 
                                            className="text-center text-gray-700 px-3 py-1 rounded-full text-sm transition-all"
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
                                                transition: { duration: 0.1 }
                                            }}
                                            whileTap={{ 
                                                scale: 0.95,
                                                transition: { duration: 0.1 }
                                            }}
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
                                transition={{ delay: 0.5, duration: 0.6 }}
                            > 
                                <p className="text-gray-600 text-ml text-center">
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