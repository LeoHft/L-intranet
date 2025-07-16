import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/Utils/Tabs';

import AddServiceForm from '@/Components/Services/AddServiceForm';
import AddCategoryForm from '@/Components/Category/AddCategoryForm';
import ListCategory from '@/Components/Category/ListCategory';
import AddStatusForm from '@/Components/Status/AddStatusForm';
import ListStatus from '@/Components/Status/ListStatus';
import ListUsers from '@/Components/Users/ListUsers';
import AddUserForm from '@/Components/Users/AddUserForm';
import ListServices from '@/Components/Services/ListServices';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

import { useEffect, useState } from 'react';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("Servicessettings"); // Set default tab to Services settings
    const [refreshTrigger, setRefreshTrigger] = useState(false);

    useEffect(() => {
        document.title = "AdminDashboard - Intranet";
    }, []);

    const triggerRefresh = () => setRefreshTrigger(prev => !prev);
    
    return (
        <AuthenticatedLayout>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                    <TabsList>
                        {/* <TabsTrigger value="overview">Menu</TabsTrigger> //TODO : ajouter les statistiques */} 
                        <TabsTrigger value="Servicessettings">Paramètres de services</TabsTrigger>
                        <TabsTrigger value="CategoriesSettings">Catégories</TabsTrigger>
                        <TabsTrigger value="StatusSettings">Status</TabsTrigger>
                        <TabsTrigger value="users">Utilisateurs</TabsTrigger>
                    </TabsList>

                    {/* <TabsContent value="overview" className="space-y-8">
                        <p> Statistiques prochainements </p>
                    </TabsContent> */}


                    <TabsContent value="Servicessettings" className="space-y-8">
                        <AddServiceForm onServiceAdded={triggerRefresh}/>
                        <ListServices refreshTrigger={refreshTrigger}/>
                    </TabsContent>

                    <TabsContent value="CategoriesSettings" className="space-y-8">
                        <AddCategoryForm onCategoryAdded={triggerRefresh} />
                        <ListCategory refreshTrigger={refreshTrigger}/>
                    </TabsContent>


                    <TabsContent value="StatusSettings" className="space-y-8">
                        <AddStatusForm onStatusAdded={triggerRefresh}/>
                        <ListStatus refreshTrigger={refreshTrigger}/>
                    </TabsContent>




                    <TabsContent value="users" className="space-y-8">
                        <AddUserForm onUserAdded={triggerRefresh}/>
                        <ListUsers refreshTrigger={refreshTrigger}/>

                    </TabsContent>
                </Tabs>
            </div>
        </AuthenticatedLayout>
    );
}
