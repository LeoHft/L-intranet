import SecondaryButton from "@/Components/Utils/SecondaryButton";
import DangerButton from "@/Components/Utils/DangerButton";
import Modal from "@/Components/Utils/Modal";

import ModifyServiceForm from "@/Components/Services/ModifyServiceForm";
import { getAllServices, deleteService } from "@/api/modules/services";

import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function ListServices({ refreshTrigger }) {
  const [servicesList, setServicesList] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [showModalModifyService, setShowModalModifyService] = useState(false);
  const [showModalDeleteService, setShowModalDeleteService] = useState(false);

  useEffect(() => {
    fetchServices();
  }, [refreshTrigger]);

  const fetchServices = () => {
    toast.promise(getAllServices(), {
      loading: "Chargement des services ...",
      success: (response) => {
        setServicesList(response.data);
        return response.message;
      },
      error: (error) => {
        return error.message;
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
    toast.promise(deleteService(selectedService.id), {
      loading: "Chargement des services ...",
      success: (response) => {
        setServicesList(
          servicesList.filter((service) => service.id !== selectedService.id)
        );
        setShowModalDeleteService(false);
        return response.message;
      },
      error: (error) => {
        return error.message;
      },
    });
  };

  return (
    <>
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th className="text-center">Nom</th>
            <th className="text-center">Description</th>
            <th className="text-center">URL Intern</th>
            <th className="text-center">URL Externe</th>
            <th className="text-center"> Catégorie(s) </th>
            <th className="text-center">Statut</th>
            <th className="text-center">Utilisateur(s)</th>
            {/* <th>Date d'ajout</th>
                        <th>Date de modification</th> */}
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {servicesList.length > 0 ? (
            servicesList.map((service) => (
              <tr key={service.id}>
                <td className="text-center">
                  <div className="flex flex-col items-center text-center">
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
                <td className="truncate max-w-[160px] text-center">
                  {service.description}
                </td>
                <td className="text-center">
                  <a
                    href={service.internal_url}
                    target="blank"
                    className="text-center px-3 py-1 rounded-full text-sm transition-all bg-white/25 backdrop-blur-md border border-white/30 shadow-md shadow-black/10"
                  >
                    {service.internal_url || "Aucun lien"}
                  </a>
                </td>
                <td className="text-center">
                  <a
                    href={service.external_url}
                    target="blank"
                    className="text-center px-3 py-1 rounded-full text-sm transition-all bg-white/25 backdrop-blur-md border border-white/30 shadow-md shadow-black/10"
                  >
                    {service.external_url || "Aucun lien"}
                  </a>
                </td>
                <td className="text-center">
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
                </td>
                <td className="text-center">
                  {service.status?.name ? (
                    <span className="badge badge-primary">
                      {service.status.name}
                    </span>
                  ) : (
                    <span className="text-base-content/50"> </span>
                  )}
                </td>
                <td className="text-center">
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
                </td>
                {/* <td>{dayjs(service.created_at).format('DD/MM/YYYY HH:mm')}</td>
                                <td>{dayjs(service.updated_at).format('DD/MM/YYYY HH:mm')}</td> */}
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

      {showModalModifyService && (
        <ModifyServiceForm
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
