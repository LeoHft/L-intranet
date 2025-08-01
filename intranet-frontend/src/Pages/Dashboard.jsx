import { useAuthAttributes } from '@/context/AuthAttributsContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CardServices from '@/Components/ListServices/CardServices';
import FilterServices from '@/Components/ListServices/FilterServices';
import { Funnel, X } from 'lucide-react';
import { useEffect, useState } from 'react';


export default function Dashboard({}) {
    useEffect(() => {
        document.title = "Dashboard - Intranet";
    }, []);
    
    const authContext = useAuthAttributes();
    const [showingFilters, setShowingFilters] = useState(false);
    const user = authContext?.userAttributes;
    
    // États pour les filtres
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState([]);

    return (
        <AuthenticatedLayout>
            <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8 mt-4 sm:mt-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
                    <div className="flex items-center justify-between w-full">
                        <div className="text-left">
                            <p className="font-serif text-3xl">Bonjour,</p>
                            <p className="font-serif text-2xl">{user.name}</p>
                        </div>

                        <div className="flex md:hidden ml-4">
                            <button
                                onClick={() => setShowingFilters(!showingFilters)}
                                className="rounded-lg p-2 text-white/90 transition-all duration-200 hover:bg-white/20 hover:text-white focus:bg-white/20 focus:text-white focus:outline-none active:scale-95"
                                aria-expanded={showingFilters}
                                aria-label="Filtres"
                            >
                                {showingFilters ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Funnel className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="w-full hidden md:block">
                        <FilterServices 
                            selectedCategories={selectedCategories}
                            setSelectedCategories={setSelectedCategories}
                            selectedStatus={selectedStatus}
                            setSelectedStatus={setSelectedStatus}
                        />
                    </div>

                    <div
                        className={`md:hidden transition-all duration-300 ease-in-out backdrop-blur-md border-t border-white/20 ${
                            showingFilters 
                                ? 'max-h-screen opacity-100 visible' 
                                : 'max-h-0 opacity-0 invisible overflow-hidden'
                        }`}
                    >
                        <FilterServices className=""
                            selectedCategories={selectedCategories}
                            setSelectedCategories={setSelectedCategories}
                            selectedStatus={selectedStatus}
                            setSelectedStatus={setSelectedStatus}
                        />
                    </div>
                </div>
                
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