import { useAuthAttributes } from "@/context/AuthAttributsContext";
import Layout from "@/Components/Utils/Layout";
import CardServices from "@/Components/ListServices/CardServices";
import FilterServices from "@/Components/ListServices/FilterServices";
import { Funnel, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function Dashboard() {
  useEffect(() => {
    document.title = "Dashboard - Intranet";
  }, []);

  const authContext = useAuthAttributes();
  const [showingFilters, setShowingFilters] = useState(false);
  const user = authContext?.userAttributes;

  // États pour les filtres
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Layout>
      <div className="container mx-auto px-2 mt-4 sm:mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center justify-between w-full">
            <div className="text-left">
              <p className="font-serif text-3xl">Bonjour,</p>
              <p className="font-serif text-2xl">{user.name}</p>
            </div>

            <div className="flex md:hidden ml-4">
              <button
                onClick={() => setShowingFilters(!showingFilters)}
                className="btn btn-ghost btn-circle"
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
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
        </div>

        <div className="pb-4 sm:pb-8">
          <CardServices
            selectedCategories={selectedCategories}
            selectedStatus={selectedStatus}
            searchQuery={searchQuery}
          />
        </div>
      </div>
    </Layout>
  );
}
