import { useAuthAttributes } from '@/context/AuthAttributsContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CardServices from '@/Components/ListServices/CardServices';
import FilterServices from '@/Components/ListServices/FilterServices';

import { useEffect, useState } from 'react';


export default function Dashboard({}) {
    useEffect(() => {
        document.title = "Dashboard - Intranet";
    }, []);
    
    const authContext = useAuthAttributes();
    const user = authContext?.userAttributes;
    
    // États pour les filtres
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState([]);

    return (
        <AuthenticatedLayout>
            <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8 mt-4 sm:mt-8">
                {/* Header responsive */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
                    <div className="text-left">
                        <p className="font-serif text-3xl">Bonjour,</p>
                        <p className="font-serif text-2xl">{user.name}</p>
                    </div>
                    
                    {/* Filtres - Stack sur mobile */}
                    <div className="w-full sm:w-auto">
                        <FilterServices 
                            selectedCategories={selectedCategories}
                            setSelectedCategories={setSelectedCategories}
                            selectedStatus={selectedStatus}
                            setSelectedStatus={setSelectedStatus}
                        />
                    </div>
                </div>
                
                {/* Cards avec padding ajusté */}
                <div className="pb-4 sm:pb-8">
                    <CardServices 
                        selectedCategories={selectedCategories}
                        selectedStatus={selectedStatus}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}