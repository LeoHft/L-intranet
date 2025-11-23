import SecondaryButton from "@/Components/Utils/SecondaryButton";
import DangerButton from "@/Components/Utils/DangerButton";
import Modal from "@/Components/Utils/Modal";

import ModifyUserForm from "@/Components/Users/ModifyUserForm";
import { getUsers, deleteUser } from "@/api/modules/users";

import toast, { Toaster } from "react-hot-toast";
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

export default function ListUsers({ refreshTrigger }) {
  const [usersList, setUsersList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModalModifyUser, setShowModalModifyUser] = useState(false);
  const [showModalDeleteUser, setShowModalDeleteUser] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [refreshTrigger]);

  const fetchUsers = () => {
    toast.promise(getUsers(), {
      loading: "Chargement des utilisateurs ...",
      success: (response) => {
        setUsersList(response.data);
        return response.message;
      },
      error: (error) => {
        return error.message;
      },
    });
  };

  const ModifyUser = (user) => {
    setSelectedUser(user);
    setShowModalModifyUser(true);
  };

  const DeleteUserShow = (user) => {
    setSelectedUser(user);
    setShowModalDeleteUser(true);
  };

  const DeleteUsers = (e) => {
    e.preventDefault();
    toast.promise(deleteUser(selectedUser.id), {
      loading: "Suppression de l'utilisateur en cours ...",
      success: (response) => {
        setUsersList(usersList.filter((use) => use.id !== selectedUser.id));
        setShowModalDeleteUser(false);
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
            <th>Nom</th>
            <th>Email</th>
            <th>Applications autorisées</th>
            <th>Rôle</th>
            <th>Date d'ajout</th>
            <th>Date de modification</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {usersList.length > 0 ? (
            usersList.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {user.services.map((service) => (
                    <span
                      key={service.id}
                      className="badge badge-ghost mr-2 mb-1"
                    >
                      {service.name}
                    </span>
                  ))}
                </td>
                <td>
                  {user.is_admin ? (
                    <span className="badge badge-info">Administrateur</span>
                  ) : (
                    <span className="badge badge-success">Utilisateur</span>
                  )}
                </td>
                <td>{dayjs(user.created_at).format("DD/MM/YYYY HH:mm")}</td>
                <td>{dayjs(user.updated_at).format("DD/MM/YYYY HH:mm")}</td>
                <td className="flex gap-2">
                  <SecondaryButton onClick={() => ModifyUser(user)}>
                    Modifier
                  </SecondaryButton>
                  <DangerButton onClick={() => DeleteUserShow(user)}>
                    Supprimer
                  </DangerButton>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center opacity-70 py-4">
                Aucun utilisateur trouvé.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showModalModifyUser && (
        <ModifyUserForm
          user={selectedUser}
          onClose={() => setShowModalModifyUser(false)}
          onSuccess={() => fetchUsers()}
        />
      )}

      <Modal
        show={showModalDeleteUser}
        onClose={() => setShowModalDeleteUser(false)}
      >
        <form onSubmit={DeleteUsers} className="space-y-6">
          <h1 className="text-lg font-medium">Supprimer un utilisateur</h1>
          <p>
            Êtes-vous sûr de vouloir supprimer l'utilisateur "
            {selectedUser?.name}" ?
          </p>
          <div className="flex gap-2 justify-end">
            <SecondaryButton onClick={() => setShowModalDeleteUser(false)}>
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
