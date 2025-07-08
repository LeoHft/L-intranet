import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/Utis/Tabs';

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
import { Head } from '@inertiajs/react';


export default function AdminDashboard() {
    const [data, setData] = useState([]);
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        fetch("/api/posts") // Appelle l'API Laravel
            .then((res) => res.json())
            .then((data) => setData(data));
    }, []);



    return (
        <AuthenticatedLayout>
        <Head title="AdminDashboard" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                    <TabsList>
                        <TabsTrigger value="overview">Menu</TabsTrigger>
                        <TabsTrigger value="Servicessettings">Paramètres de services</TabsTrigger>
                        <TabsTrigger value="CategoriesSettings">Catégories</TabsTrigger>
                        <TabsTrigger value="StatusSettings">Status</TabsTrigger>
                        <TabsTrigger value="users">Utilisateurs</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-8">
                        <p> Statistiques prochainements </p>
                    </TabsContent>


                    <TabsContent value="Servicessettings" className="space-y-8">
                        <AddServiceForm />
                        <ListServices />
                    </TabsContent>

                    <TabsContent value="CategoriesSettings" className="space-y-8">
                        <AddCategoryForm />
                        <ListCategory />
                    </TabsContent>


                    <TabsContent value="StatusSettings" className="space-y-8">
                        <AddStatusForm />
                        <ListStatus />
                    </TabsContent>




                    <TabsContent value="users" className="space-y-8">
                        <AddUserForm />
                        <ListUsers />

                    </TabsContent>
                </Tabs>
            </div>
        </AuthenticatedLayout>
    );
}
