import { getUsers } from '@/api/modules/users';

import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';

export default function UsersSelect({ selectedUsers, setSelectedUsers }) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
            getUsers()
            .then((response) => {
                setUsers(response.data.map((users) => ({
                    value: users.id,
                    label: users.name,
                })));
            })
            .catch((error) => {
                console.error("Erreur lors de la récupération des utilisateurs:", error);
            });
    }, []);

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">Utilisateur(s)</label>
            <Select
                options={users}
                isMulti
                className="mt-1 block w-full"
                value={selectedUsers || []}
                onChange={setSelectedUsers}
                placeholder="Sélectionnez des utilisateurs..."
                styles={{
                    menu: base => ({ ...base, maxHeight: "150px", overflowY: "auto" })
                }}
            />
        </div>
    );
}
