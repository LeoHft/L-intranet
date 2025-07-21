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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="font-serif text-3xl">Bonjour,</p>
                    <p className="font-serif text-2xl">{user.name}</p>
                </div>
                <FilterServices 
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    selectedStatus={selectedStatus}
                    setSelectedStatus={setSelectedStatus}
                />
            </div>
            <CardServices 
                selectedCategories={selectedCategories}
                selectedStatus={selectedStatus}
            />
        </div>
        </AuthenticatedLayout>
    );
}