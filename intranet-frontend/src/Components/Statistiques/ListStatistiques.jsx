import ByUsersBarStatistiques from '@/Components/Statistiques/ByUsersBarStatistiques';
import ResumeTabStatistiques from '@/Components/Statistiques/ResumeTabStatistiques';
import ByServicesBarStatistiques from '@/Components/Statistiques/ByServicesBarStatistiques';
import ByServicesStackAreaStatistiques from '@/Components/Statistiques/ByServicesStackAreaStatistiques';
import { getUsers } from '@/api/modules/users';
import { getAllServices } from '@/api/modules/services';

import { getBarStatByUserByServiceByDate } from '@/api/modules/statistiques';

import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import CustomSelect from '@/Components/Utils/Select';



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
    const [servicesOptions, setServicesOptions] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        handleUsers();
        handleServices();
    }, []);


    const handleUsers = () => {
        getUsers()
        .then((response) => {
            setUsers(response.data.map((users) => ({
                value: users.id,
                label: users.name,
            })));
        })
        .catch((error) => {
            console.error("Erreur lors de la récupération des utilisateurs:", error);
        });
    }

    const handleServices = () => {
        try {
            getAllServices()
                .then((response) => {
                    setServicesOptions(response.data.map((services) => ({
                        value: services.id,
                        label: services.name,
                    })));
                })
        } catch (error) {
            toast.error(error.message)
        }
    }


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
                            <CustomSelect 
                                options={linkTypes}
                                name="Types de liens"
                                placeholder="Sélectionnez un type de lien..."
                                selectedOption={selectedLinkType}
                                setSelectedOption={setSelectedLinkType}
                            />
                        </div>
                        <div className="">
                            <CustomSelect 
                                options={servicesOptions}
                                name="Services"
                                placeholder="Sélectionnez un service..."
                                selectedOption={selectedService}
                                setSelectedOption={setSelectedService}
                            />
                        </div>
                        <div className="">
                            <CustomSelect 
                                options={users}
                                name="Utilisateurs"
                                placeholder="Sélectionnez une ou plusieurs utilisateurs..."
                                selectedOption={selectedUsers}
                                setSelectedOption={setSelectedUsers}
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