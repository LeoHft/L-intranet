import SecondaryButton from '@/Components/Utils/SecondaryButton';

import ServiceSelect from '@/Components/Services/ServiceSelect';
import UsersSelect from '@/Components/Users/UsersSelect';
import ByUsersBarStatistiques from '@/Components/Statistiques/ByUsersBarStatistiques';
import ResumeTabStatistiques from '@/Components/Statistiques/ResumeTabStatistiques';
import ByServicesBarStatistiques from '@/Components/Statistiques/ByServicesBarStatistiques';
import ByServicesStackAreaStatistiques from '@/Components/Statistiques/ByServicesStackAreaStatistiques';

import { getBarStatByUserByServiceByDate } from '@/api/modules/statistiques';

import React, { useState, useEffect, useMemo } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Select from 'react-select';



export default function ListStatistiques() {
    const [selectedService, setSelectedService] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [statisticsData, setStatisticsData] = useState(null);
    const [selectedLinkType, setSelectedLinkType] = useState([]);
    const linkTypes = [
        { value: 'internal', label: 'Interne' },
        { value: 'external', label: 'Externe' }
    ];
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);
    const [startDate, setStartDate] = useState(oneMonthAgo.toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(today.toISOString().split('T')[0]);


    const handleExecuteQuery = async () => {
        // Validation des données requises - dates obligatoires seulement
        if (!startDate || !endDate) {
            toast.error('Veuillez sélectionner les dates de début et de fin');
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            toast.error('La date de début doit être antérieure à la date de fin');
            return;
        }

        
        setIsLoading(true);
        toast.promise(
            getBarStatByUserByServiceByDate(selectedService, selectedUsers, selectedLinkType, startDate, endDate),
            {
                loading: 'Récupération des statistiques en cours...',
                success: (response) => {
                    setStatisticsData(response.data);
                    setIsLoading(false);
                    return response.message;
                },
                error: (error) => {
                    setIsLoading(false);
                    console.error('Erreur lors de la récupération des statistiques:', error);
                    return error.message || 'Erreur lors de la récupération des statistiques';
                }
            }
        );
    };

    // Exécuter handleExecuteQuery à chaque changement des filtres principaux
    useEffect(() => {
        handleExecuteQuery();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedService, selectedUsers, selectedLinkType, startDate, endDate]);

    return (
        <div className="space-y-8">
            <Toaster/>
            
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-4 items-end w-full">
                    <div className="flex gap-4 items-end w-full justify-end">
                        <div>
                            <label className="label">Date de début</label>
                            <input 
                                type="date" 
                                className="input input-bordered input-glass" 
                                value={startDate} 
                                onChange={e => setStartDate(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label className="label">Date de fin</label>
                            <input 
                                type="date" 
                                className="input input-bordered input-glass" 
                                value={endDate} 
                                onChange={e => setEndDate(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="">
                            <label className="label">Type de lien</label>
                            <Select
                                options={linkTypes}
                                isMulti
                                className="mt-1"
                                styles={{
                                    ...glassStyles,
                                    menuPortal: (base) => ({ ...base, zIndex: 9999 })
                                }}
                                menuPortalTarget={document.body}
                                value={selectedLinkType || null}
                                onChange={setSelectedLinkType}
                                placeholder="Sélectionnez des types de liens..."
                                isDisabled={isLoading}
                            />
                        </div>
                        <div className="">
                            <ServiceSelect 
                                selectedService={selectedService}
                                setSelectedService={setSelectedService}
                                styles={{
                                    ...glassStyles,
                                    menuPortal: (base) => ({ ...base, zIndex: 9999 })
                                }}
                                label="Service"
                                isDisabled={isLoading}
                            />
                        </div>
                        <div className="">
                            <UsersSelect 
                                selectedUsers={selectedUsers}
                                setSelectedUsers={setSelectedUsers}
                                required={false}
                                styles={{
                                    ...glassStyles,
                                    menuPortal: (base) => ({ ...base, zIndex: 9999 })
                                }}
                                label="Utilisateurs"
                                isDisabled={isLoading}
                            />
                        </div>

                    </div>
                </div>
            </div>



            <ByUsersBarStatistiques
                statisticsData={statisticsData}
            />           

            <ByServicesBarStatistiques
                statisticsData={statisticsData}
            />

            <ByServicesStackAreaStatistiques
                statisticsData={statisticsData}
            />



            <ResumeTabStatistiques
                statisticsData={statisticsData}
            />

        </div>
    );
}

// Styles custom pour effet glass avec DaisyUI
const glassStyles = {
    control: (provided, state) => ({
        ...provided,
        background: 'rgb(var(--glass-background, 255 255 255) / 0.25)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: state.isFocused ? '2px solid hsl(var(--p))' : '1px solid rgb(var(--border-color, 255 255 255) / 0.3)',
        boxShadow: state.isFocused ? '0 0 0 2px hsl(var(--p) / 0.2)' : '0 1px 2px 0 rgba(0,0,0,0.05)',
        color: 'hsl(var(--bc))',
    }),
    menu: (provided) => ({
        ...provided,
        background: 'rgb(var(--glass-background, 255 255 255) / 0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        boxShadow: '0 8px 32px 0 hsl(var(--p) / 0.25)',
    }),
    option: (provided, state) => ({
        ...provided,
        background: state.isSelected
            ? 'hsl(var(--p) / 0.2)'
            : state.isFocused
            ? 'hsl(var(--p) / 0.1)'
            : 'transparent',
        color: 'hsl(var(--bc))',
    }),
    singleValue: (provided) => ({
        ...provided,
        color: 'hsl(var(--bc))',
    }),
    multiValue: (provided) => ({
        ...provided,
        background: 'hsl(var(--p) / 0.12)',
    }),
    multiValueLabel: (provided) => ({
        ...provided,
        color: 'hsl(var(--pc))',
    }),
    multiValueRemove: (provided) => ({
        ...provided,
        color: 'hsl(var(--pc))',
        ':hover': {
            backgroundColor: 'hsl(var(--p))',
            color: 'hsl(var(--pc))',
        },
    }),
};