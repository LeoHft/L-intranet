import SecondaryButton from "@/Components/Utils/SecondaryButton";
import DangerButton from "@/Components/Utils/DangerButton";
import Modal from "@/Components/Utils/Modal";

import ServiceFormModal from "@/Components/Services/ServiceFormModal";
import { getAllServices, deleteService } from "@/api/modules/services";

import { useState, useEffect, useMemo } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import toast from "react-hot-toast";
import notifyErrors from "@/utils/notifyErrors";
import sortServices from "@/utils/sortServices";

// Copie l'URL au clic : la pastille confirme elle-même la copie.
function CopyableUrl({ url }) {
  const [copied, setCopied] = useState(false);

  if (!url) {
    return (
      <span className="px-3 py-1 rounded-full text-sm bg-error/15 backdrop-blur-md border border-white/30 text-error">
        Aucun lien
      </span>
    );
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Impossible de copier l'URL");
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      title="Cliquer pour copier"
      className="inline-block break-all lg:break-normal px-3 py-1 rounded-2xl text-sm transition-all bg-white/25 backdrop-blur-md border border-white/30 shadow-md shadow-black/10 cursor-pointer hover:bg-white/30"
    >
      {copied ? "Copié !" : url}
    </button>
  );
}

export default function ListServices({ refreshTrigger }) {
  const [servicesList, setServicesList] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [showModalModifyService, setShowModalModifyService] = useState(false);
  const [showModalDeleteService, setShowModalDeleteService] = useState(false);
  const [sort, setSort] = useState({ key: null, direction: "asc" });
  // Calculé à l'affichage : le tri choisi survit au rechargement de la liste après un ajout.
  const sortedServices = useMemo(() => sortServices(servicesList, sort), [servicesList, sort]);

  useEffect(() => {
    fetchServices();
  }, [refreshTrigger]);

  const fetchServices = () => {
    notifyErrors(getAllServices(), {
      success: (response) => {
        setServicesList(response.data);
      },
    });
  };

  const modifyService = (service) => {
    setSelectedService(service);
    setShowModalModifyService(true);
  };

  const deleteServiceShow = (service) => {
    setSelectedService(service);
    setShowModalDeleteService(true);
  };

  const deleteServiceForm = (e) => {
    e.preventDefault();
    notifyErrors(deleteService(selectedService.id), {
      success: () => {
        setServicesList(
          servicesList.filter((service) => service.id !== selectedService.id)
        );
        setShowModalDeleteService(false);
      },
    });
  };

  const toggleSort = (key) => {
    setSort((current) => ({
      key,
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortIcon = (key) => {
    const Icon = sort.key !== key ? ArrowUpDown : sort.direction === "asc" ? ArrowUp : ArrowDown;
    return <Icon className="h-4 w-4" aria-hidden="true" />;
  };

  const sortableHeader = (key, label) => (
    <th
      className="text-center"
      aria-sort={sort.key !== key ? "none" : sort.direction === "asc" ? "ascending" : "descending"}
    >
      <button type="button" className="inline-flex cursor-pointer items-center gap-1" onClick={() => toggleSort(key)}>
        {label}
        {sortIcon(key)}
      </button>
    </th>
  );

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center gap-2 lg:hidden">
        <span className="text-sm text-base-content/70">Trier par :</span>
        {[
          ["name", "Nom"],
          ["internal_url", "URL interne"],
          ["external_url", "URL externe"],
          ["status", "Statut"],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={`btn btn-sm ${sort.key === key ? "btn-primary" : "btn-soft"}`}
            aria-pressed={sort.key === key}
            onClick={() => toggleSort(key)}
          >
            {label}
            {sortIcon(key)}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
      <table className="table table-zebra w-full responsive-table">
        <thead>
          <tr>
            {sortableHeader("name", "Nom")}
            <th className="text-center">Description</th>
            {sortableHeader("internal_url", "URL Interne")}
            {sortableHeader("external_url", "URL Externe")}
            <th className="text-center"> Catégorie(s) </th>
            {sortableHeader("status", "Statut")}
            <th className="text-center">Utilisateur(s)</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedServices.length > 0 ? (
            sortedServices.map((service) => (
              <tr key={service.id}>
                <td className="text-center">
                  <div className="flex items-center gap-2 lg:flex-col lg:gap-0 lg:text-center">
                    {service.image_url && (
                      <img
                        src={service.image_url}
                        alt="Service"
                        className="avatar h-10 w-10 rounded-full"
                      />
                    )}{" "}
                    {service.name}{" "}
                  </div>
                </td>
                <td data-label="Description" className="truncate max-w-[160px] text-center">
                  {service.description}
                </td>
                <td data-label="URL interne" className="text-center">
                  <CopyableUrl url={service.internal_url} />

                </td>
                <td data-label="URL externe" className="text-center">
                  <CopyableUrl url={service.external_url} />
                </td>
                <td data-label="Catégories" className="text-center">
                  <div className="flex flex-wrap justify-end lg:block">
                    {service.categories
                      .filter((category) => category !== null)
                      .map((category) => (
                        <span
                          key={category.id}
                          className="badge badge-secondary mb-1 mt-1 mr-2"
                        >
                          {category.name}
                        </span>
                      ))}
                  </div>
                </td>
                <td data-label="Statut" className="text-center">
                  {service.status?.name && (
                    <span className="badge badge-primary">
                      {service.status.name}
                    </span>
                  )}
                </td>
                <td data-label="Utilisateurs" className="text-center">
                  <div className="flex flex-wrap justify-end lg:block">
                    {service.users
                      .filter((user) => user !== null)
                      .map((user) => (
                        <span
                          key={user.id}
                          className="badge badge-accent mb-1 mt-1 mr-2"
                        >
                          {user.name}
                        </span>
                      ))}
                  </div>
                </td>
                <td>
                  <div className="flex gap-2 items-center justify-center">
                    <SecondaryButton onClick={() => modifyService(service)}>
                      Modifier
                    </SecondaryButton>
                    <DangerButton onClick={() => deleteServiceShow(service)}>
                      Supprimer
                    </DangerButton>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center text-base-content/70 py-4">
                Aucun service trouvé.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>

      {showModalModifyService && (
        <ServiceFormModal
          service={selectedService}
          onClose={() => setShowModalModifyService(false)}
          onSuccess={() => fetchServices()}
        />
      )}

      <Modal
        show={showModalDeleteService}
        onClose={() => setShowModalDeleteService(false)}
      >
        <form onSubmit={deleteServiceForm} className="space-y-6">
          <h1 className="text-lg font-medium">Supprimer un service</h1>
          <p>
            Êtes-vous sûr de vouloir supprimer le service "
            {selectedService?.name}" ?
          </p>
          <div className="flex gap-2 justify-end">
            <SecondaryButton onClick={() => setShowModalDeleteService(false)}>
              Annuler
            </SecondaryButton>
            <DangerButton type="submit">Supprimer</DangerButton>
          </div>
        </form>
      </Modal>
    </>
  );
}
