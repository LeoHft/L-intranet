import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';

export default function StatusSelect({ selectedStatus, setSelectedStatus }) {
    const [statusOptions, setStatusOptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("/api/getStatus")
            .then((response) => {
                setStatusOptions(response.data.map((status) => ({
                    value: status.id,
                    label: status.name, // Garde la majuscule
                })));
                setLoading(false);
            })
            .catch((error) => {
                console.error("Erreur lors de la récupération des statuts:", error);
                setLoading(false);
            });
    }, []);

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">Statut</label>
            {loading ? (
                <p className="text-sm text-gray-500">Chargement des statuts...</p>
            ) : (
                <Select
                    options={statusOptions}
                    className="mt-1 block w-full"
                    value={selectedStatus || null}
                    onChange={setSelectedStatus}
                    placeholder="Sélectionnez un statut..."
                    styles={{
                        menu: base => ({ ...base, maxHeight: "150px", overflowY: "auto" })
                    }}
                />
            )}
        </div>
    );
}
