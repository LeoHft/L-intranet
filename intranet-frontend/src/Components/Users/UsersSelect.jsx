import { getUsers } from '@/api/modules/users';

import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';

export default function UsersSelect({ selectedUsers, setSelectedUsers, required = false, styles }) {
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
        <div className="form-control">
            <label className="label-text">
                Utilisateur(s){required && <span className="text-error">*</span>}
            </label>
            <Select
                options={users}
                isMulti
                isClearable
                className="w-full"
                value={selectedUsers || []}
                onChange={setSelectedUsers}
                placeholder={required ? "Sélectionnez des utilisateurs (obligatoire)..." : "Sélectionnez des utilisateurs..."}
                styles={{
                    ...styles,
                    menu: base => ({ ...base, maxHeight: "150px", overflowY: "auto", zIndex: 9999 }),
                }}
            />
            {required && (!selectedUsers || selectedUsers.length === 0) && (
                <p className="text-sm text-error">Au moins un utilisateur doit être sélectionné</p>
            )}
        </div>
    );
}
