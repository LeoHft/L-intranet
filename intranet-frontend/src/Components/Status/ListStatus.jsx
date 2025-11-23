import SecondaryButton from "@/Components/Utils/SecondaryButton";
import DangerButton from "@/Components/Utils/DangerButton";
import Modal from "@/Components/Utils/Modal";

import ModifyStatusForm from "@/Components/Status/ModifyStatusForm";
import { getAllStatus, deleteStatus } from "@/api/modules/status";

import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import toast, { Toaster } from "react-hot-toast";

export default function ListStatus({ refreshTrigger }) {
  const [StatusList, setStatusList] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [showModalModifyStatus, setShowModalModifyStatus] = useState(false);
  const [showModalDeleteStatus, setShowModalDeleteStatus] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, [refreshTrigger]);

  const fetchStatus = () => {
    toast.promise(getAllStatus(), {
      loading: "Chargement des status ...",
      success: (response) => {
        setStatusList(response.data);
        return response.message;
      },
      error: (error) => {
        return error.message;
      },
    });
  };

  const ModifyStatus = (status) => {
    setSelectedStatus(status);
    setShowModalModifyStatus(true);
  };

  const DeleteStatusShow = (status) => {
    setSelectedStatus(status);
    setShowModalDeleteStatus(true);
  };

  const DeleteStatus = (e) => {
    e.preventDefault();

    toast.promise(deleteStatus(selectedStatus.id), {
      loading: "Suppression en cours ...",
      success: (response) => {
        setStatusList(
          StatusList.filter((stat) => stat.id !== selectedStatus.id)
        );
        setShowModalDeleteStatus(false);
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
            <th className="text-center">Date d'ajout</th>
            <th className="text-center">Date de modification</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {StatusList.length > 0 ? (
            StatusList.map((status) => (
              <tr key={status.id}>
                <td className="text-center">{status.name}</td>
                <td className="text-center">{status.description}</td>
                <td className="text-center">{dayjs(status.created_at).format("DD/MM/YYYY HH:mm")}</td>
                <td className="text-center">{dayjs(status.updated_at).format("DD/MM/YYYY HH:mm")}</td>
                <td>
                  <div className="flex gap-2 items-center justify-center">
                  <SecondaryButton onClick={() => ModifyStatus(status)}>
                    Modifier
                  </SecondaryButton>
                  <DangerButton onClick={() => DeleteStatusShow(status)}>
                    Supprimer
                  </DangerButton>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="5"
                className="text-center text-base-content/70 py-4 "
              >
                Aucun status trouvée.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showModalModifyStatus && (
        <ModifyStatusForm
          status={selectedStatus}
          onClose={() => setShowModalModifyStatus(false)}
          onSuccess={() => fetchStatus()}
        />
      )}

      <Modal
        show={showModalDeleteStatus}
        onClose={() => setShowModalDeleteStatus(false)}
      >
        <form onSubmit={DeleteStatus} className="space-y-6">
          <h1 className="text-lg font-medium">Supprimer un status</h1>
          <p>
            Êtes-vous sûr de vouloir supprimer le status "{selectedStatus?.name}
            " ?
          </p>
          <div className="flex gap-2 justify-end">
            <SecondaryButton onClick={() => setShowModalDeleteStatus(false)}>
              Annuler
            </SecondaryButton>
            <DangerButton type="submit">Supprimer</DangerButton>
          </div>
        </form>
      </Modal>
      <Toaster />
    </>
  );
}
