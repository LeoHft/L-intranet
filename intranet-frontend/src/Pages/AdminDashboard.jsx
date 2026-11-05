import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/Components/Utils/Tabs";

import AddCategoryForm from "@/Components/Category/AddCategoryForm";
import ListCategory from "@/Components/Category/ListCategory";
import AddStatusForm from "@/Components/Status/AddStatusForm";
import ListStatus from "@/Components/Status/ListStatus";
import ListUsers from "@/Components/Users/ListUsers";
import AddUserForm from "@/Components/Users/AddUserForm";
import ListServices from "@/Components/Services/ListServices";
import Layout from "@/Components/Utils/Layout";
import ListStatistiques from "@/Components/Statistiques/ListStatistiques";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  useEffect(() => {
    document.title = "AdminDashboard - Intranet";
  }, []);

  const triggerRefresh = () => setRefreshTrigger((prev) => !prev);

  return (
    <Layout>
      {/* Ouvre l'onglet Services par défaut */}
      <Tabs defaultIndex={1} className="space-y-8">
        <TabsList>
          <TabsTrigger>Statistiques</TabsTrigger>
          <TabsTrigger>Services</TabsTrigger>
          <TabsTrigger>Catégories</TabsTrigger>
          <TabsTrigger>Statuts</TabsTrigger>
          <TabsTrigger>Utilisateurs</TabsTrigger>
        </TabsList>

        <TabsContent className="space-y-8">
          <ListStatistiques />
        </TabsContent>

        <TabsContent className="space-y-8">
          <ListServices />
        </TabsContent>

        <TabsContent className="space-y-8">
          <AddCategoryForm onCategoryAdded={triggerRefresh} />
          <ListCategory refreshTrigger={refreshTrigger} />
        </TabsContent>

        <TabsContent className="space-y-8">
          <AddStatusForm onStatusAdded={triggerRefresh} />
          <ListStatus refreshTrigger={refreshTrigger} />
        </TabsContent>

        <TabsContent className="space-y-8">
          <AddUserForm onUserAdded={triggerRefresh} />
          <ListUsers refreshTrigger={refreshTrigger} />
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
