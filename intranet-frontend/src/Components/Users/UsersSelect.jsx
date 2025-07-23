import { getUsers } from '@/api/modules/users';

import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';

export default function UsersSelect({ selectedUsers, setSelectedUsers, required = false }) {
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
            <label className="block text-sm font-medium text-gray-700">
                Utilisateur(s){required && <span className="text-red-500">*</span>}
            </label>
            <Select
                options={users}
                isMulti
                className="mt-1 block w-full"
                value={selectedUsers || []}
                onChange={setSelectedUsers}
                placeholder={required ? "Sélectionnez des utilisateurs (obligatoire)..." : "Sélectionnez des utilisateurs..."}
                styles={{
                    menu: base => ({ ...base, maxHeight: "150px", overflowY: "auto" }),
                    control: (base, state) => ({
                        ...base,
                        borderColor: required && (!selectedUsers || selectedUsers.length === 0) 
                            ? '#ef4444' 
                            : state.isFocused 
                                ? '#6366f1' 
                                : '#d1d5db'
                    })
                }}
            />
            {required && (!selectedUsers || selectedUsers.length === 0) && (
                <p className="mt-1 text-sm text-red-500">Au moins un utilisateur doit être sélectionné</p>
            )}
        </div>
    );
}
