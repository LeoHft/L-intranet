import ByUsersBarStatistiques from "@/Components/Statistiques/ByUsersBarStatistiques";
import ResumeTabStatistiques from "@/Components/Statistiques/ResumeTabStatistiques";
import ByServicesBarStatistiques from "@/Components/Statistiques/ByServicesBarStatistiques";
import ByServicesStackAreaStatistiques from "@/Components/Statistiques/ByServicesStackAreaStatistiques";
import { getUsers } from "@/api/modules/users";
import { getAllServices } from "@/api/modules/services";

import { getBarStatByUserByServiceByDate } from "@/api/modules/statistiques";

import useSelectOptions from "@/hooks/useSelectOptions";

import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import notifyErrors from "@/utils/notifyErrors";
import CustomSelect from "@/Components/Utils/Select";

export default function ListStatistiques() {
  const [selectedService, setSelectedService] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statisticsData, setStatisticsData] = useState(null);
  const [selectedLinkType, setSelectedLinkType] = useState([]);
  const lastRequest = useRef(0);
  const linkTypes = [
    { value: "internal", label: "Interne" },
    { value: "external", label: "Externe" },
  ];
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);
  const [startDate, setStartDate] = useState(
    oneMonthAgo.toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(today.toISOString().split("T")[0]);
  const servicesOptions = useSelectOptions(getAllServices);
  const users = useSelectOptions(getUsers);

  const handleExecuteQuery = async () => {
    // Validation des données requises - dates obligatoires seulement
    if (!startDate || !endDate) {
      toast.error("Veuillez sélectionner les dates de début et de fin");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error("La date de début doit être antérieure à la date de fin");
      return;
    }

    // Chaque coche relance une requête : seule la réponse à la dernière compte, même si elle arrive avant les autres.
    const request = ++lastRequest.current;

    setIsLoading(true);
    notifyErrors(
      getBarStatByUserByServiceByDate(
        selectedService,
        selectedUsers,
        selectedLinkType,
        startDate,
        endDate
      ),
      {
        success: (response) => {
          if (request !== lastRequest.current) return;
          setStatisticsData(response.data);
          setIsLoading(false);
        },
        error: (error) => {
          if (request === lastRequest.current) setIsLoading(false);
          return (
            error.message || "Erreur lors de la récupération des statistiques"
          );
        },
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-end lg:justify-end">
        <div className="lg:w-44">
          <label className="label-text font-medium">Date de début</label>
          <input
            type="date"
            className="input input-bordered input-glass h-12 w-full"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="lg:w-44">
          <label className="label-text font-medium">Date de fin</label>
          <input
            type="date"
            className="input input-bordered input-glass h-12 w-full"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <CustomSelect
          options={linkTypes}
          name="Types de liens"
          placeholder="Tous les types"
          selectedOption={selectedLinkType}
          setSelectedOption={setSelectedLinkType}
          fixedSize
          className="lg:w-64"
        />
        <CustomSelect
          options={servicesOptions}
          name="Services"
          placeholder="Tous les services"
          selectedOption={selectedService}
          setSelectedOption={setSelectedService}
          fixedSize
          className="lg:w-64"
        />
        <CustomSelect
          options={users}
          name="Utilisateurs"
          placeholder="Tous les utilisateurs"
          selectedOption={selectedUsers}
          setSelectedOption={setSelectedUsers}
          fixedSize
          className="lg:w-64"
        />
      </div>

      <ByUsersBarStatistiques statisticsData={statisticsData} />

      <ByServicesBarStatistiques statisticsData={statisticsData} />

      <ByServicesStackAreaStatistiques statisticsData={statisticsData} />

      <ResumeTabStatistiques statisticsData={statisticsData} />
    </div>
  );
}
