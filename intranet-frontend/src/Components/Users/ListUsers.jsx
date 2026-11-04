import SecondaryButton from "@/Components/Utils/SecondaryButton";
import DangerButton from "@/Components/Utils/DangerButton";
import Modal from "@/Components/Utils/Modal";

import ModifyUserForm from "@/Components/Users/ModifyUserForm";
import { getUsers, deleteUser } from "@/api/modules/users";
import { useAuthAttributes } from '@/context/AuthAttributsContext';

import notifyErrors from "@/utils/notifyErrors";
import { useState, useEffect } from "react";
import dayjs from "dayjs";

export default function ListUsers({ refreshTrigger }) {
  const [usersList, setUsersList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModalModifyUser, setShowModalModifyUser] = useState(false);
  const [showModalDeleteUser, setShowModalDeleteUser] = useState(false);

  const authContext = useAuthAttributes();
  const authUser = authContext?.userAttributes;

  useEffect(() => {
    fetchUsers();
  }, [refreshTrigger]);

  const fetchUsers = () => {
    notifyErrors(getUsers(), {
      success: (response) => {
        setUsersList(response.data);
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
    notifyErrors(deleteUser(selectedUser.id), {
      success: () => {
        setUsersList(usersList.filter((use) => use.id !== selectedUser.id));
        setShowModalDeleteUser(false);
      },
    });
  };

  return (
    <>
      <div className="overflow-x-auto">
      <table className="table table-zebra w-full responsive-table">
        <thead>
          <tr>
            <th className="text-center">Nom</th>
            <th className="text-center">Email</th>
            <th className="text-center">Applications autorisées</th>
            <th className="text-center">Rôle</th>
            <th className="text-center">Date d'ajout</th>
            <th className="text-center">Date de modification</th>
            <th className="text-center">Dernière connexion</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {usersList.length > 0 ? (
            usersList.map((user) => (
              <tr key={user.id}>
                <td className="text-center">{user.name}</td>
                <td data-label="Email" className="text-center">{user.email}</td>
                <td data-label="Applications" className="text-center">
                  <div className="flex flex-wrap justify-end lg:block">
                    {user.services.map((service) => (
                      <span
                        key={service.id}
                        className="badge badge-primary badge-outline mr-2 mb-1"
                      >
                        {service.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td data-label="Rôle" className="text-center">
                  {user.is_admin ? (
                    <span className="badge badge-info">Administrateur</span>
                  ) : (
                    <span className="badge badge-success">Utilisateur</span>
                  )}
                </td>
                <td data-label="Ajouté le" className="text-center">{dayjs(user.created_at).format("DD/MM/YYYY HH:mm")}</td>
                <td data-label="Modifié le" className="text-center">{user.updated_at ? dayjs(user.updated_at).format("DD/MM/YYYY HH:mm") : "Jamais"}</td>
                <td data-label="Dernière connexion" className="text-center">{user.last_login_at ? dayjs(user.last_login_at).format("DD/MM/YYYY HH:mm") : "Jamais"}</td>
                <td>
                  <div className="flex gap-2 items-center justify-center ">
                  <SecondaryButton onClick={() => ModifyUser(user)} disabled={user.id === authUser.id}>
                    Modifier
                  </SecondaryButton>
                  <DangerButton onClick={() => DeleteUserShow(user)} disabled={user.id === authUser.id}>
                    Supprimer
                  </DangerButton>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center opacity-70 py-4">
                Aucun utilisateur trouvé.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>

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
    </>
  );
}
